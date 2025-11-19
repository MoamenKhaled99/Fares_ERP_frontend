// src/hooks/useInvoiceList.js
import { useState, useEffect } from "react";
import { invoiceService } from "@/services/invoiceService";

// Helper for date conversion (DRY Principle)
const toISOString = (dateString) => {
    if (!dateString || typeof dateString !== 'string' || dateString.length === 0) return undefined;
    
    let adjustedDate = new Date(dateString);
    if (isNaN(adjustedDate.getTime())) return undefined;
    
    adjustedDate.setDate(adjustedDate.getDate() + 1);
    return adjustedDate.toISOString().split("T")[0];
};

const toISOStringStart = (dateString) => {
    if (!dateString || typeof dateString !== 'string' || dateString.length === 0) return undefined;
    let date = new Date(dateString);
    if (isNaN(date.getTime())) return undefined;
    return date.toISOString().split("T")[0];
};

export const useInvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    useEffect(() => {
        fetchInvoices();
    }, [fromDate, toDate]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const params = {};

            // Convert state strings to API format using the helpers (DRY)
            const apiFromDate = toISOStringStart(fromDate);
            const apiToDate = toISOString(toDate);

            if (apiFromDate) params.from_date = apiFromDate;
            if (apiToDate) params.to_date = apiToDate;

            const data = await invoiceService.getAll(params);
            setInvoices(data);
            setError(null);
        } catch (e) {
            console.error("Error fetching invoices:", e);
            setError("فشل تحميل الفواتير");
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setFromDate("");
        setToDate("");
    };

    return {
        invoices,
        loading,
        error,
        selectedInvoice,
        setSelectedInvoice,
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        handleClearFilters,
        fetchInvoices,
    };
};