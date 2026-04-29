<template>
    <ion-page>
        <AppHeader title="Income" :show-back="true" back-href="/" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">
                <!-- Summary Header -->
                <div class="summary-header">
                    <span class="summary-title">Summary</span>
                    <div class="summary-period">
                        <span>This month</span>
                        <ion-icon :icon="chevronDownOutline" class="period-chevron" />
                    </div>
                </div>

                <!-- Income List -->
                <div v-if="transactionStore.loading" class="loading-wrapper">
                    <ion-spinner name="crescent" />
                </div>

                <div v-else class="transaction-list">
                    <div v-if="incomes.length === 0" class="empty-tx">
                        <p>No income yet</p>
                    </div>

                    <ion-card class="transaction-card clickable" v-for="tx in incomes" :key="tx.id"
                        @click="router.push(`/detail-transaction/${tx.id}`)">
                        <ion-card-content>
                            <div class="transaction-item">
                                <div class="transaction-info">
                                    <p class="transaction-name">{{ tx.note || 'Income' }}</p>
                                    <p class="transaction-date">{{ formatDate(tx.date) }}</p>
                                </div>
                                <p class="transaction-amount income">+ IDR {{ formatAmount(tx.amount) }}</p>
                            </div>
                        </ion-card-content>
                    </ion-card>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonIcon, IonCard, IonCardContent, IonSpinner } from '@ionic/vue'
import { useTransactionStore } from '@/stores/transaction'
import { useWalletStore } from '@/stores/wallet'
import { computed, onMounted } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import { chevronDownOutline } from 'ionicons/icons'
import { useRouter } from 'vue-router'

const router = useRouter()

const transactionStore = useTransactionStore()
const walletStore = useWalletStore()

const activeWallet = computed(() => walletStore.wallets.find(w => w.is_active))

const incomes = computed(() =>
    transactionStore.transactions.filter(tx => tx.type === 'income')
)

onMounted(async () => {
    if (walletStore.wallets.length === 0) await walletStore.fetchWallets()
    if (activeWallet.value) {
        await transactionStore.fetchTransactions({ walletId: activeWallet.value.id })
    }
})

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
</style>