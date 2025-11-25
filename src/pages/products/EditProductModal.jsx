import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner"; 

const EditProductModal = ({ product, type, onSubmit, onClose }) => {
  const { t } = useTranslation();
  const isSilkStrip = type === 'silk-strips';
  
  const [form, setForm] = useState({ 
    description: product.description || product.name || '', 
    unitPrice: product.unitPrice.toString(), 
    totalQuantity: product.totalQuantity.toString(),
    loadCapacity: product.loadCapacity?.toString() || '',
    safetyFactor: product.safetyFactor?.toString() || '', // Keep as string
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
         // ✅ FIX: Do NOT parse float for safetyFactor, keep as string (e.g., "1:5")
         payload.safetyFactor = form.safetyFactor; 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <Card 
        className="w-full max-w-md animate-in fade-in zoom-in duration-200"
        onClick={e => e.stopPropagation()} 
      >
        <CardHeader>
          <CardTitle>{t('products.editProduct')}: {product.description || product.name || `ID: ${product.id}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
             
            {!isSilkStrip && (
              <div className="space-y-2">
                <Label>{t('products.productName')}</Label>
                <Input 
                  required 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                  placeholder={t('products.productNamePlaceholder')} 
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>{t('products.currentPurchasePrice')}</Label>
              <Input 
                required 
                type="number" 
                step="0.01" 
                value={form.unitPrice} 
                onChange={e => setForm({...form, unitPrice: e.target.value})} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>{t('products.currentStockQuantity')}</Label>
              <Input 
                disabled
                value={form.totalQuantity} 
              />
              <p className="text-xs text-gray-500">
                {t('products.changeQuantityNote')}
              </p>
            </div>
          
            {isSilkStrip && (
              <>
                <div className="space-y-2">
                   <Label>{t('products.loadCapacity')}</Label>
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
                    <Label>{t('products.safetyFactor')}</Label>
                    {/* ✅ FIX: Changed type to text to allow "1:5" format */}
                    <Input 
                      required 
                      type="text" 
                      value={form.safetyFactor} 
                      onChange={e => setForm({...form, safetyFactor: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('products.unitMeter')}</Label>
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
              <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
              <Button type="submit" disabled={loading}>
                  {loading ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> {t('products.updating')}</> : t('products.saveChanges')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductModal;