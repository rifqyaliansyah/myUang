import { defineStore } from 'pinia'
import { ref } from 'vue'
import goalService from '@/services/goal.service'

export interface Goal {
    id: string
    name: string
    target_amount: number
    reached: number
    description: string
    image_url: string | null
}

export const useGoalStore = defineStore('goal', () => {
    const goals = ref<Goal[]>([])
    const loading = ref(false)

    async function fetchGoals() {
        loading.value = true
        try {
            const res = await goalService.getGoals()
            goals.value = res.data.data
        } finally {
            loading.value = false
        }
    }

    async function createGoal(data: Parameters<typeof goalService.createGoal>[0]) {
        const res = await goalService.createGoal(data)
        goals.value.push(res.data.data)
    }

    async function updateGoal(id: string, data: Parameters<typeof goalService.updateGoal>[1]) {
        const res = await goalService.updateGoal(id, data)
        const idx = goals.value.findIndex(g => g.id === id)
        if (idx !== -1) goals.value[idx] = res.data.data
    }

    async function deleteGoal(id: string) {
        await goalService.deleteGoal(id)
        goals.value = goals.value.filter(g => g.id !== id)
    }

    async function topUpGoal(id: string, data: { wallet_id?: string | null; amount: number; note?: string }) {
        const res = await goalService.topUpGoal(id, data)
        const idx = goals.value.findIndex(g => g.id === id)
        if (idx !== -1) goals.value[idx] = res.data.data
        return res.data.data
    }

    return { goals, loading, fetchGoals, createGoal, updateGoal, deleteGoal, topUpGoal }
})