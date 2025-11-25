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
  if (isLowStock(quantity)) return "destructive";
  return "default";
};

/**
 * Get stock status text (Returns Translation Key now)
 */
export const getStockStatusText = (quantity) => {
  if (isCriticalStock(quantity)) return "products.critical";
  if (isLowStock(quantity)) return "products.lowStock";
  return "products.available";
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