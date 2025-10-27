<template>
  <div class="cart-page">
    <h2>{{ t('cart.basket') }}</h2>

    <!-- Basket -->
    <div class="cart-list" v-if="store.cart.length">
      <div class="product-card" v-for="p in store.cart" :key="p.uid">
        <div class="product-image-wrapper">
          <img :src="p.image" alt="product" />

          <!-- Heart -->
          <span
            class="heart"
            :class="{ active: store.favorites.find(item => item.uid === p.uid) }"
            @click="toggleFavorite(p)"
          >
            ♥
          </span>
        </div>

        <h4>{{ p.name }}</h4>

        <!-- Quantity control -->
        <div class="quantity-controls">
          <button @click="decreaseQuantity(p)">-</button>
          <span class="quantity">{{ p.quantity || 1 }}</span>
          <button @click="increaseQuantity(p)">+</button>
        </div>

        
        <button class="buy-now-btn" @click="buyNow([p])">
          {{ t('cart.buy_now') }} {{ (p.price || 0) * (p.quantity || 1) }} ֏
        </button>

        <div class="product-actions">
          <span class="cart" @click="toggleCart(p)">
            {{ store.cart.find(item => item.uid === p.uid) ? '✅' : '🛒' }}
          </span>
        </div>
      </div>
    </div>
    <p v-else>{{ t('cart.empty') }}</p>

    <div v-if="store.cart.length" class="cart-footer">
      <p>{{ t('cart.total') }}: {{ totalPrice }} ֏</p>
      <button class="buy-btn" @click="checkoutAll">
        {{ t('cart.pay_all') }}
      </button>
    </div>

    <!-- Already purchased -->
    <h2>{{ t('cart.my_orders') }}</h2>
    <div class="cart-list" v-if="store.orders.length">
      <div class="product-card" v-for="p in store.orders" :key="p.id">
        <img :src="p.image" alt="product" />
        <h4>{{ p.name }}</h4>
        <p>{{ t('cart.price') }}: {{ p.price }} ֏</p>
      </div>
    </div>
    <p v-else>{{ t('cart.no_orders') }}</p>
  </div>
</template>

<script setup>
import { store } from "../store.js";
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter();

// Total amount including quantity
const totalPrice = computed(() =>
  store.cart.reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 1), 0)
);

// Buy now — We pass goods via query
function buyNow(products) {
  const productsQuery = encodeURIComponent(JSON.stringify(products));
  router.push(`/payment?products=${productsQuery}`);
}

// Payment for all goods
function checkoutAll() {
  if (!store.cart.length) return;
  const productsQuery = encodeURIComponent(JSON.stringify(store.cart));
  router.push(`/payment?products=${productsQuery}`);
}

// Favorites
function toggleFavorite(product) {
  const exists = store.favorites.find(p => p.uid === product.uid);
  if (exists) store.favorites = store.favorites.filter(p => p.uid !== product.uid);
  else store.favorites.push(product);
}

// Basket
function toggleCart(product) {
  const exists = store.cart.find(p => p.uid === product.uid);
  if (exists) {
    const confirmed = window.confirm("Remove from cart?");
    if (confirmed) store.cart = store.cart.filter(p => p.uid !== product.uid);
  } else {
    store.cart.push({ ...product, quantity: 1 }); // add with quantity
  }
}

// Increase in quantity
function increaseQuantity(product) {
  if (!product.quantity) product.quantity = 1;
  product.quantity++;
}

// Reducing the number
function decreaseQuantity(product) {
  if (!product.quantity) product.quantity = 1;
  if (product.quantity > 1) {
    product.quantity--;
  } else {
    const confirmed = window.confirm("Remove from cart?");
    if (confirmed) store.cart = store.cart.filter(p => p.uid !== product.uid);
  }
}
</script>

<style>
.cart-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: flex-start;
}

.product-card {
  flex: 0 0 120px;
  text-align: center;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 10px;
}

.buy-now-btn, .buy-btn {
  background: #138803;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: transform 0.2s;
}

.buy-now-btn:hover, .buy-btn:hover {
  transform: scale(1.05);
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
  margin: 0 auto 8px;
}

.heart {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 18px;
  cursor: pointer;
  color: gray;
  transition: transform 0.2s, color 0.2s;
}

.heart.active {
  color: red;
  transform: scale(1.2);
}

.heart:hover {
  transform: scale(1.2);
}

/* Quantity control */
.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin: 5px 0;
}

.quantity-controls button {
  width: 18px;         
  height: 18px;         
  font-size: 14px;     
  background: none;    
  border: none;        
  cursor: pointer;
  padding: 0;
  line-height: 1;       /* so that the symbol is centered */
  color: #333;         
}

.quantity-controls button:focus {
  outline: none;        /*deselect on click */
}

.quantity-controls .quantity {
  min-width: 18px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
}

</style>
