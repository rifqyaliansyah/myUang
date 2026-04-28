<template>
    <ion-page>
        <AppHeader title="Add Money Record" :show-back="true" back-href="/" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <!-- Name -->
                <div class="form-group">
                    <ion-label>Name</ion-label>
                    <div class="input-wrapper">
                        <ion-input v-model="name" type="text" placeholder="Name" class="custom-input" />
                    </div>
                </div>

                <!-- Type -->
                <div class="form-group">
                    <ion-label>Type</ion-label>
                    <div class="radio-wrapper">
                        <label class="radio-option">
                            <input type="radio" v-model="type" value="income" />
                            <span>Income</span>
                        </label>
                        <label class="radio-option">
                            <input type="radio" v-model="type" value="expense" />
                            <span>Expense</span>
                        </label>
                    </div>
                </div>

                <!-- Date -->
                <div class="form-group">
                    <ion-label>Date</ion-label>
                    <div class="input-wrapper">
                        <ion-input v-model="date" type="date" class="custom-input date-input" />
                    </div>
                </div>

                <!-- Amount -->
                <div class="form-group">
                    <ion-label>Amount</ion-label>
                    <div class="input-wrapper amount-wrapper">
                        <span class="currency-label">IDR</span>
                        <ion-input v-model="displayAmount" type="text" inputmode="numeric" placeholder="0"
                            class="custom-input amount-input" @ionInput="handleAmountInput" />
                    </div>
                </div>

                <!-- Choose Pocket -->
                <div class="form-group" v-if="type === 'expense'">
                    <ion-label>Choose Pocket (Optional)</ion-label>
                    <div class="input-wrapper select-wrapper">
                        <select v-model="pocket" class="custom-select">
                            <option value="">Select pocket</option>
                            <option v-for="p in pocketStore.pockets" :key="p.id" :value="p.id">
                                {{ p.emoji }} {{ p.name }}
                            </option>
                        </select>
                        <ion-icon :icon="chevronDownOutline" class="select-chevron" />
                    </div>
                </div>

                <!-- Description -->
                <div class="form-group">
                    <ion-label>Description (Optional)</ion-label>
                    <div class="input-wrapper textarea-wrapper">
                        <textarea v-model="description" placeholder="Description (Optional)" class="custom-textarea"
                            rows="4" />
                    </div>
                </div>

                <!-- Attachment -->
                <div class="form-group">
                    <div class="attachment-wrapper" @click="addAttachment">
                        <ion-icon :icon="documentOutline" class="attachment-icon" />
                        <span class="attachment-label">Add Attachment</span>
                    </div>
                </div>

                <!-- Save Button -->
                <div class="footer">
                    <ion-button expand="block" class="save-btn" :disabled="!name || !date || !amount || isSubmitting"
                        @click="handleSave">
                        <ion-spinner v-if="isSubmitting" name="crescent" style="width:20px;height:20px;" />
                        <span v-else>Save</span>
                    </ion-button>
                </div>

            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { IonPage, IonContent, IonLabel, IonInput, IonButton, IonIcon, IonSpinner, toastController } from '@ionic/vue'
import { useRouter } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import { chevronDownOutline, documentOutline } from 'ionicons/icons'
import { useWalletStore } from '@/stores/wallet'
import { usePocketStore } from '@/stores/pocket'
import { useTransactionStore } from '@/stores/transaction'

const router = useRouter()
const walletStore = useWalletStore()
const pocketStore = usePocketStore()
const transactionStore = useTransactionStore()

const name = ref('')
const type = ref<'income' | 'expense'>('income')
const date = ref('')
const amount = ref('')
const displayAmount = ref('')
const pocket = ref('')
const description = ref('')
const isSubmitting = ref(false)

const activeWallet = computed(() => walletStore.wallets.find(w => w.is_active))

const handleAmountInput = (e: any) => {
    const raw = e.target.value.replace(/\D/g, '')
    amount.value = raw
    displayAmount.value = raw ? Number(raw).toLocaleString('id-ID') : ''
}

onMounted(async () => {
    const style = document.createElement('style')
    style.innerHTML = `
        .date-input input[type="date"]::-webkit-calendar-picker-indicator {
            filter: brightness(0);
            opacity: 1;
            cursor: pointer;
        }
    `
    document.head.appendChild(style)

    if (walletStore.wallets.length === 0) await walletStore.fetchWallets()
    if (pocketStore.pockets.length === 0) await pocketStore.fetchPockets()
})

async function showToast(message: string, color = 'danger') {
    const toast = await toastController.create({ message, duration: 2500, color, position: 'top' })
    await toast.present()
}

const addAttachment = () => {
    console.log('Add attachment')
}

const handleSave = async () => {
    if (!activeWallet.value) return showToast('No active wallet')
    if (!name.value || !date.value || !amount.value) return

    isSubmitting.value = true
    try {
        await transactionStore.createTransaction({
            wallet_id: activeWallet.value.id,
            pocket_id: type.value === 'expense' && pocket.value ? pocket.value : null,
            type: type.value,
            amount: Number(amount.value),
            note: name.value,
            date: date.value,
        })
        await walletStore.fetchWallets()
        await pocketStore.fetchPockets()
        showToast('Record saved', 'success')
        router.back()
    } catch (err: any) {
        showToast(err?.response?.data?.message || 'Failed to save record')
    } finally {
        isSubmitting.value = false
    }
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
    padding: 16px 16px;
    gap: 16px;
}

/* Form Group */
.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group ion-label {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

/* Input */
.input-wrapper {
    display: flex;
    align-items: center;
    background-color: var(--color-bg-4);
    border-radius: 8px;
    padding: 0 12px;
}

.custom-input {
    --background: transparent;
    --color: var(--color-black-100);
    --placeholder-color: var(--color-black-60);
    --padding-start: 0;
    --padding-end: 0;
    --padding-top: 12px;
    --padding-bottom: 12px;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    letter-spacing: -0.02em;
    flex: 1;
}

/* Radio */
.radio-wrapper {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 12px 0;
}

.radio-option {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 400;
    color: var(--color-black-100);
    cursor: pointer;
}

.radio-option input[type="radio"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    border: 1px solid var(--color-black-40);
    border-radius: 50%;
    background-color: #ffffff;
    position: relative;
    flex-shrink: 0;
    transition: border-color 0.15s ease;
}

.radio-option input[type="radio"]:checked {
    border-color: var(--color-black-40);
    background-color: #ffffff;
}

.radio-option input[type="radio"]:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #3077E3;
}

/* Amount */
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

.amount-input {
    --padding-start: 12px;
    --padding-end: 0;
    --padding-top: 12px;
    --padding-bottom: 12px;
}

/* Select */
.select-wrapper {
    position: relative;
    padding-right: 36px;
}

.custom-select {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 16px;
    font-weight: 300;
    color: var(--color-black-100);
    padding: 12px 0;
    appearance: none;
    cursor: pointer;
}

.select-chevron {
    position: absolute;
    right: 12px;
    font-size: 16px;
    color: var(--color-black-100);
    pointer-events: none;
}

/* Textarea */
.textarea-wrapper {
    padding: 12px;
    align-items: flex-start;
}

.custom-textarea {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 16px;
    font-weight: 300;
    color: var(--color-black-100);
    resize: none;
    font-family: inherit;
    line-height: 24px;
    letter-spacing: -0.02em;
}

.custom-textarea::placeholder {
    color: var(--color-black-60);
}

/* Attachment */
.attachment-wrapper {
    background: var(--color-bg-4);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 16px;
    height: 56px;
    box-sizing: border-box;
    border: 1.5px dashed var(--color-black-40);
    border-radius: 8px;
    cursor: pointer;
}

.attachment-icon {
    font-size: 20px;
    color: var(--color-black-60);
}

.attachment-label {
    font-size: 16px;
    font-weight: 400;
    color: var(--color-black-60);
}

.save-btn {
    --background: var(--color-black-40);
    --background-activated: var(--color-primary-1);
    --border-radius: 8px;
    --color: var(--color-white);
    --box-shadow: none;
    height: 40px;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: -0.02em;
}

.save-btn:not([disabled]) {
    --background: #3077E3;
}
</style>