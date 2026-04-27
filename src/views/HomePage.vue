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
                        <div class="avatar">
                            <img src="https://umj.ac.id/storage/2024/10/parb.jpg" alt="avatar" />
                        </div>
                    </div>
                </div>
                <div class="hero-bottom">
                    <div class="wallet-selector" id="wallet-trigger">
                        <span class="wallet-label">{{ activeWallet?.name ?? 'Select Wallet' }}</span>
                        <ion-icon :icon="chevronDownOutline" class="chevron-icon"
                            :class="{ 'chevron-open': isDropdownOpen }" />
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
                    <!-- Income -->
                    <ion-card class="summary-card clickable" @click="router.push('/income-summary')">
                        <ion-card-content>
                            <span class="card-emoji">🤑</span>
                            <div class="card-label income">
                                <ion-icon :icon="caretUpOutline" class="trend-icon" />
                                <span>Income</span>
                            </div>
                            <p class="card-amount">IDR 8.000.000</p>
                        </ion-card-content>
                    </ion-card>

                    <!-- Expense -->
                    <ion-card class="summary-card clickable" @click="router.push('/expense-summary')">
                        <ion-card-content>
                            <span class="card-emoji">💸</span>
                            <div class="card-label expense">
                                <ion-icon :icon="caretDownOutline" class="trend-icon" />
                                <span>Expense</span>
                            </div>
                            <p class="card-amount">IDR 3.000.000</p>
                        </ion-card-content>
                    </ion-card>

                    <ion-card class="summary-card clickable" @click="router.push('/budgeting')">
                        <ion-card-content>
                            <span class="card-emoji">🪨</span>
                            <div class="card-label neutral">
                                <span>Pockets</span>
                            </div>
                            <p class="card-amount">7 Pockets</p>
                        </ion-card-content>
                    </ion-card>

                    <ion-card class="summary-card clickable" @click="router.push('/goals')">
                        <ion-card-content>
                            <span class="card-emoji">📌</span>
                            <div class="card-label neutral">
                                <span>Goals</span>
                            </div>
                            <p class="card-amount">10 Goals</p>
                        </ion-card-content>
                    </ion-card>
                </div>

                <!-- Recent Transaction -->
                <div class="section-header">
                    <span class="section-title">Recent Transaction</span>
                    <div class="section-action">
                        <span>All</span>
                        <ion-icon :icon="chevronDownOutline" class="period-chevron" />
                    </div>
                </div>

                <div class="transaction-list">
                    <ion-card class="transaction-card">
                        <ion-card-content>
                            <div class="transaction-item">
                                <div class="transaction-info">
                                    <p class="transaction-name">Nasi Goreng</p>
                                    <p class="transaction-date">17/04/23</p>
                                </div>
                                <p class="transaction-amount expense">- IDR 40.000</p>
                            </div>
                        </ion-card-content>
                    </ion-card>

                    <ion-card class="transaction-card">
                        <ion-card-content>
                            <div class="transaction-item">
                                <div class="transaction-info">
                                    <p class="transaction-name">Gaji Bulanan</p>
                                    <p class="transaction-date">15/04/23</p>
                                </div>
                                <p class="transaction-amount income">+ IDR 8.000.000</p>
                            </div>
                        </ion-card-content>
                    </ion-card>

                    <ion-card class="transaction-card">
                        <ion-card-content>
                            <div class="transaction-item">
                                <div class="transaction-info">
                                    <p class="transaction-name">Bensin Motor</p>
                                    <p class="transaction-date">14/04/23</p>
                                </div>
                                <p class="transaction-amount expense">- IDR 50.000</p>
                            </div>
                        </ion-card-content>
                    </ion-card>
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
import { IonPage, IonContent, IonIcon, IonCard, IonCardContent, IonFab, IonFabButton, IonPopover } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'
import { onMounted, computed, ref } from 'vue'
import {
    chevronDownOutline, notificationsOutline,
    caretUpOutline, caretDownOutline, addOutline, checkmarkOutline, walletOutline
} from 'ionicons/icons'

const router = useRouter()
const walletStore = useWalletStore()
const isDropdownOpen = ref(false)
const goToNotification = () => {
    router.push('/notification')
}
const activeWallet = computed(() => walletStore.wallets.find(w => w.is_active))

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

onMounted(async () => {
    await walletStore.fetchWallets()
})

const formatAmount = (value: number) => Number(value).toLocaleString('id-ID')
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
    gap: 12px;
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
</style>