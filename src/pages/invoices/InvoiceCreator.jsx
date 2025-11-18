import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { invoiceService } from '../../services/invoiceService';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../lib/utils';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import Label from '../../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

const InvoiceCreator = () => {
  const [lineItems, setLineItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter products by type to make selection easier
  const [selectedType, setSelectedType] = useState('irons');
  const { data: products } = useProducts(selectedType);
  
  const [selectedProductId, setSelectedProductId] = useState('');
  const [qty, setQty] = useState(1);
  const [sellPrice, setSellPrice] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddItem = () => {
    if(!selectedProductId || !qty || !sellPrice) return;
    
    const product = products.find(p => p.id === parseInt(selectedProductId));
    if (!product) return;

    setLineItems(prev => [...prev, {
      id: Date.now(), // Temporary ID for UI list
      backendType: selectedType === 'irons' ? 'حديد' : selectedType === 'wires' ? 'ويرات' : 'شرائط',
      productId: parseInt(selectedProductId),
      productName: product.وصف || 'منتج',
      quantity: parseInt(qty),
      buyPrice: product.سعر_الوحدة || 0,
      sellPrice: parseFloat(sellPrice)
    }]);
    
    // Reset fields
    setSelectedProductId('');
    setQty(1);
    setSellPrice('');
  };

  const handleSaveInvoice = async () => {
    if(!lineItems.length) return;
    setLoading(true);
    
    const payload = {
      تفاصيل: lineItems.map(item => ({
        النوع: item.backendType,
        المنتج_id: item.productId,
        الكمية: item.quantity,
        سعر_الشراء: item.buyPrice,
        سعر_البيع: item.sellPrice
      })),
      ملاحظات: notes
    };

    try {
      await invoiceService.create(payload);
      setLineItems([]);
      setNotes('');
      // In a desktop app, you might trigger a native print window here
      alert("تم حفظ الفاتورة بنجاح");
    } catch(e) {
      console.error(e);
      alert("فشل الحفظ: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = lineItems.reduce((sum, item) => sum + (item.quantity * item.sellPrice), 0);

  return (
    <div className="p-8 space-y-6 min-h-screen" dir="rtl">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-white drop-shadow-lg">فاتورة بيع جديدة</h2>
        <p className="text-white/80 text-lg">أنشئ فاتورة بيع جديدة وأضف المنتجات</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>إضافة منتجات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>القسم</Label>
              <select 
                className="w-full h-10 rounded-md border border-gray-300 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={selectedType} 
                onChange={e => setSelectedType(e.target.value)}
              >
                <option value="irons">الحديد</option>
                <option value="wires">الويرات</option>
                <option value="silk-strips">الشرائط الحريرية</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>المنتج</Label>
              <select 
                className="w-full h-10 rounded-md border border-gray-300 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={selectedProductId} 
                onChange={e => setSelectedProductId(e.target.value)}
              >
                <option value="">اختر...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.وصف} (رصيد: {p.وارد})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الكمية</Label>
                <Input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>سعر البيع</Label>
                <Input type="number" step="0.5" value={sellPrice} onChange={e => setSellPrice(e.target.value)} />
              </div>
            </div>
            <Button className="w-full mt-4" onClick={handleAddItem} disabled={!selectedProductId}>
              <Plus className="mr-2 h-4 w-4" /> إضافة للفاتورة
            </Button>
          </CardContent>
        </Card>

        {/* Invoice Preview Section */}
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
                      <td className="p-3">{item.sellPrice}</td>
                      <td className="p-3 font-bold">{formatCurrency(item.quantity * item.sellPrice)}</td>
                      <td className="p-3">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-500 h-8 w-8 hover:bg-red-50" 
                          onClick={() => setLineItems(lineItems.filter(i => i.id !== item.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {!lineItems.length && (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-400">الفاتورة فارغة</td></tr>
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
                ></textarea>
              </div>
              <Button size="lg" className="w-full bg-green-600 hover:bg-green-700" disabled={!lineItems.length} onClick={handleSaveInvoice} isLoading={loading}>
                <CheckCircle2 className="mr-2 h-5 w-5" /> حفظ وطباعة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceCreator;