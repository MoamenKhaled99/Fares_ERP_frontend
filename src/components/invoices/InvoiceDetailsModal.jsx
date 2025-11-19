// src/components/invoices/InvoiceDetailsModal.jsx (NEW FILE)
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { getProductTypeLabel } from '@/lib/product.utils';

export const InvoiceDetailsModal = ({ invoice, onClose }) => {
    if (!invoice) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <Card
                className="w-full max-w-3xl animate-in fade-in zoom-in duration-200"
                onClick={e => e.stopPropagation()}
            >
                <CardHeader className="border-b">
                    <CardTitle className="flex justify-between items-center">
                        <span>تفاصيل الفاتورة #{invoice.id}</span>
                        <Button variant="ghost" size="icon" onClick={onClose}>×</Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">التاريخ:</span>
                                <p className="font-medium">{new Date(invoice.invoiceDate).toLocaleDateString('ar-EG')}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">إجمالي الربح:</span>
                                <p className="font-bold text-green-600">{formatCurrency(invoice.totalProfit)}</p>
                            </div>
                        </div>

                        {invoice.notes && (
                            <div className="text-sm">
                                <span className="text-gray-500">الملاحظات:</span>
                                <p className="mt-1 text-gray-700">{invoice.notes}</p>
                            </div>
                        )}

                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-right">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-3 font-medium text-gray-500">المنتج</th>
                                        <th className="p-3 font-medium text-gray-500">النوع</th>
                                        <th className="p-3 font-medium text-gray-500">الكمية</th>
                                        <th className="p-3 font-medium text-gray-500">سعر الشراء</th>
                                        <th className="p-3 font-medium text-gray-500">سعر البيع</th>
                                        <th className="p-3 font-medium text-gray-500">الربح</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.details && invoice.details.map((detail, idx) => (
                                        <tr key={idx} className="border-t">
                                            <td className="p-3">#{detail.productId}</td>
                                            <td className="p-3">
                                                <Badge variant="outline">
                                                    {getProductTypeLabel(detail.productType)}
                                                </Badge>
                                            </td>
                                            <td className="p-3">{detail.quantity}</td>
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