<template>
    <ion-page>
        <AppHeader title="Notification Detail" :show-back="true" back-href="/notification" :show-menu="true"
            menu-trigger-id="notif-detail-menu" :menu-items="[
                { label: 'Delete', handler: handleDelete, danger: true },
            ]" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <div v-if="loading" class="loading-wrapper">
                    <ion-spinner name="crescent" />
                </div>

                <template v-else-if="notif">
                    <div class="notif-detail-card">
                        <div class="notif-detail-type">{{ typeLabel }}</div>
                        <div class="notif-detail-title">{{ notif.title }}</div>
                        <div class="notif-detail-time">{{ formatDateTime(notif.created_at) }}</div>
                        <div class="notif-detail-divider" />
                        <div class="notif-detail-body">{{ notif.body }}</div>
                    </div>
                </template>

            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { IonPage, IonContent, IonSpinner } from '@ionic/vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import { useNotificationStore } from '@/stores/notification'
import notificationService from '@/services/notification.service'
import type { Notification } from '@/stores/notification'

const route = useRoute()
const router = useRouter()
const notifStore = useNotificationStore()

const notifId = route.params.id as string
const loading = ref(false)
const notif = ref<Notification | null>(null)

const typeLabel = computed(() => {
    const map: Record<string, string> = {
        income: '💰 Income',
        pocket_warning: '⚠️ Budget Warning',
        pocket_over: '🚨 Over Budget',
        goal_progress: '🎯 Goal Progress',
        goal_complete: '🎉 Goal Complete',
    }
    return notif.value ? map[notif.value.type] ?? 'Notification' : ''
})

onMounted(async () => {
    loading.value = true
    try {
        const res = await notificationService.getNotificationDetail(notifId)
        notif.value = res.data.data
        if (!notif.value?.is_read) {
            await notifStore.markOneRead(notifId)
        }
    } finally {
        loading.value = false
    }
})

const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

const handleDelete = async () => {
    await notifStore.deleteOne(notifId)
    router.replace('/notification')
}
</script>

<style scoped>
.page-content {
    --background: var(--color-white);
}

.page-wrapper {
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
}

.notif-detail-type {
    font-size: 13px;
    font-weight: 600;
    color: #3077E3;
    letter-spacing: -0.01em;
}

.notif-detail-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--color-black-100);
    letter-spacing: -0.02em;
    line-height: 28px;
}

.notif-detail-time {
    font-size: 13px;
    font-weight: 400;
    color: var(--color-black-60);
    letter-spacing: -0.01em;
}

.notif-detail-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 4px 0;
}

.notif-detail-divider {
    height: 1px;
    background: var(--color-black-20);
    margin: 8px 0;
}

.notif-detail-body {
    font-size: 16px;
    font-weight: 400;
    color: var(--color-black-80);
    letter-spacing: -0.02em;
    line-height: 24px;
}

.loading-wrapper {
    display: flex;
    justify-content: center;
    padding: 48px 0;
}
</style>