import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import Badge from '../../components/ui/badge';
import Button from '../../components/ui/button';

const ProductTable = ({ products, onDelete, onAddStock }) => {
  if (!products || !products.length) return <div className="text-center p-8 text-gray-500">لا توجد منتجات متاحة</div>;

  return (
    <div className="w-full overflow-auto">
      <table className="w-full caption-bottom text-sm text-right">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50">
            <th className="h-12 px-4 align-middle font-medium text-gray-500">#</th>
            <th className="h-12 px-4 align-middle font-medium text-gray-500">الوصف</th>
            <th className="h-12 px-4 align-middle font-medium text-gray-500">سعر الوحدة</th>
            <th className="h-12 px-4 align-middle font-medium text-gray-500">المخزون</th>
            <th className="h-12 px-4 align-middle font-medium text-gray-500">الحالة</th>
            <th className="h-12 px-4 align-middle font-medium text-gray-500">إجراءات</th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {products.map((p) => (
            <tr key={p.id} className="border-b transition-colors hover:bg-gray-50/50">
              <td className="p-4 align-middle">{p.id}</td>
              <td className="p-4 align-middle font-medium">{p.وصف || p.description}</td>
              <td className="p-4 align-middle">{formatCurrency(p.سعر_الوحدة || p.unit_price || 0)}</td>
              <td className="p-4 align-middle">{p.وارد || 0}</td>
              <td className="p-4 align-middle">
                <Badge variant={(p.وارد || 0) < 10 ? "destructive" : "success"}>
                  {(p.وارد || 0) < 10 ? "منخفض" : "متوفر"}
                </Badge>
              </td>
              <td className="p-4 align-middle flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onAddStock(p)}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(p.id)}>
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