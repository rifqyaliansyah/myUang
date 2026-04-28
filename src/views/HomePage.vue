<template>
    <ion-page>
        <ion-content class="page-content" :fullscreen="true">
            <!-- Hero Header -->
            <div class="hero-header">
                <div class="hero-top">
                    <div class="brand-wrapper">
                        <span class="brand">MyUang</span>
                        <span class="brand-sub">by Me</span>
                    </div>
                    <div class="hero-actions">
                        <ion-icon :icon="notificationsOutline" class="notif-icon" @click="goToNotification" />
                        <div class="avatar" @click="router.push('/profile')">
                            <img :src="avatarUrl" alt="avatar" />
                        </div>
                    </div>
                </div>
                <div class="hero-bottom">
                    <div class="wallet-selector-wrapper" id="wallet-trigger">
                        <div class="wallet-selector">
                            <span class="wallet-label">{{ activeWallet?.name ?? 'Select Wallet' }}</span>
                            <ion-icon :icon="chevronDownOutline" class="chevron-icon"
                                :class="{ 'chevron-open': isDropdownOpen }" />
                        </div>
                    </div>
                    <div class="hero-balance">
                        <h2>IDR {{ activeWallet ? formatAmount(activeWallet.balance) : '0' }}</h2>
                    </div>

                    <ion-popover trigger="wallet-trigger" trigger-action="click" :dismiss-on-select="true"
                        :show-backdrop="true" side="bottom" alignment="start" class="wallet-dropdown"
                        :style="popoverStyle" @willPresent="isDropdownOpen = true"
                        @willDismiss="isDropdownOpen = false">
                        <ion-content class="popover-scroll">
                            <div v-for="wallet in walletStore.wallets" :key="wallet.id" class="dropdown-item"
                                :class="{ 'dropdown-item--active': wallet.is_active }" @click="selectWallet(wallet)">
                                <span class="dropdown-name">{{ wallet.name }}</span>
                                <span class="dropdown-balance">IDR {{ formatAmount(wallet.balance) }}</span>
                            </div>
                            <div class="dropdown-divider"></div>
                            <div class="dropdown-item dropdown-manage" @click="router.push('/wallet')">
                                <ion-icon :icon="walletOutline" class="manage-icon" />
                                <span>Manage Wallets</span>
                            </div>
                        </ion-content>
                    </ion-popover>
                </div>
            </div>

            <!-- Page Content -->
            <div class="page-wrapper">
                <!-- Summary Header -->
                <div class="summary-header">
                    <span class="summary-title">Summary</span>
                    <div class="summary-period">
                        <span>This month</span>
                        <ion-icon :icon="chevronDownOutline" class="period-chevron" />
                    </div>
                </div>

                <!-- Summary Grid -->
                <div class="summary-grid">
                    <ion-card class="summary-card clickable" @click="router.push('/income-summary')">
                        <ion-card-content>
                            <span class="card-emoji">🤑</span>
                            <div class="card-label income">
                                <ion-icon :icon="caretUpOutline" class="trend-icon" />
                                <span>Income</span>
                            </div>
                            <p class="card-amount">IDR {{ formatAmount(transactionStore.summary.total_income) }}</p>
                        </ion-card-content>
                    </ion-card>

                    <ion-card class="summary-card clickable" @click="router.push('/expense-summary')">
                        <ion-card-content>
                            <span class="card-emoji">💸</span>
                            <div class="card-label expense">
                                <ion-icon :icon="caretDownOutline" class="trend-icon" />
                                <span>Expense</span>
                            </div>
                            <p class="card-amount">IDR {{ formatAmount(transactionStore.summary.total_expense) }}</p>
                        </ion-card-content>
                    </ion-card>

                    <ion-card class="summary-card clickable" @click="router.push('/budgeting')">
                        <ion-card-content>
                            <span class="card-emoji">🪨</span>
                            <div class="card-label neutral">
                                <span>Pockets</span>
                            </div>
                            <p class="card-amount">{{ pocketStore.pockets.length }} Pockets</p>
                        </ion-card-content>
                    </ion-card>

                    <ion-card class="summary-card clickable" @click="router.push('/goals')">
                        <ion-card-content>
                            <span class="card-emoji">📌</span>
                            <div class="card-label neutral">
                                <span>Goals</span>
                            </div>
                            <p class="card-amount">{{ goalStore.goals.length }} Goals</p>
                        </ion-card-content>
                    </ion-card>
                </div>

                <!-- Recent Transaction -->
                <div class="section-header">
                    <span class="section-title">Recent Transaction</span>
                </div>

                <div class="transaction-list">
                    <div v-if="transactionStore.loading" class="loading-wrapper">
                        <ion-spinner name="crescent" />
                    </div>

                    <template v-else>
                        <div v-if="transactionStore.transactions.length === 0" class="empty-tx">
                            <p>No transactions yet</p>
                        </div>

                        <ion-card class="transaction-card" v-for="tx in transactionStore.recentTransactions"
                            :key="tx.id">
                            <ion-card-content>
                                <div class="transaction-item">
                                    <div class="transaction-info">
                                        <p class="transaction-name">{{ txLabel(tx) }}</p>
                                        <p class="transaction-date">{{ formatDate(tx.date) }}</p>
                                    </div>
                                    <p class="transaction-amount" :class="tx.type === 'income' ? 'income' : 'expense'">
                                        {{ tx.type === 'income' ? '+' : '-' }} IDR {{ formatAmount(tx.amount) }}
                                    </p>
                                </div>
                            </ion-card-content>
                        </ion-card>
                    </template>
                </div>
            </div>
        </ion-content>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button class="fab-btn" @click="router.push('/add-money-record')">
                <ion-icon :icon="addOutline" class="fab-icon" />
            </ion-fab-button>
        </ion-fab>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonIcon, IonCard, IonCardContent, IonFab, IonFabButton, IonPopover, IonSpinner } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'
import { useAuthStore } from '@/stores/auth'
import { useTransactionStore } from '@/stores/transaction'
import { usePocketStore } from '@/stores/pocket'
import { useGoalStore } from '@/stores/goal'
import profileService from '@/services/profile.service'
import { onMounted, computed, ref, watch } from 'vue'
import {
    chevronDownOutline, notificationsOutline,
    caretUpOutline, caretDownOutline, addOutline, walletOutline
} from 'ionicons/icons'

const router = useRouter()
const walletStore = useWalletStore()
const auth = useAuthStore()
const transactionStore = useTransactionStore()
const pocketStore = usePocketStore()
const goalStore = useGoalStore()
const isDropdownOpen = ref(false)

const now = new Date()
const currentMonth = now.getMonth() + 1
const currentYear = now.getFullYear()

const DEFAULT_AVATAR = 'https://i.pinimg.com/236x/13/74/20/137420f5b9c39bc911e472f5d20f053e.jpg'
const avatarUrl = computed(() => auth.user?.avatar_url || DEFAULT_AVATAR)
const activeWallet = computed(() => walletStore.wallets.find(w => w.is_active))

const loadTransactionData = async (walletId: string) => {
    await Promise.all([
        transactionStore.fetchTransactions({ walletId }),
        transactionStore.fetchSummary(walletId, currentMonth, currentYear),
    ])
}

onMounted(async () => {
    await walletStore.fetchWallets()
    await Promise.all([
        pocketStore.fetchPockets(),
        goalStore.fetchGoals(),
    ])

    try {
        const res = await profileService.getProfile()
        auth.setUser(res.data.data)
    } catch { /* fallback */ }

    if (activeWallet.value) {
        await loadTransactionData(activeWallet.value.id)
    }
})

watch(activeWallet, async (wallet) => {
    if (wallet) await loadTransactionData(wallet.id)
})

const selectWallet = async (wallet: any) => {
    if (!wallet.is_active) {
        await walletStore.setActiveWallet(wallet.id)
        await walletStore.fetchWallets()
    }
}

const popoverStyle = computed(() => {
    const screenWidth = window.innerWidth
    const appWidth = 480
    if (screenWidth <= 768) return ''
    const offset = -((screenWidth - appWidth) / 2) + 16
    return `--offset-x: ${offset}px;`
})

const formatAmount = (value: number) => Number(value).toLocaleString('id-ID')

const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

const txLabel = (tx: any) => {
    if (tx.note) return tx.note
    if (tx.type === 'goal_topup') return `Goals: ${tx.goal_name ?? 'Goal'}`
    if (tx.type === 'income') return 'Income'
    return tx.pocket_name ? `${tx.pocket_emoji} ${tx.pocket_name}` : 'Expense'
}

const goToNotification = () => router.push('/notification')
</script>

<style scoped>
.page-content {
    --background: var(--color-white);
}

.page-content::part(scroll) {
    scrollbar-width: none;
}

.page-content::part(scroll)::-webkit-scrollbar {
    display: none;
}

/* Hero Header */
.hero-header {
    background: linear-gradient(180deg, #3077E3 0%, var(--color-primary-2) 100%);
    padding: 12px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.hero-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.brand-wrapper {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 4px;
    margin: 0;
    padding: 0;
}

.brand {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-white);
    line-height: 1.2;
}

.brand-sub {
    font-size: 10px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: -0.01em;
    line-height: 1.2;
}

.hero-actions {
    display: flex;
    align-items: center;
    gap: 16px;
}

.notif-icon {
    font-size: 24px;
    color: var(--color-white);
    cursor: pointer;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #3077E3;
    background: var(--color-bg-1);
    cursor: pointer;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-bottom {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.wallet-selector {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
}

.wallet-label {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: rgba(255, 255, 255, 0.9);
    letter-spacing: -0.02em;
}

.chevron-icon {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    transition: transform 0.2s ease;
}

.chevron-open {
    transform: rotate(180deg);
}

.hero-balance h2 {
    font-size: 32px;
    font-weight: 700;
    line-height: 48px;
    color: var(--color-white);
    letter-spacing: -0.02em;
    margin: 0;
}

/* Page Content */
.page-wrapper {
    display: flex;
    flex-direction: column;
    padding: 16px 16px;
    gap: 16px;
}

/* Summary Header */
.summary-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.summary-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

.summary-period {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    color: var(--color-black-100);
    font-size: 14px;
    font-weight: 500;
}

.period-chevron {
    font-size: 16px;
    color: var(--color-black-80);
}

/* Summary Grid */
.summary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.summary-card {
    margin: 0;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    --background: var(--color-white);
    border: 1px solid var(--color-black-20);
}

.summary-card ion-card-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
}

.summary-card.clickable {
    cursor: pointer;
}

.card-emoji {
    font-size: 32px;
    line-height: 48px;
}

.card-label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.02em;
}

.card-label.income {
    color: var(--color-black-100);
}

.card-label.income .trend-icon {
    color: var(--color-green);
}

.card-label.expense {
    color: var(--color-black-100);
}

.card-label.expense .trend-icon {
    color: var(--color-red);
}

.card-label.neutral {
    color: var(--color-black-100);
}

.trend-icon {
    font-size: 24px;
}

.card-amount {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
    margin: 0;
}

/* Recent Transaction */
.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

.section-action {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-black-100);
}

.transaction-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.transaction-card {
    margin: 0;
    border-radius: 12px;
    box-shadow: none;
    --background: var(--color-bg-3);
}

.transaction-card ion-card-content {
    padding: 16px 16px;
}

.transaction-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.transaction-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.transaction-name {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
    margin: 0;
}

.transaction-date {
    font-size: 14px;
    font-weight: 400;
    color: var(--color-black-60);
    margin: 0;
}

.transaction-amount {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin: 0;
}

.transaction-amount.income {
    color: var(--color-green);
}

.transaction-amount.expense {
    color: var(--color-red);
}

.fab-btn {
    --background: #3077E3;
    --background-activated: var(--color-primary-1);
    --box-shadow: 0 4px 12px rgba(48, 119, 227, 0.4);
    --border-radius: 50%;
    width: 64px;
    height: 64px;
    margin-right: 8px;
}

.fab-icon {
    font-size: 32px;
    color: var(--color-white);
}

.wallet-dropdown {
    --width: 240px;
    --border-radius: 12px;
    --box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    --offset-y: 8px;
}

.wallet-dropdown .popover-scroll {
    --background: #ffffff;
}

.dropdown-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    font-size: 15px;
    color: var(--color-black-100);
}

.dropdown-item:active {
    background: var(--color-bg-4);
}

.dropdown-item--active {
    background: #EEF4FF;
}

.dropdown-item--active .dropdown-name {
    color: #3077E3;
    font-weight: 700;
}

.dropdown-item--active .dropdown-balance {
    color: #3077E3;
}

.dropdown-name {
    font-weight: 500;
}

.dropdown-balance {
    font-size: 13px;
    color: var(--color-black-60);
}

.dropdown-check {
    color: #3077E3;
    font-size: 16px;
}

.dropdown-divider {
    height: 0.9px;
    background: var(--color-black-20);
}

.dropdown-manage {
    gap: 8px;
    justify-content: flex-start;
    color: #3077E3;
    font-weight: 500;
}

.manage-icon {
    font-size: 18px;
}

.wallet-selector-wrapper {
    width: fit-content;
    cursor: pointer;
}

.empty-tx {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 48px 0;
    width: 100%;
}

.empty-tx p {
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    letter-spacing: -0.02em;
    color: var(--color-black-60);
    margin: 0;
}
</style>