import React from 'react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { getProductTypeArabic } from '@/lib/product.utils';
import { MOVEMENT_TYPES } from '@/lib/constants';

export const StockMovementsTable = ({ movements }) => {
  const getMovementBadge = (type) => ({
    variant: type === MOVEMENT_TYPES.IN ? 'default' : 'destructive',
    className: type === MOVEMENT_TYPES.IN ? 'bg-green-500' : 'bg-red-500',
    text: type === MOVEMENT_TYPES.IN ? 'وارد' : 'صادر'
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-right">
        <thead className="border-b">
          <tr>
            <th className="p-3 font-medium text-gray-500">التاريخ</th>
            <th className="p-3 font-medium text-gray-500">الساعة</th>
            <th className="p-3 font-medium text-gray-500">نوع المنتج</th>
            <th className="p-3 font-medium text-gray-500">اسم المنتج</th>
            <th className="p-3 font-medium text-gray-500">الكمية</th>
            <th className="p-3 font-medium text-gray-500">السعر</th>
            <th className="p-3 font-medium text-gray-500">النوع</th>
            <th className="p-3 font-medium text-gray-500">الملاحظات</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => {
            const badge = getMovementBadge(movement.movementType);
            return (
              <tr key={movement.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-3">
                  {new Date(movement.movementDate).toLocaleDateString('ar-EG')}
                </td>
                <td className="p-3">
                  {new Date(movement.movementDate).toLocaleTimeString('ar-EG')}
                </td>
                <td className="p-3">{getProductTypeArabic(movement.productType)}</td>
                <td className="p-3 font-medium">{movement.productName || '-'}</td>
                <td className="p-3 font-medium">{movement.quantity}</td>
                <td className="p-3">{formatCurrency(movement.purchasePrice)}</td>
                <td className="p-3">
                  <Badge variant={badge.variant} className={badge.className}>
                    {badge.text}
                  </Badge>
                </td>
                <td className="p-3 text-gray-500 max-w-xs truncate">
                  {movement.notes || '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
