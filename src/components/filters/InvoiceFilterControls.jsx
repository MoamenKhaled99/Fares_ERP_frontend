// src/components/filters/InvoiceFilterControls.jsx (NEW FILE)
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export function InvoiceFilterControls({ fromDate, setFromDate, toDate, setToDate, handleClearFilters }) {
    return (
        <div className="flex items-center gap-4 border p-4 rounded-lg bg-white shadow-sm">
            <h3 className="text-md font-medium text-gray-700 shrink-0">
                تصفية التاريخ:
            </h3>

            <div className="flex items-center gap-2">
                <Label>من:</Label>
                <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-48"
                />
            </div>

            <div className="flex items-center gap-2">
                <Label>إلى:</Label>
                <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-48"
                />
            </div>

            <Button onClick={handleClearFilters} variant="ghost" size="sm">
                مسح
            </Button>
        </div>
    );
}