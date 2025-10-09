<template>
  <div id="app" class="app-container">
   
    <!-- Main part -->
    <main class="main-content">

      <!-- Block of shares -->
      <section class="promotions">
        <div class="promo-card">🔥The biggest discount</div>
        <div class="promo-card">⚡Limited offer</div>
      </section>

      <!-- Block of companies -->
      <section class="companies">
        <h3>Favorite Shops</h3>

        <div class="company-list-wrapper">
          <!-- Left arrow -->
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

          <!-- Right arrow -->
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
        class="company-products"
        v-for="c in companiesWithProducts"
        :key="c.id"
      >
        <div class="company-products-header">
          <h3>{{ c.name }}</h3>
          <button class="view-all">See all</button>
        </div>

        <div class="product-list-wrapper">
          <!-- Left arrow -->
          <button
            class="scroll-btn left"
            @click="scrollLeft(c.id)"
            v-show="canScroll[c.id]"
          >
            ‹
          </button>

          <div class="product-list" :ref="el => productLists[c.id] = el">
            <div class="product-card" v-for="p in c.products" :key="p.id">
              <img :src="p.image" alt="product" />
              <h4>{{ p.name }}</h4>
              <p>{{ p.price }} ֏</p>
            </div>
          </div>

          <!-- Right arrow -->
          <button
            class="scroll-btn right"
            @click="scrollRight(c.id)"
            v-show="canScroll[c.id]"
          >
            ›
          </button>
        </div>
      </section>

    </main>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";


const companies = [
  { id: 1, name: "Coffee Time", rating: 4.8, logo: "/coffee-time.svg" },
  { id: 2, name: "Pizza House", rating: 4.6, logo: "/pizza_slice.svg" },
  { id: 3, name: "Fresh Market", rating: 4.9, logo: "/the-fresh-market.svg" },
  { id: 4, name: "Burgers & Co", rating: 4.7, logo: "/backyard-burgers.svg" },
];

const companiesWithProducts = [
  {
    id: 1,
    name: "Coffee Time",
    products: [
      { id: 1, name: "Latte", price: 1200, image: "/latte.png" },
      { id: 2, name: "Cappuccino", price: 1300, image: "/cappuccino.png" },
      { id: 3, name: "Espresso", price: 900, image: "/espresso.png" },
      { id: 4, name: "Mocha", price: 1500, image: "/mocha.png" },
    ],
  },
  {
    id: 2,
    name: "Pizza House",
    products: [
      { id: 1, name: "Margarita", price: 3500, image: "/pizza1.png" },
      { id: 2, name: "Pepperoni", price: 4200, image: "/pizza2.png" },
      { id: 3, name: "BBQ Chicken", price: 4500, image: "/pizza3.png" },
      { id: 4, name: "Four Cheese", price: 3800, image: "/pizza4.png" },
      { id: 5, name: "Margarita", price: 3500, image: "/pizza1.png" },
      { id: 6, name: "Pepperoni", price: 4200, image: "/pizza2.png" },
      { id: 7, name: "BBQ Chicken", price: 4500, image: "/pizza3.png" },
      { id: 8, name: "Four Cheese", price: 3800, image: "/pizza4.png" },
    ],
  },
  {
    id: 3,
    name: "Pizza House",
    products: [
      { id: 1, name: "Margarita", price: 3500, image: "/pizza1.png" },
      { id: 2, name: "Pepperoni", price: 4200, image: "/pizza2.png" },
      { id: 3, name: "BBQ Chicken", price: 4500, image: "/pizza3.png" },
      { id: 4, name: "Four Cheese", price: 3800, image: "/pizza4.png" },
      { id: 5, name: "Margarita", price: 3500, image: "/pizza1.png" },
      { id: 6, name: "Pepperoni", price: 4200, image: "/pizza2.png" },
      { id: 7, name: "BBQ Chicken", price: 4500, image: "/pizza3.png" },
    ],
  },
  {
    id: 4,
    name: "Pizza House",
    products: [
      { id: 1, name: "Margarita", price: 3500, image: "/pizza1.png" },
      { id: 2, name: "Pepperoni", price: 4200, image: "/pizza2.png" },
      { id: 3, name: "BBQ Chicken", price: 4500, image: "/pizza3.png" },
      { id: 4, name: "Four Cheese", price: 3800, image: "/pizza4.png" },
      { id: 5, name: "Margarita", price: 3500, image: "/pizza1.png" },
      { id: 6, name: "Pepperoni", price: 4200, image: "/pizza2.png" },
      { id: 7, name: "BBQ Chicken", price: 4500, image: "/pizza3.png" },
      { id: 8, name: "Four Cheese", price: 3800, image: "/pizza4.png" },
      { id: 9, name: "Margarita", price: 3500, image: "/pizza1.png" },
      { id: 10, name: "Pepperoni", price: 4200, image: "/pizza2.png" },
    ],
  },
];

const productLists = {};
const canScroll = ref({});
const companyList = ref(null);

function scrollLeft(id) {
  const el = id === 'company' ? companyList.value : productLists[id];
  el.scrollBy({ left: -200, behavior: "smooth" });
}

function scrollRight(id) {
  const el = id === 'company' ? companyList.value : productLists[id];
  el.scrollBy({ left: 200, behavior: "smooth" });
}

onMounted(() => {
  nextTick(() => {
    if (companyList.value && companyList.value.scrollWidth > companyList.value.clientWidth) {
      canScroll.value['company'] = true;
    } else {
      canScroll.value['company'] = false;
    }

    for (const c of companiesWithProducts) {
      const el = productLists[c.id];
      canScroll.value[c.id] = el && el.scrollWidth > el.clientWidth;
    }
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
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
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
  width: 80px;
  height: 80px;
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
.scroll-btn.right { right: 5px; }

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
</style>
