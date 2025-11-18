import React, { useState } from 'react';
import {Button} from '../../components/ui/button';
import {Input} from '../../components/ui/input';
import {Label} from '../../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

const AddStockModal = ({ product, onSubmit, onClose }) => {
  const [form, setForm] = useState({ الكمية: '', السعر: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(product.id, {
        الكمية: parseInt(form.الكمية),
        السعر: parseFloat(form.السعر)
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>إضافة مخزون: {product.وصف}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>الكمية الواردة</Label>
              <Input required type="number" value={form.الكمية} onChange={e => setForm({...form, الكمية: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>سعر الشراء الجديد</Label>
              <Input required type="number" step="0.01" value={form.السعر} onChange={e => setForm({...form, السعر: e.target.value})} />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
              <Button type="submit" variant="success" isLoading={loading}>تأكيد الوارد</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddStockModal;