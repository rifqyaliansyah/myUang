import api from './api'

const goalService = {
    getGoals: () => api.get('/goals'),
    createGoal: (data: { name: string; target_amount: number; description: string }) =>
        api.post('/goals', data),
    updateGoal: (id: string, data: { name: string; target_amount: number; description: string }) =>
        api.put(`/goals/${id}`, data),
    deleteGoal: (id: string) => api.delete(`/goals/${id}`),
}

export default goalService