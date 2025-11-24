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
  const [purchasePrice, setPurchasePrice] = useState('');
  const [productName, setProductName] = useState('');
  const [invoiceType, setInvoiceType] = useState('regular');
  const [invoiceDate, setInvoiceDate] = useState(new Date()); // Default to current date
  const [notes, setNotes] = useState('');

  const { data: products, refresh } = useProducts(selectedType);

  const handleAddItem = () => {
    if (!quantity || !sellingPrice) {
      toast.error("يرجى تعبئة جميع الحقول");
      return;
    }

    const isNonStock = invoiceType === 'non-stock';

    if (isNonStock) {
      // Non-stock invoice
      if (!productName || !purchasePrice) {
        toast.error("يرجى إدخال اسم المنتج وسعر الشراء للمنتجات المخصصة");
        return;
      }

      setLineItems(prev => [...prev, {
        id: Date.now(),
        productType: toBackendProductType(selectedType),
        productId: null,
        productName: productName,
        quantity: parseFloat(quantity),
        buyPrice: parseFloat(purchasePrice),
        sellPrice: parseFloat(sellingPrice),
        isNonStock: true
      }]);

      // Reset form
      setProductName('');
      setPurchasePrice('');
      setQuantity(1);
      setSellingPrice('');
    } else {
      // Regular invoice
      if (!selectedProductId) {
        toast.error("يرجى اختيار منتج");
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
        productName: product.displayName || product.description || 'منتج',
        quantity: parseFloat(quantity),
        buyPrice: product.unitPrice || 0,
        sellPrice: parseFloat(sellingPrice),
        isNonStock: false
      }]);

      // Reset form
      setSelectedProductId('');
      setQuantity(1);
      setSellingPrice('');
    }
  };

  const handleRemoveItem = (id) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveInvoice = async () => {
    if (!lineItems.length) return;
    
    setSaving(true);
    try {
      const payload = {
        invoiceType,
        notes,
        details: lineItems.map(item => ({
          productType: item.productType,
          productId: item.isNonStock ? undefined : item.productId,
          productName: item.productName, // Always send productName
          quantity: item.quantity,
          sellingPrice: item.sellPrice,
          purchasePrice: item.isNonStock ? item.buyPrice : undefined
        }))
      };

      // Add invoice date if provided, otherwise let backend set current date
      if (invoiceDate) {
        payload.invoiceDate = invoiceDate.toISOString();
      }

      await invoiceService.create(payload);
      toast.success("تم حفظ الفاتورة بنجاح");
      setLineItems([]);
      setNotes('');
      setInvoiceDate(new Date()); // Reset to current date
      setInvoiceType('regular');
      refresh();
    } catch (e) {
      toast.error("فشل الحفظ: " + (e.response?.data?.message || e.message));
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
    purchasePrice,
    setPurchasePrice,
    productName,
    setProductName,
    invoiceType,
    setInvoiceType,
    invoiceDate,
    setInvoiceDate,
    notes,
    setNotes,
    lineItems,
    handleAddItem,
    handleRemoveItem,
    handleSaveInvoice,
    saving
  };
};
