<template>
  <main class="about-main">
    <!-- Welcome Section -->
    <section class="welcome-section fade-in">
      <h2>{{ t('about.welcome_title') }}</h2>
      <p>
        {{ t('about.welcome_text') }}
        <strong>{{ t('about.companies_count') }}</strong>
        {{ t('about.welcome_text2') }}
      </p>
    </section>

    <!-- Advantages Section -->
    <section class="advantages-section fade-in">
      <h3>{{ t('about.advantages_title') }}</h3>
      <p>{{ t('about.advantages_text') }}</p>
      <ul>
        <li>{{ t('about.advantage1') }}</li>
        <li>{{ t('about.advantage2') }}</li>
        <li>{{ t('about.advantage3') }}</li>
        <li>{{ t('about.advantage4') }}</li>
      </ul>
    </section>

    <!-- Mission Section -->
    <section class="mission-section fade-in">
      <h3>{{ t('about.mission_title') }}</h3>
      <p>{{ t('about.mission_text') }}</p>
      <ul>
        <li>{{ t('about.mission1') }}</li>
        <li>{{ t('about.mission2') }}</li>
        <li>{{ t('about.mission3') }}</li>
        <li>{{ t('about.mission4') }}</li>
      </ul>
    </section>

    <!-- Quote Section -->
    <section class="quote-section fade-in">
      <blockquote>{{ t('about.quote') }}</blockquote>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>


<style scoped>
.about-main {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 15px; 
  font-family: Arial, sans-serif;
  color: #333;
  text-align: left;
  line-height: 1.5; 
}

/*Sections*/
section {
  margin-bottom: 15px; 
  padding-bottom: 5px;
}

/* Headlines */
.about-main h2 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 8px;
}

.about-main h3 {
  font-size: 16px;
  font-weight: bold;
  margin-top: 15px; 
  margin-bottom: 6px;
}

/* Text */
.about-main p {
  font-size: 13px;
  margin-bottom: 8px;
}

/*Lists */
.about-main ul {
  list-style: none;
  padding: 0;
  margin-top: 6px; 
}

.about-main ul li {
  margin-bottom: 6px;
  padding-left: 18px;
  font-size: 12px;
}

/* Quote*/
.quote-section {
  margin-top: 15px;
  font-size: 13px;
  border-left: 2px solid #d62828;
  padding-left: 8px;
}

/* Animation */
.fade-in {
  opacity: 0;
  transform: translateY(6px);
  animation: fadeInUp 0.5s forwards;
}

.fade-in:nth-child(2) { animation-delay: 0.2s; }
.fade-in:nth-child(3) { animation-delay: 0.35s; }
.fade-in:nth-child(4) { animation-delay: 0.5s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .about-main h2 { font-size: 18px; }
  .about-main h3 { font-size: 14px; }
  .about-main p, .about-main ul li { font-size: 12px; }
}
</style>

