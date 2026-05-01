import api from './api'

const buildFormData = (data: {
    name: string
    target_amount: number
    description?: string
    image?: File | null
}): FormData => {
    const form = new FormData()
    form.append('name', data.name)
    form.append('target_amount', String(data.target_amount))
    form.append('description', data.description || '')
    if (data.image) form.append('image', data.image)
    return form
}

const goalService = {
    getGoals: () => api.get('/goals'),

    createGoal: (data: { name: string; target_amount: number; description?: string; image?: File | null }) =>
        api.post('/goals', buildFormData(data)),

    updateGoal: (id: string, data: { name: string; target_amount: number; description?: string; image?: File | null }) =>
        api.put(`/goals/${id}`, buildFormData(data)),

    deleteGoal: (id: string) => api.delete(`/goals/${id}`),

    topUpGoal: (id: string, data: { wallet_id?: string | null; amount: number; note?: string }) =>
        api.post(`/goals/${id}/topup`, data),
}

export default goalService