import { useState } from 'react';
import { toast } from 'sonner';
import { useProducts } from './useProducts';
import { invoiceService } from '@/services/invoiceService';
import { toBackendProductType, validateStockQuantity } from '@/lib/product.utils';
import { PRODUCT_TYPES } from '@/lib/constants';

export const useInvoiceForm = () => {
  const [lineItems, setLineItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [selectedType, setSelectedType] = useState(PRODUCT_TYPES.IRONS);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sellingPrice, setSellingPrice] = useState('');
  const [notes, setNotes] = useState('');

  const { data: products, refresh } = useProducts(selectedType);

  const handleAddItem = () => {
    if (!selectedProductId || !quantity || !sellingPrice) {
      toast.error("يرجى تعبئة جميع الحقول");
      return;
    }

    const product = products.find(p => p.id === parseInt(selectedProductId));
    if (!product) return;

    const validation = validateStockQuantity(parseFloat(quantity), product.totalQuantity);
    if (!validation.isValid) {
      toast.warning(validation.message);
    }

    setLineItems(prev => [...prev, {
      id: Date.now(),
      productType: toBackendProductType(selectedType),
      productId: parseInt(selectedProductId),
      productName: product.description || 'منتج',
      quantity: parseFloat(quantity),
      buyPrice: product.unitPrice || 0,
      sellPrice: parseFloat(sellingPrice)
    }]);

    // Reset form
    setSelectedProductId('');
    setQuantity(1);
    setSellingPrice('');
  };

  const handleRemoveItem = (id) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveInvoice = async () => {
    if (!lineItems.length) return;
    
    setSaving(true);
    try {
      const payload = {
        notes,
        details: lineItems.map(item => ({
          productType: item.productType,
          productId: item.productId,
          quantity: item.quantity,
          sellingPrice: item.sellPrice,
          purchasePrice: item.buyPrice
        }))
      };

      await invoiceService.create(payload);
      toast.success("تم حفظ الفاتورة بنجاح");
      setLineItems([]);
      setNotes('');
      refresh();
    } catch (e) {
      toast.error("فشل الحفظ: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return {
    selectedType,
    setSelectedType,
    products,
    selectedProductId,
    setSelectedProductId,
    quantity,
    setQuantity,
    sellingPrice,
    setSellingPrice,
    notes,
    setNotes,
    lineItems,
    handleAddItem,
    handleRemoveItem,
    handleSaveInvoice,
    saving
  };
};
