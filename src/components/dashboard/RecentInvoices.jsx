// src/components/dashboard/RecentInvoices.jsx (NEW FILE)
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export const RecentInvoices = ({ recentInvoices, loading, setSelectedInvoice }) => {
    return (
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
            ) : recentInvoices && recentInvoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="border-b bg-slate-50/50">
                    <tr>
                      <th className="p-3 font-medium text-slate-500">رقم الفاتورة</th>
                      <th className="p-3 font-medium text-slate-500">التاريخ</th>
                      <th className="p-3 font-medium text-slate-500">صافي الربح</th>
                      <th className="p-3 font-medium text-slate-500">عدد الأصناف</th>
                      <th className="p-3 font-medium text-slate-500">الملاحظات</th>
                      <th className="p-3 font-medium text-slate-500">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInvoices.map((invoice) => (
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
                        <td className="p-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedInvoice(invoice)} 
                          >
                            <Eye className="h-4 w-4 ml-2" />
                            عرض التفاصيل
                          </Button>
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
    );
};