import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const isNonStock = invoiceType === 'non-stock';
  
  // Format products for combobox
  const productItems = useMemo(() => {
    if (!products || isNonStock) return [];
    return products.map(p => ({
      value: p.id.toString(),
      label: `${p.displayName || p.description || p.name || t('invoices.product')} (${t('products.balance')}: ${p.totalQuantity})`,
      product: p
    }));
  }, [products, isNonStock, t]);
  
  return (
    <Card className="lg:col-span-1 h-fit">
      <CardHeader>
        <CardTitle>{t('invoices.addProducts')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t('invoices.invoiceType')}</Label>
          <select 
            className="w-full h-10 rounded-md border border-gray-300 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={invoiceType} 
            onChange={e => setInvoiceType(e.target.value)}
          >
            <option value="regular">{t('invoices.regularFromStock')}</option>
            <option value="non-stock">{t('invoices.customNonStock')}</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>{t('invoices.invoiceDate')}</Label>
          <DatePicker 
            date={invoiceDate} 
            setDate={setInvoiceDate}
            placeholder={t('invoices.selectInvoiceDate')}
          />
          <p className="text-xs text-gray-500">{t('invoices.invoiceDateDefault')}</p>
        </div>

        {!isNonStock && (
          <div className="space-y-2">
            <Label>{t('invoices.section')}</Label>
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
              <Label>{t('invoices.customProductName')}</Label>
              <Input 
                value={productName} 
                onChange={e => setProductName(e.target.value)}
                placeholder={t('invoices.customProductPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('invoices.purchasePrice')}</Label>
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
            <Label>{t('invoices.product')}</Label>
            <Combobox
              items={productItems}
              value={selectedProductId}
              onValueChange={setSelectedProductId}
              placeholder={t('invoices.selectProduct')}
              searchPlaceholder={t('invoices.searchProduct')}
              emptyMessage={t('invoices.noProducts')}
              getLabel={(item) => item?.label || ''}
              getValue={(item) => item?.value || ''}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t('invoices.quantity')}</Label>
            <Input 
              type="number" 
              min="1" 
              step="0.01"
              value={quantity} 
              onChange={e => setQuantity(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>{t('invoices.sellingPrice')}</Label>
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
          <Plus className="mr-2 h-4 w-4" /> {t('invoices.addToInvoice')}
        </Button>
      </CardContent>
    </Card>
  );
};
