import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber, formatDate, formatTime } from '@/lib/number.utils'; // ✅ Import
import { getProductTypeArabic } from '@/lib/product.utils';
import { MOVEMENT_TYPES } from '@/lib/constants';

export const StockMovementsTable = ({ movements }) => {
  const { t } = useTranslation();

  const getMovementBadge = (type) => ({
    variant: type === MOVEMENT_TYPES.IN ? 'default' : 'destructive',
    className: type === MOVEMENT_TYPES.IN ? 'bg-green-500' : 'bg-red-500',
    text: type === MOVEMENT_TYPES.IN ? t('stock.incoming') : t('stock.outgoing')
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-right">
        <thead className="border-b">
          <tr>
            <th className="p-3 font-medium text-gray-500">{t('stock.date')}</th>
            <th className="p-3 font-medium text-gray-500">{t('stock.time')}</th>
            <th className="p-3 font-medium text-gray-500">{t('stock.productType')}</th>
            <th className="p-3 font-medium text-gray-500">{t('stock.productName')}</th>
            <th className="p-3 font-medium text-gray-500">{t('stock.quantity')}</th>
            <th className="p-3 font-medium text-gray-500">{t('stock.price')}</th>
            <th className="p-3 font-medium text-gray-500">{t('stock.type')}</th>
            <th className="p-3 font-medium text-gray-500">{t('stock.notes')}</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => {
            const badge = getMovementBadge(movement.movementType);
            return (
              <tr key={movement.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-3">
                  {formatDate(movement.movementDate)} {/* ✅ Fixed */}
                </td>
                <td className="p-3">
                  {formatTime(movement.movementDate)} {/* ✅ Fixed */}
                </td>
                <td className="p-3">{getProductTypeArabic(movement.productType)}</td>
                <td className="p-3 font-medium">{movement.productName || '-'}</td>
                <td className="p-3 font-medium">{formatNumber(movement.quantity)}</td>
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