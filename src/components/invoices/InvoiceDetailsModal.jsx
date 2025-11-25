import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber, formatDate } from '@/lib/number.utils'; // ✅ Import
import { getProductTypeLabel } from '@/lib/product.utils';

export const InvoiceDetailsModal = ({ invoice, onClose }) => {
    const { t } = useTranslation();
    if (!invoice) return null;

    const renderProductName = (detail) => {
        if (detail.productName && detail.productName.trim() !== '') return detail.productName;
        const id = formatNumber(detail.productId);
        switch (detail.productType) {
            case 'silk_strip':
                return `${t('dashboard.silkStrip')} #${id}`;
            case 'iron':
                return `${t('dashboard.iron')} #${id}`;
            case 'wire':
                return `${t('dashboard.wire')} #${id}`;
            default:
                return '—';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <Card
                className="w-full max-w-3xl animate-in fade-in zoom-in duration-200"
                onClick={e => e.stopPropagation()}
            >
                <CardHeader className="border-b">
                    <CardTitle className="flex justify-between items-center">
                        <span>{t('invoices.details')} #{formatNumber(invoice.id)}</span>
                        <Button variant="ghost" size="icon" onClick={onClose}>×</Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">{t('invoices.date')}:</span>
                                <p className="font-medium">{formatDate(invoice.invoiceDate)}</p> {/* ✅ Fixed */}
                            </div>
                            <div>
                                <span className="text-gray-500">{t('invoices.totalProfit')}:</span>
                                <p className="font-bold text-green-600">{formatCurrency(invoice.totalProfit)}</p>
                            </div>
                        </div>
                        
                        {/* ... rest of the file remains similar, ensuring formatNumber is used for quantities ... */}
                        
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-right">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-3 font-medium text-gray-500">{t('invoices.product')}</th>
                                        <th className="p-3 font-medium text-gray-500">{t('stock.type')}</th>
                                        <th className="p-3 font-medium text-gray-500">{t('invoices.quantity')}</th>
                                        <th className="p-3 font-medium text-gray-500">{t('invoices.purchasePrice')}</th>
                                        <th className="p-3 font-medium text-gray-500">{t('invoices.sellingPrice')}</th>
                                        <th className="p-3 font-medium text-gray-500">{t('invoices.profit')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.details && invoice.details.map((detail, idx) => (
                                        <tr key={idx} className="border-t">
                                            <td className="p-3 font-medium">{renderProductName(detail)}</td>
                                            <td className="p-3">
                                                <Badge variant="outline">
                                                    {getProductTypeLabel(detail.productType)}
                                                </Badge>
                                            </td>
                                            <td className="p-3">{formatNumber(detail.quantity)}</td>
                                            <td className="p-3">{formatCurrency(detail.purchasePrice)}</td>
                                            <td className="p-3">{formatCurrency(detail.sellingPrice)}</td>
                                            <td className="p-3 font-semibold text-green-600">
                                                {formatCurrency(detail.profit)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};