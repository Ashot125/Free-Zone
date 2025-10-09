<template>
  <transition name="fade">
    <div v-if="show" class="login-modal-overlay" @click.self="close">
      <div class="login-modal-content">
        <!-- Close -->
        <button class="close-modal" @click="close">✖</button>

        <!-- Logo -->
        <div class="login-modal-logo">  
           <span class="logo-top">Free</span>
          <span class="logo-bottom">Zone</span>
        </div>

        <!-- Title -->
        <h2 class="login-title">Welcome Back!</h2>

        <!-- Email input with animated placeholder -->
        <div class="material-input">
          <input 
            v-model="email" 
            type="email" 
            required 
          />
          <label>Email</label>
          <span class="underline"></span>
        </div>

        <!-- Continue button -->
        <button class="login-continue-btn" @click="continueLogin">Continue</button>

        <!-- Social login -->
        <div class="login-social-buttons">
          <button class="google-btn" @click="loginWithGoogle">
            <img src="/google.svg" alt="Google" /> Continue with Google
          </button>
          <button class="facebook-btn" @click="loginWithFacebook">
            <img src="/facebook-icon.svg" alt="Facebook" /> Continue with Facebook
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { show } = defineProps<{ show: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const email = ref('')

const close = () => emit('close')
const continueLogin = () => { console.log('Email login:', email.value); close() }
const loginWithGoogle = () => { console.log('Google login clicked'); close() }
const loginWithFacebook = () => { console.log('Facebook login clicked'); close() }
</script>

<style scoped>
/* Overlay and modal */
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1300;
  backdrop-filter: blur(2px);
}

.login-modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 320px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  text-align: center;
}

.close-modal {
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.login-modal-logo {
  font-size: 48px;
  margin: 0 auto;
}

.login-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

/* Material style input */
.material-input {
  position: relative;
  width: 100%;
  margin-top: 10px;
}

.material-input input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #ccc;
  padding: 10px 0 5px 0;
  font-size: 14px;
  background: transparent;
  outline: none;
  transition: border-color 0.3s;
}

.material-input label {
  position: absolute;
  top: 10px;
  left: 0;
  font-size: 14px;
  color: #999;
  pointer-events: none;
  transition: all 0.2s ease;
}

.material-input input:focus + label,
.material-input input:not(:placeholder-shown) + label,
.material-input input:not(:empty) + label {
  top: -8px;
  font-size: 12px;
  color: #4caf50;
}

.material-input .underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background: #4caf50;
  transition: width 0.3s;
}

.material-input input:focus ~ .underline {
  width: 100%;
}

/* Continue button */
.login-continue-btn {
  background: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.login-continue-btn:hover {
  background: #43a047;
  transform: translateY(-1px);
}

/* Social buttons */
.login-social-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.google-btn,
.facebook-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  border: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.google-btn:hover,
.facebook-btn:hover {
  transform: scale(1.03);
  box-shadow: 0 3px 8px rgba(0,0,0,0.2);
}

.google-btn {
  background: #fff;
  border: 1px solid #ddd;
  color: #444;
}

.facebook-btn {
  background: #1877f2;
  color: #fff;
}

.login-social-buttons img {
  width: 18px;
  height: 18px;
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 480px) {
  .login-modal-content {
    width: 95%;
    padding: 15px;
    border-radius: 10px;
  }

  .login-modal-logo {
    font-size: 40px;
  }

  .login-title {
    font-size: 16px;
  }

  .material-input input {
    font-size: 12px;
  }

  .material-input label {
    font-size: 12px;
  }

  .login-continue-btn {
    font-size: 12px;
    padding: 8px;
  }

  .google-btn,
  .facebook-btn {
    font-size: 12px;
    padding: 6px;
    gap: 5px;
  }

  .login-social-buttons img {
    width: 14px;
    height: 14px;
  }

  .close-modal {
    font-size: 16px;
  }
}
</style>

