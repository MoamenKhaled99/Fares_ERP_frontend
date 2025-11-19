import React from 'react';
import { format } from 'date-fns';
import { Loader2, AlertCircle, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { useStockMovements } from '@/hooks/useStockMovements';
import { StockMovementsTable } from '@/components/stock/StockMovementsTable';

const StockLogsPage = () => {
  const {
    movements,
    loading,
    error,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    handleClearFilters,
  } = useStockMovements();

  return (
    <div className="p-6 space-y-6 min-h-screen" dir="rtl">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">سجل حركات المخزون</h2>
        <p className="text-muted-foreground">عرض جميع حركات الوارد والصادر بالتفصيل</p>
      </div>

      {/* Date Range Filter UI */}
      <div className="flex items-center gap-4 border p-4 rounded-lg bg-white shadow-sm">
        <h3 className="text-md font-medium text-gray-700 shrink-0">
          تصفية التاريخ:
        </h3>

        <div className="flex items-center gap-2">
          <Label>من:</Label>
          <DatePicker
            date={fromDate ? new Date(fromDate) : undefined}
            setDate={(date) => setFromDate(date ? format(date, "yyyy-MM-dd") : "")}
            placeholder="من تاريخ"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label>إلى:</Label>
          <DatePicker
            date={toDate ? new Date(toDate) : undefined}
            setDate={(date) => setToDate(date ? format(date, "yyyy-MM-dd") : "")}
            placeholder="إلى تاريخ"
          />
        </div>

        <Button onClick={handleClearFilters} variant="ghost" size="sm">
          مسح
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : movements.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد حركات مخزون مسجلة</p>
            </div>
          ) : (
            <StockMovementsTable movements={movements} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StockLogsPage;