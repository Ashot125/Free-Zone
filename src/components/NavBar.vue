<template>
  <div class="navbar-container">
    <!-- Header -->
    <header class="header">

      <!-- Left section -->
      <div class="header-left">
        <button class="menu-btn" @click="toggleMenu">
          {{ isMenuOpen ? '✖' : '☰' }}
        </button>
        <router-link to="/" class="logo">
          <span class="logo-top">Free</span>
          <span class="logo-bottom">Zone</span>
        </router-link>
      </div>

      <!-- Center section -->
      <div class="header-center">
        <input 
          type="text" 
          class="search"

          v-model="store.search"
          
          :placeholder="t('navbar.search_placeholder')" 
        />
      </div>

      <!-- Open address button -->
      <div class="select-address" @click="showAddressModal = true">
        {{ shortAddress }}
      </div>

      <!-- Modal window -->
      <div 
        v-if="showAddressModal" 
        class="modal-overlay" 
        @click.self="showAddressModal = false"
      >
        <div class="modal">
          <!--Close button -->
          <button class="close-btn" @click="showAddressModal = false">✕</button>

          <!-- Input field + button on one line -->
          <div class="input-row">
            <input v-model="manualAddress" placeholder="Enter address..." />
            <button class="save-btn" @click="saveMapAddress">Save</button>
          </div>

          <!--Map -->
          <div id="map"></div>
        </div>
      </div>

      <!-- Right section -->
      <div class="header-right">
        <span class="icon-btn" @click="goToPage('/favorite')">💖</span>
        <span>🚚</span>
        <span class="icon-btn" @click="goToPage('/cart')">🛒</span>
        <span class="user-btn" @click="toggleUserPopup">👤</span>
      </div>

    </header>

    <!-- User Popup -->
    <transition name="fade">
      <div v-if="showUserPopup" class="user-popup">
        <span class="logo-top">Free</span>
        <span class="logo-bottom">Zone</span>
        <p class="popup-greeting">{{ t('navbar.welcome') }}</p>

        <!-- Info if the user is authorized -->
        <div class="popup-user-info" v-if="currentUser">
          <p class="user-name">
            {{ currentUser.firstName }} {{ currentUser.lastName }}
          </p>
          <button class="logout-btn" @click="logoutUser">
            {{ t('navbar.logout') }}
          </button>
        </div>

        <!-- Buttons if the user is not authorized -->
        <div class="popup-buttons" v-else>
          <button 
            class="popup-btn" 
            @click="$emit('open-login'); showUserPopup=false"
          >
            {{ t('navbar.login') }}
          </button>
          <router-link to="/register" class="popup-btn">
            {{ t('navbar.register') }}
          </router-link>
        </div>

        <!-- Language Switcher -->
        <div class="popup-language">
          <span
            v-for="lang in languages"
            :key="lang.code"
            :class="['lang-btn', { active: selectedLang === lang.code }]"
            @click="setLanguageHandler(lang.code)"
          >
            {{ lang.label }}
          </span>
        </div>
      </div>
    </transition>

    <!-- Dropdown menu -->
    <transition name="fade">
      <div v-if="isMenuOpen && !disableDropdown" class="menu-overlay">
        <ul class="menu-list">
          <li><a href="#">{{ t('navbar.restaurants') }}</a></li>
          <li><a href="#">{{ t('navbar.supermarkets') }}</a></li>
          <li><a href="#">{{ t('navbar.pharmacies') }}</a></li>
          <li><a href="#">{{ t('navbar.shops') }}</a></li>
          <li><a href="#">{{ t('navbar.services') }}</a></li>
        </ul>
      </div>
    </transition>

    <!-- Bottom menu -->
    <transition name="sub-fade">
      <nav 
        v-if="isSubMenuVisible && !disableDropdown" 
        :class="['sub-menu', { small: isSubMenuSmall }]"
      >
        <a href="#">🍔{{ t('navbar.restaurants') }}</a>
        <a href="#">🛒{{ t('navbar.supermarkets') }}</a>
        <a href="#">💊{{ t('navbar.pharmacies') }}</a>
        <a href="#">🏪{{ t('navbar.shops') }}</a>
        <a href="#">🛠{{ t('navbar.services') }}</a>
      </nav>
    </transition>

    <div class="nav-spacer" aria-hidden="true"></div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch, inject, watchEffect, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { setLanguage } from '../i18n';
import { store } from '../store.js';

import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const showAddressModal = ref(false);
const shortAddress = computed(() => {
  const text = store.deliveryAddress.text;
  if (!text) return t('navbar.address');

 const parts: string[] = (text || "").split(",").map((p: string) => p.trim());

  
  //We take the last 2-3 parts: street + house number + city
  //and we change the order so that the number comes before the street
  let street = parts[parts.length - 2] || "";
  let number = parts[parts.length - 1] || "";
  let city = parts[parts.length - 3] || "";

  // If necessary, we rearrange the number and street
  if (/\d/.test(number)) {
    const tmp = number;
    number = street;
    street = tmp;
  }

  const result = [number, street, city].filter(Boolean).join(", ");
  return result;
});

const manualAddress = ref("");

// Leaflet map
const map = ref<L.Map | null>(null);
const marker = ref<L.Marker | null>(null);
async function reverseGeocode(lat: number, lng: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await response.json();
    return data.display_name; //  full address
  } catch (err) {
    console.error("Geocoding error:", err);
    return `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
  }
}

function initMap() {
  if (map.value) return;

const m = L.map('map').setView([40.1792, 44.4991], 12); // zoom increased
  map.value = m;
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 20
}).addTo(map.value);



  map.value.on('click', async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;

    if (marker.value) {
      marker.value.setLatLng([lat, lng]);
    } else {
      marker.value = L.marker([lat, lng]).addTo(map.value!);
    }

    const address = await reverseGeocode(lat, lng);
    store.deliveryAddress.location = { lat, lng };
    store.deliveryAddress.text = address;
  });
}


function saveMapAddress() {
  // If you selected an address on the map, simply close the modal,
  // the address is already written to reverseGeocode()
  if (store.deliveryAddress.text) {
    showAddressModal.value = false;
  }
}


//Initializing the map when opening a tab
watchEffect(() => {
  if (showAddressModal.value) {
    nextTick(() => {
      if (!map.value) {
        initMap(); // we create a map
      } else {
        map.value.invalidateSize(); // recalculation of sizes after display
      }
    });
  }
});


const router = useRouter()
const route = useRoute()

const { t, locale } = useI18n()
const currentUser = inject('currentUser') as any
const showLogin = inject('showLogin') as any

const isMenuOpen = ref(false)
const isSubMenuVisible = ref(true)
const isSubMenuSmall = ref(false)
const disableDropdown = computed(() => route.path === '/register')

const showUserPopup = ref(false)

const selectedLang = ref(locale.value)

const languages = [
  { code: 'en', label: 'English' },
  { code: 'am', label: 'Հայերեն' },
  { code: 'ru', label: 'Русский' }
]

const toggleMenu = () => { if (!disableDropdown.value) isMenuOpen.value = !isMenuOpen.value }
const toggleUserPopup = () => { showUserPopup.value = !showUserPopup.value }
const setLanguageHandler = (lang: string) => {
  selectedLang.value = lang
  setLanguage(lang)
}


const logoutUser = () => { if (currentUser) currentUser.value = null }

// ✅ New feature for transition with login verification
const goToPage = (path: string) => {
  if (currentUser.value) {
    router.push(path)
  } else {
    showLogin.value = true
  }
}

// Close popup when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const popup = document.querySelector('.user-popup')
  const userBtn = document.querySelector('.user-btn')
  if (popup && userBtn && !popup.contains(event.target as Node) && !userBtn.contains(event.target as Node)) {
    showUserPopup.value = false
  }
}

const handleScroll = () => {
  if (disableDropdown.value) return
  const scrollY = window.scrollY
  isSubMenuVisible.value = scrollY <= 150
  isSubMenuSmall.value = scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})

watch(() => route.path, (newPath, _oldPath) => {
  if (newPath === '/register') {
    isSubMenuVisible.value = false
    isSubMenuSmall.value = false
    isMenuOpen.value = false
    showUserPopup.value = false
  }
})
</script>


<style scoped>

/* NAVBAR CONTAINER          */
.navbar-container {
  --header-height: 48px;
  --sub-menu-height: 32px;
  font-family: Arial, sans-serif;
  position: relative;
  font-size: 12px; /* reduced the font size globally*/
}


/* HEADER SECTION            */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #1c8607d8;
  color: white;
  z-index: 1100;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
  font-size: 14px; /*reduced*/
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px; /* slightly less distance */
}

.menu-btn {
  font-size: 16px; /* reduced*/
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-decoration: none;
  color: white;
}

.logo-top {
  font-family: 'Pacifico', cursive;
  font-size: 18px;
  transform: rotate(-10deg);
  transition: all 0.3s ease;
}

.logo-bottom {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-top: -5px;
  transition: all 0.3s ease;
}

.logo:hover .logo-top {
  transform: rotate(-5deg) scale(1.1);
  color: #92e4bd;
}

.logo:hover .logo-bottom {
  transform: scale(1.05);
  color: #92e4bd;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}
.select-address {
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 10px;
  display: inline-block;
}

/* background darkening */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

/* Modal */
.modal {
  background: #fff;
  width: 320px;
  max-width: 90%;
  border-radius: 12px;
  padding: 10px 14px 14px 14px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  position: relative;
  text-align: left;
  font-family: Arial, sans-serif;
  animation: showModal 0.2s ease-out;
}

/* Close button */
.close-btn {
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.7;
}
.close-btn:hover {
  opacity: 1;
}

/* Input field and button on the same line */
.input-row {
  display: flex;
  gap: 6px;
  margin-top: 28px; /* so that the close button does not overlap the field */
  margin-bottom: 8px;
}

.modal input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
}

/* Save button */
.save-btn {
  padding: 6px 12px;
  background: #ff0066;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 13px;
}
.save-btn:hover {
  background: #d40054;
}

/*Map */
#map {
  height: 250px;
  border-radius: 8px;
  margin-top: 6px;
}

.search {
  width: 300px;
  padding: 6px 12px; 
  border-radius: 25px;
  border: 1px solid #ccc;
  font-size: 12px; 
}

.search:focus {
  border-color: #ff6600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 14px; 
  cursor: pointer;
}


/* DROPDOWN MENU             */
.menu-overlay {
  position: fixed;
  top: calc(var(--header-height) + var(--sub-menu-height));
  left: 0;
  right: 0;
  background: rgba(65,128,3,0.95);
  color: white;
  padding: 15px; 
  z-index: 1001;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-list li {
  margin: 8px 0; 
}

.menu-list a {
  color: white;
  text-decoration: none;
  font-size: 14px;
}

/* BOTTOM MENU / SUB-MENU    */

.sub-menu {
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  height: var(--sub-menu-height);
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
  background: #f5f5f5;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  transition: all 0.3s ease;
  font-size: 12px;
  z-index: 1080;
}

.sub-menu.small {
  height: 28px; 
  font-size: 10px;
  gap: 12px;
}

.sub-menu a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.sub-menu a:hover {
  color: #3316d8;
}


/* SPACER                    */

.nav-spacer {
  height: calc(var(--header-height) + var(--sub-menu-height));
  width: 100%;
  flex-shrink: 0;
}


/* USER POPUP                */

.user-popup {
  position: fixed;
  top: 60px;
  right: 20px;
  width: 200px; 
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 18px rgba(0,0,0,0.25);
  z-index: 1200;
  padding: 12px; 
  text-align: center;
}

.popup-greeting {
  font-size: 12px; 
  margin-bottom: 8px;
  color: #333;
}

.popup-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.popup-btn {
  flex: 1;
  padding: 5px 6px; 
  background: #c51f7a;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-size: 10px;
}

.popup-btn:hover {
  background: #ff66aa;
}

.popup-language {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.lang-btn {
  font-size: 10px;
  cursor: pointer;
  padding: 2px 4px; 
  border-radius: 4px;
  color: #555;
}

.lang-btn.active,
.lang-btn:hover {
  background: #c51f7a;
  color: #fff;
}
.popup-user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8px 0; 
}

.user-name {
  font-weight: 600;
  font-size: 12px; 
  margin-bottom: 4px;
  text-align: center;
}

.logout-btn {
  background: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 10px; 
  cursor: pointer;
  transition:  0.2s;
}

.logout-btn:hover {
  background: #d32f2f;
}

/* ========================= */
/* LOGIN MODAL               */
/* ========================= */
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1300;
  backdrop-filter: blur(2px);
}

.login-modal-content {
  background: #fff;
  padding: 18px; 
  border-radius: 12px;
  width: 300px;
  max-width: 90%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px; 
  position: relative;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.login-modal-logo {
  width: 55px; 
  margin: 0 auto 8px auto;
}

.login-email-input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
  font-size: 12px; 
}

.login-continue-btn {
  background: #4caf50;
  color: #fff;
  padding: 8px; 
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 12px; 
  transition: all 0.2s ease;
}

.login-continue-btn:hover {
  background: #43a047;
  transform: translateY(-1px);
}

.login-social-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px; 
  margin-top: 8px; 
}

.google-btn,
.facebook-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px; 
  padding: 6px; 
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px; 
  font-weight: 500;
  border: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.google-btn:hover,
.facebook-btn:hover {
  transform: scale(1.03);
  box-shadow: 0 3px 8px rgba(0,0,0,0.2);
}

.google-btn {
  background: #fff;
  border: 1px solid #ddd;
  color: #444;
}

.facebook-btn {
  background: #1877f2;
  color: #fff;
}

.login-social-buttons img {
  width: 16px; 
  height: 16px; 
}

.close-modal {
  font-size: 16px; 
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
}


/* FADE ANIMATIONS           */

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}


/* RESPONSIVE STYLES         */

@media (max-width: 768px) {
  .search {
    width: 200px; 
  }

  .sub-menu {
    gap: 15px;
    font-size: 12px; 
  }

  .logo-top {
    font-size: 18px;
  }

  .logo-bottom {
    font-size: 13px;
  }

  .login-modal-content {
    width: 88%;
    padding: 16px;
  }

  .login-modal-logo {
    width: 52px;
  }

  .login-email-input {
    font-size: 12px;
  }

  .login-continue-btn {
    font-size: 12px;
    padding: 8px;
  }

  .google-btn,
  .facebook-btn {
    font-size: 12px;
    padding: 6px;
    gap: 5px;
  }

  .login-social-buttons img {
    width: 15px;
    height: 15px;
  }
}

@media (max-width: 480px) {
  .search {
    width: 160px;
  }

  .sub-menu {
    gap: 10px;
    font-size: 11px; 
  }

  .logo-top {
    font-size: 16px;
  }

  .logo-bottom {
    font-size: 12px;
  }

  .login-modal-content {
    width: 92%;
    padding: 14px;
    border-radius: 10px;
  }

  .login-modal-logo {
    width: 48px;
  }

  .login-email-input {
    font-size: 11px;
  }

  .login-continue-btn {
    font-size: 11px;
    padding: 7px;
  }

  .google-btn,
  .facebook-btn {
    font-size: 11px;
    padding: 5px;
    gap: 5px;
  }

  .login-social-buttons img {
    width: 13px;
    height: 13px;
  }

  .close-modal {
    font-size: 15px;
  }
}


</style>
