import { useTranslation } from 'react-i18next';
import { Loader2, AlertCircle, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { InvoiceDetailsModal } from "@/components/invoices/InvoiceDetailsModal"; // Assumed path

// ✅ NEW IMPORTS from refactored files
import { InvoiceListTable } from "@/components/invoices/InvoiceListTable"; 
import { InvoiceFilterControls } from "@/components/filters/InvoiceFilterControls";
import { useInvoiceList } from "@/hooks/useInvoiceList";


export default function InvoicesList({ navigate }) {
  const { t } = useTranslation();
  // ✅ USE HOOK: All state and fetching logic is here
  const {
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
  } = useInvoiceList();

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">{t('invoices.list')}</h2>
          <p className="text-muted-foreground">{t('invoices.listDescription')}</p>
        </div>
        <Button
          onClick={() => navigate("/invoices/new")}
          className="shadow-lg"
        >
          <Plus className="ml-2 h-4 w-4" /> {t('invoices.newInvoice')}
        </Button>
      </div>

      {/* ✅ FILTER CONTROLS (SRP) */}
      <InvoiceFilterControls 
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        handleClearFilters={handleClearFilters}
      />

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* ✅ INVOICE TABLE (SRP) */}
      <InvoiceListTable
        invoices={invoices}
        loading={loading}
        navigate={navigate}
        setSelectedInvoice={setSelectedInvoice}
      />

      {/* Modal Renderer */}
      {selectedInvoice && (
        <InvoiceDetailsModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}