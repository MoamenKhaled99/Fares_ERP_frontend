// src/hooks/useDateRangeFilter.js
import { useState } from 'react';

// دالة مساعدة للتحقق من صلاحية قيمة التاريخ قبل محاولة إنشاء كائن Date
const isValidDateString = (dateString) => {
    return dateString && typeof dateString === 'string' && dateString.length > 0;
};

// تحويل تاريخ النهاية لـ ISO string مع إضافة يوم كامل (لتضمين اليوم بأكمله في التصفية)
const toISOString = (dateString) => {
    if (!isValidDateString(dateString)) return undefined;
    
    let adjustedDate = new Date(dateString);
    if (isNaN(adjustedDate.getTime())) return undefined;
    
    adjustedDate.setDate(adjustedDate.getDate() + 1);
    return adjustedDate.toISOString().split('T')[0];
};

// تحويل تاريخ البداية لـ ISO string
const toISOStringStart = (dateString) => {
    if (!isValidDateString(dateString)) return undefined;
    
    let date = new Date(dateString);
    if (isNaN(date.getTime())) return undefined;
    
    return date.toISOString().split('T')[0];
};

export const useDateRangeFilter = (initialRange = { from: '', to: '' }) => {
  const [dateRange, setDateRange] = useState(initialRange); 

  // دالة لتحديث نطاق التاريخ من حقول الإدخال
  const setPickerDateRange = (name, value) => {
    setDateRange(prev => ({
        ...prev,
        [name]: value,
    }));
  };

  // دالة للحصول على التواريخ بالصيغة المطلوبة من الـ API
  const getApiDates = () => {
    return {
      from_date: toISOStringStart(dateRange.from),
      to_date: toISOString(dateRange.to),
    };
  };

  return {
    dateRange,
    setPickerDateRange,
    getApiDates,
    clearDates: () => setDateRange({ from: '', to: '' }),
  };
};