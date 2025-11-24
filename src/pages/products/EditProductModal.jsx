import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner"; 

const EditProductModal = ({ product, type, onSubmit, onClose }) => {
  const isSilkStrip = type === 'silk-strips';
  
  // Use product data for initial form state
  const [form, setForm] = useState({ 
    description: product.description || product.name || '', 
    unitPrice: product.unitPrice.toString(), 
    totalQuantity: product.totalQuantity.toString(), // Include totalQuantity for visual reference
    // Fields for silk strips
    loadCapacity: product.loadCapacity?.toString() || '',
    safetyFactor: product.safetyFactor?.toString() || '',
    unitMeter: product.unitMeter?.toString() || '' 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        unitPrice: parseFloat(form.unitPrice),
      };

      if (isSilkStrip) {
         payload.loadCapacity = parseFloat(form.loadCapacity);
         payload.safetyFactor = parseFloat(form.safetyFactor);
         payload.unitMeter = parseFloat(form.unitMeter);
      } else {
         payload.description = form.description;
      }
      
      await onSubmit(product.id, payload);
      onClose();
    } catch (error) {
      toast.error("فشل تحديث المنتج: " + (error.message || "خطأ غير معروف"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // This fixed div with bg-black/50 creates the modal overlay.
    // It captures clicks outside the modal content to close it.
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <Card 
        className="w-full max-w-md animate-in fade-in zoom-in duration-200"
        // Prevent clicks inside the card from closing the modal immediately
        onClick={e => e.stopPropagation()} 
      >
        <CardHeader>
          <CardTitle>تعديل المنتج: {product.description || product.name || `ID: ${product.id}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
             
            {!isSilkStrip && (
              <div className="space-y-2">
                <Label>اسم المنتج / الوصف</Label>
                <Input 
                  required 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                  placeholder="مثال: حدايد تسليح 10مم" 
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>سعر الشراء الحالي (للوحدة)</Label>
              <Input 
                required 
                type="number" 
                step="0.01" 
                value={form.unitPrice} 
                onChange={e => setForm({...form, unitPrice: e.target.value})} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>الكمية الحالية في المخزون</Label>
              <Input 
                disabled // This is for display only
                value={form.totalQuantity} 
              />
              <p className="text-xs text-gray-500">
                ⚠️ لتغيير الكمية، استخدم زر "إضافة مخزون".
              </p>
            </div>
          
            {isSilkStrip && (
              <>
                <div className="space-y-2">
                   <Label>حمولة الطن (Load Capacity)</Label>
                   <Input 
                     required 
                     type="number" 
                     step="0.01"
                     value={form.loadCapacity} 
                     onChange={e => setForm({...form, loadCapacity: e.target.value})} 
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>معامل الأمان (Safety Factor)</Label>
                    <Input 
                      required 
                      type="number" 
                      step="0.01"
                      value={form.safetyFactor} 
                      onChange={e => setForm({...form, safetyFactor: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>المتر (Unit Meter)</Label>
                    <Input 
                      required 
                      type="number" 
                      step="0.01"
                      value={form.unitMeter} 
                      onChange={e => setForm({...form, unitMeter: e.target.value})} 
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
              <Button type="submit" disabled={loading}>
                  {loading ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري التحديث...</> : 'حفظ التغييرات'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductModal;