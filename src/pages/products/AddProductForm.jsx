import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { productService } from '../../services/productService';

const AddProductForm = ({ onSubmit, onClose, type }) => {
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
          <Label>اسم المنتج / الوصف</Label>
          <Input
            required
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="مثال: حدايد تسليح 10مم"
          />
        </div>
      )}

      {isSilkStrip ? (
        <>
          <div className="space-y-2">
            <Label>حمولة الطن (Load Capacity)</Label>
            <Input
              required
              type="number"
              step="0.01"
              value={form.loadCapacity}
              onChange={e => setForm({ ...form, loadCapacity: e.target.value })}
              placeholder="مثال: 2"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>معامل الأمان (Safety Factor)</Label>
              <select
                required
                className="w-full h-10 rounded-md border border-gray-300 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.safetyFactor}
                onChange={e => setForm({ ...form, safetyFactor: e.target.value })}
              >
                {safetyFactorRates.length > 0 ? (
                  safetyFactorRates.map(rate => (
                    <option key={rate.id} value={rate.factor}>
                      {rate.factor} (معدل: {rate.rate})
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
              <Label>الوحدة بالمتر (Unit Meter)</Label>
              <Input
                required
                type="number"
                step="0.01"
                value={form.unitMeter}
                onChange={e => setForm({ ...form, unitMeter: e.target.value })}
                placeholder="مثال: 5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>إجمالي الكمية</Label>
            <Input
              required
              type="number"
              value={form.totalQuantity}
              onChange={e => setForm({ ...form, totalQuantity: e.target.value })}
            />
          </div>

          <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-800">
            💡 السعر سيتم حسابه تلقائياً: معدل معامل الأمان × الوحدة بالمتر × حمولة الطن
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>سعر الوحدة</Label>
            <Input
              required
              type="number"
              step="0.01"
              value={form.unitPrice}
              onChange={e => setForm({ ...form, unitPrice: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>إجمالي الكمية</Label>
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
        <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'جاري الحفظ...' : 'حفظ المنتج'}
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;