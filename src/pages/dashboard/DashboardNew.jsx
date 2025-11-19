import React, { useState } from 'react';
import { DollarSign, ArrowRightLeft, ShoppingCart, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useDashboardData } from '@/hooks/useDashboardData'; // The new custom hook
import { StatCard } from '@/components/dashboard/StatCard'; // Reusable StatCard component
import { SalesChart } from '@/components/dashboard/SalesChart'; // Sales Chart component
import { RecentInvoices } from '@/components/dashboard/RecentInvoices'; // Recent Invoices table
import { InvoiceDetailsModal } from '@/components/invoices/InvoiceDetailsModal'; // Reusable Modal
import { MONTHS_ARABIC, CURRENT_MONTH_INDEX, CURRENT_YEAR, YEARS, getPeriodLabel } from '@/lib/dashboard.utils'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DashboardPageNew = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // State for Month/Year filtering
  const [selectedMonth, setSelectedMonth] = useState(String(CURRENT_MONTH_INDEX));
  const [selectedYear, setSelectedYear] = useState(String(CURRENT_YEAR));
  
  // ✅ Use the Custom Hook to fetch all data
  const { stats, salesByType, loading, error } = useDashboardData(selectedMonth, selectedYear);

  // Safely access data for rendering
  const lowStockItems = stats?.lowStockItems || [];
  const recentInvoices = stats?.recentInvoices || [];
  
  return (
    <div className="p-6 space-y-6 min-h-screen" dir="rtl">
      
      {/* Header and Filters (SRP: UI Controls) */}
      <div className="flex justify-between items-center space-y-2">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم</h2>
          <p className="text-muted-foreground">نظرة عامة على الأداء والإحصائيات</p>
        </div>
        
        {/* Month/Year Filter Group */}
        <div className="flex gap-3">
          <div className="w-32">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="الشهر" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS_ARABIC.map((month, index) => (
                    <SelectItem key={month} value={String(index)}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-24">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="السنة" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((year) => (
                    <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Error Alert */}
      {error && (
        <Card className="border-red-500 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              خطأ في تحميل البيانات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">{error}</p>
            <p className="text-xs text-red-500 mt-2">تأكد من تشغيل الخادم على المنفذ الصحيح</p>
          </CardContent>
        </Card>
      )}

      {/* Low Stock Alert */}
      {!loading && lowStockItems.length > 0 && (
        <Card className="border-orange-500 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-orange-700 text-lg">
              <AlertTriangle className="h-5 w-5" />
              تنبيه: مخزون منخفض
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1">
              {lowStockItems.map((item, idx) => (
                <div key={idx} className="text-sm text-orange-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-orange-600">({item.type === 'silk_strip' ? 'شريط' : item.type === 'iron' ? 'حدايد' : 'واير'})</span>
                  <span>- الكمية المتبقية: <span className="font-bold">{item.quantity}</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid (SRP: StatCard component) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          loading={loading}
          title="إجمالي قيمة المخزون" 
          value={stats?.totalInventoryBalance ? formatCurrency(stats.totalInventoryBalance) : '-'} 
          icon={DollarSign} 
          color="blue"
          footer="القيمة الإجمالية لجميع الأصناف بالمخزن"
        />
        <StatCard 
          loading={loading}
          title="صافي الأرباح" 
          value={stats?.totalProfit ? formatCurrency(stats.totalProfit) : '-'} 
          icon={ArrowRightLeft} 
          color="green"
          trend={true}
          footer={getPeriodLabel(selectedYear, selectedMonth)} 
        />
        <StatCard 
          loading={loading}
          title="الفواتير المسجلة" 
          value={stats?.invoiceCount || '-'} 
          icon={ShoppingCart} 
          color="purple"
          trend={true}
          footer="إجمالي عدد الفواتير المكتملة"
        />
      </div>

      {/* Charts Section (SRP: SalesChart component) */}
      <div className="grid gap-4 md:grid-cols-2">
        <SalesChart salesData={salesByType} loading={loading} />
      </div>

      {/* Recent Invoices Table (SRP: RecentInvoices component) */}
      <RecentInvoices 
        recentInvoices={recentInvoices} 
        loading={loading}
        setSelectedInvoice={setSelectedInvoice}
      />
      
      {/* Modal Renderer (SRP: Modal Display) */}
      {selectedInvoice && (
        <InvoiceDetailsModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default DashboardPageNew;