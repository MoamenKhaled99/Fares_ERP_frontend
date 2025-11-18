import React, { useState } from 'react';
import {Button} from '../../components/ui/button';
import {Input} from '../../components/ui/input';
import {Label} from '../../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Loader2 } from 'lucide-react'; // Import Loader2 for isLoading prop

const AddStockModal = ({ product, onSubmit, onClose }) => {
  // ✅ Removed 'السعر' from state tracking
  const [form, setForm] = useState({ الكمية: '' });
  const [loading, setLoading] = useState(false);

  // Fallback for iron/wire description or silk strip name/ID
  const productName = product.description || product.name || `ID: ${product.id}`;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Ensure quantity is positive
    const quantity = parseInt(form.الكمية);
    if (isNaN(quantity) || quantity <= 0) {
        setLoading(false);
        return;
    }

    try {
      await onSubmit(product.id, {
        الكمية: quantity,
        // ✅ Use the current product's unitPrice as the purchasePrice 
        // to satisfy backend validation and balance calculation (old balance + cost of new stock).
        السعر: product.unitPrice, 
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <Card 
        className="w-full max-w-md animate-in fade-in zoom-in duration-200"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <CardHeader>
          {/* Use the fallback for product name */}
          <CardTitle>إضافة مخزون: {productName}</CardTitle> 
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>الكمية الواردة</Label>
              <Input 
                required 
                type="number" 
                min="1"
                value={form.الكمية} 
                onChange={e => setForm({...form, الكمية: e.target.value})} 
              />
            </div>
            
            {/* ✅ Removed the "سعر الشراء الجديد" field block */}
            <div className="space-y-2 p-3 border rounded-md bg-gray-50 text-sm">
                <p className="font-medium text-gray-700">سعر الشراء المُستخدم:</p>
                <p className="font-bold text-green-600">
                    {product.unitPrice} ج.م (سيتم استخدامه لحساب الرصيد الإجمالي)
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    لتحديث سعر الشراء للوحدة، استخدم زر التعديل بجوار المنتج.
                </p>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
              {/* Note: The Button component structure might not correctly pass 'isLoading'. */}
              <Button 
                type="submit" 
                variant="success" 
                disabled={loading} // Use disabled prop for loading state
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الإضافة...</> : 'تأكيد الوارد'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddStockModal;