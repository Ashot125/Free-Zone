<template>
  <div id="app">
    <!-- Навигация -->
    <NavBar @open-login="showLogin = true" />

    <!-- Основной контент -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Футер -->
    <Footer />

    <!-- Модалка -->
    <LoginModal :show="showLogin" @close="showLogin = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import LoginModal from '@/components/LoginModal.vue'

const showLogin = ref(false)
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
</style>
