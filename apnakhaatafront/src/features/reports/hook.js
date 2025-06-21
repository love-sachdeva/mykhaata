// src/hooks/reportsHooks.js
import { useQuery } from 'react-query'
import {
    fetchSalesOverview,
    fetchSalesTrends,
    fetchInventoryStatus,
    fetchConsumption, fetchItemTrend
} from '../../api/api'

// 1) Sales overview
export function useSalesOverview() {
    return useQuery(
        'reports:overview',
        fetchSalesOverview,
        { staleTime: 1000 * 60 * 5 }
    )
}

// 2) Sales trends (for a specific period)
export function useSalesTrend(period) {
    return useQuery(
        ['reports:trends', period],
        () => fetchSalesTrends(period),
        { staleTime: 1000 * 60 * 5 }
    )
}

// 3) Inventory status
export function useInventoryStatus() {
    return useQuery(
        ['reports', 'inventory'],
        fetchInventoryStatus,
        { staleTime: 5 * 60 * 1000 }
    )
}

// 4) Consumption (for a specific period)
export function useConsumptionTrend(period) {
    return useQuery(
        ['reports:consumption', period],
        () => fetchConsumption(period),
        { staleTime: 1000 * 60 * 5 }
    )
}

export function useTopItemTrends(period) {
    return useQuery(
        ['reports:topitems', period],
        () => fetchItemTrend(period),
        { staleTime: 1000 * 60 * 5 }
    )
}

