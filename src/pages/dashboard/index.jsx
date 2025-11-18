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

  const StatCard = ({ title, value, icon: Icon, color, gradient }) => (
    <Card className="card-hover overflow-hidden relative">
      <div className={`absolute top-0 left-0 w-2 h-full ${gradient}`}></div>
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">{value || '-'}</h3>
        </div>
        <div className={`p-4 rounded-2xl ${gradient} shadow-lg animate-float`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-8 space-y-8 min-h-screen" dir="rtl">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-white drop-shadow-lg">لوحة التحكم</h2>
        <p className="text-white/80 text-lg">نظرة عامة على الأداء والإحصائيات</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="إجمالي المبيعات" 
          value={stats?.totalSales ? formatCurrency(stats.totalSales) : null} 
          icon={DollarSign} 
          color="blue"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard 
          title="صافي الأرباح" 
          value={stats?.totalProfit ? formatCurrency(stats.totalProfit) : null} 
          icon={ArrowRightLeft} 
          color="green"
          gradient="bg-gradient-to-br from-green-500 to-emerald-600"
        />
        <StatCard 
          title="الفواتير المسجلة" 
          value={stats?.invoiceCount} 
          icon={ShoppingCart} 
          color="purple"
          gradient="bg-gradient-to-br from-purple-500 to-pink-600"
        />
      </div>
      
      {/* Placeholder for future charts using Chart.js or Recharts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-[350px] card-hover overflow-hidden">
          <CardContent className="p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              مخطط المبيعات الشهري
            </h3>
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200">
              <p className="text-gray-400 font-medium">قريباً...</p>
            </div>
          </CardContent>
        </Card>
        <Card className="h-[350px] card-hover overflow-hidden">
          <CardContent className="p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
              توزيع الأرباح حسب الصنف
            </h3>
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-dashed border-green-200">
              <p className="text-gray-400 font-medium">قريباً...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;