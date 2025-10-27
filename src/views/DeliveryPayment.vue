<template>
  <div class="delivery-page">
 
    <!-- Main content -->
    <main class="main-content">
      <section class="delivery-section fade-in">
        <h3>{{ t('delivery.title') }}</h3>

        <!-- Payment Info -->
        <article class="payment-info">
          <h4>{{ t('delivery.payment.title') }}</h4>
          <p>{{ t('delivery.payment.intro') }}</p>
          <p>{{ t('delivery.payment.non_cash_intro') }}</p>
          <ul>
            <li>{{ t('delivery.payment.method1') }}</li>
            <li>{{ t('delivery.payment.method2') }}</li>
            <li>{{ t('delivery.payment.method3') }}</li>
            <li>{{ t('delivery.payment.method4') }}</li>
            <li>{{ t('delivery.payment.method5') }}</li>
            <li>{{ t('delivery.payment.method6') }}</li>
          </ul>
          <p>{{ t('delivery.payment.cash') }}</p>
          <p>{{ t('delivery.payment.register') }}</p>
        </article>

        <!-- Delivery Info -->
        <article class="delivery-info">
          <h4>{{ t('delivery.delivery.title') }}</h4>
          <p>{{ t('delivery.delivery.intro') }}</p>
          <ul>
            <li>{{ t('delivery.delivery.option1') }}</li>
            <li>{{ t('delivery.delivery.option2') }}</li>
          </ul>
          <p>{{ t('delivery.delivery.note') }}</p>
          <p>{{ t('delivery.delivery.preorder') }}</p>
          <h5>{{ t('delivery.delivery.rates_title') }}</h5>
          <ul>
            <li>{{ t('delivery.delivery.rate1') }}</li>
            <li>{{ t('delivery.delivery.rate2') }}</li>
          </ul>
          <p>{{ t('delivery.delivery.rate_note') }}</p>
        </article>
      </section>
    </main>

  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>


<style scoped>
.delivery-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 15px; 
  max-width: 850px;
  margin: 0 auto;
}

.delivery-section {
  margin-top: 15px;
}

.delivery-section h3 {
  font-size: 18px; 
  margin-bottom: 10px; 
  text-align: center;
}

.delivery-section h4 {
  font-size: 16px;
  margin-top: 15px;
  margin-bottom: 6px;
}

.delivery-section h5 {
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 5px;
}

.delivery-section p,
.delivery-section ul li {
  margin-bottom: 3px; /* less space between lines */
  line-height: 1.3; /* reduced line spacing */
  font-weight: 400;
  font-size: 11px; 
}

.delivery-section ul {
  margin-left: 15px;
  margin-bottom: 6px;
  list-style-type: disc;
}

/* Adaptive*/
@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }

  .delivery-section h3 {
    font-size: 16px;
  }

  .delivery-section h4 {
    font-size: 14px;
  }

  .delivery-section h5 {
    font-size: 13px;
  }

  .delivery-section p,
  .delivery-section ul li {
    font-size: 10px;
  }
}
</style>
