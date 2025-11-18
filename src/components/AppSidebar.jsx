import { LayoutDashboard, Anchor, Cable, Package, ShoppingCart } from 'lucide-react';
import { cn } from '../lib/utils';

const AppSidebar = ({ currentPath, navigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, path: '/' },
    { type: 'separator', label: 'المخزون' },
    { id: 'irons', label: 'الحديد', icon: Anchor, path: '/irons' },
    { id: 'wires', label: 'الويرات', icon: Cable, path: '/wires' },
    { id: 'silk', label: 'الشرائط', icon: Package, path: '/silk' },
    { type: 'separator', label: 'المعاملات' },
    { id: 'invoices', label: 'الفواتير', icon: ShoppingCart, path: '/invoices' },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col border-l bg-white h-screen sticky top-0 border-r">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center text-lg">F</div>
          Fares ERP
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item, idx) => (
          item.type === 'separator' ? (
            <div key={idx} className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {item.label}
            </div>
          ) : (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
                currentPath === item.path 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        ))}
      </nav>
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">A</div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">المسؤول</p>
            <p className="text-xs text-gray-500">admin@fares.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;