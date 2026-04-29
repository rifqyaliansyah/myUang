import api from './api'

export interface CreateTransactionPayload {
    wallet_id: string
    pocket_id?: string | null
    type: 'income' | 'expense'
    amount: number
    note?: string
    date?: string
}

const transactionService = {
    getTransactions: (params?: {
        walletId?: string
        pocketId?: string
        goalId?: string
        month?: number
        year?: number
        type?: 'income' | 'expense' | 'goal_topup'
        limit?: number
        offset?: number
    }) => api.get('/transactions', { params }),

    getSummary: (walletId: string, month: number, year: number) =>
        api.get('/transactions/summary', { params: { walletId, month, year } }),

    createTransaction: (data: CreateTransactionPayload) =>
        api.post('/transactions', data),

    deleteTransaction: (id: string) =>
        api.delete(`/transactions/${id}`),
}

export default transactionService