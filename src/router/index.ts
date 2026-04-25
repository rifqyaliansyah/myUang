import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/auth/LoginPage.vue'
import SignUpPage from '../views/auth/SignUpPage.vue';
import ForgotPasswordPage from '../views/auth/ForgotPasswordPage.vue';
import SentMailPage from '../views/auth/SentMailPage.vue';
import SetupPinPage from '../views/auth/SetupPinPage.vue';
import WelcomePage from '../views/auth/WelcomePage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/signup',
    name: 'Sign Up',
    component: SignUpPage
  },
  {
    path: '/forgot-password',
    name: 'Forgot Password',
    component: ForgotPasswordPage
  },
  {
    path: '/sent-mail',
    name: 'Sent Mail',
    component: SentMailPage
  },
  {
    path: '/setup-pin',
    name: 'Setup PIN',
    component: SetupPinPage
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: WelcomePage
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
