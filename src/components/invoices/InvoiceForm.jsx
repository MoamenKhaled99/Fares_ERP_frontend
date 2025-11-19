import React from 'react';
import { Plus } from 'lucide-react';
import { PRODUCT_SECTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
  onAddItem,
  disabled
}) => {
  return (
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
            {PRODUCT_SECTIONS.map(section => (
              <option key={section.value} value={section.value}>
                {section.label}
              </option>
            ))}
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
            {products?.map(p => (
              <option key={p.id} value={p.id}>
                {p.description || p.name} (رصيد: {p.totalQuantity})
              </option>
            ))}
          </select>
        </div>

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
          disabled={disabled || !selectedProductId}
        >
          <Plus className="mr-2 h-4 w-4" /> إضافة للفاتورة
        </Button>
      </CardContent>
    </Card>
  );
};
