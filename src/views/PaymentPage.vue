<template>
  <div class="payment-page">
    <div v-if="!paid" class="payment-grid">
      <!-- Left: visual map -->
      <div class="card-column">
        <div class="card-visual" :class="{ flip: showCVC, tilt: tilt }">
          <div class="card-front">
            <div class="chip"></div>
            <div class="card-number">
              <span v-for="(digit, index) in displayedDigits" :key="index" class="digit">
                {{ digit }}
              </span>
            </div>
            <div class="card-footer">
              <div class="card-name">{{ cardName || "FULL NAME" }}</div>
              <div class="card-expiry">{{ expiry || "MM/YY" }}</div>
            </div>
          </div>
          <div class="card-back">
            <div class="magnetic" />
            <div class="cvc-box">
              <div class="cvc-label">CVC</div>
              <div class="cvc">{{ cvc || "###" }}</div>
            </div>
          </div>
        </div>
      </div>

      
<!-- Right: form -->
<div class="form-column">

  <!--Headline -->
  <h3 class="title">Payment</h3>

  <!-- Always visible amount -->
  <div class="total">Total: {{ totalAmount }} ֏</div>

  <!-- Map fields-->
  <label class="small">
    Cardholder
    <input
      v-model="cardName"
      @focus="showCVC=false; tilt=true"
      @blur="tilt=false"
      type="text"
      placeholder="John Doe"
    />
  </label>

  <label class="small">
    Card number
    <input
      v-model="cardNumber"
      @input="formatCardNumber"
      @focus="showCVC=false; tilt=true"
      @blur="tilt=false"
      type="text"
      placeholder="1234 5678 9012 3456"
      maxlength="16"
    />
  </label>

  <div class="row">
    <label class="mini">
      Expiry
      <input
        v-model="expiry"
        @focus="showCVC=false; tilt=true"
        @blur="tilt=false"
        type="text"
        placeholder="MM/YY"
        maxlength="5"
      />
    </label>

    <label class="mini">
      CVC
      <input
        v-model="cvc"
        @focus="showCVC=true; tilt=false"
        @blur="tilt=false"
        type="text"
        placeholder="123"
        maxlength="4"
      />
    </label>
  </div>

  <!-- Card type -->
  <div class="cards-row">
    <img
      v-for="type in ['visa','mastercard','amex']"
      :key="type"
      :src="`/${type}.png`"
      :class="{ selected: selectedCard === type }"
      @click="selectedCard = type"
    />
  </div>

  <!--Payment button -->
  <button
    :disabled="loading"
    @click="pay"
    class="pay-btn"
  >
    <span v-if="!loading">Pay</span>
    <span v-else>...</span>
  </button>

  <!-- Togglefor the list of products -->
  <button
    @click="showProducts = !showProducts"
    class="toggle-btn"
  >
    {{ showProducts ? "Hide products" : "Show products" }}
  </button>

  <!--List of products under the button -->
  <ul v-if="showProducts" class="products-list">
    <li v-for="(p, index) in products" :key="p.id" class="product-item">
      <span class="product-info">{{ p.name }} — {{ p.price }} ֏ x {{ p.quantity || 1 }}</span>
      <button class="remove-btn" @click="removeProduct(index)">❌</button>
    </li>
  </ul>

</div>


    </div>
    

    <!-- Success -->
    <div v-else class="success">
      <h3>Payment confirmed ✅</h3>
      <ul>
        <li v-for="p in products" :key="p.id">{{ p.name }} — {{ p.price }} ֏ x {{ p.quantity || 1 }}</li>
      </ul>
      <p>Total: <strong>{{ totalAmount }} ֏</strong></p>
      <p>Transaction: <strong>{{ transactionId }}</strong></p>
      <router-link to="/">Home</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { auth, db } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { store } from '../store.js'

const route = useRoute();
const router = useRouter();
const showProducts = ref(false);

const selectedCard = ref("");
const cardName = ref("");
const cardNumber = ref("");
const expiry = ref("");
const cvc = ref("");
const loading = ref(false);
const paid = ref(false);
const transactionId = ref("");
const showCVC = ref(false);
const tilt = ref(false);


function removeProduct(index) {
  products.value.splice(index, 1);
}

// Getting a list of products from query
const products = ref([]);
if (route.query.products) {
  try {
    products.value = JSON.parse(decodeURIComponent(route.query.products));
  } catch (e) {
    console.error("Error parsing product list", e);
    products.value = [];
  }
}

// Total amount of all goods
const totalAmount = computed(() => {
  return products.value.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0);
});

const formattedCardNumber = computed(() => {
  if (!cardNumber.value) return "################";
  return cardNumber.value.replace(/\D/g, '').slice(0, 16).padEnd(16, '#');
});

const displayedDigits = ref(formattedCardNumber.value.split(''));
watch(formattedCardNumber, (newVal) => {
  displayedDigits.value = newVal.split('');
});

function formatCardNumber() {
  cardNumber.value = cardNumber.value.replace(/\D/g, '').slice(0, 16);
}

// Processing successful payment
function handlePaymentSuccess(productsPaid) {
  // ДAdd paid items to My Orders
  store.orders.push(...productsPaid);

  // We remove them from the basket
  store.cart = store.cart.filter(c => !productsPaid.some(p => p.id === c.id));

  // Return to cart
  router.push('/cart');
}

// Payment
async function pay() {
  if (!auth.currentUser) {
    alert("Please log in before paying.");
    return;
  }
  if (!cardName.value || !cardNumber.value || !expiry.value || !cvc.value) {
    alert("Please fill in all fields");
    return;
  }
  if (!selectedCard.value) {
    alert("Select card type");
    return;
  }

  loading.value = true;
  try {
    const docRef = await addDoc(collection(db, "payments"), {
      userId: auth.currentUser.uid,
      products: products.value,
      totalAmount: totalAmount.value,
      cardType: selectedCard.value,
      cardName: cardName.value,
      createdAt: serverTimestamp(),
      status: "paid",
    });

    transactionId.value = docRef.id;
    // ✅ Items from the cart → My Orders
    handlePaymentSuccess(products.value);
    paid.value = true;
  } catch (e) {
    console.error(e);
    alert("Payment error");
  } finally {
    loading.value = false;
  }
}

</script>

<style scoped>
.payment-page {
  max-width: 360px;
  margin: 12px auto;
  padding: 10px;
  font-family: Inter, Arial, sans-serif;
}

.payment-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 10px;
  align-items: start;
}

.card-column {
  display: flex;
  justify-content: center;
}

.card-visual {
  width: 180px;
  height: 96px;
  perspective: 800px;
  transition: transform 0.22s ease;
}
.card-visual.tilt {
  transform: rotateX(3deg) rotateY(4deg);
}

.card-front,
.card-back {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  color: #fff;
  padding: 8px;
  box-sizing: border-box;
  position: relative;
  backface-visibility: hidden;
  transition: transform 0.45s;
  font-size: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(135deg, #2b8aef, #1a6fd0);
}

.card-back {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, #333, #111);
}

.card-visual.flip .card-front {
  transform: rotateY(180deg);
}

.card-visual.flip .card-back {
  transform: rotateY(0deg);
}

.chip {
  width: 20px;
  height: 14px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 2px;
}

.card-number {
  font-size: 11px;
  letter-spacing: 1.2px;
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.digit {
  width: 8px;
  text-align: center;
  display: inline-block;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-name {
  text-transform: uppercase;
  font-size: 9px;
  opacity: 0.95;
}

.card-expiry {
  font-size: 9px;
  opacity: 0.95;
}

.magnetic {
  height: 18px;
  background: rgba(0, 0, 0, 0.6);
  margin-bottom: 10px;
  border-radius: 3px;
}

.cvc-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
}

.cvc-label {
  font-size: 9px;
  color: #bbb;
}

.cvc {
  font-size: 12px;
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
}

.form-column {
  padding: 4px 2px;
}

.title {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 600;
}
.toggle-btn {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  margin-top: 8px;
  background: #aaa;
  transition: transform 0.12s;
}

.toggle-btn:active {
  transform: translateY(1px);
}

.products-list {
  margin: 6px 0;
  padding-left: 16px;
  font-size: 12px;
}

.total {
  font-weight: 700;
  margin-bottom: 8px;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.product-info {
  font-size: 12px;
}

.remove-btn {
  padding: 2px 6px;
  font-size: 10px;
  border: none;
  background: #ff4d4f;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.remove-btn:hover {
  transform: scale(1.1);
}

label.small {
  display: block;
  margin-bottom: 6px;
  font-size: 11px;
  color: #333;
}

label.small input {
  width: 100%;
  padding: 6px 8px;
  margin-top: 4px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  font-size: 12px;
}

label.small input:focus {
  border-color: #2b8aef;
  box-shadow: 0 0 0 3px rgba(43, 138, 239, 0.08);
}

.row {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}

label.mini {
  flex: 1;
  font-size: 11px;
}

label.mini input {
  width: 100%;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  font-size: 12px;
}

.cards-row {
  display: flex;
  gap: 6px;
  margin: 8px 0;
}

.cards-row img {
  height: 14px;
  opacity: 0.95;
  cursor: pointer;
}

.cards-row img.selected {
  border: 2px solid #2b8aef;
  border-radius: 4px;
  opacity: 1;
}

.pay-btn {
  width: 100%;
  padding: 8px;
  background: linear-gradient(90deg, #2b8aef, #1a6fd0);
  color: #fff;
  border: none;
  border-radius: 7px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: transform 0.12s;
}

.pay-btn:active {
  transform: translateY(1px);
}

.pay-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.success {
  text-align: center;
  padding: 12px;
  background: #ecfff0;
  border-radius: 8px;
}

.success h3 {
  color: #0b74d1;
  margin-bottom: 6px;
  font-size: 14px;
}

@media (max-width: 520px) {
  .payment-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .card-visual {
    width: 100%;
    height: 120px;
  }
}

</style>
