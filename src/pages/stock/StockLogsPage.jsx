import React, { useState, useEffect } from 'react';
import { stockService } from '@/services/stockService';
import { Loader2, AlertCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const StockLogsPage = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovements = async () => {
      try {
        const data = await stockService.getAllMovements();
        setMovements(data);
        setError(null);
      } catch (e) {
        console.error('Failed to load stock movements:', e);
        setError('فشل تحميل حركات المخزون');
      } finally {
        setLoading(false);
      }
    };
    loadMovements();
  }, []);

  const getProductTypeArabic = (type) => {
    switch (type) {
      case 'iron': return 'حديد';
      case 'wire': return 'واير';
      case 'silk_strip': return 'شريط حريري';
      default: return type;
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen" dir="rtl">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">سجل حركات المخزون</h2>
        <p className="text-muted-foreground">عرض جميع حركات الوارد والصادر بالتفصيل</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : movements.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد حركات مخزون مسجلة</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="border-b">
                  <tr>
                    <th className="p-3 font-medium text-gray-500">التاريخ</th>
                    <th className="p-3 font-medium text-gray-500">نوع المنتج</th>
                    <th className="p-3 font-medium text-gray-500">الكمية</th>
                    <th className="p-3 font-medium text-gray-500">السعر</th>
                    <th className="p-3 font-medium text-gray-500">النوع</th>
                    <th className="p-3 font-medium text-gray-500">الملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement) => (
                    <tr key={movement.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        {new Date(movement.movementDate).toLocaleString('ar-EG')}
                      </td>
                      <td className="p-3">{getProductTypeArabic(movement.productType)}</td>
                      <td className="p-3 font-medium">{movement.quantity}</td>
                      <td className="p-3">{movement.purchasePrice}</td>
                      <td className="p-3">
                        <Badge variant={movement.movementType === 'in' ? 'default' : 'destructive'} 
                               className={movement.movementType === 'in' ? 'bg-green-500' : 'bg-red-500'}>
                          {movement.movementType === 'in' ? 'وارد' : 'صادر'}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-500 max-w-xs truncate">{movement.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StockLogsPage;