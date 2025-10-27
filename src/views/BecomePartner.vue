<template>
  <div class="register-page">

    <!-- Banner and form in one line -->
    <section class="banner-form-section">

      <!-- Banner on the left -->
      <div class="banner">
        <img src="/premium_photo.avif" alt="Partner" class="partner-image" />
        <div class="overlay"></div>
        <h1 class="banner-text">{{ t('partner.banner') }}</h1>
      </div>

      <!-- Form on the right -->
      <div class="form-container">
        <h2>{{ t('partner.contact_now') }}</h2>
        <form class="register-form" @submit.prevent="submitForm">

          <!-- Company Name -->
          <div class="form-group" :class="{ error: errors.companyName }">
            <label>{{ t('partner.company_name') }}</label>
            <input v-model="form.companyName" type="text" :placeholder="t('partner.company_name')" />
            <small v-if="errors.companyName">{{ errors.companyName }}</small>
          </div>

          <!-- Business Type -->
          <div class="form-group" :class="{ error: errors.businessType }">
            <label>{{ t('partner.business_type') }}</label>
            <select v-model="form.businessType">
              <option value="" disabled>{{ t('partner.select_business_type') }}</option>
              <option value="Clothes">{{ t('partner.type_clothes') }}</option>
              <option value="Perfume">{{ t('partner.type_perfume') }}</option>
              <option value="Electrical appliances">{{ t('partner.type_appliances') }}</option>
              <option value="Restaurant">{{ t('partner.type_restaurant') }}</option>
              <option value="Supermarket">{{ t('partner.type_supermarket') }}</option>
              <option value="Pharmacy">{{ t('partner.type_pharmacy') }}</option>
              <option value="Flower salon">{{ t('partner.type_flower') }}</option>
              <option value="Alcoholic beverages">{{ t('partner.type_alcohol') }}</option>
            </select>
            <small v-if="errors.businessType">{{ errors.businessType }}</small>
          </div>

          <!-- First & Last Name -->
          <div class="form-row">
            <div class="form-group" :class="{ error: errors.firstName }">
              <label>{{ t('partner.first_name') }}</label>
              <input v-model="form.firstName" type="text" :placeholder="t('partner.first_name')" />
              <small v-if="errors.firstName">{{ errors.firstName }}</small>
            </div>
            <div class="form-group" :class="{ error: errors.lastName }">
              <label>{{ t('partner.last_name') }}</label>
              <input v-model="form.lastName" type="text" :placeholder="t('partner.last_name')" />
              <small v-if="errors.lastName">{{ errors.lastName }}</small>
            </div>
          </div>

          <!-- Phone -->
          <div class="form-group phone-group" :class="{ error: errors.phone }">
            <label>{{ t('partner.phone') }}</label>
            <div class="phone-input">
              <select v-model="form.countryCode">
                <option value="+374">🇦🇲 +374</option>
                <option value="+7">🇷🇺 +7</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>
              <input v-model="form.phone" type="tel" :placeholder="t('partner.phone_placeholder')" />
            </div>
            <small v-if="errors.phone">{{ errors.phone }}</small>
          </div>

          <!-- Email -->
          <div class="form-group" :class="{ error: errors.email }">
            <label>{{ t('partner.email') }}</label>
            <input v-model="form.email" type="email" :placeholder="t('partner.email_placeholder')" />
            <small v-if="errors.email">{{ errors.email }}</small>
          </div>

          <!-- Terms Checkbox -->
          <div class="form-check" :class="{ error: errors.agree }">
            <input type="checkbox" id="agree" v-model="form.agree" />
            <label for="agree">{{ t('partner.agree_terms') }}</label>
          </div>
          <small v-if="errors.agree">{{ errors.agree }}</small>

          <!-- Submit Button -->
          <div class="action-buttons">
            <button type="submit" class="continue-btn" :disabled="isLoading">
              <span v-if="isLoading">{{ t('partner.sending') }}</span>
              <span v-else>{{ t('partner.send') }}</span>
            </button>
          </div>

          <!-- Success Message -->
          <p v-if="successMessage" class="success-msg">{{ successMessage }}</p>
        </form>
      </div>
    </section>

    <!-- Advantages Section -->
    <section class="advantages-section">
      <h4>{{ t('partner.advantages_title') }}</h4>
      <div class="advantages-images">
        <div class="advantage-item">
          <img src="/new-customers.png" alt="New Customers" />
          <p>{{ t('partner.advantage_customers') }}</p>
        </div>
        <div class="advantage-item">
          <img src="/sales-growth.png" alt="Sales Growth" />
          <p>{{ t('partner.advantage_sales') }}</p>
        </div>
        <div class="advantage-item">
          <img src="/flexible-schedule.png" alt="Flexible Schedule" />
          <p>{{ t('partner.advantage_schedule') }}</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { registerPartnerFirestore } from "@/firebase.js";
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const form = ref({
  companyName: '',
  businessType: '',
  firstName: '',
  lastName: '',
  email: '',
  countryCode: '+374',
  phone: '',
  agree: false,
});

const errors = ref<{ [key: string]: string }>({});
const successMessage = ref('');
const isLoading = ref(false); // ⚡Adding a boot flag

const validateForm = () => {
  errors.value = {};

  if (!form.value.companyName.trim()) errors.value.companyName = 'Enter company name';
  if (!form.value.businessType) errors.value.businessType = 'Select business type';
  if (!form.value.firstName.trim()) errors.value.firstName = 'Enter first name';
  if (!form.value.lastName.trim()) errors.value.lastName = 'Enter last name';
  if (!form.value.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.value.email = 'Enter a valid email';
  if (!form.value.phone.match(/^\d{6,15}$/)) errors.value.phone = 'Enter a valid phone number';
  if (!form.value.agree) errors.value.agree = 'You must agree to the terms';

  return Object.keys(errors.value).length === 0;
};

const submitForm = async () => {
  if (!validateForm()) return;

  isLoading.value = true; // start download
  try {
    const partnerId = await registerPartnerFirestore({
      email: form.value.email,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      companyName: form.value.companyName,
      businessType: form.value.businessType,
      phone: form.value.phone,
      countryCode: form.value.countryCode,
    });

    successMessage.value = "✅ Partner request sent successfully!";
    console.log("Partner saved:", partnerId);

    form.value = {
      companyName: "",
      businessType: "",
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+374",
      phone: "",
      agree: false,
    };
  } catch (error) {
  if (error instanceof Error) {
    errors.value.general = error.message;
  } else {
    errors.value.general = "Submission failed";
  }
} finally {
    isLoading.value = false; // end of download
  }
};
</script>


<style scoped>
/* Reducing form fonts */
input, select, label { font-size: 11px; }
small { font-size: 10px; }


.register-page { 
  display: flex; 
  flex-direction: column; 
  min-height: 100vh; 
}

/*Banner and form in one line */
.banner-form-section {
  display: flex;
  gap: 20px;
  align-items: stretch; /* Key: Same height for banner and form */
  padding: 20px;
}

/*Banner on the left */
.banner {
  flex: 1;
  position: relative;
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
  bottom: 20px;
  left: 20px;
  color: #fff;
  font-size: 1.5rem; /* reduced the banner font size */
  font-weight: 700;
}

/* Form on the right*/
.form-container {
  flex: 1;
  max-width: 380px;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-size: 16px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.form-group input,
.form-group select {
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 6px 5px;
  font-size: 12px;
  outline: none;
}

.form-group.error input,
.form-group.error select {
  border-bottom: 1px solid #e53935;
}

small {
  color: #e53935;
  margin-top: 4px;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 5px;
  gap: 10px;
  flex-direction: column;
}

.continue-btn {
  background: #4caf50;
  color: #fff;
  flex: 1;
  padding: 5px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}

.success-msg {
  text-align: center;
  color: #4caf50;
  font-weight: bold;
  margin-top: 10px;
  font-size: 12px;
}

.form-group input:focus,
.form-group select:focus {
  border-bottom: 2px solid #4caf50;
  background-color: #f9fff9;
}

.form-group.error input:focus,
.form-group.error select:focus {
  border-bottom: 2px solid #e53935;
  background-color: #fff5f5;
}

/* Advantages Section */
.advantages-section {
  text-align: center;
  margin-top: -20px;
}

.advantages-images {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.advantage-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 150px;
}

.advantage-item img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  margin-bottom: 5px;
}

.advantage-item p {
  margin: 0;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
  color: #555;
}

/* Adaptive */
@media (max-width: 768px){
  .banner-form-section { flex-direction: column; }
  .banner { height: 250px; }
  .banner-text { font-size: 1.2rem; }
  .advantages-images { gap: 15px; }
  .advantage-item img { width: 60px; height: 60px; }
  .advantage-item p { font-size: 10px; }
}
</style>
