import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import TabsPage from '../views/TabsPage.vue'
import LoginPage from '../views/auth/LoginPage.vue'
import SignUpPage from '../views/auth/SignUpPage.vue'
import ForgotPasswordPage from '../views/auth/ForgotPasswordPage.vue'
import SentMailPage from '../views/auth/SentMailPage.vue'
import SetupPinPage from '../views/auth/SetupPinPage.vue'
import VerifyPinPage from '../views/auth/VerifyPinPage.vue'
import WelcomePage from '../views/auth/WelcomePage.vue'
import NotificationPage from '../views/NotificationPage.vue'
import NotificationDetailPage from '../views/NotificationDetailPage.vue'
import ExpenseSummaryPage from '../views/summary/ExpenseSummaryPage.vue'
import IncomeSummaryPage from '../views/summary/IncomeSummaryPage.vue'
import AddMoneyRecordPage from '../views/AddMoneyRecordPage.vue'
import WalletPage from '../views/wallet/WalletPage.vue'
import WalletFormPage from '../views/wallet/WalletFormPage.vue'
import PocketFormPage from '../views/budgeting/PocketFormPage.vue'
import PocketDetailPage from '../views/budgeting/PocketDetailPage.vue'
import GoalsFormPage from '../views/goals/GoalsFormPage.vue'
import GoalsDetailPage from '../views/goals/GoalsDetailPage.vue'
import ProfileFormPage from '../views/profile/ProfileFormPage.vue'
import ChangeLanguagePage from '../views/profile/ChangeLanguagePage.vue'
import TransactionDetailPage from '../views/TransactionDetailPage.vue'
import AboutUsPage from '../views/profile/AboutUsPage.vue'
import HelpCenterPage from '../views/profile/HelpCenterPage.vue'
import NotFoundPage from '../views/components/NotFoundPage.vue'

const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password', '/sent-mail']
const TEMP_TOKEN_ROUTES = ['/setup-pin', '/verify-pin']
const PIN_SUCCESS_ROUTE = '/welcome'
const AFTER_LOGIN_BLOCKED = [...PUBLIC_ROUTES, ...TEMP_TOKEN_ROUTES, PIN_SUCCESS_ROUTE]

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: TabsPage,
    children: [
      {
        path: '',
        meta: { title: 'Home' },
        component: () => import('../views/HomePage.vue')
      },
      {
        path: 'budgeting',
        meta: { title: 'Budgeting' },
        component: () => import('../views/BudgetingPage.vue')
      },
      {
        path: 'goals',
        meta: { title: 'Goals' },
        component: () => import('../views/GoalsPage.vue')
      },
      {
        path: 'profile',
        meta: { title: 'Profile' },
        component: () => import('../views/ProfilePage.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: 'Login' },
    component: LoginPage
  },
  {
    path: '/signup',
    name: 'Sign Up',
    meta: { title: 'Sign Up' },
    component: SignUpPage
  },
  {
    path: '/forgot-password',
    name: 'Forgot Password',
    meta: { title: 'Forgot Password' },
    component: ForgotPasswordPage
  },
  {
    path: '/sent-mail',
    name: 'Sent Mail',
    meta: { title: 'Check Your Email' },
    component: SentMailPage
  },
  {
    path: '/setup-pin',
    name: 'Setup PIN',
    meta: { title: 'Setup PIN' },
    component: SetupPinPage
  },
  {
    path: '/verify-pin',
    name: 'Verify PIN',
    meta: { title: 'Verify PIN' },
    component: VerifyPinPage
  },
  {
    path: '/welcome',
    name: 'Welcome',
    meta: { title: 'Welcome' },
    component: WelcomePage
  },
  {
    path: '/notification',
    name: 'Notification',
    meta: { title: 'Notifications' },
    component: NotificationPage
  },
  {
    path: '/notification/:id',
    name: 'Notification Detail',
    meta: { title: 'Notification' },
    component: NotificationDetailPage
  },
  {
    path: '/expense-summary',
    name: 'Expense Summary',
    meta: { title: 'Expense Summary' },
    component: ExpenseSummaryPage
  },
  {
    path: '/income-summary',
    name: 'Income Summary',
    meta: { title: 'Income Summary' },
    component: IncomeSummaryPage
  },
  {
    path: '/add-money-record',
    name: 'Add Money Record',
    meta: { title: 'Add Record' },
    component: AddMoneyRecordPage
  },
  {
    path: '/wallet',
    name: 'Wallet',
    meta: { title: 'Wallets' },
    component: WalletPage
  },
  {
    path: '/add-wallet',
    name: 'Add Wallet',
    meta: { title: 'Add Wallet' },
    component: WalletFormPage
  },
  {
    path: '/edit-wallet/:id',
    name: 'Edit Wallet',
    meta: { title: 'Edit Wallet' },
    component: WalletFormPage
  },
  {
    path: '/add-pocket',
    name: 'Add Pocket',
    meta: { title: 'Add Pocket' },
    component: PocketFormPage
  },
  {
    path: '/edit-pocket/:id',
    name: 'Edit Pocket',
    meta: { title: 'Edit Pocket' },
    component: PocketFormPage
  },
  {
    path: '/detail-pocket/:id',
    name: 'Detail Pocket',
    meta: { title: 'Pocket Detail' },
    component: PocketDetailPage
  },
  {
    path: '/add-goals',
    name: 'Add Goals',
    meta: { title: 'Add Goal' },
    component: GoalsFormPage
  },
  {
    path: '/edit-goals/:id',
    name: 'Edit Goals',
    meta: { title: 'Edit Goal' },
    component: GoalsFormPage
  },
  {
    path: '/detail-goals/:id',
    name: 'Detail Goals',
    meta: { title: 'Goal Detail' },
    component: GoalsDetailPage
  },
  {
    path: '/edit-profile',
    name: 'Edit Profile',
    meta: { title: 'Edit Profile' },
    component: ProfileFormPage
  },
  {
    path: '/language',
    name: 'Language',
    meta: { title: 'Language' },
    component: ChangeLanguagePage
  },
  {
    path: '/detail-transaction/:id',
    name: 'Transaction Detail',
    meta: { title: 'Transaction Detail' },
    component: TransactionDetailPage
  },
  {
    path: '/about-us',
    name: 'About Us',
    meta: { title: 'About Us' },
    component: AboutUsPage
  },
  {
    path: '/help-center',
    name: 'Help Center',
    meta: { title: 'Help Center' },
    component: HelpCenterPage
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Not Found',
    meta: { title: 'Page Not Found' },
    component: NotFoundPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore()

  const pageTitle = to.meta?.title as string | undefined
  document.title = pageTitle ? `MyUang - ${pageTitle}` : 'MyUang'

  if (!auth.sessionChecked) {
    await auth.initializeAuth()
  }

  const isPublic = PUBLIC_ROUTES.includes(to.path)
  const isTempRoute = TEMP_TOKEN_ROUTES.includes(to.path)
  const isPinSuccessRoute = to.path === PIN_SUCCESS_ROUTE
  const isBlockedAfterLogin = AFTER_LOGIN_BLOCKED.includes(to.path)

  if (auth.pinVerified && isBlockedAfterLogin && !isPinSuccessRoute) {
    return next('/')
  }

  if (isPublic) {
    if (!auth.accessToken) return next()
    if (auth.hasTempToken) return next('/verify-pin')
    return next()
  }

  if (isPinSuccessRoute) {
    if (!auth.isAuthenticated) return next('/login')
    return next()
  }

  if (isTempRoute) {
    if (!auth.hasTempToken) return next('/login')
    return next()
  }

  if (!auth.accessToken) return next('/login')

  if (!auth.pinVerified) {
    if (auth.hasTempToken) return next('/verify-pin')
    return next('/login')
  }

  return next()
})

export default router