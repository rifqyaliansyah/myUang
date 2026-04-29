<template>
    <ion-page>
        <AppHeader title="Transaction Detail" :show-back="true" back-href="/" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <div v-if="loading" class="loading-wrapper">
                    <ion-spinner name="crescent" />
                </div>

                <template v-else-if="tx">
                    <div class="tx-detail-card">
                        <div class="tx-detail-type" :class="tx.type">{{ typeLabel }}</div>
                        <div class="tx-detail-amount" :class="tx.type === 'income' ? 'income' : 'expense'">
                            {{ tx.type === 'income' ? '+' : '-' }} IDR {{ formatAmount(tx.amount) }}
                        </div>
                        <div class="tx-detail-date">{{ formatDateTime(tx.date, tx.created_at) }}</div>

                        <div class="tx-detail-divider" />

                        <div class="tx-detail-row" v-if="tx.pocket_name">
                            <span class="tx-detail-label">Pocket</span>
                            <span class="tx-detail-value">{{ tx.pocket_emoji }} {{ tx.pocket_name }}</span>
                        </div>

                        <div class="tx-detail-row" v-if="tx.goal_name">
                            <span class="tx-detail-label">Goal</span>
                            <span class="tx-detail-value">{{ tx.goal_name }}</span>
                        </div>

                        <div class="tx-detail-row" v-if="tx.note">
                            <span class="tx-detail-label">Note</span>
                            <span class="tx-detail-value">{{ tx.note }}</span>
                        </div>
                    </div>
                </template>

                <template v-else-if="!loading">
                    <div class="empty-state">
                        <p>Transaction not found</p>
                    </div>
                </template>

            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { IonPage, IonContent, IonSpinner } from '@ionic/vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import { useTransactionStore } from '@/stores/transaction'
import type { Transaction } from '@/stores/transaction'

const route = useRoute()
const transactionStore = useTransactionStore()

const txId = route.params.id as string
const loading = ref(false)
const tx = ref<Transaction | null>(null)

const typeLabel = computed(() => {
    const map: Record<string, string> = {
        income: 'Income',
        expense: 'Expense',
        goal_topup: 'Goal Top Up',
    }
    return tx.value ? map[tx.value.type] ?? 'Transaction' : ''
})

onMounted(async () => {
    loading.value = true
    try {
        const all = [
            ...transactionStore.transactions,
            ...transactionStore.pocketActivities,
            ...transactionStore.goalActivities,
        ]
        const found = all.find(t => t.id === txId)
        if (found) {
            tx.value = found
        }
    } finally {
        loading.value = false
    }
})

const formatAmount = (value: number) => Math.floor(Number(value) || 0).toLocaleString('id-ID')

const formatDateTime = (dateStr: string, createdAt: string) => {
    const date = new Date(dateStr)
    const time = new Date(createdAt)
    return date.toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric',
    }) + ', ' + time.toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit'
    })
}
</script>

<style scoped>
.page-content {
    --background: var(--color-white);
}

.page-wrapper {
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
}

.tx-detail-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 4px 0;
}

.tx-detail-type {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: -0.01em;
}

.tx-detail-type.income {
    color: var(--color-green);
}

.tx-detail-type.expense,
.tx-detail-type.goal_topup {
    color: var(--color-red);
}

.tx-detail-amount {
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
}

.tx-detail-amount.income {
    color: var(--color-green);
}

.tx-detail-amount.expense {
    color: var(--color-red);
}

.tx-detail-date {
    font-size: 13px;
    font-weight: 400;
    color: var(--color-black-60);
    letter-spacing: -0.01em;
}

.tx-detail-divider {
    height: 1px;
    background: var(--color-black-20);
    margin: 8px 0;
}

.tx-detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
}

.tx-detail-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-black-60);
    letter-spacing: -0.01em;
}

.tx-detail-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-black-100);
    letter-spacing: -0.01em;
    text-align: right;
}

.loading-wrapper {
    display: flex;
    justify-content: center;
    padding: 48px 0;
}

.empty-state {
    text-align: center;
    padding: 48px 0;
    color: var(--color-black-60);
    font-size: 16px;
}
</style>