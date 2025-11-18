import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowRightLeft, ShoppingCart } from 'lucide-react';
import { invoiceService } from '../../services/invoiceService';
import { formatCurrency } from '../../lib/utils';
import { Card, CardContent } from '../../components/ui/card';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await invoiceService.getStats();
        setStats(data);
      } catch(e) { 
        console.error("Dashboard stats failed:", e);
      }
    };
    loadStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold">{value || '-'}</h3>
        </div>
        <div className={`p-3 rounded-full bg-${color}-50 text-${color}-600`}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="إجمالي المبيعات" 
          value={stats?.totalSales ? formatCurrency(stats.totalSales) : null} 
          icon={DollarSign} 
          color="blue" 
        />
        <StatCard 
          title="صافي الأرباح" 
          value={stats?.totalProfit ? formatCurrency(stats.totalProfit) : null} 
          icon={ArrowRightLeft} 
          color="green" 
        />
        <StatCard 
          title="الفواتير المسجلة" 
          value={stats?.invoiceCount} 
          icon={ShoppingCart} 
          color="purple" 
        />
      </div>
      
      {/* Placeholder for future charts using Chart.js or Recharts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-[300px] flex items-center justify-center bg-gray-50 border-dashed">
          <p className="text-gray-400">مخطط المبيعات الشهري</p>
        </Card>
        <Card className="h-[300px] flex items-center justify-center bg-gray-50 border-dashed">
          <p className="text-gray-400">توزيع الأرباح حسب الصنف</p>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;