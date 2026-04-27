import { defineStore } from 'pinia'
import { ref } from 'vue'
import pocketService from '@/services/pocket.service'

export interface Pocket {
    id: string
    emoji: string
    name: string
    budget_limit: number
    used: number
    description: string
}

export const usePocketStore = defineStore('pocket', () => {
    const pockets = ref<Pocket[]>([])
    const loading = ref(false)

    async function fetchPockets() {
        loading.value = true
        try {
            const res = await pocketService.getPockets()
            pockets.value = res.data.data
        } finally {
            loading.value = false
        }
    }

    async function createPocket(data: { emoji: string; name: string; budget_limit: number; description: string }) {
        const res = await pocketService.createPocket(data)
        pockets.value.push(res.data.data)
    }

    async function updatePocket(id: string, data: { emoji: string; name: string; budget_limit: number; description: string }) {
        const res = await pocketService.updatePocket(id, data)
        const idx = pockets.value.findIndex(p => p.id === id)
        if (idx !== -1) pockets.value[idx] = res.data.data
    }

    async function deletePocket(id: string) {
        await pocketService.deletePocket(id)
        pockets.value = pockets.value.filter(p => p.id !== id)
    }

    return { pockets, loading, fetchPockets, createPocket, updatePocket, deletePocket }
})