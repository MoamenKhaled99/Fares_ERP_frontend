import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, AlertTriangle, TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/number.utils'; // ✅ CHANGED IMPORT
import { useDashboardData } from '@/hooks/useDashboardData';
import { StatCard } from '@/components/dashboard/StatCard';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { RecentInvoices } from '@/components/dashboard/RecentInvoices';
import { InvoiceDetailsModal } from '@/components/invoices/InvoiceDetailsModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DashboardPageNew = () => {
  const { t } = useTranslation();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // State for filtering
  const currentDate = new Date();
  const [filterType, setFilterType] = useState('month'); 
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  // Build filters object
  const filters = {};
  if (filterType === 'day') {
    filters.day = selectedDay;
    filters.month = selectedMonth;
    filters.year = selectedYear;
  } else if (filterType === 'month') {
    filters.month = selectedMonth;
    filters.year = selectedYear;
  } else if (filterType === 'year') {
    filters.year = selectedYear;
  }
  
  const { stats, salesByType, loading, error } = useDashboardData(filters);

  const lowStockItems = stats?.lowStockItems || [];
  const recentInvoices = stats?.recentInvoices || [];
  
  const MONTHS = [
    t('dashboard.january'), t('dashboard.february'), t('dashboard.march'), t('dashboard.april'),
    t('dashboard.may'), t('dashboard.june'), t('dashboard.july'), t('dashboard.august'),
    t('dashboard.september'), t('dashboard.october'), t('dashboard.november'), t('dashboard.december')
  ];
  
  const YEARS = Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - 5 + i);
  
  return (
    <div className="p-6 space-y-6 min-h-screen">
      
      {/* Header and Filters */}
      <div className="flex justify-between items-start space-y-2">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h2>
          <p className="text-muted-foreground">{t('dashboard.overview')}</p>
        </div>
        
        {/* Filter Controls */}
        <Card className="w-fit">
          <CardContent className="pt-6">
            <div className="flex gap-3 items-end">
              <div className="space-y-2">
                <Label>{t('dashboard.filterType')}</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('dashboard.all')}</SelectItem>
                    <SelectItem value="day">{t('dashboard.day')}</SelectItem>
                    <SelectItem value="month">{t('dashboard.month')}</SelectItem>
                    <SelectItem value="year">{t('dashboard.year')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {filterType === 'day' && (
                <div className="space-y-2">
                  <Label>{t('dashboard.day')}</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="31" 
                    value={selectedDay}
                    onChange={e => setSelectedDay(parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>
              )}
              
              {(filterType === 'day' || filterType === 'month') && (
                <div className="space-y-2">
                  <Label>{t('dashboard.month')}</Label>
                  <Select value={String(selectedMonth)} onValueChange={v => setSelectedMonth(parseInt(v))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((month, index) => (
                        <SelectItem key={index} value={String(index + 1)}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {filterType !== 'all' && (
                <div className="space-y-2">
                  <Label>{t('dashboard.year')}</Label>
                  <Select value={String(selectedYear)} onValueChange={v => setSelectedYear(parseInt(v))}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Error Alert */}
      {error && (
        <Card className="border-red-500 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              {t('dashboard.errorLoading')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">{error}</p>
            <p className="text-xs text-red-500 mt-2">{t('dashboard.checkServer')}</p>
          </CardContent>
        </Card>
      )}

      {/* Low Stock Alert */}
      {!loading && lowStockItems.length > 0 && (
        <Card className="border-orange-500 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-orange-700 text-lg">
              <AlertTriangle className="h-5 w-5" />
              {t('dashboard.lowStockAlert')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1">
              {lowStockItems.map((item, idx) => (
                <div key={idx} className="text-sm text-orange-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-orange-600">
                    ({item.type === 'silk_strip' ? t('dashboard.silkStrip') : 
                      item.type === 'iron' ? t('dashboard.iron') : t('dashboard.wire')})
                  </span>
                  <span>- {t('dashboard.remainingQuantity')}: <span className="font-bold">{formatNumber(item.quantity)}</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          loading={loading}
          title={t('dashboard.totalSales')}
          value={stats?.totalSales ? formatCurrency(stats.totalSales) : '-'} 
          icon={TrendingUp} 
          color="blue"
          footer={t('dashboard.totalSalesValue')}
        />
        <StatCard 
          loading={loading}
          title={t('dashboard.totalProfit')}
          value={stats?.totalProfit ? formatCurrency(stats.totalProfit) : '-'} 
          icon={DollarSign} 
          color="green"
          trend={true}
          footer={t('dashboard.netProfit')}
        />
        <StatCard 
          loading={loading}
          title={t('dashboard.totalCost')}
          value={stats?.totalCost ? formatCurrency(stats.totalCost) : '-'} 
          icon={TrendingDown} 
          color="orange"
          footer={t('dashboard.totalCostOfSales')}
        />
        <StatCard 
          loading={loading}
          title={t('dashboard.totalStockValue')}
          value={stats?.totalStockValue ? formatCurrency(stats.totalStockValue) : '-'} 
          icon={ShoppingCart} 
          color="purple"
          footer={t('dashboard.totalInventoryValue')}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <SalesChart salesData={salesByType} loading={loading} />
      </div>

      {/* Recent Invoices Table */}
      <RecentInvoices 
        recentInvoices={recentInvoices} 
        loading={loading}
        setSelectedInvoice={setSelectedInvoice}
      />
      
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