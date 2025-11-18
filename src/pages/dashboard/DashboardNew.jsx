import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowRightLeft, ShoppingCart, TrendingUpIcon, Package } from 'lucide-react';
import { invoiceService } from '@/services/invoiceService';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardPageNew = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await invoiceService.getStats();
        setStats(data);
      } catch(e) { 
        console.error("Dashboard stats failed:", e);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
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

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="إجمالي المبيعات" 
          description="إجمالي المبيعات لهذا الشهر"
          value={stats?.totalSales ? formatCurrency(stats.totalSales) : '-'} 
          icon={DollarSign} 
          color="blue"
          trend={true}
          trendValue="+12.5%"
          footer="الإيرادات الكلية من جميع الفواتير"
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
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-purple-600 rounded-full"></div>
              مخطط المبيعات الشهري
            </CardTitle>
            <CardDescription>
              أداء المبيعات خلال الـ 6 أشهر الماضية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200">
              <div className="text-center space-y-2">
                <Package className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground font-medium">قريباً: مخطط المبيعات التفاعلي</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-1 h-6 bg-linear-to-b from-green-500 to-emerald-600 rounded-full"></div>
              توزيع الأرباح حسب الصنف
            </CardTitle>
            <CardDescription>
              تحليل الأرباح حسب فئات المنتجات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-dashed border-green-200">
              <div className="text-center space-y-2">
                <Package className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground font-medium">قريباً: مخطط دائري للأرباح</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPageNew;
