<template>
    <ion-page>
        <AppHeader title="Goals Details" :show-back="true" back-href="/goals" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <div v-if="loading" class="loading-wrapper">
                    <ion-spinner name="crescent" />
                </div>

                <template v-else-if="goal">
                    <div class="goal-cover" v-if="goal.image_url">
                        <img :src="goal.image_url" :alt="goal.name" class="cover-img" />
                    </div>

                    <div class="goal-info-section">
                        <div class="goal-name">{{ goal.name }}</div>
                        <div class="goal-desc">{{ goal.description }}</div>
                        <div class="goal-amount">IDR {{ formatAmount(goal.reached) }}</div>

                        <div class="goal-progress-bar">
                            <div class="goal-progress-fill" :style="{ width: progressPercent + '%' }" />
                        </div>

                        <div class="goal-reached">
                            IDR {{ formatAmount(goal.reached) }} of IDR {{ formatAmount(goal.target_amount) }} reached
                        </div>
                    </div>

                    <div class="section-title">Goal Money Record Activities</div>

                    <div class="transaction-list">
                        <div v-if="activities.length === 0" class="empty-activities">
                            <p>No activities yet</p>
                        </div>
                        <div class="transaction-card" v-for="tx in activities" :key="tx.id">
                            <div class="transaction-item">
                                <div class="transaction-info">
                                    <p class="transaction-name">{{ tx.wallet_id ? 'From Wallet' : 'No Source' }}</p>
                                    <p class="transaction-date">{{ formatDate(tx.date) }}</p>
                                </div>
                                <p class="transaction-amount income">
                                    + IDR {{ formatAmount(tx.amount) }}
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

        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button class="fab-btn" @click="showTopUpModal = true">
                <ion-icon :icon="addOutline" class="fab-icon" />
            </ion-fab-button>
        </ion-fab>

        <ion-modal ref="topUpModalRef" :is-open="showTopUpModal" :initial-breakpoint="0.55" :breakpoints="[0, 0.55]"
            handle="false" @didDismiss="showTopUpModal = false" class="topup-modal">
            <ion-content class="modal-content">
                <div class="modal-wrapper">
                    <div class="sheet-handle" ref="handleRef" />

                    <div class="modal-title">Top-up Goal</div>

                    <div class="source-toggle">
                        <button class="toggle-btn" :class="{ active: sourceMode === 'wallet' }"
                            @click="sourceMode = 'wallet'">
                            From Wallet
                        </button>
                        <button class="toggle-btn" :class="{ active: sourceMode === 'manual' }"
                            @click="sourceMode = 'manual'">
                            No Source
                        </button>
                    </div>

                    <div class="modal-sub" v-if="sourceMode === 'wallet'">
                        From: <strong>{{ activeWallet?.name ?? '-' }}</strong>
                        (IDR {{ formatAmount(activeWallet?.balance ?? 0) }})
                    </div>
                    <div class="modal-sub manual-note" v-else>
                        Amount will be added directly without deducting any wallet.
                    </div>

                    <div class="form-group">
                        <ion-label>Amount</ion-label>
                        <div class="input-wrapper amount-wrapper">
                            <span class="currency-label">IDR</span>
                            <ion-input v-model="displayTopUpAmount" type="text" inputmode="numeric" placeholder="0"
                                class="custom-input amount-input" @ionInput="handleTopUpAmountInput" />
                        </div>
                    </div>

                    <ion-button expand="block" class="save-btn" :disabled="!topUpAmount || isSubmitting"
                        @click="handleTopUp">
                        <ion-spinner v-if="isSubmitting" name="crescent" style="width:20px;height:20px;" />
                        <span v-else>Top-up</span>
                    </ion-button>
                </div>
            </ion-content>
        </ion-modal>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import {
    IonPage, IonContent, IonFab, IonFabButton, IonIcon,
    IonModal, IonLabel, IonInput, IonButton, IonSpinner,
    IonInfiniteScroll, IonInfiniteScrollContent,
    toastController, createGesture
} from '@ionic/vue'
import { useRoute } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import { addOutline } from 'ionicons/icons'
import { useGoalStore } from '@/stores/goal'
import { useWalletStore } from '@/stores/wallet'
import { useTransactionStore } from '@/stores/transaction'

const route = useRoute()
const goalStore = useGoalStore()
const walletStore = useWalletStore()
const transactionStore = useTransactionStore()

const loading = ref(false)
const showTopUpModal = ref(false)
const topUpAmount = ref('')
const displayTopUpAmount = ref('')
const isSubmitting = ref(false)
const handleRef = ref()
const topUpModalRef = ref()
const hasMore = ref(true)
const LIMIT = 10
let currentOffset = 0

const sourceMode = ref<'wallet' | 'manual'>('wallet')

const goalId = route.params.id as string

const goal = computed(() => goalStore.goals.find(g => g.id === goalId))
const activeWallet = computed(() => walletStore.wallets.find(w => w.is_active))
const activities = computed(() => transactionStore.goalActivities)

const progressPercent = computed(() => {
    if (!goal.value?.target_amount) return 0
    return Math.min((goal.value.reached / goal.value.target_amount) * 100, 100)
})

watch(showTopUpModal, (val) => {
    if (!val) {
        topUpAmount.value = ''
        displayTopUpAmount.value = ''
        sourceMode.value = 'wallet'
        return
    }
    nextTick(() => {
        const el = handleRef.value?.$el ?? handleRef.value
        if (!el) return

        let startY = 0
        const gesture = createGesture({
            el,
            gestureName: 'swipe-down-handle-topup',
            direction: 'y',
            onStart: (detail) => { startY = detail.startY },
            onEnd: (detail) => {
                const delta = detail.currentY - startY
                if (delta > 60) showTopUpModal.value = false
            },
        })
        gesture.enable()
    })
})

onMounted(async () => {
    loading.value = true
    try {
        if (goalStore.goals.length === 0) await goalStore.fetchGoals()
        if (walletStore.wallets.length === 0) await walletStore.fetchWallets()
        transactionStore.goalActivities = []
        hasMore.value = true
        currentOffset = 0
        const data = await transactionStore.fetchGoalActivities(goalId)
        if (data.length < LIMIT) hasMore.value = false
    } finally {
        loading.value = false
    }
})

async function loadMore(ev: any) {
    const nextOffset = currentOffset + LIMIT
    try {
        const data = await transactionStore.fetchMoreGoalActivities(goalId, nextOffset)
        currentOffset = nextOffset
        if (data.length < LIMIT) hasMore.value = false
    } finally {
        ev.target.complete()
    }
}

async function showToast(message: string, color = 'danger') {
    const toast = await toastController.create({ message, duration: 2500, color, position: 'top' })
    await toast.present()
}

const handleTopUpAmountInput = (e: any) => {
    const raw = e.target.value.replace(/\D/g, '')
    topUpAmount.value = raw
    displayTopUpAmount.value = raw ? Number(raw).toLocaleString('id-ID') : ''
}

const handleTopUp = async () => {
    if (!topUpAmount.value) return

    if (sourceMode.value === 'wallet' && !activeWallet.value) {
        return showToast('No active wallet')
    }

    isSubmitting.value = true
    try {
        await goalStore.topUpGoal(goalId, {
            wallet_id: sourceMode.value === 'wallet' ? activeWallet.value!.id : null,
            amount: Number(topUpAmount.value),
        })

        if (sourceMode.value === 'wallet') {
            await walletStore.fetchWallets()
        }

        transactionStore.goalActivities = []
        hasMore.value = true
        currentOffset = 0
        const data = await transactionStore.fetchGoalActivities(goalId)
        if (data.length < LIMIT) hasMore.value = false

        showTopUpModal.value = false
        showToast('Top-up successful', 'success')
    } catch (err: any) {
        showToast(err?.response?.data?.message || 'Failed to top-up')
    } finally {
        isSubmitting.value = false
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

/* FAB */
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

/* Modal */
.modal-content {
    --background: var(--color-white);
}

.modal-wrapper {
    padding: 12px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* Sheet Handle */
.sheet-handle {
    width: 49px;
    height: 5px;
    background: var(--color-black-40);
    border-radius: 5px;
    margin: 8px auto 0;
    cursor: grab;
}

.modal-title {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

/* Source Toggle */
.source-toggle {
    display: flex;
    background: var(--color-bg-3);
    border-radius: 8px;
    padding: 4px;
    gap: 4px;
}

.toggle-btn {
    flex: 1;
    height: 36px;
    border: none;
    background: transparent;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-black-60);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    font-family: inherit;
}

.toggle-btn.active {
    background: var(--color-white);
    color: var(--color-black-100);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    font-weight: 600;
}

.modal-sub {
    font-size: 14px;
    color: var(--color-black-60);
    margin-top: -8px;
}

.manual-note {
    font-style: italic;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group ion-label {
    font-size: 16px;
    font-weight: 400;
    color: var(--color-black-100);
}

.input-wrapper {
    display: flex;
    align-items: center;
    background-color: var(--color-bg-4);
    border-radius: 8px;
}

.amount-wrapper {
    padding: 0;
    overflow: hidden;
    align-items: stretch;
}

.currency-label {
    padding: 0 12px;
    font-size: 16px;
    font-weight: 500;
    color: var(--color-black-100);
    background: var(--color-bg-3);
    border-radius: 8px 0 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    align-self: stretch;
}

.custom-input {
    --background: transparent;
    --color: var(--color-black-100);
    --placeholder-color: var(--color-black-60);
    --padding-start: 12px;
    --padding-top: 12px;
    --padding-bottom: 12px;
    font-size: 16px;
    font-weight: 300;
    flex: 1;
}

.amount-input {
    --padding-start: 12px;
}

.save-btn {
    --background: var(--color-black-40);
    --border-radius: 8px;
    --color: var(--color-white);
    --box-shadow: none;
    height: 40px;
    font-size: 16px;
    font-weight: 600;
    margin: 0;
}

.save-btn:not([disabled]) {
    --background: #3077E3;
}

.loading-wrapper {
    display: flex;
    justify-content: center;
    padding: 48px 0;
}

.empty-activities {
    text-align: center;
    padding: 32px 0;
    color: var(--color-black-60);
    font-size: 16px;
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 24px;
}
</style>

<style>
.topup-modal {
    --width: 100% !important;
    --max-width: 480px !important;
    --height: 550px !important;
    --border-radius: 24px 24px 0 0 !important;
}
</style>