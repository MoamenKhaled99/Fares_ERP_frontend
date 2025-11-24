// Product Type Mappings
export const PRODUCT_TYPES = {
  IRONS: 'irons',
  WIRES: 'wires',
  SILK_STRIPS: 'silk-strips'
};

export const PRODUCT_TYPE_BACKEND_MAP = {
  irons: 'iron',
  wires: 'wire',
  'silk-strips': 'silk_strip'
};

export const PRODUCT_TYPE_ARABIC = {
  iron: 'حدايد',
  wire: 'واير',
  silk_strip: 'شريط حريري'
};

export const PRODUCT_SECTIONS = [
  { value: 'irons', label: 'الحدايد', backendType: 'iron' },
  { value: 'wires', label: 'الويرات', backendType: 'wire' },
  { value: 'silk-strips', label: 'الشرائط الحريرية', backendType: 'silk_strip' }
];

// Movement Types
export const MOVEMENT_TYPES = {
  IN: 'in',
  OUT: 'out'
};

export const MOVEMENT_TYPE_ARABIC = {
  in: 'وارد',
  out: 'صادر'
};

// Stock thresholds
export const STOCK_THRESHOLD = {
  LOW: 10,
  CRITICAL: 5
};

// Badge variants
export const BADGE_VARIANTS = {
  LOW_STOCK: 'destructive',
  IN_STOCK: 'default',
  MOVEMENT_IN: 'default',
  MOVEMENT_OUT: 'destructive'
};
