// src/components/invoices/InvoiceListTable.jsx (NEW FILE)
import React from 'react';
import { Eye, FileText, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

export function InvoiceListTable({
  invoices,
  loading,
  navigate,
  setSelectedInvoice,
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد فواتير مسجلة</p>
            {navigate && (
              <Button
                variant="link"
                onClick={() => navigate("/invoices/new")}
                className="mt-2"
              >
                إنشاء أول فاتورة
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="border-b">
              <tr>
                <th className="p-3 font-medium text-gray-500">رقم الفاتورة</th>
                <th className="p-3 font-medium text-gray-500">التاريخ</th>
                <th className="p-3 font-medium text-gray-500">الساعة</th>
                <th className="p-3 font-medium text-gray-500">إجمالي الربح</th>
                <th className="p-3 font-medium text-gray-500">عدد المنتجات</th>
                <th className="p-3 font-medium text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 font-medium">#{invoice.id}</td>
                  <td className="p-3">
                    {new Date(invoice.invoiceDate).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="p-3">
                    {new Date(invoice.invoiceDate).toLocaleTimeString("ar-EG")}
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-green-600">
                      {formatCurrency(invoice.totalProfit)}
                    </span>
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary">
                      {invoice.details?.length || 0} منتج
                    </Badge>
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
      </CardContent>
    </Card>
  );
}