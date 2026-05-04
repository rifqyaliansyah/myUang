<template>
    <ion-page>
        <AppHeader title="Wallet" :show-back="true" back-href="/" :show-menu="false" />
        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">
                <template v-if="walletStore.loading">
                    <div class="loading-wrapper"><ion-spinner name="crescent" /></div>
                </template>
                <template v-else>
                    <div class="wallet-card" :class="wallet.is_active ? 'wallet-card--active' : 'wallet-card--inactive'"
                        v-for="wallet in walletStore.wallets" :key="wallet.id">
                        <div class="wallet-card-header">
                            <span class="wallet-name">{{ wallet.name }}</span>
                            <ion-button fill="clear" class="wallet-menu-btn" :id="`wallet-menu-${wallet.id}`">
                                <ion-icon :icon="ellipsisVertical" />
                            </ion-button>
                        </div>
                        <div class="wallet-balance">IDR {{ formatAmount(wallet.balance) }}</div>
                        <div class="wallet-status" v-if="wallet.is_active">
                            <span>{{ t('wallet.used') }}</span>
                            <img src="/assets/icon/circle-check.svg" class="status-icon" />
                        </div>

                        <ion-popover :trigger="`wallet-menu-${wallet.id}`" side="bottom" alignment="end"
                            trigger-action="click" :dismiss-on-select="true" :show-backdrop="false"
                            :style="popoverStyle" class="wallet-popover">
                            <ion-content class="popover-content">
                                <div class="menu-item" @click="handleEdit(wallet)">
                                    <span>{{ t('wallet.edit') }}</span>
                                </div>
                                <template v-if="!wallet.is_active">
                                    <div class="menu-divider"></div>
                                    <div class="menu-item" @click="handleUseWallet(wallet)">
                                        <span>{{ t('wallet.useThis') }}</span>
                                    </div>
                                </template>
                                <div class="menu-divider"></div>
                                <div class="menu-item menu-item--danger" @click="handleDelete(wallet)">
                                    <span>{{ t('wallet.delete') }}</span>
                                </div>
                            </ion-content>
                        </ion-popover>
                    </div>

                    <div class="add-wallet-btn" @click="handleAddWallet">
                        <span>{{ t('wallet.addNew') }}</span>
                    </div>
                </template>
            </div>
        </ion-content>

        <ion-alert :is-open="showDeleteAlert" :header="t('wallet.deleteHeader')" :message="t('wallet.deleteMessage')"
            :buttons="alertButtons" @didDismiss="showDeleteAlert = false" class="delete-alert" />
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { IonPage, IonContent, IonButton, IonIcon, IonPopover, IonAlert, IonSpinner, toastController } from '@ionic/vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import { ellipsisVertical } from 'ionicons/icons'
import { useWalletStore } from '@/stores/wallet'
import type { Wallet } from '@/stores/wallet'

const router = useRouter()
const walletStore = useWalletStore()
const { t } = useI18n()

const showDeleteAlert = ref(false)
const walletToDelete = ref<Wallet | null>(null)

onMounted(async () => { await walletStore.fetchWallets() })

async function showToast(message: string, color = 'danger') {
    const toast = await toastController.create({ message, duration: 2500, color, position: 'top' })
    await toast.present()
}

const alertButtons = computed(() => [
    {
        text: 'No', role: 'cancel', cssClass: 'alert-btn-no',
        handler: () => { showDeleteAlert.value = false },
    },
    {
        text: 'Yes', cssClass: 'alert-btn-yes',
        handler: async () => {
            if (walletToDelete.value) {
                try {
                    await walletStore.deleteWallet(walletToDelete.value.id)
                    showToast(t('wallet.toastDeleted'), 'success')
                } catch {
                    showToast(t('wallet.toastDeleteFailed'))
                } finally {
                    walletToDelete.value = null
                    showDeleteAlert.value = false
                }
            }
        },
    },
])

const popoverStyle = computed(() => {
    const screenWidth = window.innerWidth
    const appWidth = 480
    const rightMargin = 8
    if (screenWidth <= 768) return ''
    const offset = -(screenWidth - appWidth) / 2 - rightMargin
    return `--offset-x: ${offset}px;`
})

const formatAmount = (value: number) => Number(value).toLocaleString('id-ID')
const handleEdit = (wallet: Wallet) => router.push(`/edit-wallet/${wallet.id}`)
const handleUseWallet = async (wallet: Wallet) => {
    try {
        await walletStore.setActiveWallet(wallet.id)
        await walletStore.fetchWallets()
    } catch {
        showToast(t('wallet.toastActiveFailed'))
    }
}
const handleDelete = (wallet: Wallet) => { walletToDelete.value = wallet; showDeleteAlert.value = true }
const handleAddWallet = () => router.push('/add-wallet')
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
    gap: 12px;
}

.loading-wrapper {
    display: flex;
    justify-content: center;
    padding-top: 48px;
}

/* Wallet Card Base */
.wallet-card {
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    min-height: 108px;
    box-sizing: border-box;
}

.wallet-card--active {
    background-color: #3077E3;
}

.wallet-card--inactive {
    background-color: var(--color-white);
    border: 1px solid var(--color-black-20);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.wallet-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.wallet-card--active .wallet-name {
    color: var(--color-white);
}

.wallet-card--inactive .wallet-name {
    color: var(--color-black-60);
}

.wallet-card--active .wallet-menu-btn {
    --color: var(--color-white);
}

.wallet-card--inactive .wallet-menu-btn {
    --color: var(--color-black-100);
}

.wallet-menu-btn {
    --padding-start: 0;
    --padding-end: 0;
    margin: 0;
    height: 24px;
    width: 24px;
}

.wallet-name {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.02em;
}

.wallet-card--active .wallet-balance {
    color: var(--color-white);
}

.wallet-card--inactive .wallet-balance {
    color: var(--color-black-100);
}

.wallet-balance {
    font-size: 32px;
    font-weight: 700;
    line-height: 48px;
    letter-spacing: -0.02em;
}

.wallet-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: var(--color-bg-2);
}

.status-icon {
    width: 24px;
    height: 24px;
    opacity: 0.9;
}

/* Add New Wallet */
.add-wallet-btn {
    background-color: var(--color-bg-3);
    border-radius: 12px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.add-wallet-btn span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

/* Popover */
.wallet-popover {
    --width: 160px;
    --border-radius: 16px;
    --box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.popover-content {
    --background: var(--color-white);
}

.menu-item {
    padding: 14px 16px;
    font-size: 15px;
    font-weight: 400;
    color: var(--color-black-100);
    cursor: pointer;
    letter-spacing: -0.01em;
    text-align: center;
}

.menu-item:active {
    background: var(--color-bg-4);
}

.menu-item--danger span {
    color: var(--color-red);
}

.menu-item--danger:active {
    background: #fff0f0;
}

.menu-divider {
    height: 0.9px;
    background: var(--color-black-20);
    margin: 0;
}
</style>

<style>
.delete-alert {
    --backdrop-opacity: 0.4;
    --border-radius: 8px;
    --min-width: 280px;
}

.delete-alert .alert-wrapper {
    border-radius: 8px;
    height: 148px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0;
}

.delete-alert .alert-head {
    padding: 16px 20px 2px;
}

.delete-alert .alert-title {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: var(--color-black-100);
    letter-spacing: -0.02em;
}

.delete-alert .alert-message {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: var(--color-black-60);
    padding: 2px 20px 0;
    letter-spacing: -0.02em;
}

.delete-alert .alert-button-group {
    display: flex;
    flex-direction: row;
    gap: 8px;
    padding: 12px 16px 16px;
}

.delete-alert .alert-btn-no {
    flex: 1;
    height: 48px !important;
    border: 1.5px solid #3077E3 !important;
    border-radius: 8px !important;
    color: #3077E3 !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    letter-spacing: -0.02em;
    text-transform: none !important;
    justify-content: center !important;
}

.delete-alert .alert-btn-yes {
    flex: 1;
    height: 48px !important;
    background: var(--color-red) !important;
    border-radius: 8px !important;
    color: #ffffff !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    letter-spacing: -0.02em;
    text-transform: none !important;
    justify-content: center !important;
}

.delete-alert .alert-button-inner {
    justify-content: center !important;
}
</style>