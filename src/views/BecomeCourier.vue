<template>
  <div class="register-page">

    <!-- Left Banner -->
    <section class="banner">
      <img src="/become.a-courier.jpg" alt="Courier" class="partner-image" />
      <div class="overlay"></div>
    </section>

    <!-- Right Form -->
    <section class="form-section">
      <div class="form-container">
        <h2>{{ t('register.title') }}</h2>

        <form class="register-form" @submit.prevent="submitForm">
          <!-- Name -->
          <div class="form-group" :class="{ error: errors.firstName }">
            <label>{{ t('register.first_name') }}</label>
            <input v-model="form.firstName" type="text" :placeholder="t('register.first_name')" />
            <small v-if="errors.firstName">{{ errors.firstName }}</small>
          </div>

          <div class="form-group" :class="{ error: errors.lastName }">
            <label>{{ t('register.last_name') }}</label>
            <input v-model="form.lastName" type="text" :placeholder="t('register.last_name')" />
            <small v-if="errors.lastName">{{ errors.lastName }}</small>
          </div>

          <!-- Phone -->
          <div class="form-group phone-group" :class="{ error: errors.phone }">
            <label>{{ t('register.phone') }}</label>
            <div class="phone-input">
              <select v-model="form.countryCode">
                <option value="+374">🇦🇲 +374</option>
                <option value="+7">🇷🇺 +7</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>
              <input v-model="form.phone" type="tel" :placeholder="t('register.phone_placeholder')" />
            </div>
            <small v-if="errors.phone">{{ errors.phone }}</small>
          </div>

          <!-- Email -->
          <div class="form-group" :class="{ error: errors.email }">
            <label>{{ t('register.email') }}</label>
            <input v-model="form.email" type="email" :placeholder="t('register.email_placeholder')" />
            <small v-if="errors.email">{{ errors.email }}</small>
          </div>

          <!-- Vehicle Type -->
          <div class="form-group">
            <label>{{ t('register.vehicle_type') }}</label>
            <select v-model="form.vehicle">
              <option disabled value="">{{ t('register.select_vehicle') }}</option>
              <option value="bike">{{ t('register.vehicle_bike') }}</option>
              <option value="car">{{ t('register.vehicle_car') }}</option>
              <option value="scooter">{{ t('register.vehicle_scooter') }}</option>
              <option value="other">{{ t('register.vehicle_other') }}</option>
            </select>
          </div>

          <!-- Terms -->
          <div class="form-check" :class="{ error: errors.agree }">
            <input type="checkbox" id="agree" v-model="form.agree" />
            <label for="agree">{{ t('register.agree_terms') }}</label>
          </div>
          <small v-if="errors.agree">{{ errors.agree }}</small>

          <!-- Submit -->
          <div class="action-buttons">
            <button type="submit" class="continue-btn" :disabled="isLoading">
              <span v-if="isLoading">{{ t('register.loading') }}</span>
              <span v-else>{{ t('register.submit') }}</span>
            </button>
          </div>

          <!-- Success -->
          <p v-if="successMessage" class="success-msg">{{ successMessage }}</p>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { registerCourierFirestore } from '@/firebase.js';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  countryCode: '+374',
  phone: '',
  vehicle: '',
  agree: false,
});

const errors = ref<{ [key: string]: string }>({});
const successMessage = ref('');
const isLoading = ref(false);

const validateForm = () => {
  errors.value = {};

  if (!form.value.firstName.trim()) {
    errors.value.firstName = 'Enter first name';
  }
  if (!form.value.lastName.trim()) {
    errors.value.lastName = 'Enter last name';
  }

  // ✅ Email validation fix
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Enter a valid email';
  }

  // ✅ Phone validation fix (only numbers, 6-15 digits)
  if (!form.value.phone.trim()) {
    errors.value.phone = 'Enter phone number';
  } else if (!/^\d{6,15}$/.test(form.value.phone)) {
    errors.value.phone = 'Enter a valid phone number';
  }

  if (!form.value.vehicle) {
    errors.value.vehicle = 'Select vehicle type';
  }
  if (!form.value.agree) {
    errors.value.agree = 'You must agree to continue';
  }

  return Object.keys(errors.value).length === 0;
};

const submitForm = async () => {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    await registerCourierFirestore({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      phone: form.value.phone, // ✅We do NOT collect the full number
      countryCode: form.value.countryCode,
      vehicle: form.value.vehicle,
    });

    successMessage.value = '✅ Courier request sent!';
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      countryCode: '+374',
      phone: '',
      vehicle: '',
      agree: false,
    };
  } catch (error) {
    console.error('Error sending request:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>


<style scoped>
.register-page {
  display: flex;
  flex-wrap: wrap;
  min-height: 100vh;
}

/* Banner (Left) */
.banner {
  flex: 2; /* enlarged the photo */
  min-width: 300px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(70%);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.4), transparent);
}

.banner-text {
  position: absolute;
  color: white;
  font-size: 2.5rem; /* increased */
  font-weight: 700;
  text-align: center;
}

/* Form (Right) */
.form-section {
  flex: 1;
  min-width: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.form-container {
  background: #fff;
  padding: 15px;
  border-radius: 12px;
  width: 100%;
  max-width: 320px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  position: relative;
}

.form-group label {
  font-size: 9px;
  color: #292020;
  margin-bottom: 4px;
}
input::placeholder, textarea::placeholder {
  color: #aaa;
  font-size: 9px;
}

.form-group input,
.form-group select {
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 6px 5px;
  font-size: 12px;
  outline: none;
  transition: border-color 0.3s, border-bottom-width 0.3s;
}

/* Focus */
.form-group input:focus,
.form-group select:focus {
  border-bottom: 2px solid #4caf50;
}

/*Errors */
.form-group.error input,
.form-group.error select {
  border-bottom: 2px solid #e53935;
}

small {
  color: #e53935;
  font-size: 10px;
  margin-top: 3px;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 12px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.continue-btn {
  background: #4caf50;
  color: white;
  padding: 6px;
  font-size: 13px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.continue-btn:hover {
  background: #43a047;
  transform: translateY(-1px);
}

.success-msg {
  text-align: center;
  color: #4caf50;
  font-weight: bold;
  margin-top: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .register-page {
    flex-direction: column;
  }

  .banner {
    flex: 1;
    height: 200px;
  }

  .banner-text {
    font-size: 2rem;
  }
}

</style>