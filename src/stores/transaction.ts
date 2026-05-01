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

const LIMIT = 10

export const useTransactionStore = defineStore('transaction', () => {
    const transactions = ref<Transaction[]>([])
    const goalActivities = ref<Transaction[]>([])
    const pocketActivities = ref<Transaction[]>([])
    const summary = ref<Summary>({ total_income: 0, total_expense: 0 })
    const loading = ref(false)
    const loadingMore = ref(false)
    const hasMore = ref(true)
    const currentOffset = ref(0)
    const currentWalletId = ref<string | undefined>(undefined)
    const currentPeriodParams = ref<Record<string, any>>({})

    async function fetchTransactions(params?: {
        walletId?: string
        month?: number
        year?: number
        type?: 'income' | 'expense' | 'goal_topup'
        startDate?: string
        endDate?: string
    }) {
        loading.value = true
        hasMore.value = true
        currentOffset.value = 0
        currentWalletId.value = params?.walletId
        currentPeriodParams.value = params ?? {}

        try {
            const res = await transactionService.getTransactions({
                ...params,
                limit: LIMIT,
                offset: 0,
            })
            transactions.value = res.data.data
            if (res.data.data.length < LIMIT) hasMore.value = false
        } finally {
            loading.value = false
        }
    }

    async function fetchMoreTransactions() {
        if (loadingMore.value || !hasMore.value) return

        loadingMore.value = true
        const nextOffset = currentOffset.value + LIMIT

        try {
            const res = await transactionService.getTransactions({
                ...currentPeriodParams.value,
                limit: LIMIT,
                offset: nextOffset,
            })
            const newData: Transaction[] = res.data.data
            transactions.value = [...transactions.value, ...newData]
            currentOffset.value = nextOffset
            if (newData.length < LIMIT) hasMore.value = false
        } finally {
            loadingMore.value = false
        }
    }

    async function fetchGoalActivities(goalId: string) {
        const res = await transactionService.getTransactions({
            goalId,
            type: 'goal_topup',
            limit: 10,
            offset: 0,
        })
        goalActivities.value = res.data.data
        return res.data.data
    }

    async function fetchMoreGoalActivities(goalId: string, offset: number) {
        const res = await transactionService.getTransactions({
            goalId,
            type: 'goal_topup',
            limit: 10,
            offset,
        })
        goalActivities.value = [...goalActivities.value, ...res.data.data]
        return res.data.data
    }

    async function fetchPocketActivities(pocketId: string) {
        const res = await transactionService.getTransactions({ pocketId })
        pocketActivities.value = res.data.data
    }

    async function fetchSummary(walletId: string, params: {
        month?: number
        year?: number
        startDate?: string
        endDate?: string
    } = {}) {
        const res = await transactionService.getSummary(walletId, params)
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
        loadingMore,
        hasMore,
        recentTransactions,
        fetchTransactions,
        fetchMoreTransactions,
        fetchGoalActivities,
        fetchMoreGoalActivities,
        fetchPocketActivities,
        fetchSummary,
        createTransaction,
        deleteTransaction,
    }
})