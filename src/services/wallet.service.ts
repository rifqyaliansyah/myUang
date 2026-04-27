import api from './api'

const walletService = {
    getWallets: () => api.get('/wallets'),
    createWallet: (data: { name: string; balance: number }) => api.post('/wallets', data),
    updateWallet: (id: string, data: { name: string; balance: number }) => api.put(`/wallets/${id}`, data),
    deleteWallet: (id: string) => api.delete(`/wallets/${id}`),
    setActiveWallet: (id: string) => api.patch(`/wallets/${id}/active`),
}

export default walletService