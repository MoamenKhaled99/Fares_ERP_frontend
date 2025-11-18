import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowRightLeft, ShoppingCart, TrendingUpIcon, Package, AlertTriangle } from 'lucide-react';
import { dashboardService } from '@/services/dashboardService';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DashboardPageNew = () => {
  const [stats, setStats] = useState(null);
  const [salesByType, setSalesByType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsResponse, salesResponse] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getSalesByType()
        ]);
        
        // Extract the actual data payload from the API response
        // backend returns: { success: true, data: { ... }, ... }
        const statsData = statsResponse.data || {};
        const salesDataObj = salesResponse.data || {};

        console.log('Processed Stats Data:', statsData);
        console.log('Processed Sales Data:', salesDataObj);
        
        setStats(statsData);

        // Transform the sales object into an array for Recharts
        // Backend returns object: { silk_strip: { quantity: 0, ... }, iron: { ... } }
        // Recharts needs array: [{ name: 'Silk', quantity: 0 }, ...]
        const salesArray = Object.entries(salesDataObj).map(([key, value]) => ({
          name: key === 'silk_strip' ? 'شرائط' : key === 'iron' ? 'حديد' : 'ويرات',
          totalSales: value.quantity || 0, // mapping quantity to sales for chart
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
  }, []);

  const StatCard = ({ title, description, value, icon: Icon, trend, trendValue, footer, color = "blue" }) => (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full bg-${color}-500`}></div>
      <CardHeader className="relative pb-2">
        <CardDescription className="text-sm font-medium">{title}</CardDescription>
        <CardTitle className="text-3xl font-bold tabular-nums">
          {loading ? <Skeleton className="h-9 w-32" /> : value}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {trend && trendValue && (
          <div className="absolute right-4 top-20">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              {trendValue}
            </Badge>
          </div>
        )}
      </CardHeader>
      {footer && (
        <CardFooter className="flex-col items-start gap-1 text-sm pt-0">
          <div className="text-muted-foreground">{footer}</div>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className="p-6 space-y-6 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم</h2>
        <p className="text-muted-foreground">نظرة عامة على الأداء والإحصائيات</p>
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
      {!loading && stats?.lowStockItems && stats.lowStockItems.length > 0 && (
        <Card className="border-orange-500 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-orange-700 text-lg">
              <AlertTriangle className="h-5 w-5" />
              تنبيه: مخزون منخفض
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1">
              {stats.lowStockItems.map((item, idx) => (
                <div key={idx} className="text-sm text-orange-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-orange-600">({item.type === 'silk_strip' ? 'شريط' : item.type === 'iron' ? 'حديد' : 'واير'})</span>
                  <span>- الكمية المتبقية: <span className="font-bold">{item.quantity}</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Note: Total Revenue logic might need backend adjustment if not directly provided, 
            here we can estimate or just show Profit if Revenue isn't in stats */}
        <StatCard 
          title="إجمالي قيمة المخزون" 
          description="قيمة البضاعة الحالية"
          value={stats?.totalInventoryBalance ? formatCurrency(stats.totalInventoryBalance) : '-'} 
          icon={DollarSign} 
          color="blue"
          footer="القيمة الإجمالية لجميع الأصناف بالمخزن"
        />
        <StatCard 
          title="صافي الأرباح" 
          description="الأرباح المحققة"
          value={stats?.totalProfit ? formatCurrency(stats.totalProfit) : '-'} 
          icon={ArrowRightLeft} 
          color="green"
          trend={true}
          trendValue="+8.3%"
          footer="الفرق بين سعر الشراء والبيع"
        />
        <StatCard 
          title="الفواتير المسجلة" 
          description="عدد الفواتير"
          value={stats?.invoiceCount || '-'} 
          icon={ShoppingCart} 
          color="purple"
          trend={true}
          trendValue="+5.2%"
          footer="إجمالي عدد الفواتير المكتملة"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              أداء المبيعات حسب الصنف
            </CardTitle>
            <CardDescription>
              مقارنة الكميات المباعة والأرباح لكل قسم
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : salesByType && salesByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByType}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Legend />
                  <Bar dataKey="totalSales" fill="#3b82f6" name="الكمية المباعة" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="totalProfit" fill="#10b981" name="صافي الربح" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <div className="text-center space-y-2">
                  <Package className="h-12 w-12 text-slate-300 mx-auto" />
                  <p className="text-slate-400 font-medium">لا توجد بيانات مبيعات حتى الآن</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>آخر الفواتير</CardTitle>
          <CardDescription>آخر 5 فواتير تم إنشاؤها</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : stats?.recentInvoices && stats.recentInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="border-b bg-slate-50/50">
                  <tr>
                    <th className="p-3 font-medium text-slate-500">رقم الفاتورة</th>
                    <th className="p-3 font-medium text-slate-500">التاريخ</th>
                    <th className="p-3 font-medium text-slate-500">صافي الربح</th>
                    <th className="p-3 font-medium text-slate-500">عدد الأصناف</th>
                    <th className="p-3 font-medium text-slate-500">الملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-medium">#{invoice.id}</td>
                      <td className="p-3 text-slate-600">
                        {new Date(invoice.invoiceDate).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="p-3 font-bold text-emerald-600">
                        {formatCurrency(invoice.totalProfit)}
                      </td>
                      <td className="p-3 text-slate-600">
                        {invoice.details ? invoice.details.length : '-'}
                      </td>
                      <td className="p-3 text-slate-500 truncate max-w-[200px]">
                        {invoice.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">
              لا توجد فواتير حديثة
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPageNew;