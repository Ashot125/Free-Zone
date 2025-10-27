<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  submit: '',
});

const submitting = ref(false);
const success = ref('');

function validate() {
  let ok = true;
  errors.name = form.name.trim() ? '' : 'Please enter your full name.';
  errors.email = /^\S+@\S+\.\S+$/.test(form.email) ? '' : 'Please enter a valid email.';
  errors.subject = form.subject.trim() ? '' : 'Please enter a subject.';
  errors.message = form.message.trim().length >= 5 ? '' : 'Message must be at least 5 characters.';
  if (errors.name || errors.email || errors.subject || errors.message) ok = false;
  return ok;
}

async function submitForm() {
  errors.submit = '';
  success.value = '';
  if (!validate()) return;

  submitting.value = true;
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      errors.submit = err.message || `Server returned ${res.status}`;
    } else {
      success.value = 'Thanks! Your message has been sent. We will contact you shortly.';
      form.name = form.email = form.subject = form.message = '';
    }
  } catch (e: any) {
    errors.submit = e.message || 'Network error';
  } finally {
    submitting.value = false;
  }
}
</script>
<template>
  <div class="contact-page">

    <section class="contact-section">
      
      <!--LEFT COLUMN: text + contacts -->
      <div class="contact-text">
        <h3>{{ t('contact.title') }}</h3>
        <p>{{ t('contact.subtitle') }}</p>
        <div class="contact-details">
          <p>📞 +374 93 24 72 44</p>
          <p>📧 info@freezone.am</p>
        </div>
      </div>

      <!-- RIGHT COLUMN: form -->
      <div class="form-container">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">{{ t('contact.form.name') }}</label>
            <input id="name" v-model="form.name" :placeholder="t('contact.form.name_placeholder')" />
            <small v-if="errors.name">{{ errors.name }}</small>
          </div>

          <div class="form-group">
            <label for="email">{{ t('contact.form.email') }}</label>
            <input id="email" v-model="form.email" type="email" :placeholder="t('contact.form.email_placeholder')" />
            <small v-if="errors.email">{{ errors.email }}</small>
          </div>

          <div class="form-group">
            <label for="subject">{{ t('contact.form.subject') }}</label>
            <input id="subject" v-model="form.subject" :placeholder="t('contact.form.subject_placeholder')" />
            <small v-if="errors.subject">{{ errors.subject }}</small>
          </div>

          <div class="form-group">
            <label for="message">{{ t('contact.form.message') }}</label>
            <textarea id="message" v-model="form.message" rows="6" :placeholder="t('contact.form.message_placeholder')"></textarea>
            <small v-if="errors.message">{{ errors.message }}</small>
          </div>

          <div class="form-group">
            <button type="submit" :disabled="submitting">
              {{ submitting ? t('contact.form.sending') : t('contact.form.send') }}
            </button>
          </div>

          <p v-if="errors.submit" class="submit-error">{{ errors.submit }}</p>
          <p v-if="success" class="success-msg">{{ success }}</p>
        </form>
      </div>

    </section>

  </div>
</template>

<style scoped>
.contact-page {
  background: #f8f8f8;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 30px 10px;
}

.contact-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  max-width: 900px;
  gap: 30px; /*reduced the gap between columns*/
}

/* Left column: text */
.contact-text {
  max-width: 300px;
}
.contact-text h3 {
  font-size: 20px; 
  margin-bottom: 8px;
  color: #d62a2a;
}
.contact-text p {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}
.contact-details {
  background: #fff;
  padding: 8px 12px; 
  border-radius: 6px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.05);
}
.contact-details p {
  margin: 4px 0;
  font-size: 13px;
}

/* Right column: form */
.form-container {
  background: #fff;
  padding: 15px 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 320px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

h2 {
  text-align: center;
  margin-bottom: 15px;
  font-size: 20px;
  color: #791010;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px; /* reduced the distance between fields */
  font-size: 10px
}

input, select, textarea {
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 4px 6px; 
  font-size: 12px; 
  outline: none;
  border-radius: 3px;
}

input::placeholder, textarea::placeholder {
  color: #aaa;
  font-size: 9px;
}

.form-group small {
  color: #e53935;
  font-size: 0.7em;
  margin-top: 2px;
}

button {
  background: #4caf50;
  color: #fff;
  padding: 6px 10px; 
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
}

button[disabled] {
  opacity: 0.65;
  cursor: not-allowed;
}

.success-msg {
  text-align: center;
  color: #4caf50;
  font-weight: bold;
  font-size: 12px;
  margin-top: 6px;
}

.submit-error {
  text-align: center;
  color: #e53935;
  font-weight: 600;
  font-size: 12px;
  margin-top: 6px;
}

input:focus, textarea:focus {
  border-bottom: 1px solid #ff6f61;
  box-shadow: 0 1px 0 #ff6f61;
  transition: all 0.25s ease;
}

/* Adaptive */
@media (max-width:768px){
  .contact-section {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
}
</style>

