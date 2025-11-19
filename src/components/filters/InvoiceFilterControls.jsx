// src/components/filters/InvoiceFilterControls.jsx
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';

export function InvoiceFilterControls({ fromDate, setFromDate, toDate, setToDate, handleClearFilters }) {
    return (
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
    );
}