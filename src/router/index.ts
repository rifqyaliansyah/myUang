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
        component: () => import('../views/HomePage.vue')
      },
      {
        path: 'budgeting',
        component: () => import('../views/BudgetingPage.vue')
      },
      {
        path: 'goals',
        component: () => import('../views/GoalsPage.vue')
      },
      {
        path: 'profile',
        component: () => import('../views/ProfilePage.vue')
      },
    ]
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
    path: '/verify-pin',
    name: 'Verify PIN',
    component: VerifyPinPage
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: WelcomePage
  },
  {
    path: '/notification',
    name: 'Notification',
    component: NotificationPage
  },
  {
    path: '/notification/:id',
    name: 'Notification Detail',
    component: NotificationDetailPage
  },
  {
    path: '/expense-summary',
    name: 'Expense Summary',
    component: ExpenseSummaryPage
  },
  {
    path: '/income-summary',
    name: 'Income Summary',
    component: IncomeSummaryPage
  },
  {
    path: '/add-money-record',
    name: 'Add Money Record',
    component: AddMoneyRecordPage
  },
  {
    path: '/wallet',
    name: 'Wallet',
    component: WalletPage
  },
  {
    path: '/add-wallet',
    name: 'Add Wallet',
    component: WalletFormPage
  },
  {
    path: '/edit-wallet/:id',
    name: 'Edit Wallet',
    component: WalletFormPage
  },
  {
    path: '/add-pocket',
    name: 'Add Pocket',
    component: PocketFormPage
  },
  {
    path: '/edit-pocket/:id',
    name: 'Edit Pocket',
    component: PocketFormPage
  },
  {
    path: '/detail-pocket/:id',
    name: 'Detail Pocket',
    component: PocketDetailPage
  },
  {
    path: '/add-goals',
    name: 'Add Goals',
    component: GoalsFormPage
  },
  {
    path: '/edit-goals/:id',
    name: 'Edit Goals',
    component: GoalsFormPage
  },
  {
    path: '/detail-goals/:id',
    name: 'Detail Goals',
    component: GoalsDetailPage
  },
  {
    path: '/edit-profile',
    name: 'Edit Profile',
    component: ProfileFormPage
  },
  {
    path: '/language',
    name: 'Language',
    component: ChangeLanguagePage
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore()

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