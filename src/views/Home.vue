<template>
  <div id="app" class="app-container">

    <!-- Main part -->
    <main class="main-content">

      <!-- When the search is empty, we show the regular main screen.-->
      <template v-if="!isSearching">

        <!-- Block of promotions -->
        <section class="promotions">
          <div class="promo-card">
            <img src="/download111.jpeg" alt="Promotion 1" />
          </div>
          <div class="promo-card">
            <img src="/discount.jpg" alt="Promotion 2" />
          </div>
        </section>

        <!-- Block of companies -->
        <section class="companies">
          <h3>{{ $t('home.favorite_shops') }}</h3>

          <div class="company-list-wrapper">
            <button
              class="scroll-btn left"
              @click="scrollLeft('company')"
              v-show="canScroll['company']"
            >
              ‹
            </button>

            <div class="company-list" ref="companyList">
              <div class="company-card" v-for="c in companies" :key="c.id">
                <img :src="c.logo" alt="logo" />
                <h3>{{ c.name }}</h3>
                <p>⭐ {{ c.rating }}</p>
              </div>
            </div>

            <button
              class="scroll-btn right"
              @click="scrollRight('company')"
              v-show="canScroll['company']"
            >
              ›
            </button>
          </div>
        </section>

        <!-- Block of companies with products -->
        <section
  v-if="!store.search"
  class="company-products"
  v-for="c in companiesWithProducts"
  :key="c.id"
>

          <div class="company-products-header">
            <h3>{{ c.name }}</h3>
            <button class="view-all">{{ $t('home.see_all') }}</button>
          </div>

          <div class="product-list-wrapper">
            <button
              class="scroll-btn left"
              @click="scrollLeft(c.id)"
              v-show="canScroll[c.id]"
            >
              ‹
            </button>

            <div class="product-list-container">
              <div class="product-list" :ref="el => productLists[c.id] = el">
                <div class="product-card" v-for="p in c.products" :key="p.uid">
                  <div class="product-image-wrapper">
                    <img :src="p.image" alt="product" />
                    <span
                      class="heart"
                      :class="{ active: store.favorites.find(item => item.uid === p.uid) }"
                      @click="toggleFavorite(p)"
                    >
                      ♥
                    </span>
                  </div>
                  <h4>{{ p.name }}</h4>
                  <button class="buy-now-btn" @click="buyNow(p)">
                    {{ $t('home.buy') }} {{ p.price }} ֏
                  </button>
                  <div class="product-actions">
                    <span class="cart" @click="toggleCart(p)">
                      {{ store.cart.find(item => item.uid === p.uid) ? '✅' : '🛒' }}
                    </span>
                  </div>
                </div>
              </div>

              <div v-if="c.name === 'Pizza House'" class="company-right-image">
                <img src="/pizza_house_extra.jpg" alt="Pizza House Extra" />
              </div>
            </div>

            <button
              class="scroll-btn right"
              :class="{ 'pizza-house': c.name === 'Pizza House' }"
              @click="scrollRight(c.id)"
              v-show="canScroll[c.id]"
            >
              ›
            </button>
          </div>
        </section>

      </template>

      <!-- When the user enters text, we display search results.-->
      <template v-else>
  <section class="search-results" v-if="isSearching">
  <div v-for="c in filteredSearchCompanies" :key="c.id">
    <h3>{{ c.name }}</h3>
    <div class="product-list">
      <div class="product-card" v-for="p in c.products" :key="p.uid">
        <img :src="p.image" alt="product" />
        <h4>{{ p.name }}</h4>
        <button class="buy-now-btn" @click="buyNow(p)">
          {{ $t('home.buy') }} {{ p.price }} ֏
        </button>
      </div>
    </div>
  </div>

  <div v-if="filteredSearchCompanies.length === 0" class="no-results">
    <p>{{ $t('home.no_results') }}</p>
  </div>
</section>

</template>


    </main>
  </div>
</template>


<script setup >
import { ref, onMounted, nextTick, computed } from "vue";
import { store } from "../store.js";
import { inject } from 'vue'
import { useRouter } from "vue-router";


const isSearching = computed(() => store.search.trim().length > 0);
const router = useRouter();

const currentUser = inject('currentUser', ref(null));
const showLogin = inject('showLogin', ref(false));


const companies = [
  { id: 1, name: "Coffee Time", rating: 4.8, logo: "/coffee.png" },
  { id: 2, name: "Pizza House", rating: 4.6, logo: "/pizza_slice.png" },
  { id: 3, name: "Fresh Market", rating: 4.9, logo: "/the-fresh-market.png" },
  { id: 4, name: "Burgers & Co", rating: 4.7, logo: "/backyard-burgers.png" },
  { id: 5, name: "Pharmacies", rating: 4.6, logo: "/pharmacies.png" },
  { id: 6, name: "Supermarkets", rating: 4.5, logo: "/Supermarkets.png" },
];

const companiesWithProducts = [
  {
    id: 1,
    name: "Coffee Time",
    products: [
      { id: 1, name: "Latte", price: 1200, image: "/latte.jpeg" },
      { id: 2, name: "Cappuccino", price: 1000, image: "/cappuccino.jpeg" },
      { id: 3, name: "Espresso", price: 900, image: "/espresso.jpeg" },
      { id: 4, name: "Mocha", price: 800, image: "/mocha.jpeg" },
      { id: 5, name: "Americano", price: 700, image: "/americano.jpeg" },
      { id: 6, name: "Caramel", price: 1400, image: "/caramel.jpeg" },
      { id: 7, name: "Chocolate", price: 1100, image: "/chocolate.jpeg" },
    ],
  },
  {
    id: 2,
    name: "Pizza House",
    products: [
      { id: 1, name: "Palermo", price: 2200, image: "/Palermo.png" },
      { id: 2, name: "Peperoni", price: 1900, image: "/Peperoni.png" },
      { id: 3, name: "Roman", price: 2500, image: "/Roman.jpg" },
      { id: 4, name: "Venice", price: 2400, image: "/Venice.jpg" },
      { id: 5, name: "Europe", price: 2200, image: "/Europe.jpg" },
      { id: 6, name: "Diablo", price: 2900, image: "/Diablo.png" },
    ],
  },
  {
    id: 3,
    name: "Burgers & Co",
    products: [
      { id: 1, name: "Special Burger", price: 1800, image: "/Special Burger.jpg" },
      { id: 2, name: "Bacon Jam Burger", price: 2000, image: "/Bacon Jam Burger.jpg" },
      { id: 3, name: "BBQ Burger", price: 1600, image: "/BBQ Burger.jpg" },
      { id: 4, name: "Buffalo Chicken Burger", price: 1700, image: "/Buffalo Chicken Burger.jpg" },
      { id: 5, name: "Cheese Burger", price: 2000, image: "/Cheese Burger.jpg" },
      { id: 6, name: "Crispy Chicken Burger", price: 1700, image: "/Crispy Chicken Burger.jpg" },
      { id: 7, name: "Hotdog", price: 900, image: "/Hotdog.jpg" },
    ],
  },
  {
    id: 4,
    name: "Seasonal vitamins from AKG",
    products: [
      { id: 1, name: "Vitamin-A", price: 6500, image: "/Vitamin-A.png" },
      { id: 2, name: "Vitamin-C", price: 6000, image: "/Vitamin-C.png" },
      { id: 3, name: "Omega-3", price: 5500, image: "/Omega-3.png" },
      { id: 4, name: "Multivits", price: 5000, image: "/Multivits.png" },
      { id: 5, name: "Calcium", price: 5800, image: "/Calcium.png" },
    ],
  },
];

//  search by companies
const filteredSearchCompanies = computed(() => {
  const query = (store.search || "").toLowerCase().trim();
  if (!query) return [];

  // Filter products within each company
  return companiesWithProducts
    .map(c => {
      const products = c.products.filter(p =>
        p.name.toLowerCase().includes(query)
      );
      return { ...c, products };
    })
    .filter(c => c.products.length > 0); // we leave only companies with matches
});


// ✅Add a UID to each product
companiesWithProducts.forEach(company => {
  company.products.forEach(product => {
    product.uid = company.id + "-" + product.id;
    product.company = company.name;
  });
});

const productLists = {};
const canScroll = ref({});
const companyList = ref(null);

// Scroll
function scrollLeft(id) {
  const el = id === "company" ? companyList.value : productLists[id];
  el.scrollBy({ left: -200, behavior: "smooth" });
}

function scrollRight(id) {
  const el = id === "company" ? companyList.value : productLists[id];
  el.scrollBy({ left: 200, behavior: "smooth" });
}

// Buy Now
function buyNow(product) {
  if (!currentUser.value) {
    showLogin.value = true; // open login
    return;
  }

  // We create an array with one product and encode it in the query
  const productsQuery = encodeURIComponent(JSON.stringify([product]));

  // We go to the payment page with query
  router.push(`/payment?products=${productsQuery}`);
}


// ✅ FAVORITES —allow only after login
function toggleFavorite(product) {
  if (!currentUser.value) {
    showLogin.value = true; // open the login modal
    return;
  }
  const exists = store.favorites.find(p => p.uid === product.uid);
  if (exists) {
    store.favorites = store.favorites.filter(p => p.uid !== product.uid);
  } else {
    store.favorites.push(product);
  }
}

// ✅ CART —allow only after login
function toggleCart(product) {
  if (!currentUser.value) {
    showLogin.value = true; // open the login modal
    return;
  }
  const exists = store.cart.find(p => p.uid === product.uid);
  if (exists) {
    store.cart = store.cart.filter(p => p.uid !== product.uid);
  } else {
    store.cart.push(product);
  }
}


// Scroll init
onMounted(() => {
  nextTick(() => {
    canScroll.value["company"] =
      companyList.value.scrollWidth > companyList.value.clientWidth;

    companiesWithProducts.forEach(c => {
      const el = productLists[c.id];
      canScroll.value[c.id] = el.scrollWidth > el.clientWidth;
    });
  });
});
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-results .product-list {
  display: flex;
  flex-wrap: nowrap;       /* horizontally, without transfer */
  gap: 15px;
  overflow-x: auto;        /* horizontal scroll */
  padding-bottom: 10px;
  scroll-behavior: smooth;
}

.search-results .product-card {
  flex: 0 0 auto;          /* does not compress */
  width: 150px;            /* card width */
}


.no-results {
  text-align: center;
  color: #777;
  margin-top: 40px;
}

/* Block of companies */
.companies h2 {
  margin-bottom: 10px;
}

.company-list-wrapper {
  position: relative;
}

.company-list {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding-bottom: 10px;
  scroll-behavior: smooth;
}

/* Product block */
.company-products {
  position: relative;
}

.company-products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Product list wrapper */
.product-list-wrapper {
  position: relative;
}

/* Product list */
.product-list {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding-bottom: 10px;
  scroll-behavior: smooth;
   flex: 1; /*to occupy the remaining space */
}



.product-list-container {
  display: flex;
  gap: 0;
  position: relative;
   align-items: flex-start; 
}

.company-right-image {
  flex-shrink: 0;
  height: 200px;  /* fixed height */
  width: auto;

  

}
.company-right-image img {
  width: 310px;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}



/* Cards */
.company-card, .product-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  text-align: center;
  padding: 10px;
}

.company-card {
  flex: 0 0 100px;
  height: 110px;
}

.company-card img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  margin: 0 auto 8px auto;
  display: block;
}

.company-card h3 {
  font-size: 11px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.company-card p {
  font-size: 11px;
  margin: 0;
}

.product-card h4 {
  font-size: 12px;
  margin-bottom: 5px;
}

.product-card p {
  font-size: 12px;
  color: #e63946;
  font-weight: bold;
}
.product-card img {
  width: 90px;        /* image width */
  height: 90px;       /* fixed height*/
  object-fit: cover;   /* trims the edges, maintains a normal appearance*/
  border-radius: 8px;  /* rounded edges */
  display: block;
  margin: 0 auto 8px;
}
.product-card:hover {
  
  transform: translateY(-1px);
}

.product-image-wrapper {
  position: relative;
}

.product-image-wrapper img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
}

.heart {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 18px;
  cursor: pointer;
  color: gray; /*default is gray */
  transition: transform 0.2s, color 0.2s;
}

.heart.active {
  color: red;
  transform: scale(1.2);
}

.heart:hover {
  transform: scale(1.2);
}


/* Scroll buttons */
.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 10;
}

.scroll-btn.left { left: 5px; }
.scroll-btn.right { right: 5px; transition: right 0.3s; }
.scroll-btn.right.pizza-house {
  right: 320px;
}
/* Show arrows only on hover */
.company-list-wrapper:hover .scroll-btn,
.product-list-wrapper:hover .scroll-btn {
  opacity: 1;
}

/* Hide scrollbar */
.company-list::-webkit-scrollbar,
.product-list::-webkit-scrollbar {
  display: none;
}

.company-list,
.product-list {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Promo cards */
.promotions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.promo-card {
  flex: 1 1 calc(50% - 10px);
  min-height: 160px;
  background: #e63946;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  border-radius: 12px;
  font-weight: bold;
}
.promo-card img {
  width: 100%;
  height: 160px;     
  object-fit: cover;   /* so that the picture fills the block nicely */
  border-radius: 12px; /*rounding corners*/
  display: block;
}

.buy-now-btn {
  background: #138803;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: transform 0.2s;
}

.buy-now-btn:hover {
  transform: scale(1.05);
}


/* New styles for the heart and basket */
.product-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 5px;
}

.favorite {
  cursor: pointer;
  font-size: 18px;
  color: gray; /* default is gray */
  transition: transform 0.2s, color 0.2s;
}


.favorite.active {
  color: red;  /* when choosing red */
  font-size: 18px;
  transform: scale(1.2);
}
  

.favorite:hover{
    transform: scale(1.2);
}

.cart {
  cursor: pointer;
  font-size: 13px;
  color: gray;
  transition: transform 0.2s, color 0.2s;
}

.cart.in-cart {
  color: rgb(230, 15, 15);
   font-size: 16px;
  transform: scale(1.2);
}

.cart:hover {
  transform: scale(1.2);
}

/* View all button */
.view-all {
  font-size: 12px;
  color: #3987fc;
  background: none;
  border: none;
  cursor: pointer;
}

/* Adaptive */
@media (max-width: 768px) {
  .promo-card { flex: 1 1 100%; }
  .company-card, .product-card { flex: 0 0 120px; }
  .scroll-btn { font-size: 16px; width: 26px; height: 26px; }
}

/* Adaptive for medium screens */
@media (max-width: 768px) {
  

  .company-right-image img {
    width: 200px;
  }
}

/* Adaptive for small screens */
@media (max-width: 480px) {
  .company-right-image {
   
    margin-top: 10px; /*indentation to prevent food from sticking together */
  }

  .company-right-image img {
    width: 150px;
  }

  
}
/* Adaptive for tablets*/
@media (max-width: 768px) {
  .scroll-btn.right.pizza-house {
    right: 200px; /* decrease indentation */
  }
}

/* Adaptive for phones */
@media (max-width: 480px) {
  .scroll-btn.right.pizza-house {
    right: 150px; /* decrease indentation */
  }
}

/* Adaptive for tablets */
@media (max-width: 768px) {
  .search-results .product-card {
    width: 120px;          /* We're making cards smaller on tablets. */
  }
}

/* Adaptive for phones */
@media (max-width: 480px) {
  .search-results .product-card {
    width: 100px;          /* even less for phones */
  }
}
</style>
