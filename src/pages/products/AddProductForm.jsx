import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { productService } from '../../services/productService';

const AddProductForm = ({ onSubmit, onClose, type }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    description: '',
    totalQuantity: 0,
    // Fields for silk strips
    loadCapacity: '',
    safetyFactor: '1:6',
    unitMeter: ''
  });
  const [loading, setLoading] = useState(false);
  const [safetyFactorRates, setSafetyFactorRates] = useState([]);

  const isSilkStrip = type === 'silk-strips';

  useEffect(() => {
    if (isSilkStrip) {
      // Load safety factor rates
      productService.getSafetyFactorRates()
        .then(response => {
          setSafetyFactorRates(response.data?.data || []);
        })
        .catch(err => console.error('Failed to load safety factor rates:', err));
    }
  }, [isSilkStrip]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        totalQuantity: parseInt(form.totalQuantity),
      };

      if (isSilkStrip) {
        // Silk strips: auto-calculated unitPrice
        payload.loadCapacity = parseFloat(form.loadCapacity);
        payload.safetyFactor = form.safetyFactor; // String: "1:5", "1:6", "1:7"
        payload.unitMeter = parseFloat(form.unitMeter);
      } else {
        // Irons and Wires use description and manual unitPrice
        payload.description = form.description;
        payload.unitPrice = parseFloat(form.unitPrice);
      }

      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isSilkStrip && (
        <div className="space-y-2">
          <Label>{t('products.productName')}</Label>
          <Input
            required
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder={t('products.productNamePlaceholder')}
          />
        </div>
      )}

      {isSilkStrip ? (
        <>
          <div className="space-y-2">
            <Label>{t('products.loadCapacity')}</Label>
            <Input
              required
              type="number"
              step="0.01"
              value={form.loadCapacity}
              onChange={e => setForm({ ...form, loadCapacity: e.target.value })}
              placeholder={t('products.loadCapacityPlaceholder')}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('products.safetyFactor')}</Label>
              <select
                required
                className="w-full h-10 rounded-md border border-gray-300 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.safetyFactor}
                onChange={e => setForm({ ...form, safetyFactor: e.target.value })}
              >
                {safetyFactorRates.length > 0 ? (
                  safetyFactorRates.map(rate => (
                    <option key={rate.id} value={rate.factor}>
                      {t('products.safetyFactorWithRate', { factor: rate.factor, rate: rate.rate })}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="1:5">1:5</option>
                    <option value="1:6">1:6</option>
                    <option value="1:7">1:7</option>
                  </>
                )}
              </select>
            </div>
            <div className="space-y-2">
              <Label>{t('products.unitMeter')}</Label>
              <Input
                required
                type="number"
                step="0.01"
                value={form.unitMeter}
                onChange={e => setForm({ ...form, unitMeter: e.target.value })}
                placeholder={t('products.unitMeterPlaceholder')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('products.totalQuantity')}</Label>
            <Input
              required
              type="number"
              value={form.totalQuantity}
              onChange={e => setForm({ ...form, totalQuantity: e.target.value })}
            />
          </div>

          <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-800">
            {t('products.priceAutoCalcNote')}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t('products.unitPrice')}</Label>
            <Input
              required
              type="number"
              step="0.01"
              value={form.unitPrice}
              onChange={e => setForm({ ...form, unitPrice: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('products.totalQuantity')}</Label>
            <Input
              required
              type="number"
              value={form.totalQuantity}
              onChange={e => setForm({ ...form, totalQuantity: e.target.value })}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
        <Button type="submit" disabled={loading}>
          {loading ? t('products.savingProduct') : t('products.saveProduct')}
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;