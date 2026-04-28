import api from './api'

const goalService = {
    getGoals: () => api.get('/goals'),

    createGoal: (data: { name: string; target_amount: number; description?: string; image?: File | null }) =>
        api.post('/goals', {
            name: data.name,
            target_amount: data.target_amount,
            description: data.description || '',
        }),

    updateGoal: (id: string, data: { name: string; target_amount: number; description?: string; image?: File | null }) =>
        api.put(`/goals/${id}`, {
            name: data.name,
            target_amount: data.target_amount,
            description: data.description || '',
        }),

    deleteGoal: (id: string) => api.delete(`/goals/${id}`),

    topUpGoal: (id: string, data: { wallet_id?: string | null; amount: number; note?: string }) =>
        api.post(`/goals/${id}/topup`, data),
}

export default goalService