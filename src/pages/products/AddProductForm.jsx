import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const AddProductForm = ({ onSubmit, onClose, type }) => {
  const [form, setForm] = useState({ 
    description: '', 
    unitPrice: '', 
    totalQuantity: 0,
    // Fields for silk strips
    loadCapacity: '',
    safetyFactor: '',
    unitMeter: '' 
  });
  const [loading, setLoading] = useState(false);

  const isSilkStrip = type === 'silk-strips';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        unitPrice: parseFloat(form.unitPrice),
        totalQuantity: parseInt(form.totalQuantity),
      };

      // Conditionally add fields based on type
      if (isSilkStrip) {
         // Silk strips don't use description in the schema provided earlier, 
         // but let's double check if your backend validation requires it.
         // The error says safetyFactor and unitMeter are missing.
         payload.loadCapacity = parseFloat(form.loadCapacity);
         payload.safetyFactor = parseFloat(form.safetyFactor);
         payload.unitMeter = parseFloat(form.unitMeter);
      } else {
         // Irons and Wires use description
         payload.description = form.description;
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
            onChange={e => setForm({...form, description: e.target.value})} 
            placeholder="مثال: حديد تسليح 10مم" 
          />
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>سعر الشراء (للوحدة)</Label>
          <Input 
            required 
            type="number" 
            step="0.01" 
            value={form.unitPrice} 
            onChange={e => setForm({...form, unitPrice: e.target.value})} 
          />
        </div>
        <div className="space-y-2">
          <Label>الرصيد الافتتاحي</Label>
          <Input 
            required 
            type="number" 
            value={form.totalQuantity} 
            onChange={e => setForm({...form, totalQuantity: e.target.value})} 
          />
        </div>
      </div>

      {isSilkStrip && (
        <>
          <div className="space-y-2">
             <Label>حمولة الطن (Load Capacity)</Label>
             <Input 
               required 
               type="number" 
               step="0.01"
               value={form.loadCapacity} 
               onChange={e => setForm({...form, loadCapacity: e.target.value})} 
             />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>معامل الأمان (Safety Factor)</Label>
              <Input 
                required 
                type="number" 
                step="0.01"
                value={form.safetyFactor} 
                onChange={e => setForm({...form, safetyFactor: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>المتر (Unit Meter)</Label>
              <Input 
                required 
                type="number" 
                step="0.01"
                value={form.unitMeter} 
                onChange={e => setForm({...form, unitMeter: e.target.value})} 
              />
            </div>
          </div>
        </>
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