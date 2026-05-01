import api from './api'

export interface CreateTransactionPayload {
    wallet_id: string
    pocket_id?: string | null
    type: 'income' | 'expense'
    amount: number
    note?: string
    date?: string
    image?: File | null
}

const transactionService = {
    getTransactions: (params?: {
        walletId?: string
        pocketId?: string
        goalId?: string
        month?: number
        year?: number
        type?: 'income' | 'expense' | 'goal_topup' | string
        startDate?: string
        endDate?: string
        limit?: number
        offset?: number
    }) => api.get('/transactions', { params }),

    getSummary: (walletId: string, params: {
        month?: number
        year?: number
        startDate?: string
        endDate?: string
    }) => api.get('/transactions/summary', { params: { walletId, ...params } }),

    createTransaction: (data: CreateTransactionPayload) => {
        const form = new FormData()
        form.append('wallet_id', data.wallet_id)
        form.append('type', data.type)
        form.append('amount', String(data.amount))
        if (data.pocket_id) form.append('pocket_id', data.pocket_id)
        if (data.note) form.append('note', data.note)
        if (data.date) form.append('date', data.date)
        if (data.image) form.append('image', data.image)
        return api.post('/transactions', form)
    },

    deleteTransaction: (id: string) =>
        api.delete(`/transactions/${id}`),
}

export default transactionService