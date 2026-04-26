<template>
    <ion-page>
        <AppHeader title="Budgeting" :show-back="false" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <!-- Pocket Card -->
                <div class="pocket-card" v-for="pocket in pockets" :key="pocket.id">
                    <div class="pocket-card-header">
                        <span class="pocket-emoji">{{ pocket.emoji }}</span>
                        <ion-button fill="clear" class="pocket-menu-btn" :id="`pocket-menu-${pocket.id}`">
                            <ion-icon :icon="ellipsisVertical" />
                        </ion-button>
                    </div>

                    <div class="pocket-name">{{ pocket.name }}</div>
                    <div class="pocket-amount">IDR {{ formatAmount(pocket.used) }}</div>

                    <div class="pocket-progress-wrapper">
                        <div class="pocket-progress-bar">
                            <div class="pocket-progress-fill" :style="{ width: progressPercent(pocket) + '%' }" />
                        </div>
                    </div>

                    <div class="pocket-used">
                        IDR {{ formatAmount(pocket.used) }} of IDR {{ formatAmount(pocket.limit) }} used
                    </div>
                    <div class="pocket-desc">{{ pocket.description }}</div>

                    <!-- Popover -->
                    <ion-popover :trigger="`pocket-menu-${pocket.id}`" side="bottom" alignment="end"
                        trigger-action="click" :dismiss-on-select="true" :show-backdrop="false" :style="popoverStyle"
                        class="pocket-popover">
                        <ion-content class="popover-content">
                            <div class="menu-item" @click="handleDetails(pocket)">
                                <span>Details</span>
                            </div>
                            <div class="menu-divider"></div>
                            <div class="menu-item" @click="handleEdit(pocket)">
                                <span>Edit</span>
                            </div>
                            <div class="menu-divider"></div>
                            <div class="menu-item menu-item--danger" @click="handleDelete(pocket)">
                                <span>Delete</span>
                            </div>
                        </ion-content>
                    </ion-popover>
                </div>

                <!-- Add New Pocket -->
                <div class="add-pocket-btn" @click="handleAddPocket">
                    <span>Add New Pocket</span>
                </div>

            </div>
        </ion-content>

        <!-- FAB Button -->
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button class="fab-btn" @click="handleAddPocket">
                <ion-icon :icon="addOutline" class="fab-icon" />
            </ion-fab-button>
        </ion-fab>

        <!-- Delete Confirmation Modal -->
        <ion-alert :is-open="showDeleteAlert" header="Are you sure to delete?"
            message="Your pocket will be permanently deleted" :buttons="alertButtons"
            @didDismiss="showDeleteAlert = false" class="delete-alert" />
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonPage, IonContent, IonButton, IonIcon, IonPopover, IonAlert, IonFab, IonFabButton } from '@ionic/vue'
import AppHeader from './components/AppHeader.vue'
import { ellipsisVertical, addOutline } from 'ionicons/icons'

const pockets = ref([
    { id: 1, emoji: '😊', name: 'Food', used: 1000000, limit: 1500000, description: 'Money for food, snack, etc' },
    { id: 2, emoji: '⛽', name: 'Gas', used: 0, limit: 0, description: 'Oil pocket' },
])

const showDeleteAlert = ref(false)
const pocketToDelete = ref<any>(null)

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
            if (pocketToDelete.value) {
                pockets.value = pockets.value.filter(p => p.id !== pocketToDelete.value.id)
                pocketToDelete.value = null
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

const formatAmount = (value: number) => value.toLocaleString('id-ID')

const progressPercent = (pocket: any) => {
    if (!pocket.limit) return 0
    return Math.min((pocket.used / pocket.limit) * 100, 100)
}

const handleDetails = (pocket: any) => {
    console.log('Details', pocket.name)
}

const handleEdit = (pocket: any) => {
    console.log('Edit', pocket.name)
}

const handleDelete = (pocket: any) => {
    pocketToDelete.value = pocket
    showDeleteAlert.value = true
}

const handleAddPocket = () => {
    console.log('Add new pocket')
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

/* Pocket Card */
.pocket-card {
    background-color: var(--color-white);
    border: 1px solid var(--color-black-20);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-sizing: border-box;
}

.pocket-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
}

.pocket-emoji {
    font-size: 32px;
    line-height: 48px;
    letter-spacing: -0.02em;
}

.pocket-menu-btn {
    --color: var(--color-black-100);
    --padding-start: 0;
    --padding-end: 0;
    margin: 0;
    height: 24px;
    width: 24px;
}

.pocket-name {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

.pocket-amount {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

/* Progress Bar */
.pocket-progress-wrapper {
    margin: 4px 0;
}

.pocket-progress-bar {
    width: 100%;
    height: 8px;
    background-color: var(--color-black-20);
    border-radius: 999px;
    overflow: hidden;
}

.pocket-progress-fill {
    height: 100%;
    background-color: #3077E3;
    border-radius: 999px;
    transition: width 0.3s ease;
}

.pocket-used {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
    margin-top: 2px;
}

.pocket-desc {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: -0.02em;
    color: var(--color-black-60);
}

/* Add New Pocket */
.add-pocket-btn {
    background-color: var(--color-bg-3);
    border-radius: 12px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.add-pocket-btn span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

/* Popover */
.pocket-popover {
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

/* FAB Button */
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
</style>