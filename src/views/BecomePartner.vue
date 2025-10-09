<template>
  <div class="register-page">

    <!-- Header -->
    <section class="banner">
       <img src="/premium_photo.avif" alt="Partner" class="partner-image" />
      <div class="overlay"></div>
      <h1 class="banner-text">Become a Partner</h1>
    </section>

    <!-- Form Section -->
    <section class="form-section">
      <div class="form-container">

        <h2>Contact us right now</h2>

        <form class="register-form" @submit.prevent="submitForm">

          <!-- Company Name -->
          <div class="form-group" :class="{ error: errors.companyName }">
            <label>Company Name</label>
            <input v-model="form.companyName" type="text" placeholder="Company Name" />
            <small v-if="errors.companyName">{{ errors.companyName }}</small>
          </div>

          <!-- Business Type -->
          <div class="form-group" :class="{ error: errors.businessType }">
            <label>Business Type</label>
            <select v-model="form.businessType">
              <option value="" disabled>Select Business Type</option>
              <option value="tech">Tech</option>
              <option value="retail">Retail</option>
              <option value="finance">Finance</option>
            </select>
            <small v-if="errors.businessType">{{ errors.businessType }}</small>
          </div>

          <!-- First & Last Name -->
          <div class="form-row">
            <div class="form-group" :class="{ error: errors.firstName }">
              <label>First Name</label>
              <input v-model="form.firstName" type="text" placeholder="First Name" />
              <small v-if="errors.firstName">{{ errors.firstName }}</small>
            </div>
            <div class="form-group" :class="{ error: errors.lastName }">
              <label>Last Name</label>
              <input v-model="form.lastName" type="text" placeholder="Last Name" />
              <small v-if="errors.lastName">{{ errors.lastName }}</small>
            </div>
          </div>

          <!-- Phone -->
          <div class="form-group phone-group" :class="{ error: errors.phone }">
            <label>Phone</label>
            <div class="phone-input">
              <select v-model="form.countryCode">
                <option value="+374">🇦🇲 +374</option>
                <option value="+7">🇷🇺 +7</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>
              <input v-model="form.phone" type="tel" placeholder="Phone number" />
            </div>
            <small v-if="errors.phone">{{ errors.phone }}</small>
          </div>

          <!-- Email -->
          <div class="form-group" :class="{ error: errors.email }">
            <label>Email</label>
            <input v-model="form.email" type="email" placeholder="Email" />
            <small v-if="errors.email">{{ errors.email }}</small>
          </div>

          <!-- Terms Checkbox -->
          <div class="form-check" :class="{ error: errors.agree }">
            <input type="checkbox" id="agree" v-model="form.agree" />
            <label for="agree">I agree to the terms of use</label>
          </div>
          <small v-if="errors.agree">{{ errors.agree }}</small>

          <!-- Submit Button -->
          <div class="action-buttons">
            <button type="submit" class="continue-btn">Send</button>
          </div>

          <!-- Success Message -->
          <p v-if="successMessage" class="success-msg">{{ successMessage }}</p>
        </form>
      </div>
    </section>

   <!-- Advantages Section -->
<section class="advantages-section">
  <h4>By becoming a free zone partner, you get a lot of advantages</h4>
  <div class="advantages-images">
    <div class="advantage-item">
      <img src="/new-customers.png" alt="New Customers" />
      <p>New Customers</p>
    </div>
    
    <div class="advantage-item">
      <img src="/sales-growth.png" alt="Sales Growth" />
      <p>Sales Growth</p>
    </div>
    
    <div class="advantage-item">
      <img src="/flexible-schedule.png" alt="Flexible Schedule" />
      <p>Flexible Schedule</p>
    </div>
  </div>
</section>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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

const submitForm = () => {
  if (validateForm()) {
    successMessage.value = '✅ Form submitted successfully!';
    setTimeout(() => successMessage.value = '', 3000);
    console.log(form.value);
  }
};
</script>

<style scoped>
/* --- Basic Page Styles--- */
input, select, label { font-size: 11px; }

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
  flex-direction: column; /* all fields vertically */ 
  gap: 15px; 
}

.form-group { 
  margin-bottom: 20px; 
  display: flex; 
  flex-direction: column; 
  position: relative; 
}

.form-group input, .form-group select { 
  border: none; 
  border-bottom: 1px solid #ccc; 
  padding: 8px 5px; 
  font-size: 14px; 
  outline: none; 
}

.form-group.error input, .form-group.error select { 
  border-bottom: 1px solid #e53935; 
}

small { 
  color: #e53935; 
  font-size: 0.8em; 
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
  margin-top: 10px; 
  gap: 10px;
  flex-direction: column; /* buttons vertically */ 
}

.continue-btn { 
  background: #4caf50; 
  color: #fff; 
  flex: 1; 
  padding: 8px; 
  border: none; 
  border-radius: 6px; 
  cursor: pointer; 
}

.success-msg { 
  text-align: center; 
  color: #4caf50; 
  font-weight: bold; 
  margin-top: 10px; 
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-bottom: 2px solid #4caf50;
  background-color: #f9fff9;
  transition: border-color 0.15s ease-in-out, background-color 0.15s ease-in-out;
}


.form-group.error input:focus,
.form-group.error select:focus {
  border-bottom: 2px solid #e53935;
  background-color: #fff5f5;
  transition: border-color 0.15s ease-in-out, background-color 0.15s ease-in-out;
}

/* --- Advantages Section --- */
.advantages-section {
  text-align: center;
  margin-top: -20px;
}

.advantages-section h2 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 30px;
  color: #333;
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
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 10px;
}

.advantage-item p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #555;
}

/* --- Adaptive --- */
@media (max-width: 768px){
  .banner { height: 250px; }
  .banner-text { font-size: 1.5rem; }
  .form-row { flex-direction: column; } /* vertically */
  .advantages-images { gap: 20px; }
  .advantage-item img { width: 80px; height: 80px; }
  .advantages-section h2 { font-size: 1.5rem; }
}

</style>

