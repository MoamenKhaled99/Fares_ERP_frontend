import React from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { getStockBadgeVariant, getStockStatusText } from '@/lib/product.utils';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

const ProductTable = ({ products, onDelete, onAddStock, onEdit = () => { } }) => {
  if (!products || !products.length) return <div className="text-center p-8 text-gray-500">لا توجد منتجات متاحة</div>;

  const isSilkStrip = products.length > 0 && (products[0].loadCapacity !== undefined || products[0].safetyFactor !== undefined);

  // Sort products by loadCapacity asc for silk strips as a client-side fallback
  const sortedProducts = isSilkStrip
    ? [...products].sort((a, b) => (parseFloat(a.loadCapacity || 0) - parseFloat(b.loadCapacity || 0)))
    : products;

  return (
    <div className="w-full overflow-auto">
      <table className="w-full caption-bottom text-sm text-right">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50">
            <th className="h-12 px-4 align-middle font-medium text-gray-500">#</th>
            {isSilkStrip ? (
              <>
                <th className="h-12 px-4 align-middle font-medium text-gray-500">حمولة الطن</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500">معامل الأمان</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500">المتر</th>
              </>
            ) : (
              <th className="h-12 px-4 align-middle font-medium text-gray-500">الوصف</th>
            )}
            <th className="h-12 px-4 align-middle font-medium text-gray-500">سعر الوحدة</th>
            <th className="h-12 px-4 align-middle font-medium text-gray-500">اجمالى عدد
            </th>
            <th className="h-12 px-4 align-middle font-medium text-gray-500">الرصيد </th>
            <th className="h-12 px-4 align-middle font-medium text-gray-500">الحالة</th>
            <th className="h-12 px-4 align-middle font-medium text-gray-500">إجراءات</th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {sortedProducts.map((p) => (
            <tr key={p.id} className="border-b transition-colors hover:bg-gray-50/50">
              <td className="p-4 align-middle">{p.id}</td>

              {isSilkStrip ? (
                <>
                  <td className="p-4 align-middle font-medium">{p.loadCapacity || '-'}</td>
                  <td className="p-4 align-middle">{p.safetyFactor || '-'}</td>
                  <td className="p-4 align-middle">{p.unitMeter || '-'}</td>
                </>
              ) : (
                <td className="p-4 align-middle font-medium">{p.description || p.name || 'بدون وصف'}</td>
              )}

              <td className="p-4 align-middle">{formatCurrency(p.unitPrice || 0)}</td>
              <td className="p-4 align-middle font-bold">{p.totalQuantity || 0}</td>
              <td className="p-4 align-middle text-gray-600">{formatCurrency(p.balance || 0)}</td>

              <td className="p-4 align-middle">
                <Badge 
                  variant={getStockBadgeVariant(p.totalQuantity || 0)} 
                  className={getStockBadgeVariant(p.totalQuantity || 0) === "destructive" ? "bg-red-500" : "bg-green-600 hover:bg-green-700"}
                >
                  {getStockStatusText(p.totalQuantity || 0)}
                </Badge>
              </td>
              <td className="p-4 align-middle flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(p)} title="تعديل المنتج">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onAddStock(p)} title="إضافة مخزون">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(p)} title="حذف المنتج">
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