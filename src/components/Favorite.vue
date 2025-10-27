<template>
  <div class="favorites-page">
    <h2>{{ t('favorites.featured') }}</h2>

    <div class="favorites-list" v-if="store.favorites.length">
      <div class="product-card" v-for="p in store.favorites" :key="p.id">
        <div class="image-wrapper">
          <img :src="p.image" alt="product" />
          <span
            class="heart"
            :class="{ active: isFavorite(p) }"
            @click="toggleFavorite(p)"
          >
            ♥
          </span>
        </div>

        <h4>{{ p.name }}</h4>

        <button class="buy-now-btn" @click="buyNow([p])">
          {{ t('favorites.buy_now') }} {{ p.price }} ֏
        </button>

        <div class="product-actions">
          <!-- Cart with confirmation-->
          <span class="cart" @click="moveToCart(p)">🛒</span>
        </div>
      </div>
    </div>

    <p v-else>{{ t('favorites.empty') }}</p>
  </div>
</template>

<script setup>
import { store } from "../store.js";
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter();

function buyNow(products) {
  //Convert the products to JSON to pass to the query
  const productsQuery = encodeURIComponent(JSON.stringify(products));
  
  router.push(`/payment?products=${productsQuery}`);
}
function isFavorite(product) {
  return store.favorites.some(p => p.id === product.id);
}


function toggleFavorite(product) {
  //Remove from favorites
  store.favorites = store.favorites.filter(p => p.id !== product.id);
}

function moveToCart(product) {
  const confirmed = window.confirm("Add to cart and remove from favorites?");
  if (confirmed) {
    // Add to cart
    const exists = store.cart.find(p => p.id === product.id);
    if (!exists) store.cart.push(product);

    // Remove from favorites
    store.favorites = store.favorites.filter(p => p.id !== product.id);
  }
}

</script>

<style>
.favorites-list {
  display: flex;
  flex-wrap: wrap; /* line break */
  gap: 15px;       /* distance between cards */
  justify-content: flex-start;
}

.product-card {
  flex: 0 0 120px; /*card width */
  text-align: center;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 10px;
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
.image-wrapper {
  position: relative;
}

.image-wrapper img {
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
  color: gray; /* default is gray */
  transition: transform 0.2s, color 0.2s;
}

.heart.active {
  color: red;
  transform: scale(1.2);
}

.heart:hover {
  transform: scale(1.2);
}

</style>
