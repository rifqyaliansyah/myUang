<template>
    <ion-page>
        <AppHeader title="Goals" :show-back="false" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <!-- Goal Card -->
                <div class="goal-card" v-for="goal in goals" :key="goal.id">
                    <div class="goal-card-header">
                        <div class="goal-info">
                            <div class="goal-name">{{ goal.name }}</div>
                            <div class="goal-desc">{{ goal.description }}</div>
                        </div>
                        <ion-button fill="clear" class="goal-menu-btn" :id="`goal-menu-${goal.id}`">
                            <ion-icon :icon="ellipsisVertical" />
                        </ion-button>
                    </div>

                    <div class="goal-amount">IDR {{ formatAmount(goal.reached) }}</div>

                    <div class="goal-progress-wrapper">
                        <div class="goal-progress-bar">
                            <div class="goal-progress-fill" :style="{ width: progressPercent(goal) + '%' }" />
                        </div>
                    </div>

                    <div class="goal-reached">
                        IDR {{ formatAmount(goal.reached) }} of IDR {{ formatAmount(goal.limit) }} reached
                    </div>

                    <!-- Popover -->
                    <ion-popover :trigger="`goal-menu-${goal.id}`" side="bottom" alignment="end" trigger-action="click"
                        :dismiss-on-select="true" :show-backdrop="false" :style="popoverStyle" class="goal-popover">
                        <ion-content class="popover-content">
                            <div class="menu-item" @click="handleDetails(goal)">
                                <span>Details</span>
                            </div>
                            <div class="menu-divider"></div>
                            <div class="menu-item" @click="handleEdit(goal)">
                                <span>Edit</span>
                            </div>
                            <div class="menu-divider"></div>
                            <div class="menu-item menu-item--danger" @click="handleDelete(goal)">
                                <span>Delete</span>
                            </div>
                        </ion-content>
                    </ion-popover>
                </div>

                <!-- Add New Goal -->
                <!-- <div class="add-goal-btn" @click="handleAddGoal">
                    <span>Add New Goal</span>
                </div> -->

            </div>
        </ion-content>

        <!-- FAB Button -->
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button class="fab-btn" @click="handleAddGoal">
                <ion-icon :icon="addOutline" class="fab-icon" />
            </ion-fab-button>
        </ion-fab>

        <!-- Delete Confirmation Modal -->
        <ion-alert :is-open="showDeleteAlert" header="Are you sure to delete?"
            message="Your goal will be permanently deleted" :buttons="alertButtons"
            @didDismiss="showDeleteAlert = false" class="delete-alert" />
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonPage, IonContent, IonButton, IonIcon, IonPopover, IonAlert, IonFab, IonFabButton } from '@ionic/vue'
import AppHeader from './components/AppHeader.vue'
import { ellipsisVertical, addOutline } from 'ionicons/icons'

const goals = ref([
    { id: 1, name: 'Buy Jacket', description: 'New stylish jacket', reached: 200000, limit: 500000 },
    { id: 2, name: 'Vacation Bali', description: 'Holiday trip to Bali', reached: 1500000, limit: 5000000 },
])

const showDeleteAlert = ref(false)
const goalToDelete = ref<any>(null)

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
            if (goalToDelete.value) {
                goals.value = goals.value.filter(g => g.id !== goalToDelete.value.id)
                goalToDelete.value = null
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

const progressPercent = (goal: any) => {
    if (!goal.limit) return 0
    return Math.min((goal.reached / goal.limit) * 100, 100)
}

const handleDetails = (goal: any) => console.log('Details', goal.name)
const handleEdit = (goal: any) => console.log('Edit', goal.name)
const handleDelete = (goal: any) => {
    goalToDelete.value = goal
    showDeleteAlert.value = true
}
const handleAddGoal = () => console.log('Add new goal')
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

/* Goal Card */
.goal-card {
    background-color: var(--color-white);
    border: 1px solid var(--color-black-20);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    min-height: 160px;
    flex-direction: column;
    gap: 6px;
    box-sizing: border-box;
}

.goal-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 4px;
}

.goal-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
}

.goal-name {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

.goal-desc {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: -0.02em;
    color: var(--color-black-60);
}

.goal-menu-btn {
    --color: var(--color-black-100);
    --padding-start: 0;
    --padding-end: 0;
    margin: 0;
    height: 24px;
    width: 24px;
    flex-shrink: 0;
}

.goal-amount {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

/* Progress Bar */
.goal-progress-wrapper {
    margin: 4px 0;
}

.goal-progress-bar {
    width: 100%;
    height: 8px;
    background-color: var(--color-black-20);
    border-radius: 999px;
    overflow: hidden;
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
    color: var(--color-black-100);
    margin-top: 2px;
}

/* Add New Goal */
/* .add-goal-btn {
    background-color: var(--color-bg-3);
    border-radius: 12px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.add-goal-btn span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
} */

/* Popover */
.goal-popover {
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

<!-- Alert global style -->
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