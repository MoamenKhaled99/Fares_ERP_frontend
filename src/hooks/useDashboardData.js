// src/hooks/useDashboardData.js (NEW FILE)
import { useState, useEffect } from 'react';
import { dashboardService } from '@/services/dashboardService';
import { getMonthPeriodDates } from '@/lib/dashboard.utils'; // Assuming this is imported from your new utils file

export const useDashboardData = (selectedMonth, selectedYear) => {
    const [stats, setStats] = useState(null);
    const [salesByType, setSalesByType] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                const { fromDate, toDate } = getMonthPeriodDates(
                    parseInt(selectedYear), 
                    parseInt(selectedMonth)
                );

                const [statsResponse, salesResponse, profitResponse] = await Promise.all([
                    dashboardService.getStats(),
                    dashboardService.getSalesByType(),
                    dashboardService.getProfitsByPeriod(fromDate, toDate) 
                ]);
                
                const statsData = statsResponse.data || {};
                const salesDataObj = salesResponse.data || {};
                const profitData = profitResponse.data || {};

                // OVERWRITE totalProfit with the filtered value
                statsData.totalProfit = profitData.totalProfit; 
                
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
    }, [selectedMonth, selectedYear]); 

    return { stats, salesByType, loading, error };
};