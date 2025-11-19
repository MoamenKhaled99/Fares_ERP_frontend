import { useState, useEffect } from "react";
import { productService } from "../services/productService";
import { toast } from "sonner"; // ✅ FIX: Import toast from the sonner package

export const useProducts = (type) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await productService.getAll(type);
      setData(Array.isArray(result) ? result : []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("فشل تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type) fetchProducts();
  }, [type]);

  const addProduct = async (productData) => {
    try {
      await productService.create(type, productData);
      toast.success("تم إضافة المنتج بنجاح");
      fetchProducts();
    } catch (err) {
      toast.error("فشل إضافة المنتج");
      console.error(err);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      await productService.update(type, id, productData);
      toast.success("تم تحديث المنتج بنجاح");
      fetchProducts();
    } catch (err) {
      toast.error("فشل تحديث المنتج");
      console.error(err);
    }
  };

  const removeProduct = async (id) => {
    try {
      await productService.delete(type, id);
      toast.success("تم حذف المنتج");
    } catch (err) {
      console.error("Delete error:", err);
      if (err.message && err.message.includes("404")) {
        toast.warning("المنتج غير موجود بالفعل");
      } else {
        toast.error("فشل حذف المنتج");
      }
    } finally {
      // Always refresh the list to ensure UI matches Database
      fetchProducts();
    }
  };

  const addStock = async (id, stockData) => {
    try {
      await productService.addStock(type, id, stockData);
      toast.success("تم تحديث المخزون");
      fetchProducts();
      return true; // Indicate success
    } catch (err) {
      console.error("Add stock error:", err);
      if (err.message && err.message.includes("404")) {
        toast.error("المنتج غير موجود");
      } else if (err.message && err.message.includes("Product not found")) {
        toast.error("المنتج غير موجود");
      } else {
        toast.error("فشل تحديث المخزون: " + (err.message || "خطأ غير معروف"));
      }
      // Refresh to sync UI with database
      fetchProducts();
      throw err; // Re-throw to let modal handle it
    }
  };

  return {
    data,
    loading,
    error,
    addProduct,
    updateProduct,
    removeProduct,
    addStock,
    refresh: fetchProducts,
  };
};
