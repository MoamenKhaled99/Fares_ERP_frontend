import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {Button} from '../../components/ui/button';
import {Input} from '../../components/ui/input';
import {Label} from '../../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Loader2 } from 'lucide-react';

const AddStockModal = ({ product, onSubmit, onClose }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ الكمية: '' });
  const [loading, setLoading] = useState(false);

  const productName = product.description || product.name || `ID: ${product.id}`;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const quantity = parseInt(form.الكمية);
    if (isNaN(quantity) || quantity <= 0) {
        setLoading(false);
        return;
    }

    try {
      await onSubmit(product.id, {
        الكمية: quantity,
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
        onClick={e => e.stopPropagation()} 
      >
        <CardHeader>
          <CardTitle>{t('products.addStockFor', { name: productName })}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('products.incomingQuantity')}</Label>
              <Input 
                required 
                type="number" 
                min="1"
                value={form.الكمية} 
                onChange={e => setForm({...form, الكمية: e.target.value})} 
              />
            </div>
            
            <div className="space-y-2 p-3 border rounded-md bg-gray-50 text-sm">
                <p className="font-medium text-gray-700">{t('products.purchasePriceUsed')}</p>
                <p className="font-bold text-green-600">
                    {product.unitPrice} {t('common.egp')} {t('products.willBeUsed')}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {t('products.purchasePriceNote')}
                </p>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
              <Button 
                type="submit" 
                variant="success" 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> {t('products.adding')}</> : t('products.confirmIncoming')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddStockModal;