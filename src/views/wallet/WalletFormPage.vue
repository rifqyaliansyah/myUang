<template>
    <ion-page>
        <AppHeader :title="isEdit ? 'Edit Wallet' : 'Add Wallet'" :show-back="true" back-href="/wallet"
            :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <div class="form-content">
                    <!-- Wallet Name -->
                    <div class="form-group">
                        <ion-label>Wallet Name</ion-label>
                        <div class="input-wrapper">
                            <ion-input v-model="walletName" type="text" placeholder="Wallet Name"
                                class="custom-input" />
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
                </div>

                <!-- Button -->
                <div class="footer">
                    <ion-button expand="block" class="save-btn" :disabled="!walletName || !amount"
                        @click="handleSubmit">
                        {{ isEdit ? 'Edit Wallet' : 'Add Wallet' }}
                    </ion-button>
                </div>

            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { IonPage, IonContent, IonLabel, IonInput, IonButton } from '@ionic/vue'
import { useRoute } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'

const route = useRoute()

const isEdit = computed(() => route.name === 'Edit Wallet')

const walletName = ref('')
const amount = ref('')
const displayAmount = ref('')

// Simulasi data static untuk edit
const staticWallets = [
    { id: 1, name: 'Main Wallet', balance: 5000000 },
    { id: 2, name: 'Second Wallet', balance: 8000000 },
]

onMounted(() => {
    if (isEdit.value) {
        const id = Number(route.params.id)
        const wallet = staticWallets.find(w => w.id === id)
        if (wallet) {
            walletName.value = wallet.name
            amount.value = String(wallet.balance)
            displayAmount.value = wallet.balance.toLocaleString('id-ID')
        }
    }
})

const handleAmountInput = (e: any) => {
    const raw = e.target.value.replace(/\D/g, '')
    amount.value = raw
    displayAmount.value = raw ? Number(raw).toLocaleString('id-ID') : ''
}

const handleSubmit = () => {
    if (isEdit.value) {
        console.log('Update Wallet', { id: route.params.id, walletName: walletName.value, amount: amount.value })
    } else {
        console.log('Add Wallet', { walletName: walletName.value, amount: amount.value })
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
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
}

.form-content {
    flex: 1;
    display: flex;
    flex-direction: column;
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

/* Footer */
.footer {
    padding-top: 16px;
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
    margin: 0;
}

.save-btn:not([disabled]) {
    --background: #3077E3;
}
</style>