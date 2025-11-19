// src/components/dashboard/SalesChart.jsx (NEW FILE)
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const SalesChart = ({ salesData, loading }) => {
    return (
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
            ) : salesData && salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
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
    );
};