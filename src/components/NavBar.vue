<template>
  <div class="navbar-container">

    <!-- Header -->
    <header class="header">
      <!-- Left: Burger + Logo -->
      <div class="header-left">
        <button class="menu-btn" @click="toggleMenu">{{ isMenuOpen ? '✖' : '☰' }}</button>
        <router-link to="/" class="logo">
          <span class="logo-top">Free</span>
          <span class="logo-bottom">Zone</span>
        </router-link>
      </div>

      <!-- Center: Search -->
      <div class="header-center">
        <input type="text" class="search" placeholder="Search in Free Zone" />
      </div>

      <!-- Right: Icons -->
      <div class="header-right">
        <span>❤️</span>
        <span>🚚</span>
        <span>🛒</span>
        <span class="user-btn" @click="toggleUserPopup">👤</span>
      </div>
    </header>

    <!-- User Popup -->
    <transition name="fade">
      <div v-if="showUserPopup" class="user-popup">
        <span class="logo-top">Free</span>
        <span class="logo-bottom">Zone</span>
        <p class="popup-greeting">Welcome to Free Zone!</p>

        <div class="popup-buttons">
          <!-- Instead of a local modal, we emit an event outside -->
          <button class="popup-btn" @click="$emit('open-login'); showUserPopup=false">Login</button>
          <router-link to="/register" class="popup-btn">Register</router-link>
        </div>

        <div class="popup-language">
          <span v-for="lang in languages" :key="lang.code" 
                :class="['lang-btn', { active: selectedLang === lang.code }]"
                @click="setLanguage(lang.code)">
            {{ lang.label }}
          </span>
        </div>
      </div>
    </transition>

    <!-- Dropdown menu -->
    <transition name="fade">
      <div v-if="isMenuOpen && !disableDropdown" class="menu-overlay">
        <ul class="menu-list">
          <li><a href="#">Restaurants</a></li>
          <li><a href="#">Supermarkets</a></li>
          <li><a href="#">Pharmacies</a></li>
          <li><a href="#">Shops</a></li>
          <li><a href="#">Services</a></li>
        </ul>
      </div>
    </transition>

    <!-- Bottom menu -->
    <transition name="sub-fade">
      <nav v-if="isSubMenuVisible && !disableDropdown" :class="['sub-menu', { small: isSubMenuSmall }]">
        <a href="#">🍔Restaurants</a>
        <a href="#">🛒Supermarkets</a>
        <a href="#">💊Pharmacies</a>
        <a href="#">🏪Shops</a>
        <a href="#">🛠Services</a>
      </nav>
    </transition>

    <!-- Spacer -->
    <div class="nav-spacer" aria-hidden="true"></div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRoute } from 'vue-router'


const route = useRoute()

// Nav states
const isMenuOpen = ref(false)
const isSubMenuVisible = ref(true)
const isSubMenuSmall = ref(false)
const disableDropdown = computed(() => route.path === '/register')

// User popup
const showUserPopup = ref(false)
const selectedLang = ref('en')
const languages = [
  { code: 'en', label: 'English' },
  { code: 'am', label: 'Հայերեն' },
  { code: 'ru', label: 'Русский' }
]

const toggleMenu = () => { if (!disableDropdown.value) isMenuOpen.value = !isMenuOpen.value }
const toggleUserPopup = () => { if (route.path === '/') showUserPopup.value = !showUserPopup.value }
const setLanguage = (lang: string) => { selectedLang.value = lang }

// Close popup when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const popup = document.querySelector('.user-popup')
  const userBtn = document.querySelector('.user-btn')
  if (popup && userBtn && !popup.contains(event.target as Node) && !userBtn.contains(event.target as Node)) {
    showUserPopup.value = false
  }
}

// Scroll effect
const handleScroll = () => {
  if (disableDropdown.value) return
  const scrollY = window.scrollY
  isSubMenuVisible.value = scrollY <= 150
  isSubMenuSmall.value = scrollY > 50
}
const addScrollListener = () => window.addEventListener('scroll', handleScroll)
const removeScrollListener = () => window.removeEventListener('scroll', handleScroll)

onMounted(() => {
  addScrollListener()
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  removeScrollListener()
  document.removeEventListener('click', handleClickOutside)
})

watch(() => route.path, (newPath, oldPath) => {
  if (newPath === '/register') {
    removeScrollListener()
    isSubMenuVisible.value = false
    isSubMenuSmall.value = false
    isMenuOpen.value = false
    showUserPopup.value = false
  } else if (oldPath === '/register') addScrollListener()
})
</script>


<style scoped>

/* ========================= */
/* NAVBAR CONTAINER          */
/* ========================= */
.navbar-container {
  --header-height: 48px;
  --sub-menu-height: 32px;
  font-family: Arial, sans-serif;
  position: relative;
}

/* ========================= */
/* HEADER SECTION            */
/* ========================= */
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
  background: #c51f7a;
  color: white;
  z-index: 1100;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.menu-btn {
  font-size: 19px;
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
  font-size: 20px;
  transform: rotate(-10deg);
  transition: all 0.3s ease;
}

.logo-bottom {
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: -5px;
  transition: all 0.3s ease;
}

.logo:hover .logo-top {
  transform: rotate(-5deg) scale(1.2);
  color: #92e4bd;
}

.logo:hover .logo-bottom {
  transform: scale(1.1);
  color: #92e4bd;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.search {
  width: 300px;
  padding: 8px 15px;
  border-radius: 25px;
  border: 1px solid #ccc;
}

.search:focus {
  border-color: #ff6600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 18px;
  cursor: pointer;
}

/* ========================= */
/* DROPDOWN MENU             */
/* ========================= */
.menu-overlay {
  position: fixed;
  top: calc(var(--header-height) + var(--sub-menu-height));
  left: 0;
  right: 0;
  background: rgba(65,128,3,0.95);
  color: white;
  padding: 20px;
  z-index: 1001;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-list li {
  margin: 12px 0;
}

.menu-list a {
  color: white;
  text-decoration: none;
  font-size: 18px;
}

/* ========================= */
/* BOTTOM MENU / SUB-MENU    */
/* ========================= */
.sub-menu {
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  height: var(--sub-menu-height);
  display: flex;
  justify-content: center;
  gap: 30px;
  align-items: center;
  background: #f5f5f5;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  transition: all 0.3s ease;
  font-size: 14px;
  z-index: 1080;
}

.sub-menu.small {
  height: 32px;
  font-size: 10px;
  gap: 15px;
}

.sub-menu a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.sub-menu a:hover {
  color: #3316d8;
}

/* ========================= */
/* SPACER                    */
/* ========================= */
.nav-spacer {
  height: calc(var(--header-height) + var(--sub-menu-height));
  width: 100%;
  flex-shrink: 0;
}

/* ========================= */
/* USER POPUP                */
/* ========================= */
.user-popup {
  position: fixed;
  top: 60px;
  right: 20px;
  width: 220px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 18px rgba(0,0,0,0.25);
  z-index: 1200;
  padding: 15px;
  text-align: center;
}

.popup-greeting {
  font-size: 14px;
  margin-bottom: 10px;
  color: #333;
}

.popup-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}

.popup-btn {
  flex: 1;
  padding: 6px 8px;
  background: #c51f7a;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-size: 12px;
}

.popup-btn:hover {
  background: #ff66aa;
}

.popup-language {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.lang-btn {
  font-size: 12px;
  cursor: pointer;
  padding: 2px 5px;
  border-radius: 4px;
  color: #555;
}

.lang-btn.active,
.lang-btn:hover {
  background: #c51f7a;
  color: #fff;
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
  padding: 20px;
  border-radius: 12px;
  width: 320px;
  max-width: 90%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.login-modal-logo {
  width: 60px;
  margin: 0 auto 10px auto;
}

.login-email-input {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
  font-size: 14px;
}

.login-continue-btn {
  background: #4caf50;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.login-continue-btn:hover {
  background: #43a047;
  transform: translateY(-1px);
}

.login-social-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.google-btn,
.facebook-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
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
  width: 18px;
  height: 18px;
}

.close-modal {
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

/* ========================= */
/* FADE ANIMATIONS           */
/* ========================= */
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

/* ========================= */
/* RESPONSIVE STYLES         */
/* ========================= */
@media (max-width: 768px) {
  .search {
    width: 200px;
  }

  .sub-menu {
    gap: 15px;
    font-size: 14px;
  }

  .logo-top {
    font-size: 18px;
  }

  .logo-bottom {
    font-size: 14px;
  }

  .login-modal-content {
    width: 90%;
    padding: 18px;
  }

  .login-modal-logo {
    width: 55px;
  }

  .login-email-input {
    font-size: 13px;
  }

  .login-continue-btn {
    font-size: 13px;
    padding: 9px;
  }

  .google-btn,
  .facebook-btn {
    font-size: 13px;
    padding: 7px;
    gap: 6px;
  }

  .login-social-buttons img {
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 480px) {
  .search {
    width: 150px;
  }

  .sub-menu {
    gap: 10px;
    font-size: 12px;
  }

  .logo-top {
    font-size: 16px;
  }

  .logo-bottom {
    font-size: 12px;
  }

  .login-modal-content {
    width: 95%;
    padding: 15px;
    border-radius: 10px;
  }

  .login-modal-logo {
    width: 50px;
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
    width: 14px;
    height: 14px;
  }

  .close-modal {
    font-size: 16px;
  }
}

</style>

