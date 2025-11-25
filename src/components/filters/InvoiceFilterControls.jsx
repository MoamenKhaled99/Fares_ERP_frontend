import React from 'react';
import { useTranslation } from 'react-i18next'; // ✅ Import hook
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';

export function InvoiceFilterControls({ fromDate, setFromDate, toDate, setToDate, handleClearFilters }) {
    const { t } = useTranslation(); // ✅ Init hook

    return (
        <div className="flex items-center gap-4 border p-4 rounded-lg bg-white shadow-sm flex-wrap">
            <h3 className="text-md font-medium text-gray-700 shrink-0">
                {t('filters.filter')}:
            </h3>

            <div className="flex items-center gap-2">
                <Label>{t('filters.fromDate')}:</Label>
                <DatePicker
                    date={fromDate ? new Date(fromDate) : undefined}
                    setDate={(date) => setFromDate(date ? format(date, "yyyy-MM-dd") : "")}
                    placeholder={t('filters.selectDate')}
                />
            </div>

            <div className="flex items-center gap-2">
                <Label>{t('filters.toDate')}:</Label>
                <DatePicker
                    date={toDate ? new Date(toDate) : undefined}
                    setDate={(date) => setToDate(date ? format(date, "yyyy-MM-dd") : "")}
                    placeholder={t('filters.selectDate')}
                />
            </div>

            <Button onClick={handleClearFilters} variant="ghost" size="sm">
                {t('filters.reset')}
            </Button>
        </div>
    );
}   