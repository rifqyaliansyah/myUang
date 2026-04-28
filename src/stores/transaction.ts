import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import transactionService from '@/services/transaction.service'

export interface Transaction {
    id: string
    wallet_id: string
    pocket_id: string | null
    goal_id: string | null
    pocket_name: string | null
    pocket_emoji: string | null
    goal_name: string | null
    type: 'income' | 'expense' | 'goal_topup'
    amount: number
    note: string
    date: string
    created_at: string
}

export interface Summary {
    total_income: number
    total_expense: number
}

export const useTransactionStore = defineStore('transaction', () => {
    const transactions = ref<Transaction[]>([])
    const goalActivities = ref<Transaction[]>([])
    const pocketActivities = ref<Transaction[]>([])
    const summary = ref<Summary>({ total_income: 0, total_expense: 0 })
    const loading = ref(false)

    async function fetchTransactions(params?: {
        walletId?: string
        month?: number
        year?: number
        type?: 'income' | 'expense' | 'goal_topup'
    }) {
        loading.value = true
        try {
            const res = await transactionService.getTransactions(params)
            transactions.value = res.data.data
        } finally {
            loading.value = false
        }
    }

    async function fetchGoalActivities(goalId: string) {
        const res = await transactionService.getTransactions({ type: 'goal_topup' })
        goalActivities.value = res.data.data.filter((t: Transaction) => t.goal_id === goalId)
    }

    async function fetchPocketActivities(pocketId: string) {
        const res = await transactionService.getTransactions({ pocketId })
        pocketActivities.value = res.data.data
    }

    async function fetchSummary(walletId: string, month: number, year: number) {
        const res = await transactionService.getSummary(walletId, month, year)
        summary.value = res.data.data
    }

    async function createTransaction(data: Parameters<typeof transactionService.createTransaction>[0]) {
        const res = await transactionService.createTransaction(data)
        transactions.value.unshift(res.data.data)
        return res.data.data
    }

    async function deleteTransaction(id: string) {
        await transactionService.deleteTransaction(id)
        transactions.value = transactions.value.filter(t => t.id !== id)
    }

    const recentTransactions = computed(() => transactions.value.slice(0, 10))

    return {
        transactions,
        goalActivities,
        pocketActivities,
        summary,
        loading,
        recentTransactions,
        fetchTransactions,
        fetchGoalActivities,
        fetchPocketActivities,
        fetchSummary,
        createTransaction,
        deleteTransaction,
    }
})