<template>
    <ion-page>
        <AppHeader :title="isEdit ? t('walletForm.titleEdit') : t('walletForm.titleAdd')" :show-back="true"
            back-href="/wallet" :show-menu="false" />
        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">
                <div class="form-content">
                    <div class="form-group">
                        <ion-label>{{ t('walletForm.walletName') }}</ion-label>
                        <div class="input-wrapper">
                            <ion-input v-model="walletName" type="text" :placeholder="t('walletForm.walletName')"
                                class="custom-input" />
                        </div>
                    </div>
                    <div class="form-group">
                        <ion-label>{{ t('walletForm.amount') }}</ion-label>
                        <div class="input-wrapper amount-wrapper">
                            <span class="currency-label">IDR</span>
                            <ion-input v-model="displayAmount" type="text" inputmode="numeric" placeholder="0"
                                class="custom-input amount-input" @ionInput="handleAmountInput" />
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <ion-button expand="block" class="save-btn" :disabled="!walletName || loading"
                        @click="handleSubmit">
                        <ion-spinner v-if="loading" name="crescent" />
                        <span v-else>{{ isEdit ? t('walletForm.btnEdit') : t('walletForm.btnAdd') }}</span>
                    </ion-button>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { IonPage, IonContent, IonLabel, IonInput, IonButton, IonSpinner, toastController } from '@ionic/vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import { useWalletStore } from '@/stores/wallet'

const route = useRoute()
const router = useRouter()
const walletStore = useWalletStore()
const { t } = useI18n()

const isEdit = computed(() => route.name === 'Edit Wallet')
const walletName = ref('')
const amount = ref('')
const displayAmount = ref('')
const loading = ref(false)

onMounted(async () => {
    if (isEdit.value) {
        if (walletStore.wallets.length === 0) await walletStore.fetchWallets()
        const wallet = walletStore.wallets.find(w => w.id === route.params.id as string)
        if (wallet) {
            walletName.value = wallet.name
            amount.value = String(wallet.balance)
            displayAmount.value = Number(wallet.balance).toLocaleString('id-ID')
        } else {
            showToast(t('walletForm.toastNotFound'))
            router.replace('/wallet')
        }
    }
})

async function showToast(message: string, color = 'danger') {
    const toast = await toastController.create({ message, duration: 2500, color, position: 'top' })
    await toast.present()
}

const handleAmountInput = (e: any) => {
    const raw = e.target.value.replace(/\D/g, '')
    amount.value = raw
    displayAmount.value = raw ? Number(raw).toLocaleString('id-ID') : ''
}

const handleSubmit = async () => {
    loading.value = true
    try {
        const payload = { name: walletName.value, balance: amount.value ? Number(amount.value) : 0 }
        if (isEdit.value) {
            await walletStore.updateWallet(route.params.id as string, payload)
            showToast(t('walletForm.toastUpdated'), 'success')
        } else {
            await walletStore.createWallet(payload)
            showToast(t('walletForm.toastAdded'), 'success')
        }
        router.replace('/wallet')
    } catch {
        showToast(t('walletForm.toastFailed'))
    } finally {
        loading.value = false
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