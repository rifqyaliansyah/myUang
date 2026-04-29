import api from './api'

const notificationService = {
    getNotifications: (params?: { limit?: number; offset?: number }) =>
        api.get('/notifications', { params }),
    getNotificationDetail: (id: string) => api.get(`/notifications/${id}`),
    markOneRead: (id: string) => api.patch(`/notifications/${id}/read`),
    markAllRead: () => api.patch('/notifications/mark-all-read'),
    deleteOne: (id: string) => api.delete(`/notifications/${id}`),
    removeAll: () => api.delete('/notifications/remove-all'),
}

export default notificationService