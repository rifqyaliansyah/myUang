import { defineStore } from 'pinia'
import { ref } from 'vue'
import notificationService from '@/services/notification.service'

export interface Notification {
    id: string
    title: string
    body: string
    type: 'pocket_warning' | 'pocket_over' | 'goal_progress' | 'goal_complete' | 'income'
    is_read: boolean
    created_at: string
}

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref<Notification[]>([])
    const loading = ref(false)

    async function fetchNotifications() {
        loading.value = true
        try {
            const res = await notificationService.getNotifications()
            notifications.value = res.data.data
        } finally {
            loading.value = false
        }
    }

    async function markAllRead() {
        await notificationService.markAllRead()
        notifications.value = notifications.value.map(n => ({ ...n, is_read: true }))
    }

    async function removeAll() {
        await notificationService.removeAll()
        notifications.value = []
    }

    async function markOneRead(id: string) {
        await notificationService.markOneRead(id)
        const notif = notifications.value.find(n => n.id === id)
        if (notif) notif.is_read = true
    }

    async function deleteOne(id: string) {
        await notificationService.deleteOne(id)
        notifications.value = notifications.value.filter(n => n.id !== id)
    }

    const unreadCount = () => notifications.value.filter(n => !n.is_read).length

    return { notifications, loading, fetchNotifications, markAllRead, removeAll, markOneRead, unreadCount, deleteOne }
})