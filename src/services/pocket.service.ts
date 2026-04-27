import api from './api'

const pocketService = {
    getPockets: () => api.get('/pockets'),
    createPocket: (data: { emoji: string; name: string; budget_limit: number; description: string }) =>
        api.post('/pockets', data),
    updatePocket: (id: string, data: { emoji: string; name: string; budget_limit: number; description: string }) =>
        api.put(`/pockets/${id}`, data),
    deletePocket: (id: string) => api.delete(`/pockets/${id}`),
}

export default pocketService