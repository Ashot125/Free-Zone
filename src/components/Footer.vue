<template>
  <footer class="footer">
    <!-- Upper part -->
    <div class="footer-top">
      <!-- Logo -->
      <div class="footer-logo">
        <router-link to="/" class="logo">
          <span class="logo-top">Free</span>
          <span class="logo-bottom">Zone</span>
        </router-link>
      </div>

      <!-- Link columns -->
      <div class="footer-columns">
        <div class="footer-column">
          <router-link to="/about" class="nav-link">{{ t('footer.about') }}</router-link>
          <router-link to="/become-partner" class="footer-link">{{ t('footer.partner') }}</router-link>
          <router-link to="/delivery-payment">{{ t('footer.delivery') }}</router-link>
        </div>
        <div class="footer-column">
          <router-link to="/become-courier" class="footer-link">{{ t('footer.courier') }}</router-link>
          <router-link to="/contact">{{ t('footer.contact') }}</router-link>
        </div>
        <div class="footer-column">
          <p>{{ t('footer.support') }}</p>
          <p>📞 +374 93 24 72 44</p>
        </div>
      </div>

      <!-- Applications -->
      <div class="footer-apps">
        <a href="#"><img src="/google-play.svg" alt="Google Play" /></a>
        <a href="#"><img src="/app-store.svg" alt="App Store" /></a>
      </div>
    </div>

    <!-- Bottom part -->
    <div class="footer-bottom">
      <div class="footer-left">
        <p>{{ t('footer.rights') }}</p>
      </div>
      <div class="footer-right footer-social">
        <a href="#"><img src="/facebook.svg" alt="Facebook" /></a>
        <a href="#"><img src="/instagram.svg" alt="Instagram" /></a>
        <a href="#"><img src="/youtube.svg" alt="YouTube" /></a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>



<style scoped>
.footer {
  background: #f5f5f5;
  color: #333;
  padding: 4px 8px;   /*reduced indents */
  font-family: Arial, sans-serif;
  font-size: 11px;    /* smaller font */
}

.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;           /*smaller gap */
  margin-bottom: 3px;
}

.footer-logo .logo {
  text-decoration: none;
  color: #333;
  display: flex;
  flex-direction: column;
}

.logo-top {
  font-size: 19px;    /* smaller font */
  font-family: 'Pacifico', cursive;
  transform: rotate(-10deg);
}

.logo-bottom {
  font-size: 10px;    /* smaller font */
  text-transform: uppercase;
  letter-spacing: 1px;
}

.footer-columns {
  display: flex;
  gap: 80px;          /* less gap between columns */
  flex-wrap: wrap;
  align-items: center;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 4px;           /* minimum intervals */
  margin: 0;
}

.footer-column a {
  color: #555;
  text-decoration: none;
  font-size: 9px;     /* smaller font */
}

.footer-column a:hover {
  color: #ff6600;
}

.footer-column p {
  margin: 0;
  font-size: 10px;    /* smaller font */
}

.footer-apps {
  display: flex;
  flex-direction: row; /* horizontally */
  gap: 5px;            /* distance between icons */
  align-items: center;
}

.footer-apps img {
  width: 70px;   /* the same width*/
  height: 60px;  /*the same height */
  object-fit: contain; /* maintaining proportions within a square */
}


.footer-bottom {
  border-top: 1px solid #ddd;
  padding-top: 3px;   /*  smaller padding */
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 10px;    /* smaller font */
  gap: 3px;
}

.footer-social img {
  width: 16px;        /*fewer social icons */
  height: 16px;
  margin-left: 6px;
}

/* Responsive design */
@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .footer-columns {
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .footer-apps {
    justify-content: center;
    gap: 6px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 3px;
    text-align: center;
  }
}

</style>

