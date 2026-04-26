<template>
    <ion-page>
        <AppHeader title="Detail Pocket" :show-back="true" back-href="/budgeting" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <!-- Pocket Summary Card -->
                <div class="pocket-summary-card">
                    <div class="pocket-summary-header">
                        <span class="pocket-emoji">{{ pocket.emoji }}</span>
                        <span class="pocket-name">{{ pocket.name }}</span>
                    </div>

                    <div class="pocket-balance">
                        IDR {{ formatAmount(pocket.used) }}<span class="pocket-limit">/IDR {{ formatAmount(pocket.limit)
                            }}</span>
                    </div>

                    <div class="pocket-desc">{{ pocket.description }}</div>

                    <div class="pocket-progress-bar">
                        <div class="pocket-progress-fill" :style="{ width: progressPercent + '%' }" />
                    </div>

                    <div class="pocket-reached">
                        IDR {{ formatAmount(pocket.reached) }} of IDR {{ formatAmount(pocket.limit) }} reached
                    </div>
                </div>

                <!-- Transaction History -->
                <div class="section-title">Transaction History</div>

                <div class="transaction-list">
                    <div class="transaction-card" v-for="tx in transactions" :key="tx.id">
                        <div class="transaction-item">
                            <div class="transaction-info">
                                <p class="transaction-name">{{ tx.name }}</p>
                                <p class="transaction-date">{{ tx.date }}</p>
                            </div>
                            <p class="transaction-amount" :class="tx.type">
                                {{ tx.type === 'expense' ? '- ' : '+ ' }}IDR {{ formatAmount(tx.amount) }}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'
import AppHeader from '../components/AppHeader.vue'

const pocket = {
    id: 1,
    emoji: '⛽',
    name: 'Food',
    used: 1000000,
    limit: 1500000,
    reached: 200000,
    description: 'Food, snack, etc',
}

const transactions = [
    { id: 1, name: 'Nasi Goreng', date: '17/04/23', amount: 40000, type: 'expense' },
    { id: 2, name: 'Mc. Donald', date: '17/04/23', amount: 50000, type: 'expense' },
]

const progressPercent = computed(() => {
    if (!pocket.limit) return 0
    return Math.min((pocket.used / pocket.limit) * 100, 100)
})

const formatAmount = (value: number) => value.toLocaleString('id-ID')
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