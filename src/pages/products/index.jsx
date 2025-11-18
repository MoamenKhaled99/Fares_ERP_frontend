import React, { useState } from 'react';
import { Plus, AlertCircle, Loader2 } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import ProductTable from './ProductTable';
import AddProductForm from './AddProductForm';
import AddStockModal from './AddStockModal';
import EditProductModal from './EditProductModal';

const ProductsPage = ({ title = "المنتجات", type = "irons" }) => {
  const { data, loading, error, addProduct, removeProduct, addStock, updateProduct } = useProducts(type);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [stockItem, setStockItem] = useState(null);
  const [editItem, setEditItem] = useState(null);

  return (
    <div className="space-y-6 p-8 min-h-screen" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 drop-shadow-sm">{title}</h2>
          <p className="text-gray-500 text-lg mt-1">إدارة مخزون {title} والمبيعات</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} size="lg" className="shadow-xl">
          <Plus className="ml-2 h-5 w-5" /> إضافة منتج
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
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
          ) : (
            <ProductTable products={data} onDelete={removeProduct} onAddStock={setStockItem} />
          )}
        </CardContent>
      </Card>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md animate-in fade-in zoom-in duration-200">
            <CardHeader>
              <CardTitle>إضافة {title} جديد</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Pass the type prop here so the form knows which fields to show */}
              <AddProductForm onSubmit={addProduct} onClose={() => setIsAddOpen(false)} type={type} />
            </CardContent>
          </Card>
        </div>
      )}

      {stockItem && (
        <AddStockModal
          product={stockItem}
          onSubmit={addStock}
          onClose={() => setStockItem(null)}
        />
      )}

      {editItem && (
        <EditProductModal
          product={editItem}
          type={type}
          onSubmit={updateProduct} // Pass update function
          onClose={() => setEditItem(null)} // Close function
        />
      )}
    </div>
  );
};

export default ProductsPage;