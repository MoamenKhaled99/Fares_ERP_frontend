import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { invoiceService } from '../../services/invoiceService';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { toast } from "sonner"; //

const InvoiceCreator = () => {
  const [lineItems, setLineItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  
  // Maps frontend selection to backend endpoints
  const [selectedType, setSelectedType] = useState('irons');
  const { data: products, refresh: refreshProducts } = useProducts(selectedType); //
  
  const [selectedProductId, setSelectedProductId] = useState('');
  const [qty, setQty] = useState(1);
  const [sellPrice, setSellPrice] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddItem = () => {
    if(!selectedProductId || !qty || !sellPrice) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }
    
    const product = products.find(p => p.id === parseInt(selectedProductId));
    if (!product) return;

    // Validation: Check stock locally (optional but good UX)
    if (parseInt(qty) > product.totalQuantity) {
       toast.warning("تنبيه: الكمية المطلوبة أكبر من الرصيد المتاح");
    }

    // Map the API path type to the 'productType' expected by the Invoice schema
    let backendProductType = '';
    switch (selectedType) {
        case 'irons': backendProductType = 'iron'; break;
        case 'wires': backendProductType = 'wire'; break;
        case 'silk-strips': backendProductType = 'silk_strip'; break;
        default: backendProductType = 'iron';
    }

    setLineItems(prev => [...prev, {
      id: Date.now(),
      productType: backendProductType,
      productId: parseInt(selectedProductId),
      productName: product.description || product.name || 'منتج',
      quantity: parseInt(qty),
      buyPrice: product.unitPrice || 0,
      sellPrice: parseFloat(sellPrice)
    }]);
    
    // Reset fields
    setSelectedProductId('');
    setQty(1);
    setSellPrice('');
    toast.success("تم إضافة المنتج للقائمة");
  };

  const handleSaveInvoice = async () => {
    if(!lineItems.length) return;
    setSubmitting(true);
    
    // Construct payload matching Invoice validation rules
    const payload = {
      notes: notes,
      details: lineItems.map(item => ({
        productType: item.productType,
        productId: item.productId,
        quantity: item.quantity,
        sellingPrice: item.sellPrice,
        purchasePrice: item.buyPrice 
      }))
    };

    try {
      await invoiceService.create(payload); //
      
      setLineItems([]);
      setNotes('');
      toast.success("تم حفظ الفاتورة بنجاح");
      
      // Update stock counts in the dropdown
      refreshProducts();
      
    } catch(e) {
      console.error(e);
      toast.error("فشل حفظ الفاتورة: " + (e.message || "خطأ غير معروف"));
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = lineItems.reduce((sum, item) => sum + (item.quantity * item.sellPrice), 0);
  const totalProfit = lineItems.reduce((sum, item) => sum + (item.quantity * (item.sellPrice - item.buyPrice)), 0);

  return (
    <div className="p-8 space-y-6 min-h-screen" dir="rtl">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-white drop-shadow-lg">فاتورة بيع جديدة</h2>
        <p className="text-white/80 text-lg">أنشئ فاتورة بيع جديدة وأضف المنتجات</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <Card className="lg:col-span-1 h-fit shadow-lg border-0/50">
          <CardHeader>
            <CardTitle>إضافة منتجات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>القسم</Label>
              <select 
                className="w-full h-10 rounded-md border border-gray-300 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={selectedType} 
                onChange={e => {
                  setSelectedType(e.target.value);
                  setSelectedProductId('');
                }}
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
                <option value="">اختر منتج...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.description || p.name} (الرصيد: {p.totalQuantity})
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
        <Card className="lg:col-span-2 flex flex-col shadow-lg border-0/50">
          <CardHeader className="border-b bg-gray-50/50 rounded-t-xl">
            <CardTitle className="flex justify-between items-center">
              <span>معاينة الفاتورة</span>
              <div className="text-left">
                <span className="block text-sm text-gray-500 font-normal">الإجمالي</span>
                <span className="text-2xl text-blue-600">{formatCurrency(totalAmount)}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-6">
            <div className="rounded-md border flex-1 overflow-hidden mb-6 relative min-h-[200px]">
              <table className="w-full text-right text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="p-3 font-medium">المنتج</th>
                    <th className="p-3 font-medium">النوع</th>
                    <th className="p-3 font-medium">الكمية</th>
                    <th className="p-3 font-medium">السعر</th>
                    <th className="p-3 font-medium">المجموع</th>
                    <th className="p-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {lineItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="p-3 font-medium">{item.productName}</td>
                      <td className="p-3 text-xs text-gray-500">
                        {item.productType === 'iron' ? 'حدايد' : 
                         item.productType === 'wire' ? 'سلك' : 'شريط'}
                      </td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3">{formatCurrency(item.sellPrice)}</td>
                      <td className="p-3 font-bold text-gray-900">{formatCurrency(item.quantity * item.sellPrice)}</td>
                      <td className="p-3">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-500 h-8 w-8 hover:bg-red-50 hover:text-red-700" 
                          onClick={() => setLineItems(lineItems.filter(i => i.id !== item.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {!lineItems.length && (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-gray-400 bg-gray-50/30">
                        لم يتم إضافة منتجات بعد
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="space-y-4 mt-auto bg-gray-50 p-4 rounded-lg border">
              <div className="space-y-2">
                <Label>ملاحظات الفاتورة</Label>
                <textarea 
                  className="w-full min-h-[60px] rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="أدخل ملاحظات إضافية هنا..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex items-center justify-between gap-4 pt-2">
                <div className="text-sm text-gray-500">
                  عدد العناصر: <span className="font-medium text-gray-900">{lineItems.length}</span>
                </div>
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 min-w-[200px]" 
                  disabled={!lineItems.length || submitting} 
                  onClick={handleSaveInvoice}
                >
                   {submitting ? (
                     <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> جاري الحفظ...</>
                   ) : (
                     <><CheckCircle2 className="mr-2 h-5 w-5" /> حفظ الفاتورة</>
                   )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceCreator;