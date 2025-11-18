import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Button from '../components/ui/button';
import AppSidebar from '../components/AppSidebar';  
import DashboardPage from '../pages/dashboard';
import ProductsPage from '../pages/products';
import InvoiceCreator from '../pages/invoices/InvoiceCreator';

// NOTE: For a full desktop app, you would likely use 'react-router-dom'.
// This simple state-based router works perfectly for a single-window electron app.
const AppRouter = () => {
  const [currentPath, setCurrentPath] = useState('/');

  const navigate = (path) => setCurrentPath(path);

  const renderContent = () => {
    switch (currentPath) {
      case '/': return <DashboardPage />;
      case '/irons': return <ProductsPage title="الحديد" type="irons" />;
      case '/wires': return <ProductsPage title="الويرات" type="wires" />;
      case '/silk': return <ProductsPage title="الشرائط الحريرية" type="silk-strips" />;
      case '/invoices': return <InvoiceCreator />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans" dir="rtl">
      <AppSidebar currentPath={currentPath} navigate={navigate} />
      
      <main className="flex-1 overflow-auto bg-gray-50/50">
        {/* Mobile Header */}
        <header className="md:hidden h-14 border-b bg-white flex items-center px-4 justify-between sticky top-0 z-10">
          <span className="font-bold text-lg text-blue-600">نظام فارس</span>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        
        {renderContent()}
      </main>
    </div>
  );
};

export default AppRouter;