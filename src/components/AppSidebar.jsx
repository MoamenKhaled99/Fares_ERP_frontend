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
    <aside className="hidden md:flex w-64 flex-col glass-effect h-screen sticky top-0 shadow-xl">
      <div className="p-6 border-b border-gray-200/50">
        <h1 className="text-2xl font-bold gradient-blue bg-clip-text text-transparent flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-blue text-white flex items-center justify-center text-xl font-bold shadow-lg">F</div>
          Fares ERP
        </h1>
        <p className="text-xs text-gray-500 mt-2 mr-13">نظام إدارة متكامل</p>
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
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                currentPath === item.path 
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50" 
                  : "text-gray-700 hover:bg-white/50 hover:text-gray-900 hover:shadow-md"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          )
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200/50 bg-white/30">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-all cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg">A</div>
          <div className="text-sm">
            <p className="font-semibold text-gray-900">المسؤول</p>
            <p className="text-xs text-gray-500">admin@fares.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;