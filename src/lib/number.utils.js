import i18n from '../i18n';

function localeWithNumberingSystem(lang) {
  if (!lang) return 'en';
  // Force Arabic-Indic digits (Eastern Arabic numerals) when in Arabic
  if (lang.startsWith('ar')) {
    return 'ar-EG-u-nu-arab'; 
  }
  return lang;
}

export function formatNumber(value, options = {}) {
  if (value === null || value === undefined || value === '') return '';
  
  // ✅ FIX: Check if value is a valid number before formatting
  const num = Number(value);
  if (isNaN(num)) {
      return String(value); // Return original string (e.g., "1:5") if not a number
  }

  const baseLang = i18n.language || 'en';
  const locale = localeWithNumberingSystem(baseLang);
  
  const opts = Object.assign({
    useGrouping: false, 
    ...options
  }, options);

  try {
    return new Intl.NumberFormat(locale, opts).format(num);
  } catch (e) {
    return String(value);
  }
}

export function formatCurrency(value, currency = 'EGP', options = {}) {
  if (value === null || value === undefined || value === '') return ''; // Handle empty string
  
  const num = Number(value);
  if (isNaN(num)) return String(value); // Handle non-numeric currency values safely

  const baseLang = i18n.language || 'en';
  const locale = localeWithNumberingSystem(baseLang);
  const opts = Object.assign({
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }, options);

  try {
    return new Intl.NumberFormat(locale, opts).format(num);
  } catch (e) {
    return String(value);
  }
}

export function formatDate(value, options = {}) {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';
  
  const baseLang = i18n.language || 'en';
  const locale = localeWithNumberingSystem(baseLang);
  
  try {
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...options
    });
  } catch (e) {
    return date.toLocaleDateString();
  }
}

export function formatTime(value, options = {}) {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';
  
  const baseLang = i18n.language || 'en';
  const locale = localeWithNumberingSystem(baseLang);
  
  try {
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      ...options
    });
  } catch (e) {
    return date.toLocaleTimeString();
  }
}