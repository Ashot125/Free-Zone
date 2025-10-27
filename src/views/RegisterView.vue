<script setup lang="ts">
import { ref } from 'vue';
import { register } from '@/firebase.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
// Form
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  countryCode: '+374',
  phone: '',
  password: '',
  confirmPassword: '',
  confirmCode: '',
  agree: false,
})

// Firebase registration
const handleRegister = async () => {
  try {
    const user = await register(
      form.value.email,
      form.value.password,
      form.value.firstName + ' ' + form.value.lastName
    );
    console.log("✅ User registered:", user.uid);
  } catch (error:any) {
    console.error("❌ Firebase error:", error.message);
  }
}


const showPassword = ref(false);
const showConfirmPassword = ref(false);
const showCode = ref(false);
const successMessage = ref('');
const errors = ref<{ [key: string]: string }>({});

const sentCode = ref(generateRandomCode());

function generateRandomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const generateCode = () => {
  sentCode.value = generateRandomCode();
};

const validateForm = () => {
  errors.value = {};

  if (!form.value.firstName.trim())
    errors.value.firstName = 'Enter first name';
  if (!form.value.lastName.trim())
    errors.value.lastName = 'Enter last name';
  if (!form.value.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
    errors.value.email = 'Enter a valid email';
  if (!form.value.phone.match(/^\d{6,15}$/))
    errors.value.phone = 'Enter a valid phone number';

  if (!form.value.password)
    errors.value.password = 'Enter password';
  else if (form.value.password.length < 6)
    errors.value.password = 'Password must be at least 6 characters';

  if (!form.value.confirmPassword)
    errors.value.confirmPassword = 'Confirm your password';
  else if (form.value.password !== form.value.confirmPassword)
    errors.value.confirmPassword = 'Passwords do not match';

  if (!form.value.confirmCode.trim())
    errors.value.confirmCode = 'Enter confirmation code';
  else if (form.value.confirmCode !== sentCode.value)
    errors.value.confirmCode = 'Incorrect confirmation code';

  if (!form.value.agree)
    errors.value.agree = 'You must agree to the terms';

  return Object.keys(errors.value).length === 0;
};

const loading = ref(false); // ✅ loading state

const submitForm = async () => {
  if (!validateForm()) return;

  loading.value = true; // turned on loading
  try {
    await handleRegister(); //we're waiting Firebase
    successMessage.value = '✅ Registration successful!';
  } catch (error) {
    console.error("Registration error:", error);
  } finally {
    loading.value = false; // turned off loading
  }
};

</script>

<template>
  <div class="register-page">

    <!-- Banner -->
    <section class="banner">
      <img src="/signup-illustration.jpg" alt="Register banner" />
      <div class="overlay"></div>
      <h1 class="banner-text">{{ t('registerPage.banner') }}</h1>
    </section>

    <!-- Form Section -->
    <section class="form-section">
      <div class="form-container">

        <h2>{{ t('registerPage.title') }}</h2>

        <form class="register-form" @submit.prevent="submitForm">

          <!-- First & Last Name -->
          <div class="form-row">
            <div class="form-group" :class="{ error: errors.firstName }">
              <label>{{ t('registerPage.first_name') }}</label>
              <input v-model="form.firstName" type="text" :placeholder="t('registerPage.first_name_placeholder')" />
              <small v-if="errors.firstName">{{ errors.firstName }}</small>
            </div>

            <div class="form-group" :class="{ error: errors.lastName }">
              <label>{{ t('registerPage.last_name') }}</label>
              <input v-model="form.lastName" type="text" :placeholder="t('registerPage.last_name_placeholder')" />
              <small v-if="errors.lastName">{{ errors.lastName }}</small>
            </div>
          </div>

          <!-- Email -->
          <div class="form-group" :class="{ error: errors.email }">
            <label>{{ t('registerPage.email') }}</label>
            <input v-model="form.email" type="email" :placeholder="t('registerPage.email_placeholder')" />
            <small v-if="errors.email">{{ errors.email }}</small>
          </div>

          <!-- Phone -->
          <div class="form-group phone-group" :class="{ error: errors.phone }">
            <label>{{ t('registerPage.phone') }}</label>
            <div class="phone-input">
              <select v-model="form.countryCode">
                <option value="+374">🇦🇲 +374</option>
                <option value="+7">🇷🇺 +7</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>
              <input v-model="form.phone" type="tel" :placeholder="t('registerPage.phone_placeholder')" />
            </div>
            <small v-if="errors.phone">{{ errors.phone }}</small>
          </div>

          <!-- Password + Confirm Password -->
          <div class="form-row">
            <div class="form-group" :class="{ error: errors.password }">
              <label>{{ t('registerPage.password') }}</label>
              <div class="code-input">
                <input v-model="form.password" :type="showPassword ? 'text' : 'password'" :placeholder="t('registerPage.password_placeholder')" />
                <button type="button" @click="showPassword = !showPassword" class="show-btn">
                  <img v-if="showPassword" src="/eye-open.svg" alt="Hide" />
                  <img v-else src="/eye-closed.svg" alt="Show" />
                </button>
              </div>
              <small v-if="errors.password">{{ errors.password }}</small>
            </div>

            <div class="form-group" :class="{ error: errors.confirmPassword }">
              <label>{{ t('registerPage.confirm_password') }}</label>
              <div class="code-input">
                <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" :placeholder="t('registerPage.confirm_password_placeholder')" />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="show-btn">
                  <img v-if="showConfirmPassword" src="/eye-open.svg" alt="Hide" />
                  <img v-else src="/eye-closed.svg" alt="Show" />
                </button>
              </div>
              <small v-if="errors.confirmPassword">{{ errors.confirmPassword }}</small>
            </div>
          </div>

          <!-- Confirmation Code -->
          <div class="form-group" :class="{ error: errors.confirmCode }">
            <label>{{ t('registerPage.confirm_code') }}</label>
            <div class="code-input">
              <input v-model="form.confirmCode" :type="showCode ? 'text' : 'password'" :placeholder="t('registerPage.confirm_code_placeholder')" />
              <button type="button" @click="showCode = !showCode" class="show-btn">
                <img v-if="showCode" src="/eye-open.svg" alt="Hide" />
                <img v-else src="/eye-closed.svg" alt="Show" />
              </button>
              <span class="generated-code">{{ sentCode }}</span>
              <button type="button" @click="generateCode" class="refresh-btn">🔄</button>
            </div>
            <small v-if="errors.confirmCode">{{ errors.confirmCode }}</small>
          </div>

          <!-- Terms Checkbox -->
          <div class="form-check" :class="{ error: errors.agree }">
            <input type="checkbox" id="agree" v-model="form.agree" />
            <label for="agree">{{ t('registerPage.agree_terms') }}</label>
          </div>
          <small v-if="errors.agree">{{ errors.agree }}</small>

          <!-- Social Buttons -->
          <div class="social-buttons">
            <a href="#" class="google-btn">
              <img src="/google.svg" alt="Google" />
              <span>{{ t('registerPage.continue_google') }}</span>
            </a>
            <a href="#" class="facebook-btn">
              <img src="/facebook-icon.svg" alt="Facebook" />
              <span>{{ t('registerPage.continue_facebook') }}</span>
            </a>
          </div>

          <!-- Form Actions -->
          <div class="action-buttons">
            <button type="button" class="close-btn">{{ t('registerPage.close') }}</button>
            <button type="submit" class="continue-btn" :disabled="loading">
              <span v-if="loading">{{ t('registerPage.loading') }}</span>
              <span v-else>{{ t('registerPage.continue') }}</span>
            </button>
          </div>

          <!-- Success Message -->
          <p v-if="successMessage" class="success-msg">{{ successMessage }}</p>
        </form>
      </div>
    </section>
  </div>
</template>



<style scoped>


input, select, label {
  font-size: 11px;
}


.register-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.banner {
  position: relative;
  width: 100%;
  height: 350px;
  overflow: hidden;
}

.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(70%);
  transition: 0.5s ease;
}

.banner:hover img {
  filter: brightness(85%);
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.4), transparent);
}

.banner-text {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

.form-section {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: -100px;
  padding: 0 20px 60px;
  z-index: 10;
}

.form-container {
  background: #fff;
  padding: 35px;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-group {
  flex: 1;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.form-group input {
  border-bottom: 1px solid #ccc;
}

.form-group.error input {
  border-bottom: 1px solid #e53935;
}


input, select {
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 8px 5px;
  font-size: 14px;
  outline: none;
}

input::placeholder { 
  color: #aaa; 
}

.form-group.error input,
.form-group.error select {
   border-bottom: 1px solid #e53935;
   }

small { 
  color: #e53935;
  font-size: 0.8em; 
  margin-top: 4px; }

.phone-group .phone-input {
   display: flex;
    gap: 10px; }

.code-input { 
  display: flex; 
  align-items:center; 
  gap:10px; }

.show-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

.show-btn img {
  width: 20px;
  height: 20px;
  filter: brightness(0.5);
  transition: 0.3s;
}

.show-btn:hover img {
  filter: brightness(0);
}


.generated-code {
  font-weight:bold;
  font-family: monospace;
  padding: 0 5px;
}

.form-check { 
  display:flex; 
  align-items:center; 
  gap:8px; 
  margin-bottom:15px; 
}

.social-buttons {
  display: flex;
  justify-content: center; /*buttons in the center */
  gap: 20px; /* distance between buttons*/
  margin: 10px 0;
}

.social-btn {
  display: flex;
  align-items: center;
  gap: 8px; /* the distance between the icon and the text */
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.social-btn img {
  width: 24px;
  height: 24px;
}
.google-btn, .facebook-btn {
  background: none; /*remove the background */
  border: none; /* remove the frame */
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #333;
}

.google-btn img, .facebook-btn img {
  width: 24px;
  height: 24px;
}




.action-buttons { 
  display:flex; 
  justify-content:space-between; 
  gap:10px; 
}
  
.close-btn { 
  background:#ccc; 
  flex:1; padding:8px; 
  border:none;
   border-radius:6px;
    cursor:pointer;
   }

.continue-btn {
   background:#4caf50; 
   color:#fff; 
   flex:1;
    padding:8px; 
    border:none; 
    border-radius:6px; 
    cursor:pointer; 
  }
.continue-btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-msg { 
  text-align:center; 
  color:#4caf50; 
  font-weight:bold; 
  margin-top:10px;
 }


/*Effect on focus on input */
input:focus {
  border-bottom: 1px solid #ff6f61; /*coral */
  box-shadow: 0 1px 0 #ff6f61;
  transition: all 0.25s ease;
}


@media (max-width:768px){
  .banner { height:250px; }
  .banner-text { font-size:1.5rem; }
  .form-section { margin-top:-60px; }
  .form-container { padding:25px; }
  .form-row { flex-direction:column; }
}
</style>


