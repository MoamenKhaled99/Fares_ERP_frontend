import React, { useState } from 'react';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import Label from '../../components/ui/label';

const AddProductForm = ({ onSubmit, onClose }) => {
  const [form, setForm] = useState({ وصف: '', سعر_الوحدة: '', وارد: 0 });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        سعر_الوحدة: parseFloat(form.سعر_الوحدة),
        وارد: parseInt(form.وارد)
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>اسم المنتج / الوصف</Label>
        <Input required value={form.وصف} onChange={e => setForm({...form, وصف: e.target.value})} placeholder="مثال: حديد تسليح 10مم" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>سعر الشراء (للوحدة)</Label>
          <Input required type="number" step="0.01" value={form.سعر_الوحدة} onChange={e => setForm({...form, سعر_الوحدة: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label>الرصيد الافتتاحي</Label>
          <Input required type="number" value={form.وارد} onChange={e => setForm({...form, وارد: e.target.value})} />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
        <Button type="submit" isLoading={loading}>حفظ المنتج</Button>
      </div>
    </form>
  );
};

export default AddProductForm;