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

        <!-- Welcome text -->
        <h2 class="login-title">{{ t('login.welcome') }}</h2>

        <!-- Input fields -->
        <div class="material-input">
          <input v-model="email" type="email" required />
          <label>{{ t('login.email') }}</label>
          <span class="underline"></span>
          <small v-if="errors.email" class="input-error">{{ errors.email }}</small>
        </div>

        <div class="material-input">
          <input v-model="password" type="password" required />
          <label>{{ t('login.password') }}</label>
          <span class="underline"></span>
          <small v-if="errors.password" class="input-error">{{ errors.password }}</small>
        </div>

        <!-- Continue button -->
        <button class="login-continue-btn" @click="continueLogin" :disabled="loading">
          <span v-if="loading">{{ t('login.loading') }}</span>
          <span v-else>{{ t('login.continue') }}</span>
        </button>

        <!-- Registration text -->
        <p class="register-text" @click="goToRegister">
          {{ t('login.no_account') }} <span>{{ t('login.register') }}</span>
        </p>

        <!-- Social buttons in one row -->
        <div class="login-social-buttons-row">
          <button class="google-btn" @click="loginWithGoogle">
            <img src="/google.svg" alt="Google" /> {{ t('login.google') }}
          </button>
          <button class="facebook-btn" @click="loginWithFacebook">
            <img src="/facebook-icon.svg" alt="Facebook" /> {{ t('login.facebook') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, inject } from 'vue'
import { useRouter } from 'vue-router'
import { login, db } from '@/firebase.js'
import { doc, getDoc } from 'firebase/firestore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const { show } = defineProps<{ show: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errors = ref<{ email?: string; password?: string }>({})

const currentUser = inject('currentUser') as any
const close = () => emit('close')

const validateField = (field: 'email' | 'password') => {
  if (field === 'email') {
    if (!email.value) errors.value.email = 'Enter your email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
      errors.value.email = 'Invalid email'
    else delete errors.value.email
  }
  if (field === 'password') {
    if (!password.value) errors.value.password = 'Enter your password'
    else if (password.value.length < 6)
      errors.value.password = 'Password must be at least 6 characters long'
    else delete errors.value.password
  }
}

watch(email, () => validateField('email'))
watch(password, () => validateField('password'))

const continueLogin = async () => {
  validateField('email')
  validateField('password')
  if (errors.value.email || errors.value.password) return

  loading.value = true
  try {
    const user = await login(email.value, password.value)
    const docRef = doc(db, "users", user.uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      currentUser.value = {
        firstName: data.name.split(' ')[0],
        lastName: data.name.split(' ')[1] || ''
      }
    }
    close()
  } catch {
    errors.value.email = "❌ Incorrect email or password"
  } finally {
    loading.value = false
  }
}

const goToRegister = () => { close(); router.push('/register') }
const loginWithGoogle = () => { console.log('Google login clicked'); close() }
const loginWithFacebook = () => { console.log('Facebook login clicked'); close() }
</script>

<style scoped>
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1300;
  backdrop-filter: blur(2px);
}

.login-modal-content {
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  width: 280px;
  max-width: 95%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  text-align: center;
}

.close-modal {
  position: absolute;
  top: 6px;
  right: 8px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.login-modal-logo {
  font-size: 32px;
  font-weight: bold;
}

.login-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
  font-weight: 500;
}

/* Input fields */
.material-input {
  position: relative;
  width: 100%;
  margin-top: 8px;
}

.material-input input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #ccc;
  padding: 6px 0 4px 0;
  font-size: 12px;
  outline: none;
  background: transparent;
}

.material-input label {
  position: absolute;
  top: 8px;
  left: 0;
  font-size: 11px;
  color: #999;
  transition: all 0.2s ease;
}

.material-input input:focus + label,
.material-input input:not(:placeholder-shown) + label,
.material-input input:not(:empty) + label {
  top: -6px;
  font-size: 11px;
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

.input-error {
  color: #e53935;
  font-size: 10px;
  margin-top: 2px;
  display: block;
  text-align: left;
}

/* Buttons */
.login-continue-btn {
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 6px;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.login-continue-btn:hover {
  background: #43a047;
  transform: translateY(-1px);
}

.register-text {
  font-size: 11px;
  color: #333;
  cursor: pointer;
  margin: 4px 0;
}

.register-text span {
  color: #4caf50;
  text-decoration: underline;
}

/* Social buttons in row */
.login-social-buttons-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
}

.google-btn,
.facebook-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 6px;
  border-radius: 6px;
  font-size: 12px;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
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

.google-btn:hover,
.facebook-btn:hover {
  transform: scale(1.03);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}

.login-social-buttons-row img {
  width: 14px;
  height: 14px;
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

/* Adaptive for small screens */
@media (max-width: 480px) {
  .login-modal-content {
    width: 95%;
    padding: 12px;
  }

  .login-modal-logo {
    font-size: 28px;
  }

  .login-title {
    font-size: 14px;
  }

  .material-input input {
    font-size: 11px;
    padding: 5px 0 3px 0;
  }

  .material-input label {
    font-size: 10px;
  }

  .login-continue-btn {
    font-size: 11px;
    padding: 5px;
  }

  .register-text {
    font-size: 10px;
  }

  .google-btn,
  .facebook-btn {
    flex: 1;
    font-size: 11px;
    padding: 5px;
  }

  .login-social-buttons-row {
    flex-direction: column;
  }
}
</style>



