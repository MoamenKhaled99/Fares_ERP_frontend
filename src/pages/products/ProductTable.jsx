import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../lib/number.utils';
import { getStockBadgeVariant, getStockStatusText } from '@/lib/product.utils';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

const ProductTable = ({ products, onDelete, onAddStock, onEdit = () => { } }) => {
  const { t } = useTranslation();

  if (!products || !products.length) return <div className="text-center p-8 text-gray-500">{t('products.noProductsAvailable')}</div>;

  const isSilkStrip = products.length > 0 && (products[0].loadCapacity !== undefined || products[0].safetyFactor !== undefined);

  // Sort products by loadCapacity asc for silk strips as a client-side fallback
  const sortedProducts = isSilkStrip
    ? [...products].sort((a, b) => (parseFloat(a.loadCapacity || 0) - parseFloat(b.loadCapacity || 0)))
    : products;

  return (
    <div className="w-full overflow-auto">
      {/* ✅ FIX: Changed 'text-right' to 'text-start' to support both LTR and RTL */}
      <table className="w-full caption-bottom text-sm text-start">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50">
            {/* Added text-start to th for safety, though table inherits it */}
            <th className="h-12 px-4 align-middle font-medium text-gray-500 text-start">#</th>
            {isSilkStrip ? (
              <>
                <th className="h-12 px-4 align-middle font-medium text-gray-500 text-start">{t('products.loadCapacity')}</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500 text-start">{t('products.safetyFactor')}</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500 text-start">{t('products.unitMeter')}</th>
              </>
            ) : (
              <th className="h-12 px-4 align-middle font-medium text-gray-500 text-start">{t('products.description')}</th>
            )}
            <th className="h-12 px-4 align-middle font-medium text-gray-500 text-start">{t('products.unitPrice')}</th>
            <th className="h-12 px-4 align-middle font-medium text-gray-500 text-start">{t('products.totalQuantity')}</th>
            <th className="h-12 px-4 align-middle font-medium text-gray-500 text-start">{t('products.balance')}</th>
            <th className="h-12 px-4 align-middle font-medium text-gray-500 text-start">{t('products.status')}</th>
            <th className="h-12 px-4 align-middle font-medium text-gray-500 text-start">{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {sortedProducts.map((p) => (
            <tr key={p.id} className="border-b transition-colors hover:bg-gray-50/50">
              <td className="p-4 align-middle">{formatNumber(p.id)}</td>

              {isSilkStrip ? (
                <>
                  <td className="p-4 align-middle font-medium">{formatNumber(p.loadCapacity)}</td>
                  <td className="p-4 align-middle">{p.safetyFactor || '-'}</td>
                  <td className="p-4 align-middle">{formatNumber(p.unitMeter)}</td>
                </>
              ) : (
                <td className="p-4 align-middle font-medium">{p.description || p.name || '-'}</td>
              )}

              <td className="p-4 align-middle">{formatCurrency(p.unitPrice || 0)}</td>
              <td className="p-4 align-middle font-bold">{formatNumber(p.totalQuantity || 0)}</td>
              <td className="p-4 align-middle text-gray-600">{formatCurrency(p.balance || 0)}</td>

              <td className="p-4 align-middle">
                <Badge 
                  variant={getStockBadgeVariant(p.totalQuantity || 0)} 
                  className={getStockBadgeVariant(p.totalQuantity || 0) === "destructive" ? "bg-red-500" : "bg-green-600 hover:bg-green-700"}
                >
                  {t(getStockStatusText(p.totalQuantity || 0))}
                </Badge>
              </td>
              <td className="p-4 align-middle flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(p)} title={t('products.edit')}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onAddStock(p)} title={t('products.addStock')}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(p)} title={t('products.delete')}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;