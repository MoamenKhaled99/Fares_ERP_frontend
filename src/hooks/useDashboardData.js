// src/hooks/useDashboardData.js
import { useState, useEffect } from 'react';
import { dashboardService } from '@/services/dashboardService';

export const useDashboardData = (filters = {}) => {
    const [stats, setStats] = useState(null);
    const [salesByType, setSalesByType] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);

                const [statsResponse, salesResponse] = await Promise.all([
                    dashboardService.getStats(filters),
                    dashboardService.getSalesByType(),
                ]);
                
                const statsData = statsResponse.data?.data || statsResponse.data || {};
                const salesDataObj = salesResponse.data?.data || salesResponse.data || {};
                
                setStats(statsData);

                // Transform the sales object into an array for Recharts
                const salesArray = Object.entries(salesDataObj).map(([key, value]) => ({
                    name: key === 'silk_strip' ? 'شرائط' : key === 'iron' ? 'حدايد' : 'ويرات',
                    totalSales: value.quantity || 0,
                    totalProfit: value.profit || 0
                }));

                setSalesByType(salesArray);
                setError(null);
            } catch(e) { 
                console.error("Dashboard data failed:", e);
                setError(e.message || 'فشل تحميل البيانات');
                setStats({ 
                    totalProfit: 0,
                    totalSales: 0,
                    totalCost: 0,
                    totalStockValue: 0,
                    invoiceCount: 0, 
                    lowStockItems: [], 
                    recentInvoices: [] 
                });
                setSalesByType([]);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, [filters.day, filters.month, filters.year]); 

    return { stats, salesByType, loading, error };
};