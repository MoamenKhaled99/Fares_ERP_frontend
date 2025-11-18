import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type) fetchProducts();
  }, [type]);

  const addProduct = async (productData) => {
    await productService.create(type, productData);
    fetchProducts();
  };

  const removeProduct = async (id) => {
    await productService.delete(type, id);
    fetchProducts();
  };

  const addStock = async (id, stockData) => {
    await productService.addStock(type, id, stockData);
    fetchProducts();
  };

  return { data, loading, error, addProduct, removeProduct, addStock, refresh: fetchProducts };
};