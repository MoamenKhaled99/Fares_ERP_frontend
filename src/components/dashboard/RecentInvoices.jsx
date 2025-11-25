import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatNumber, formatDate } from '@/lib/number.utils'; // ✅ Import
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export const RecentInvoices = ({ recentInvoices, loading, setSelectedInvoice }) => {
    const { t } = useTranslation();

    return (
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentInvoices')}</CardTitle>
            <CardDescription>{t('dashboard.recentInvoicesDesc')}</CardDescription>
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
                      <th className="p-3 font-medium text-slate-500">{t('invoices.invoiceNumber')}</th>
                      <th className="p-3 font-medium text-slate-500">{t('invoices.date')}</th>
                      <th className="p-3 font-medium text-slate-500">{t('dashboard.netProfit')}</th>
                      <th className="p-3 font-medium text-slate-500">{t('invoices.itemsCount')}</th>
                      <th className="p-3 font-medium text-slate-500">{t('invoices.notes')}</th>
                      <th className="p-3 font-medium text-slate-500">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-medium">#{formatNumber(invoice.id)}</td>
                        <td className="p-3 text-slate-600">
                          {formatDate(invoice.invoiceDate)} {/* ✅ Fixed */}
                        </td>
                        <td className="p-3 font-bold text-emerald-600">
                          {formatCurrency(invoice.totalProfit)}
                        </td>
                        <td className="p-3 text-slate-600">
                          {formatNumber(invoice.details ? invoice.details.length : 0)}
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
                            {t('invoices.view')}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500">
                {t('dashboard.noRecentInvoices')}
              </div>
            )}
          </CardContent>
        </Card>
    );
};