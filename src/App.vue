<template>
  <div id="app">
    <!-- Navigation -->
    <NavBar @open-login="showLogin = true" />

    <!--Main content -->
    <main class="main-content">
      <router-view />
    </main>


    <!-- Footer -->
    <Footer />

    <!-- Modal -->
    <LoginModal :show="showLogin" @close="showLogin = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import LoginModal from '@/components/LoginModal.vue'

const currentUser = ref<{ firstName: string, lastName: string } | null>(null)

const showLogin = ref(false)  //Add a ref for the modal

//Provide for nested components
provide('currentUser', currentUser)
provide('showLogin', showLogin)  // You can now inject into Home.vue
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
