import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Register from '@/views/RegisterView.vue'
import BecomePartner from "@/views/BecomePartner.vue";
import AboutUs from '@/views/AboutUs.vue';
import DeliveryPayment from '@/views/DeliveryPayment.vue';
import Contact from '@/views/Contact.vue';
import BecomeCourier from '@/views/BecomeCourier.vue'
import Favorite from '../components/Favorite.vue'
import Cart from '../components/Cart.vue'
import PaymentPage from "@/views/PaymentPage.vue";



const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/register', name: 'Register', component: Register },
  { path: '/become-partner', name: 'BecomePartner', component: BecomePartner },
  { path: '/about', name: 'AboutUs', component: AboutUs },
  { path: '/delivery-payment', name: 'DeliveryPayment', component: DeliveryPayment },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/become-courier', name: 'BecomeCourier', component: BecomeCourier },
  { path: '/favorite', component: Favorite },
  { path: '/cart', component: Cart },
  { path: '/payment', component: PaymentPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 } 
  }
})
export default router

