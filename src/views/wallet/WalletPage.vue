<template>
    <ion-page>
        <AppHeader title="Wallet" :show-back="true" back-href="/home" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <!-- Wallet Card -->
                <div class="wallet-card" :class="wallet.isActive ? 'wallet-card--active' : 'wallet-card--inactive'"
                    v-for="wallet in wallets" :key="wallet.id">
                    <div class="wallet-card-header">
                        <span class="wallet-name">{{ wallet.name }}</span>
                        <ion-button fill="clear" class="wallet-menu-btn" :id="`wallet-menu-${wallet.id}`">
                            <ion-icon :icon="ellipsisVertical" />
                        </ion-button>
                    </div>
                    <div class="wallet-balance">IDR {{ formatAmount(wallet.balance) }}</div>
                    <div class="wallet-status" v-if="wallet.isActive">
                        <span>This wallet is currently used</span>
                        <img src="/assets/icon/circle-check.svg" class="status-icon" />
                    </div>

                    <!-- Popover -->
                    <ion-popover :trigger="`wallet-menu-${wallet.id}`" side="bottom" alignment="end"
                        trigger-action="click" :dismiss-on-select="true" :show-backdrop="false" :style="popoverStyle"
                        class="wallet-popover">
                        <ion-content class="popover-content">
                            <div class="menu-item" @click="handleEdit(wallet)">
                                <span>Edit</span>
                            </div>
                            <template v-if="!wallet.isActive">
                                <div class="menu-divider"></div>
                                <div class="menu-item" @click="handleUseWallet(wallet)">
                                    <span>Use this wallet</span>
                                </div>
                            </template>
                            <div class="menu-divider"></div>
                            <div class="menu-item menu-item--danger" @click="handleDelete(wallet)">
                                <span>Delete</span>
                            </div>
                        </ion-content>
                    </ion-popover>
                </div>

                <!-- Add New Wallet -->
                <div class="add-wallet-btn" @click="handleAddWallet">
                    <span>Add New Wallet</span>
                </div>

            </div>
        </ion-content>

        <!-- Delete Confirmation Modal -->
        <ion-alert :is-open="showDeleteAlert" header="Are you sure to delete?"
            message="Your wallet will be permanently deleted" :buttons="alertButtons"
            @didDismiss="showDeleteAlert = false" class="delete-alert" />
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonPage, IonContent, IonButton, IonIcon, IonPopover, IonAlert } from '@ionic/vue'
import AppHeader from '../components/AppHeader.vue'
import { ellipsisVertical } from 'ionicons/icons'

const wallets = ref([
    { id: 1, name: 'Main Wallet', balance: 5000000, isActive: true },
    { id: 2, name: 'Second Wallet', balance: 8000000, isActive: false },
])

const showDeleteAlert = ref(false)
const walletToDelete = ref<any>(null)

const alertButtons = computed(() => [
    {
        text: 'No',
        role: 'cancel',
        cssClass: 'alert-btn-no',
        handler: () => { showDeleteAlert.value = false },
    },
    {
        text: 'Yes',
        cssClass: 'alert-btn-yes',
        handler: () => {
            if (walletToDelete.value) {
                wallets.value = wallets.value.filter(w => w.id !== walletToDelete.value.id)
                walletToDelete.value = null
            }
            showDeleteAlert.value = false
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

const formatAmount = (value: number) => {
    return value.toLocaleString('id-ID')
}

const handleEdit = (wallet: any) => {
    console.log('Edit', wallet.name)
}

const handleUseWallet = (wallet: any) => {
    wallets.value = wallets.value.map(w => ({ ...w, isActive: w.id === wallet.id }))
}

const handleDelete = (wallet: any) => {
    walletToDelete.value = wallet
    showDeleteAlert.value = true
}

const handleAddWallet = () => {
    console.log('Add new wallet')
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
    gap: 12px;
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

.menu-divider {
    height: 0.9px;
    background: var(--color-black-20);
    margin: 0;
}
</style>

<!-- Alert global style (tidak bisa scoped) -->
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
    width: 147.5px !important;
    height: 48px !important;
    border: 1.5px solid #3077E3 !important;
    border-radius: 8px !important;
    color: #3077E3 !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    letter-spacing: -0.02em;
    line-height: 24px;
    text-transform: none !important;
    justify-content: center !important;
}

.delete-alert .alert-btn-yes {
    flex: 1;
    width: 147.5px !important;
    height: 48px !important;
    background: #3077E3 !important;
    border-radius: 8px !important;
    color: #ffffff !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    letter-spacing: -0.02em;
    line-height: 24px;
    text-transform: none !important;
    justify-content: center !important;
}

.delete-alert .alert-button-inner {
    justify-content: center !important;
}
</style>