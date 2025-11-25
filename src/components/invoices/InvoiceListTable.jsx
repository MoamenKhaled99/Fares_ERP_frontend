import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, FileText, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatNumber, formatDate, formatTime } from '@/lib/number.utils'; // ✅ Import new utils

export function InvoiceListTable({
  invoices,
  loading,
  navigate,
  setSelectedInvoice,
}) {
  const { t } = useTranslation();

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
            <p className="text-gray-500">{t('invoices.noInvoices')}</p>
            {navigate && (
              <Button
                variant="link"
                onClick={() => navigate("/invoices/new")}
                className="mt-2"
              >
                {t('invoices.createFirst')}
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
                <th className="p-3 font-medium text-gray-500">{t('invoices.invoiceNumber')}</th>
                <th className="p-3 font-medium text-gray-500">{t('invoices.date')}</th>
                <th className="p-3 font-medium text-gray-500">{t('invoices.time')}</th>
                <th className="p-3 font-medium text-gray-500">{t('invoices.totalProfit')}</th>
                <th className="p-3 font-medium text-gray-500">{t('invoices.itemsCount')}</th>
                <th className="p-3 font-medium text-gray-500">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 font-medium">#{formatNumber(invoice.id)}</td>
                  <td className="p-3">
                    {formatDate(invoice.invoiceDate)} {/* ✅ Fixed */}
                  </td>
                  <td className="p-3">
                    {formatTime(invoice.invoiceDate)} {/* ✅ Fixed */}
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-green-600">
                      {formatCurrency(invoice.totalProfit)}
                    </span>
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary">
                      {formatNumber(invoice.details?.length || 0)} {t('invoices.itemUnit')}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      <Eye className="h-4 w-4 ml-2" />
                      {t('invoices.viewDetails')}
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