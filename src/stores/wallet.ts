import { defineStore } from 'pinia'
import { ref } from 'vue'
import walletService from '@/services/wallet.service'

export interface Wallet {
    id: string
    name: string
    balance: number
    is_active: boolean
}

export const useWalletStore = defineStore('wallet', () => {
    const wallets = ref<Wallet[]>([])
    const loading = ref(false)

    async function fetchWallets() {
        loading.value = true
        try {
            const res = await walletService.getWallets()
            wallets.value = res.data.data
        } finally {
            loading.value = false
        }
    }

    async function createWallet(data: { name: string; balance: number }) {
        const res = await walletService.createWallet(data)
        wallets.value.push(res.data.data)
    }

    async function updateWallet(id: string, data: { name: string; balance: number }) {
        const res = await walletService.updateWallet(id, data)
        const idx = wallets.value.findIndex(w => w.id === id)
        if (idx !== -1) wallets.value[idx] = res.data.data
    }

    async function deleteWallet(id: string) {
        await walletService.deleteWallet(id)
        wallets.value = wallets.value.filter(w => w.id !== id)
    }

    async function setActiveWallet(id: string) {
        await walletService.setActiveWallet(id)
        wallets.value = wallets.value.map(w => ({ ...w, is_active: w.id === id }))
    }

    return { wallets, loading, fetchWallets, createWallet, updateWallet, deleteWallet, setActiveWallet }
})