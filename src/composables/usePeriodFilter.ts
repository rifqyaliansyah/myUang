import { ref, computed } from 'vue'

export type PeriodKey = 'all' | 'this_week' | 'this_month' | 'last_month' | 'this_year'

export interface PeriodOption {
    key: PeriodKey
    label: string
}

export const PERIOD_OPTIONS: PeriodOption[] = [
    { key: 'all', label: 'All Time' },
    { key: 'this_week', label: 'This Week' },
    { key: 'this_month', label: 'This Month' },
    { key: 'last_month', label: 'Last Month' },
    { key: 'this_year', label: 'This Year' },
]

export function usePeriodFilter() {
    const selectedPeriod = ref<PeriodKey>('this_month')
    const isDropdownOpen = ref(false)

    const selectedLabel = computed(() =>
        PERIOD_OPTIONS.find(p => p.key === selectedPeriod.value)?.label ?? 'This Month'
    )

    const periodParams = computed(() => {
        const now = new Date()
        switch (selectedPeriod.value) {
            case 'all':
                return {}
            case 'this_week': {
                const day = now.getDay()
                const diffToMon = (day === 0 ? -6 : 1 - day)
                const mon = new Date(now)
                mon.setDate(now.getDate() + diffToMon)
                const sun = new Date(mon)
                sun.setDate(mon.getDate() + 6)
                return {
                    startDate: mon.toISOString().split('T')[0],
                    endDate: sun.toISOString().split('T')[0],
                }
            }
            case 'this_month':
                return { month: now.getMonth() + 1, year: now.getFullYear() }
            case 'last_month': {
                const d = new Date(now.getFullYear(), now.getMonth() - 1, 1)
                return { month: d.getMonth() + 1, year: d.getFullYear() }
            }
            case 'this_year':
                return {
                    startDate: `${now.getFullYear()}-01-01`,
                    endDate: `${now.getFullYear()}-12-31`,
                }
            default:
                return {}
        }
    })

    return { selectedPeriod, selectedLabel, isDropdownOpen, periodParams, PERIOD_OPTIONS }
}