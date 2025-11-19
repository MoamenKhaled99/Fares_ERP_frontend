export const MONTHS_ARABIC = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export const CURRENT_MONTH_INDEX = new Date().getMonth();
export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2]; 

/**
 * Calculates the start and end dates (start of next month) for a given year and month index.
 */
export const getMonthPeriodDates = (year, monthIndex) => {
  // Start of the selected month
  const from = new Date(year, monthIndex, 1);

  // Start of the month AFTER the selected month
  const to = new Date(year, monthIndex + 1, 1);
  
  const formatDate = (date) => date.toISOString().split('T')[0];

  return { fromDate: formatDate(from), toDate: formatDate(to) };
};

/**
 * Creates the Arabic label for the profit card footer.
 */
export const getPeriodLabel = (year, monthIndex) => {
    const monthName = MONTHS_ARABIC[parseInt(monthIndex)];
    return `صافي الأرباح المحققة خلال ${monthName} ${year}`;
};