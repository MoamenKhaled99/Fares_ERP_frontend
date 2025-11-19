import React, { useState, useEffect } from 'react';
import { Eye, FileText, Loader2, AlertCircle, Plus } from 'lucide-react';
import { invoiceService } from '../../services/invoiceService';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input'; // ✅ IMPORTED: For Date Input
import { Label } from '../../components/ui/label';  // ✅ IMPORTED: For Date Input Label

const InvoicesList = ({ navigate }) => { 
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  const [fromDate, setFromDate] = useState(''); // ✅ NEW STATE for filter start date
  const [toDate, setToDate] = useState('');     // ✅ NEW STATE for filter end date

  useEffect(() => {
    loadInvoices();
  }, [fromDate, toDate]); // ✅ EFFECT: Re-run when filter dates change

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (fromDate) params.from_date = fromDate;
      if (toDate) {
          // ✅ FIX: Adjust toDate to include the entire day up to the start of the next day.
          // The backend controller/repository needs the next day's date for 'lte'.
          let adjustedToDate = new Date(toDate);
          adjustedToDate.setDate(adjustedToDate.getDate() + 1);
          params.to_date = adjustedToDate.toISOString().split('T')[0];
      }
      
      // Fetch data using the service which now accepts parameters
      const data = await invoiceService.getAll(params); // Assuming getAll accepts params now
      setInvoices(data);
      setError(null);
    } catch (e) {
      console.error('Failed to load invoices:', e);
      setError('فشل تحميل الفواتير');
    } finally {
      setLoading(false);
    }
  };

  const InvoiceDetailsModal = ({ invoice, onClose }) => {
    if (!invoice) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <Card className="w-full max-w-3xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
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
                            {detail.productType === 'iron' ? 'حديد' : 
                             detail.productType === 'wire' ? 'سلك' : 'شريط'}
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

  const handleClearFilters = () => {
    setFromDate('');
    setToDate('');
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

      {/* ✅ NEW: Date Range Filter UI */}
      <div className="flex items-center gap-4 border p-4 rounded-lg bg-white shadow-sm">
        <h3 className="text-md font-medium text-gray-700 shrink-0">تصفية التاريخ:</h3>
        
        <div className="flex items-center gap-2">
          <Label>من:</Label>
          <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-48" />
        </div>
        
        <div className="flex items-center gap-2">
          <Label>إلى:</Label>
          <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-48" />
        </div>
        
        <Button onClick={handleClearFilters} variant="ghost" size="sm">مسح</Button>
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
                    <th className="p-3 font-medium text-gray-500">الساعة</th>
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
                        {new Date(invoice.invoiceDate).toLocaleTimeString('ar-EG')}
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