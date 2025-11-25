// products/DeleteConfirmationModal.jsx (NEW FILE)
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';

const DeleteConfirmationModal = ({ product, onConfirm, onClose }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm(); 
        } catch (error) {
            // Error is logged/handled by the underlying hook/service
            console.error('Deletion attempt failed in modal:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const productName = product.description || product.name || `ID: ${product.id}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <Card 
                className="w-full max-w-sm animate-in fade-in zoom-in duration-200"
                onClick={e => e.stopPropagation()} 
            >
                <CardHeader className="text-center">
                    <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                    <CardTitle className="text-xl">{t('products.confirmDelete')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                    <p className="text-center text-gray-700">
                        {t('products.deleteConfirmMessage')} 
                        <span className="font-bold text-red-600 block mt-1">"{productName}"</span>
                    </p>
                    <p className="text-sm text-gray-500 text-center">{t('products.deleteCannotUndo')}</p>
                    
                    <div className="flex justify-between gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>{t('common.cancel')}</Button>
                        <Button 
                            type="button" 
                            variant="destructive" 
                            onClick={handleConfirm} 
                            disabled={loading}
                        >
                            {loading ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> {t('products.deleting')}</> : 
                            <><Trash2 className="ml-2 h-4 w-4" /> {t('products.confirmDeleteButton')}</>}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DeleteConfirmationModal;