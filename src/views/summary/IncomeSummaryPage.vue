<template>
    <ion-page>
        <AppHeader title="Income" :show-back="true" back-href="/" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">
                <!-- Summary Header -->
                <div class="summary-header">
                    <span class="summary-title">{{ t('incomeSummary.summary') }}</span>
                    <div class="summary-period" id="income-period-trigger">
                        <span>{{ selectedLabel }}</span>
                        <ion-icon :icon="chevronDownOutline" class="period-chevron"
                            :class="{ 'chevron-open': isPeriodOpen }" />
                    </div>
                </div>

                <ion-popover trigger="income-period-trigger" trigger-action="click" :dismiss-on-select="true"
                    :show-backdrop="false" side="bottom" alignment="end" class="period-dropdown" :style="popoverStyle"
                    @willPresent="isPeriodOpen = true" @willDismiss="isPeriodOpen = false">
                    <ion-content class="popover-scroll">
                        <div v-for="opt in PERIOD_OPTIONS" :key="opt.key" class="dropdown-item"
                            :class="{ 'dropdown-item--active': selectedPeriod === opt.key }"
                            @click="selectPeriod(opt.key)">
                            <span class="dropdown-name">{{ opt.label }}</span>
                        </div>
                    </ion-content>
                </ion-popover>

                <!-- Income List -->
                <div v-if="loading" class="loading-wrapper">
                    <ion-spinner name="crescent" />
                </div>

                <div v-else class="transaction-list">
                    <div v-if="localTransactions.length === 0" class="empty-tx">
                        <p>{{ t('incomeSummary.noIncome') }}</p>
                    </div>

                    <ion-card class="transaction-card clickable" v-for="tx in localTransactions" :key="tx.id"
                        @click="router.push(`/detail-transaction/${tx.id}`)">
                        <ion-card-content>
                            <div class="transaction-item">
                                <div class="transaction-info">
                                    <p class="transaction-name">{{ tx.note || t('incomeSummary.income') }}</p>
                                    <p class="transaction-date">{{ formatDate(tx.date) }}</p>
                                </div>
                                <p class="transaction-amount income">+ IDR {{ formatAmount(tx.amount) }}</p>
                            </div>
                        </ion-card-content>
                    </ion-card>
                </div>
            </div>
            <ion-infinite-scroll @ionInfinite="loadMore" :disabled="!hasMore">
                <ion-infinite-scroll-content loading-spinner="crescent" loading-text="" />
            </ion-infinite-scroll>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage, IonContent, IonIcon, IonCard, IonCardContent, IonSpinner,
    IonInfiniteScroll, IonInfiniteScrollContent, IonPopover
} from '@ionic/vue'
import { useWalletStore } from '@/stores/wallet'
import { ref, computed, onMounted } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import { chevronDownOutline } from 'ionicons/icons'
import { useRouter } from 'vue-router'
import transactionService from '@/services/transaction.service'
import type { Transaction } from '@/stores/transaction'
import { usePeriodFilter, type PeriodKey } from '@/composables/usePeriodFilter'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const walletStore = useWalletStore()
const activeWallet = computed(() => walletStore.wallets.find(w => w.is_active))

const { selectedPeriod, selectedLabel, isDropdownOpen: isPeriodOpen, periodParams, PERIOD_OPTIONS } = usePeriodFilter()

const localTransactions = ref<Transaction[]>([])
const loading = ref(false)
const hasMore = ref(true)
const LIMIT = 10
let currentOffset = 0

onMounted(async () => {
    if (walletStore.wallets.length === 0) await walletStore.fetchWallets()
    await loadInitial()
})

async function loadInitial() {
    if (!activeWallet.value) return
    loading.value = true
    hasMore.value = true
    currentOffset = 0
    try {
        const res = await transactionService.getTransactions({
            walletId: activeWallet.value.id,
            type: 'income',
            ...periodParams.value,
            limit: LIMIT,
            offset: 0,
        })
        localTransactions.value = res.data.data
        if (res.data.data.length < LIMIT) hasMore.value = false
    } finally {
        loading.value = false
    }
}

async function loadMore(ev: any) {
    const nextOffset = currentOffset + LIMIT
    try {
        const res = await transactionService.getTransactions({
            walletId: activeWallet.value?.id,
            type: 'income',
            ...periodParams.value,
            limit: LIMIT,
            offset: nextOffset,
        })
        localTransactions.value = [...localTransactions.value, ...res.data.data]
        currentOffset = nextOffset
        if (res.data.data.length < LIMIT) hasMore.value = false
    } finally {
        ev.target.complete()
    }
}

async function selectPeriod(key: PeriodKey) {
    selectedPeriod.value = key
    await loadInitial()
}

const formatAmount = (value: number) => Math.floor(Number(value) || 0).toLocaleString('id-ID')
const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

const popoverStyle = computed(() => {
    const screenWidth = window.innerWidth
    const appWidth = 480
    if (screenWidth <= 768) return ''
    const offset = -((screenWidth - appWidth) / 2) + 16
    return `--offset-x: ${offset}px;`
})
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

.page-wrapper {
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
}

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
    cursor: pointer;
}

.transaction-card ion-card-content {
    padding: 16px;
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

.loading-wrapper {
    display: flex;
    justify-content: center;
    padding: 48px 0;
}

.empty-tx {
    text-align: center;
    padding: 48px 0;
    color: var(--color-black-60);
    font-size: 16px;
}

.period-dropdown {
    --width: 160px;
    --border-radius: 12px;
    --box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    --offset-y: 8px;
}

.dropdown-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    font-size: 15px;
    color: var(--color-black-100);
}

.dropdown-item--active .dropdown-name {
    color: #3077E3;
    font-weight: 700;
}

.chevron-open {
    transform: rotate(180deg);
}
</style>