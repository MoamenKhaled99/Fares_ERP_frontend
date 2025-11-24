import React, { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { PRODUCT_SECTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Combobox } from '@/components/ui/combobox';

export const InvoiceForm = ({
  selectedType,
  setSelectedType,
  products,
  selectedProductId,
  setSelectedProductId,
  quantity,
  setQuantity,
  sellingPrice,
  setSellingPrice,
  purchasePrice,
  setPurchasePrice,
  productName,
  setProductName,
  invoiceType,
  setInvoiceType,
  invoiceDate,
  setInvoiceDate,
  onAddItem,
  disabled
}) => {
  const isNonStock = invoiceType === 'non-stock';
  
  // Format products for combobox
  const productItems = useMemo(() => {
    if (!products || isNonStock) return [];
    return products.map(p => ({
      value: p.id.toString(),
      label: `${p.displayName || p.description || p.name || 'منتج'} (رصيد: ${p.totalQuantity})`,
      product: p
    }));
  }, [products, isNonStock]);
  
  return (
    <Card className="lg:col-span-1 h-fit">
      <CardHeader>
        <CardTitle>إضافة منتجات</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>نوع الفاتورة</Label>
          <select 
            className="w-full h-10 rounded-md border border-gray-300 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={invoiceType} 
            onChange={e => setInvoiceType(e.target.value)}
          >
            <option value="regular">عادية (من المخزون)</option>
            <option value="non-stock">منتج مخصص (خارج المخزون)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>تاريخ الفاتورة</Label>
          <DatePicker 
            date={invoiceDate} 
            setDate={setInvoiceDate}
            placeholder="اختر تاريخ الفاتورة"
          />
          <p className="text-xs text-gray-500">التاريخ الافتراضي هو اليوم</p>
        </div>

        {!isNonStock && (
          <div className="space-y-2">
            <Label>القسم</Label>
            <select 
              className="w-full h-10 rounded-md border border-gray-300 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={selectedType} 
              onChange={e => setSelectedType(e.target.value)}
            >
              {PRODUCT_SECTIONS.map(section => (
                <option key={section.value} value={section.value}>
                  {section.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {isNonStock ? (
          <>
            <div className="space-y-2">
              <Label>اسم المنتج المخصص</Label>
              <Input 
                value={productName} 
                onChange={e => setProductName(e.target.value)}
                placeholder="مثال: شريط حريري مخصص 3x10x1:7"
              />
            </div>
            <div className="space-y-2">
              <Label>سعر الشراء</Label>
              <Input 
                type="number" 
                step="0.01"
                value={purchasePrice} 
                onChange={e => setPurchasePrice(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label>المنتج</Label>
            <Combobox
              items={productItems}
              value={selectedProductId}
              onValueChange={setSelectedProductId}
              placeholder="اختر منتج..."
              searchPlaceholder="ابحث عن منتج..."
              emptyMessage="لا توجد منتجات"
              getLabel={(item) => item?.label || ''}
              getValue={(item) => item?.value || ''}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>الكمية</Label>
            <Input 
              type="number" 
              min="1" 
              step="0.01"
              value={quantity} 
              onChange={e => setQuantity(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>سعر البيع</Label>
            <Input 
              type="number" 
              step="0.01" 
              value={sellingPrice} 
              onChange={e => setSellingPrice(e.target.value)} 
            />
          </div>
        </div>

        <Button 
          className="w-full mt-4" 
          onClick={onAddItem} 
          disabled={disabled || (!isNonStock && !selectedProductId) || (isNonStock && !productName)}
        >
          <Plus className="mr-2 h-4 w-4" /> إضافة للفاتورة
        </Button>
      </CardContent>
    </Card>
  );
};
