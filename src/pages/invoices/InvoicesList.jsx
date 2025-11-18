import React, { useState, useEffect } from 'react';
import { Eye, FileText, Loader2, AlertCircle, Plus } from 'lucide-react'; // Add Plus icon
import { invoiceService } from '../../services/invoiceService';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const InvoicesList = ({ navigate }) => { // Receive navigate prop
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await invoiceService.getAll();
      setInvoices(data);
    } catch (e) {
      console.error('Failed to load invoices:', e);
      setError('فشل تحميل الفواتير');
    } finally {
      setLoading(false);
    }
  };

  // ... Keep InvoiceDetailsModal code as is ...
  const InvoiceDetailsModal = ({ invoice, onClose }) => {
     // ... (Keep existing modal code)
     if (!invoice) return null;
     return (
       // ... existing modal JSX ...
       // (Just putting a placeholder here to save space, keep your existing modal code)
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
         <Card className="w-full max-w-3xl" onClick={e => e.stopPropagation()}>
            {/* ... content ... */}
            <Button onClick={onClose}>Close</Button>
         </Card>
       </div>
     );
  };

  return (
    <div className="p-6 space-y-6 min-h-screen" dir="rtl">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">قائمة الفواتير</h2>
          <p className="text-muted-foreground">عرض جميع الفواتير المسجلة</p>
        </div>
        {navigate && (
          <Button onClick={() => navigate('/invoices/new')} className="shadow-lg">
            <Plus className="ml-2 h-4 w-4" /> فاتورة جديدة
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد فواتير مسجلة</p>
              {navigate && (
                <Button variant="link" onClick={() => navigate('/invoices/new')} className="mt-2">
                  إنشاء أول فاتورة
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="border-b">
                  <tr>
                    <th className="p-3 font-medium text-gray-500">رقم الفاتورة</th>
                    <th className="p-3 font-medium text-gray-500">التاريخ</th>
                    <th className="p-3 font-medium text-gray-500">إجمالي الربح</th>
                    <th className="p-3 font-medium text-gray-500">عدد المنتجات</th>
                    <th className="p-3 font-medium text-gray-500">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium">#{invoice.id}</td>
                      <td className="p-3">
                        {new Date(invoice.invoiceDate).toLocaleDateString('ar-EG')}
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
          )}
        </CardContent>
      </Card>

      {selectedInvoice && (
        <InvoiceDetailsModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default InvoicesList;