import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/components/setup/MockAPI';
import { useQuery } from '@tanstack/react-query';
import { Shield, Zap, Globe, Lock, Headphones, Infinity } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PricingCard from '@/components/vpn/PricingCard';
import PaymentMethodCard from '@/components/vpn/PaymentMethodCard';
import PaymentForm from '@/components/payment/PaymentForm';
import SuccessAnimation from '@/components/payment/SuccessAnimation';

const plans = {
    monthly: [
        {
            id: 'free',
            name: 'Free',
            price: 0,
            features: [
                '5 локаций серверов',
                '1 устройство',
                'Ограниченная скорость',
                'Базовое шифрование',
            ]
        },
        {
            id: 'basic',
            name: 'Basic',
            price: 4.99,
            features: [
                '20 локаций серверов',
                '3 устройства',
                'Высокая скорость',
                'AES-256 шифрование',
                'Kill Switch',
            ]
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 9.99,
            features: [
                '50+ локаций серверов',
                '5 устройств',
                'Максимальная скорость',
                'Double VPN',
                'Выделенный IP',
                'Приоритетная поддержка',
            ]
        },
        {
            id: 'ultimate',
            name: 'Ultimate',
            price: 14.99,
            features: [
                'Все локации серверов',
                'Безлимит устройств',
                'Максимальная скорость',
                'Double VPN + Onion',
                'Выделенный IP',
                '24/7 VIP поддержка',
                'Менеджер паролей',
            ]
        }
    ],
    yearly: [
        {
            id: 'free',
            name: 'Free',
            price: 0,
            features: [
                '5 локаций серверов',
                '1 устройство',
                'Ограниченная скорость',
                'Базовое шифрование',
            ]
        },
        {
            id: 'basic',
            name: 'Basic',
            price: 2.99,
            savings: 40,
            features: [
                '20 локаций серверов',
                '3 устройства',
                'Высокая скорость',
                'AES-256 шифрование',
                'Kill Switch',
            ]
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 5.99,
            savings: 40,
            features: [
                '50+ локаций серверов',
                '5 устройств',
                'Максимальная скорость',
                'Double VPN',
                'Выделенный IP',
                'Приоритетная поддержка',
            ]
        },
        {
            id: 'ultimate',
            name: 'Ultimate',
            price: 8.99,
            savings: 40,
            features: [
                'Все локации серверов',
                'Безлимит устройств',
                'Максимальная скорость',
                'Double VPN + Onion',
                'Выделенный IP',
                '24/7 VIP поддержка',
                'Менеджер паролей',
            ]
        }
    ]
};

const paymentMethods = ['card', 'paypal', 'crypto', 'apple_pay', 'google_pay'];

export default function Pricing() {
    const [billingPeriod, setBillingPeriod] = useState('monthly');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStep, setPaymentStep] = useState('method'); // 'method', 'form', 'success'
    const [user, setUser] = useState(null);
    const [userPlan, setUserPlan] = useState('free');

    useEffect(() => {
        base44.auth.me().then(setUser).catch(() => {});
    }, []);

    const { data: subscriptions = [] } = useQuery({
        queryKey: ['subscriptions', user?.email],
        queryFn: () => base44.entities.Subscription.filter({ user_email: user?.email }),
        enabled: !!user?.email,
    });

    useEffect(() => {
        if (subscriptions.length > 0) {
            const activeSub = subscriptions.find(s => s.status === 'active');
            if (activeSub) setUserPlan(activeSub.plan);
        }
    }, [subscriptions]);

    const handlePaymentMethodSelect = () => {
        if (selectedPayment === 'card') {
            setPaymentStep('form');
        } else {
            // Для других методов оплаты сразу обрабатываем
            handlePurchase();
        }
    };

    const handlePurchase = async (cardData) => {
        if (!user) {
            toast.error('Войдите в аккаунт для покупки');
            base44.auth.redirectToLogin();
            return;
        }

        setIsProcessing(true);
        try {
            // Симуляция обработки платежа
            await new Promise(r => setTimeout(r, 2000));

            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + (billingPeriod === 'yearly' ? 12 : 1));

            await base44.entities.Payment.create({
                user_email: user.email,
                amount: selectedPlan.price * (billingPeriod === 'yearly' ? 12 : 1),
                plan: selectedPlan.id,
                payment_method: selectedPayment,
                status: 'completed',
                transaction_id: `TXN${Date.now()}`
            });

            await base44.entities.Subscription.create({
                user_email: user.email,
                plan: selectedPlan.id,
                status: 'active',
                start_date: new Date().toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0],
                auto_renew: true
            });

            setPaymentStep('success');
            setUserPlan(selectedPlan.id);
        } catch (error) {
            toast.error('Ошибка при оформлении подписки');
        }
        setIsProcessing(false);
    };

    const handleCloseDialog = () => {
        setSelectedPlan(null);
        setPaymentStep('method');
        setIsProcessing(false);
    };

    const features = [
        { icon: Shield, text: 'Военное шифрование' },
        { icon: Zap, text: 'Молниеносная скорость' },
        { icon: Globe, text: 'Серверы по всему миру' },
        { icon: Lock, text: 'No-logs политика' },
        { icon: Headphones, text: '24/7 поддержка' },
        { icon: Infinity, text: 'Безлимитный трафик' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-4 pb-24">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div 
                    className="text-center mb-12 pt-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Выберите свой план
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Получите полный доступ к быстрым и безопасным серверам по всему миру
                    </p>
                </motion.div>

                {/* Features */}
                <motion.div 
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/30">
                            <feature.icon className="w-6 h-6 text-violet-400" />
                            <span className="text-xs text-slate-300 text-center">{feature.text}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-8">
                    <Tabs value={billingPeriod} onValueChange={setBillingPeriod}>
                        <TabsList className="bg-slate-800 border border-slate-700">
                            <TabsTrigger value="monthly" className="data-[state=active]:bg-violet-600">
                                Месячно
                            </TabsTrigger>
                            <TabsTrigger value="yearly" className="data-[state=active]:bg-violet-600">
                                Годово <span className="ml-1 text-xs text-emerald-400">-40%</span>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans[billingPeriod].map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <PricingCard
                                plan={plan}
                                isPopular={plan.id === 'pro'}
                                isCurrent={userPlan === plan.id}
                                onSelect={setSelectedPlan}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Payment Dialog */}
                <Dialog open={!!selectedPlan} onOpenChange={handleCloseDialog}>
                    <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
                        {paymentStep === 'success' ? (
                            <SuccessAnimation
                                plan={selectedPlan?.name}
                                onClose={handleCloseDialog}
                            />
                        ) : (
                            <>
                                <DialogHeader>
                                    <DialogTitle className="text-white text-xl">
                                        {paymentStep === 'method' ? 'Оформление подписки' : 'Данные карты'}
                                    </DialogTitle>
                                </DialogHeader>
                                
                                {paymentStep === 'method' && (
                                    <>
                                        <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-white font-semibold">{selectedPlan?.name}</p>
                                                    <p className="text-sm text-slate-400">
                                                        {billingPeriod === 'yearly' ? 'Годовая подписка' : 'Месячная подписка'}
                                                    </p>
                                                </div>
                                                <p className="text-2xl font-bold text-white">
                                                    ${selectedPlan?.price * (billingPeriod === 'yearly' ? 12 : 1)}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-slate-400 mb-4">Выберите способ оплаты</p>
                                        
                                        <div className="space-y-3 mb-6">
                                            {paymentMethods.map((method) => (
                                                <PaymentMethodCard
                                                    key={method}
                                                    method={method}
                                                    isSelected={selectedPayment === method}
                                                    onSelect={setSelectedPayment}
                                                />
                                            ))}
                                        </div>

                                        <Button
                                            onClick={handlePaymentMethodSelect}
                                            disabled={isProcessing}
                                            className="w-full h-12 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                                        >
                                            {isProcessing ? 'Обработка...' : 'Продолжить'}
                                        </Button>

                                        <p className="text-xs text-slate-500 text-center mt-4">
                                            Нажимая "Продолжить", вы соглашаетесь с условиями использования
                                        </p>
                                    </>
                                )}

                                {paymentStep === 'form' && (
                                    <PaymentForm
                                        onSubmit={handlePurchase}
                                        isProcessing={isProcessing}
                                        onBack={() => setPaymentStep('method')}
                                    />
                                )}
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}