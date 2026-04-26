<template>
    <ion-page>
        <AppHeader title="Goals Details" :show-back="true" back-href="/goals" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <!-- Cover Image -->
                <div class="goal-cover">
                    <img :src="goal.image" :alt="goal.name" class="cover-img" />
                </div>

                <!-- Goal Info -->
                <div class="goal-info-section">
                    <div class="goal-name">{{ goal.name }}</div>
                    <div class="goal-desc">{{ goal.description }}</div>
                    <div class="goal-amount">IDR {{ formatAmount(goal.reached) }}</div>

                    <div class="goal-progress-bar">
                        <div class="goal-progress-fill" :style="{ width: progressPercent + '%' }" />
                    </div>

                    <div class="goal-reached">
                        IDR {{ formatAmount(goal.reached) }} of IDR {{ formatAmount(goal.limit) }} reached
                    </div>
                </div>

                <!-- Goal Money Record Activities -->
                <div class="section-title">Goal Money Record Activities</div>

                <div class="transaction-list">
                    <div class="transaction-card" v-for="tx in activities" :key="tx.id">
                        <div class="transaction-item">
                            <div class="transaction-info">
                                <p class="transaction-name">{{ tx.name }}</p>
                                <p class="transaction-date">{{ tx.date }}</p>
                            </div>
                            <p class="transaction-amount" :class="tx.type">
                                {{ tx.type === 'income' ? '+ ' : '- ' }}IDR {{ formatAmount(tx.amount) }}
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

const goal = {
    id: 1,
    name: 'Buy Jacket',
    description: 'New stylish jacket',
    reached: 200000,
    limit: 500000,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop',
}

const activities = [
    { id: 1, name: 'Freelance', date: '17/04/23', amount: 100000, type: 'income' },
    { id: 2, name: 'Transfer', date: '15/04/23', amount: 100000, type: 'income' },
]

const progressPercent = computed(() => {
    if (!goal.limit) return 0
    return Math.min((goal.reached / goal.limit) * 100, 100)
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

/* Cover Image */
.goal-cover {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    aspect-ratio: 16 / 9;
}

.cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

/* Goal Info */
.goal-info-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.goal-name {
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

.goal-desc {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-80);
}

.goal-amount {
    font-size: 20px;
    font-weight: 700;
    line-height: 32px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
    margin-top: 4px;
}

.goal-progress-bar {
    width: 100%;
    height: 8px;
    background-color: var(--color-black-20);
    border-radius: 999px;
    overflow: hidden;
    margin: 4px 0;
}

.goal-progress-fill {
    height: 100%;
    background-color: #3077E3;
    border-radius: 999px;
    transition: width 0.3s ease;
}

.goal-reached {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-80);
}

/* Section Title */
.section-title {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

/* Transaction List */
.transaction-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
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