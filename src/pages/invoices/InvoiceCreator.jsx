import React from 'react';
import { useInvoiceForm } from '@/hooks/useInvoiceForm';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import { InvoicePreview } from '@/components/invoices/InvoicePreview';

const InvoiceCreator = () => {
  const {
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
  } = useInvoiceForm();

  return (
    <div className="p-8 space-y-6 min-h-screen" dir="rtl">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-white drop-shadow-lg">
          فاتورة بيع جديدة
        </h2>
        <p className="text-white/80 text-lg">
          أنشئ فاتورة بيع جديدة وأضف المنتجات
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <InvoiceForm
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          products={products}
          selectedProductId={selectedProductId}
          setSelectedProductId={setSelectedProductId}
          quantity={quantity}
          setQuantity={setQuantity}
          sellingPrice={sellingPrice}
          setSellingPrice={setSellingPrice}
          onAddItem={handleAddItem}
          disabled={saving}
        />

        <InvoicePreview
          lineItems={lineItems}
          onRemoveItem={handleRemoveItem}
          notes={notes}
          setNotes={setNotes}
          onSave={handleSaveInvoice}
          saving={saving}
        />
      </div>
    </div>
  );
};

export default InvoiceCreator;
