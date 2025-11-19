import {
  PRODUCT_TYPE_BACKEND_MAP,
  PRODUCT_TYPE_ARABIC,
  STOCK_THRESHOLD,
} from "./constants";

/**
 * Convert frontend product type to backend type
 */
export const toBackendProductType = (frontendType) => {
  return PRODUCT_TYPE_BACKEND_MAP[frontendType] || frontendType;
};

/**
 * Get Arabic name for product type
 */
export const getProductTypeArabic = (type) => {
  return PRODUCT_TYPE_ARABIC[type] || type;
};

export const getProductTypeLabel = (productType) => {
  // Note: The invoice details usually contain backend types ('iron', 'wire')
  return PRODUCT_TYPE_ARABIC[productType] || productType;
};
/**
 * Check if product is low stock
 */
export const isLowStock = (quantity) => {
  return quantity < STOCK_THRESHOLD.LOW;
};

/**
 * Check if product is critically low stock
 */
export const isCriticalStock = (quantity) => {
  return quantity < STOCK_THRESHOLD.CRITICAL;
};

/**
 * Get stock status badge variant
 */
export const getStockBadgeVariant = (quantity) => {
  return isLowStock(quantity) ? "destructive" : "default";
};

/**
 * Get stock status text
 */
export const getStockStatusText = (quantity) => {
  if (isCriticalStock(quantity)) return "حرج";
  if (isLowStock(quantity)) return "منخفض";
  return "متوفر";
};

/**
 * Validate stock quantity for sale
 */
export const validateStockQuantity = (requestedQty, availableQty) => {
  return {
    isValid: requestedQty <= availableQty,
    message:
      requestedQty > availableQty
        ? "الكمية المطلوبة أكبر من الرصيد المتاح"
        : "",
  };
};
