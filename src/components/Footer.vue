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

      <!--Link columns -->
      <div class="footer-columns">
        <div class="footer-column">
          <a href="#">About Us</a>
          <router-link to="/become-partner" class="footer-link">Become a partner</router-link>

          <a href="#">Delivery & Payment</a>
        </div>
        <div class="footer-column">
          <a href="#">Become a Courier</a>
          <a href="#">Contact</a>
        </div>
        <div class="footer-column">
          <a href="#">Customer Support</a>
          <p>📞 +374 00 000 000</p>
        </div>
      </div>

      <!--Applications -->
      <div class="footer-apps">
        <a href="#"><img src="/google-play.svg" alt="Google Play" /></a>
        <a href="#"><img src="/app-store.svg" alt="App Store" /></a>
      </div>
    </div>

    <!--Bottom part -->
    <div class="footer-bottom">
      <div class="footer-left">
        <p>© 2020 - 2025 Free Zone. All rights reserved.</p>
      </div>
      <div class="footer-right footer-social">
        <a href="#"><img src="/facebook.svg" alt="Facebook" /></a>
        <a href="#"><img src="/instagram.svg" alt="Instagram" /></a>
        <a href="#"><img src="/youtube.svg" alt="YouTube" /></a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped>
.footer {
  background: #f5f5f5;
  color: #333;
  padding: 8px 15px;   /* smaller padding */
  font-family: Arial, sans-serif;
  font-size: 13px;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: center; /* key alignment */
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 5px;
}

.footer-logo .logo {
  text-decoration: none;
  color: #333;
  display: flex;
  flex-direction: column;
}

.logo-top {
  font-size: 16px;
  font-family: 'Pacifico', cursive;
  transform: rotate(-10deg);
}

.logo-bottom {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.footer-columns {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center; /* align center */
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 2px; /* minimal gap */
  margin: 0;
}

.footer-apps {
  display: flex;
  flex-direction: row; /* horizontal now, not column */
  gap: 8px;
  align-items: center;
}

.footer-bottom {
  border-top: 1px solid #ddd;
  padding-top: 5px;   /* smaller padding */
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
}

.footer-columns {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.footer-column a {
  color: #555;
  text-decoration: none;
  font-size: 12px;
}

.footer-column a:hover {
  color: #ff6600;
}

.footer-column p {
  margin: 0;
  font-size: 12px;
}

.footer-apps {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
}

.footer-apps img {
  width: 70px;
}

/* Footer bottom */
.footer-bottom {
  border-top: 1px solid #ddd;
  padding-top: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
}

/* Social icons */
.footer-social img {
  width: 20px;   /* reduced size */
  height: 20px;  /* fixed height for proportions */
  object-fit: contain;
  margin-left: 8px;
}

/* Responsive design */
@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .footer-columns {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .footer-apps {
    flex-direction: row;
    gap: 10px;
    justify-content: center;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }
}
</style>

