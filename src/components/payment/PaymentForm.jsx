import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Calendar, AlertCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function PaymentForm({ onSubmit, isProcessing, onBack }) {
    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });
    const [errors, setErrors] = useState({});

    const formatCardNumber = (value) => {
        return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    };

    const formatExpiry = (value) => {
        return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (cardData.number.replace(/\s/g, '').length !== 16) {
            newErrors.number = 'Неверный номер карты';
        }
        if (!cardData.name) {
            newErrors.name = 'Введите имя владельца';
        }
        if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
            newErrors.expiry = 'Неверный формат (ММ/ГГ)';
        }
        if (cardData.cvv.length !== 3) {
            newErrors.cvv = 'CVV должен содержать 3 цифры';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(cardData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Preview */}
            <motion.div
                initial={{ rotateY: 0 }}
                whileHover={{ rotateY: 10 }}
                className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white shadow-2xl"
            >
                <div className="flex justify-between items-start mb-8">
                    <CreditCard className="w-12 h-12" />
                    <Lock className="w-6 h-6 opacity-50" />
                </div>
                <div className="mb-6">
                    <p className="text-xl tracking-wider font-mono">
                        {cardData.number || '•••• •••• •••• ••••'}
                    </p>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs opacity-60 mb-1">Владелец карты</p>
                        <p className="font-semibold uppercase">
                            {cardData.name || 'ИМЯ ФАМИЛИЯ'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs opacity-60 mb-1">Срок</p>
                        <p className="font-mono">{cardData.expiry || 'ММ/ГГ'}</p>
                    </div>
                </div>
            </motion.div>

            {/* Form Fields */}
            <div className="space-y-4">
                <div>
                    <Label htmlFor="number">Номер карты</Label>
                    <Input
                        id="number"
                        placeholder="1234 5678 9012 3456"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                        maxLength={19}
                        className={errors.number ? 'border-red-500' : ''}
                    />
                    {errors.number && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.number}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="name">Имя владельца</Label>
                    <Input
                        id="name"
                        placeholder="IVAN IVANOV"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                        className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="expiry">Срок действия</Label>
                        <Input
                            id="expiry"
                            placeholder="ММ/ГГ"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                            maxLength={5}
                            className={errors.expiry ? 'border-red-500' : ''}
                        />
                        {errors.expiry && (
                            <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                            id="cvv"
                            type="password"
                            placeholder="123"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                            maxLength={3}
                            className={errors.cvv ? 'border-red-500' : ''}
                        />
                        {errors.cvv && (
                            <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-2 bg-slate-800/50 rounded-lg p-3 text-sm text-slate-400">
                <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>Ваши данные защищены 256-битным SSL шифрованием</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    disabled={isProcessing}
                    className="flex-1"
                >
                    Назад
                </Button>
                <Button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                >
                    {isProcessing ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                            Обработка...
                        </>
                    ) : (
                        <>
                            <Lock className="w-4 h-4 mr-2" />
                            Оплатить
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}