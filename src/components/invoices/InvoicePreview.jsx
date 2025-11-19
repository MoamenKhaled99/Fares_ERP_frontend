import React from 'react';
import { Trash2, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const InvoicePreview = ({
  lineItems,
  onRemoveItem,
  notes,
  setNotes,
  onSave,
  saving
}) => {
  const totalAmount = lineItems.reduce((sum, item) => 
    sum + (item.quantity * item.sellPrice), 0
  );

  return (
    <Card className="lg:col-span-2 flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>معاينة الفاتورة</span>
          <span className="text-blue-600">{formatCurrency(totalAmount)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="rounded-md border flex-1 overflow-hidden mb-4">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-medium text-gray-500">المنتج</th>
                <th className="p-3 font-medium text-gray-500">الكمية</th>
                <th className="p-3 font-medium text-gray-500">السعر</th>
                <th className="p-3 font-medium text-gray-500">المجموع</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{item.productName}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">{formatCurrency(item.sellPrice)}</td>
                  <td className="p-3 font-bold">
                    {formatCurrency(item.quantity * item.sellPrice)}
                  </td>
                  <td className="p-3">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-red-500 h-8 w-8 hover:bg-red-50" 
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {!lineItems.length && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    الفاتورة فارغة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="space-y-4 mt-auto">
          <div className="space-y-2">
            <Label>ملاحظات</Label>
            <textarea 
              className="w-full min-h-[80px] rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل ملاحظات إضافية هنا..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
          <Button 
            size="lg" 
            className="w-full bg-green-600 hover:bg-green-700" 
            disabled={!lineItems.length || saving} 
            onClick={onSave}
          >
            {saving ? 'جاري الحفظ...' : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" /> حفظ الفاتورة
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
