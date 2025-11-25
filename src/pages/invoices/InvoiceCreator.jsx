import React from 'react';
import { useTranslation } from 'react-i18next';
import { useInvoiceForm } from '@/hooks/useInvoiceForm';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import { InvoicePreview } from '@/components/invoices/InvoicePreview';

const InvoiceCreator = () => {
  const { t } = useTranslation();
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
  } = useInvoiceForm();

  return (
    <div className="p-8 space-y-6 min-h-screen">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-white drop-shadow-lg">
          {t('invoices.createNewInvoice')}
        </h2>
        <p className="text-white/80 text-lg">
          {t('invoices.createNewInvoiceDesc')}
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
          purchasePrice={purchasePrice}
          setPurchasePrice={setPurchasePrice}
          productName={productName}
          setProductName={setProductName}
          invoiceType={invoiceType}
          setInvoiceType={setInvoiceType}
          invoiceDate={invoiceDate}
          setInvoiceDate={setInvoiceDate}
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
