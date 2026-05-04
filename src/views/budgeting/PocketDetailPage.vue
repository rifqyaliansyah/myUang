<template>
    <ion-page>
        <AppHeader :title="t('pocketDetail.title')" :show-back="true" back-href="/budgeting" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <div v-if="loading" class="loading-wrapper">
                    <ion-spinner name="crescent" />
                </div>

                <template v-else-if="pocket">
                    <div class="pocket-summary-card">
                        <div class="pocket-summary-header">
                            <span class="pocket-emoji">{{ pocket.emoji }}</span>
                            <span class="pocket-name">{{ pocket.name }}</span>
                        </div>

                        <div class="pocket-balance">
                            IDR {{ formatAmount(pocket.used) }}<span class="pocket-limit">/IDR {{
                                formatAmount(pocket.budget_limit) }}</span>
                        </div>

                        <div class="pocket-desc">{{ pocket.description }}</div>

                        <div class="pocket-progress-bar">
                            <div class="pocket-progress-fill" :style="{ width: progressPercent + '%' }" />
                        </div>

                        <div class="pocket-reached">
                            IDR {{ formatAmount(pocket.used) }} of IDR {{ formatAmount(pocket.budget_limit) }} {{
                                t('pocketDetail.used') }}
                        </div>
                    </div>

                    <div class="section-title">{{ t('pocketDetail.transactionHistory') }}</div>

                    <div class="transaction-list">
                        <div v-if="localTransactions.length === 0" class="empty-transactions">
                            <p>{{ t('pocketDetail.noTransactions') }}</p>
                        </div>
                        <div class="transaction-card" v-for="tx in localTransactions" :key="tx.id"
                            @click="router.push(`/detail-transaction/${tx.id}`)" style="cursor: pointer;">
                            <div class="transaction-item">
                                <div class="transaction-info">
                                    <p class="transaction-name">{{ tx.note || 'Expense' }}</p>
                                    <p class="transaction-date">{{ formatDate(tx.date) }}</p>
                                </div>
                                <p class="transaction-amount expense">
                                    - IDR {{ formatAmount(tx.amount) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </template>

            </div>
            <ion-infinite-scroll @ionInfinite="loadMore" :disabled="!hasMore">
                <ion-infinite-scroll-content loading-spinner="crescent" loading-text="" />
            </ion-infinite-scroll>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { IonPage, IonContent, IonSpinner, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import { usePocketStore } from '@/stores/pocket'
import transactionService from '@/services/transaction.service'
import type { Transaction } from '@/stores/transaction'

const router = useRouter()
const route = useRoute()
const pocketStore = usePocketStore()
const { t } = useI18n()

const pocketId = route.params.id as string
const loading = ref(false)
const hasMore = ref(true)
const LIMIT = 10
let currentOffset = 0

const pocket = computed(() => pocketStore.pockets.find(p => p.id === pocketId))
const localTransactions = ref<Transaction[]>([])

const progressPercent = computed(() => {
    if (!pocket.value?.budget_limit) return 0
    return Math.min((pocket.value.used / pocket.value.budget_limit) * 100, 100)
})

onMounted(async () => {
    loading.value = true
    try {
        if (pocketStore.pockets.length === 0) await pocketStore.fetchPockets()
        await loadInitial()
    } finally {
        loading.value = false
    }
})

async function loadInitial() {
    hasMore.value = true
    currentOffset = 0
    const res = await transactionService.getTransactions({ pocketId, limit: LIMIT, offset: 0 })
    localTransactions.value = res.data.data
    if (res.data.data.length < LIMIT) hasMore.value = false
}

async function loadMore(ev: any) {
    const nextOffset = currentOffset + LIMIT
    try {
        const res = await transactionService.getTransactions({ pocketId, limit: LIMIT, offset: nextOffset })
        localTransactions.value = [...localTransactions.value, ...res.data.data]
        currentOffset = nextOffset
        if (res.data.data.length < LIMIT) hasMore.value = false
    } finally {
        ev.target.complete()
    }
}

const formatAmount = (value: number) => Math.floor(Number(value) || 0).toLocaleString('id-ID')
const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
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

/* Pocket Summary Card */
.pocket-summary-card {
    background-color: var(--color-bg-3);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-sizing: border-box;
}

.pocket-summary-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
}

.pocket-emoji {
    font-size: 32px;
    line-height: 48px;
    letter-spacing: -0.02em;
}

.pocket-name {
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

.pocket-balance {
    font-size: 20px;
    font-weight: 700;
    line-height: 32px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

.pocket-limit {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-80);
}

.pocket-desc {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-80);
}

.pocket-progress-bar {
    width: 100%;
    height: 8px;
    background-color: var(--color-white);
    border-radius: 999px;
    overflow: hidden;
    margin: 4px 0;
}

.pocket-progress-fill {
    height: 100%;
    background-color: #3077E3;
    border-radius: 999px;
    transition: width 0.3s ease;
}

.pocket-reached {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

/* Section Title */
.section-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

/* Transaction List */
.transaction-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.transaction-card {
    background-color: var(--color-white);
    border: 1px solid var(--color-black-20);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 16px;
    min-height: 84px;
    box-sizing: border-box;
    cursor: pointer;
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
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
    margin: 0;
}

.transaction-date {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-60);
    margin: 0;
}

.transaction-amount {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: -0.02em;
    margin: 0;
}

.transaction-amount.income {
    color: var(--color-green);
}

.transaction-amount.expense {
    color: var(--color-red);
}
</style>