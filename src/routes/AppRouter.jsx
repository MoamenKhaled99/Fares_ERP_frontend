import React, { useState } from 'react';
import { FaresSidebar } from '../components/FaresSidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import DashboardPageNew from '../pages/dashboard/DashboardNew';
import ProductsPage from '../pages/products';
import InvoiceCreator from '../pages/invoices/InvoiceCreator';
import InvoicesList from '../pages/invoices/InvoicesList';

// NOTE: For a full desktop app, you would likely use 'react-router-dom'.
// This simple state-based router works perfectly for a single-window electron app.
const AppRouter = () => {
  const [currentPath, setCurrentPath] = useState('/');

  const navigate = (path) => setCurrentPath(path);

  const renderContent = () => {
    switch (currentPath) {
      case '/': return <DashboardPageNew />;
      case '/irons': return <ProductsPage title="الحديد" type="irons" />;
      case '/wires': return <ProductsPage title="الويرات" type="wires" />;
      case '/silk': return <ProductsPage title="الشرائط الحريرية" type="silk-strips" />;
      case '/invoices': return <InvoicesList />;
      case '/invoices/new': return <InvoiceCreator />;
      default: return <DashboardPageNew />;
    }
  };

  return (
    <SidebarProvider>
      <FaresSidebar currentPath={currentPath} navigate={navigate} />
      <SidebarInset>
        {/* Mobile Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 px-4 sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2 flex-1">
            <span className="font-bold text-xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">نظام فارس</span>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppRouter;