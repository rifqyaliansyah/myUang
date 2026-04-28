<template>
    <ion-page>
        <AppHeader title="Notification" :show-back="true" back-href="/" :show-menu="true" menu-trigger-id="notif-menu"
            :menu-items="[
                { label: 'Mark all read', handler: markAllRead },
                { label: 'Remove all', handler: removeAll, danger: true },
            ]" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <div v-if="notifStore.loading" class="loading-wrapper">
                    <ion-spinner name="crescent" />
                </div>

                <template v-else>
                    <div v-if="notifStore.notifications.length === 0" class="empty-notif">
                        <p>No notifications yet</p>
                    </div>

                    <div v-else class="notif-list">
                        <ion-list class="notif-ion-list">
                            <ion-item-sliding v-for="notif in notifStore.notifications" :key="notif.id">
                                <ion-item class="notif-item" :class="{ 'notif-item--unread': !notif.is_read }"
                                    @click="goToDetail(notif.id)" lines="none">
                                    <div class="notif-info">
                                        <p class="notif-title" :class="{ 'notif-title--unread': !notif.is_read }">{{
                                            notif.title }}</p>
                                        <p class="notif-desc">{{ notif.body }}</p>
                                    </div>
                                    <div class="notif-right" slot="end">
                                        <span class="notif-time">{{ formatTime(notif.created_at) }}</span>
                                    </div>
                                </ion-item>

                                <ion-item-options side="end">
                                    <ion-item-option color="danger" @click="deleteOne(notif.id)">
                                        <ion-icon :icon="trashOutline" slot="icon-only" />
                                    </ion-item-option>
                                </ion-item-options>
                            </ion-item-sliding>
                        </ion-list>
                    </div>
                </template>

            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent, IonSpinner, IonList, IonItem, IonItemSliding, IonItemOptions, IonItemOption, IonIcon } from '@ionic/vue'
import { trashOutline } from 'ionicons/icons'
import AppHeader from './components/AppHeader.vue'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const notifStore = useNotificationStore()

onMounted(() => notifStore.fetchNotifications())

const markAllRead = async () => {
    await notifStore.markAllRead()
}

const removeAll = async () => {
    await notifStore.removeAll()
}

const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const goToDetail = (id: string) => {
    router.push(`/notification/${id}`)
}

const deleteOne = async (id: string) => {
    await notifStore.deleteOne(id)
}
</script>

<style scoped>
.page-content {
    --background: var(--color-white);
}

.page-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.notif-list {
    display: flex;
    flex-direction: column;
}

.notif-ion-list {
    padding: 0;
    background: transparent;
}

.notif-item {
    --background: var(--color-white);
    --padding-start: 16px;
    --padding-end: 16px;
    --padding-top: 16px;
    --padding-bottom: 16px;
    --inner-padding-end: 0;
    --min-height: 0;
    --border-width: 0;
    position: relative;
    cursor: pointer;
}

.notif-item::part(native) {
    align-items: center;
}

.notif-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 16px;
    right: 16px;
    height: 1px;
    background: var(--color-black-20);
    z-index: 1;
}

.notif-item--unread {
    --background: #EEF4FF;
    border-left: 4px solid #3077E3;
}

.notif-title--unread {
    color: #3077E3;
    font-weight: 700;
}

.notif-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    overflow: hidden;
}

.notif-title {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 24px;
    color: var(--color-black-100);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.notif-desc {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 24px;
    color: var(--color-black-60);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.notif-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;
    padding-left: 12px;
}

.notif-time {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 24px;
    color: var(--color-black-60);
    white-space: nowrap;
}

.loading-wrapper {
    display: flex;
    justify-content: center;
    padding: 48px 0;
}

.empty-notif {
    text-align: center;
    padding: 48px 0;
    color: var(--color-black-60);
    font-size: 16px;
}
</style>