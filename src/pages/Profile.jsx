import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/components/setup/MockAPI';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
    User, Mail, Shield, Crown, Calendar, CreditCard, 
    Settings, LogOut, ChevronRight, Bell, Globe, Lock,
    Smartphone, Monitor, Tablet
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const planBadges = {
    free: { label: 'Free', color: 'bg-slate-500' },
    basic: { label: 'Basic', color: 'bg-blue-500' },
    pro: { label: 'Pro', color: 'bg-violet-500' },
    ultimate: { label: 'Ultimate', color: 'bg-gradient-to-r from-amber-500 to-orange-500' },
};

const devices = [
    { id: 1, name: 'iPhone 15 Pro', type: 'mobile', lastActive: new Date() },
    { id: 2, name: 'MacBook Pro', type: 'desktop', lastActive: new Date(Date.now() - 86400000) },
    { id: 3, name: 'iPad Air', type: 'tablet', lastActive: new Date(Date.now() - 172800000) },
];

const deviceIcons = {
    mobile: Smartphone,
    desktop: Monitor,
    tablet: Tablet,
};

export default function Profile() {
    const [user, setUser] = useState(null);
    const [userPlan, setUserPlan] = useState('free');
    const [subscription, setSubscription] = useState(null);
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [notifications, setNotifications] = useState(true);
    const [autoConnect, setAutoConnect] = useState(false);
    const [killSwitch, setKillSwitch] = useState(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        base44.auth.me().then(u => {
            setUser(u);
            setEditedName(u?.full_name || '');
        }).catch(() => {});
    }, []);

    const { data: subscriptions = [] } = useQuery({
        queryKey: ['subscriptions', user?.email],
        queryFn: () => base44.entities.Subscription.filter({ user_email: user?.email }),
        enabled: !!user?.email,
    });

    const { data: payments = [] } = useQuery({
        queryKey: ['payments', user?.email],
        queryFn: () => base44.entities.Payment.filter({ user_email: user?.email }, '-created_date', 5),
        enabled: !!user?.email,
    });

    useEffect(() => {
        if (subscriptions.length > 0) {
            const activeSub = subscriptions.find(s => s.status === 'active');
            if (activeSub) {
                setUserPlan(activeSub.plan);
                setSubscription(activeSub);
            }
        }
    }, [subscriptions]);

    const handleLogout = () => {
        base44.auth.logout();
    };

    const handleSaveProfile = async () => {
        try {
            await base44.auth.updateMe({ full_name: editedName });
            setUser({ ...user, full_name: editedName });
            toast.success('Профиль обновлён');
            setEditProfileOpen(false);
        } catch (error) {
            toast.error('Ошибка при обновлении профиля');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 flex items-center justify-center p-4">
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Shield className="w-16 h-16 text-violet-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">Войдите в аккаунт</h2>
                    <p className="text-slate-400 mb-6">Для доступа к профилю необходимо авторизоваться</p>
                    <Button 
                        onClick={() => base44.auth.redirectToLogin()}
                        className="bg-violet-500 hover:bg-violet-600"
                    >
                        Войти
                    </Button>
                </motion.div>
            </div>
        );
    }

    const planBadge = planBadges[userPlan];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-4 pb-24">
            <div className="max-w-lg mx-auto">
                {/* Header */}
                <motion.div 
                    className="text-center pt-8 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Avatar className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-violet-500 to-purple-600">
                        <AvatarFallback className="text-2xl text-white bg-transparent">
                            {user.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold text-white mb-1">{user.full_name || 'Пользователь'}</h1>
                    <p className="text-slate-400 text-sm mb-3">{user.email}</p>
                    <Badge className={`${planBadge.color} text-white`}>
                        <Crown className="w-3 h-3 mr-1" />
                        {planBadge.label}
                    </Badge>
                </motion.div>

                {/* Subscription Card */}
                {subscription && userPlan !== 'free' && (
                    <motion.div
                        className="bg-gradient-to-br from-violet-900/50 to-slate-800 rounded-2xl p-5 border border-violet-500/30 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-slate-400">Текущий план</p>
                                <p className="text-xl font-bold text-white">{planBadge.label}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-400">Действует до</p>
                                <p className="text-white font-medium">
                                    {subscription.end_date && format(new Date(subscription.end_date), 'd MMM yyyy', { locale: ru })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Автопродление</span>
                            <Badge variant="outline" className={subscription.auto_renew ? 'border-emerald-500 text-emerald-400' : 'border-slate-600 text-slate-400'}>
                                {subscription.auto_renew ? 'Включено' : 'Отключено'}
                            </Badge>
                        </div>
                    </motion.div>
                )}

                {/* Settings Sections */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Account Section */}
                    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-700/50">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Аккаунт</p>
                        </div>
                        
                        <button 
                            onClick={() => setEditProfileOpen(true)}
                            className="w-full flex items-center gap-4 p-4 hover:bg-slate-700/30 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-violet-400" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-white font-medium">Редактировать профиль</p>
                                <p className="text-sm text-slate-400">Имя и контакты</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-500" />
                        </button>

                        <Separator className="bg-slate-700/50" />

                        <div className="flex items-center gap-4 p-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">Email</p>
                                <p className="text-sm text-slate-400">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-700/50">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Безопасность</p>
                        </div>
                        
                        <div className="flex items-center gap-4 p-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">Kill Switch</p>
                                <p className="text-sm text-slate-400">Блокировать трафик при обрыве</p>
                            </div>
                            <Switch 
                                checked={killSwitch} 
                                onCheckedChange={setKillSwitch}
                                className="data-[state=checked]:bg-violet-500"
                            />
                        </div>

                        <Separator className="bg-slate-700/50" />

                        <div className="flex items-center gap-4 p-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                <Globe className="w-5 h-5 text-amber-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">Авто-подключение</p>
                                <p className="text-sm text-slate-400">Подключаться при запуске</p>
                            </div>
                            <Switch 
                                checked={autoConnect} 
                                onCheckedChange={setAutoConnect}
                                className="data-[state=checked]:bg-violet-500"
                            />
                        </div>
                    </div>

                    {/* Devices Section */}
                    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-700/50">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Устройства ({devices.length})
                            </p>
                        </div>
                        
                        {devices.map((device, index) => {
                            const Icon = deviceIcons[device.type];
                            return (
                                <React.Fragment key={device.id}>
                                    {index > 0 && <Separator className="bg-slate-700/50" />}
                                    <div className="flex items-center gap-4 p-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{device.name}</p>
                                            <p className="text-sm text-slate-400">
                                                Активен {format(device.lastActive, 'd MMM, HH:mm', { locale: ru })}
                                            </p>
                                        </div>
                                        {index === 0 && (
                                            <Badge className="bg-emerald-500/20 text-emerald-400">
                                                Текущее
                                            </Badge>
                                        )}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Payments Section */}
                    {payments.length > 0 && (
                        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-700/50">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    История платежей
                                </p>
                            </div>
                            
                            {payments.map((payment, index) => (
                                <React.Fragment key={payment.id}>
                                    {index > 0 && <Separator className="bg-slate-700/50" />}
                                    <div className="flex items-center gap-4 p-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{planBadges[payment.plan]?.label} план</p>
                                            <p className="text-sm text-slate-400">
                                                {format(new Date(payment.created_date), 'd MMM yyyy', { locale: ru })}
                                            </p>
                                        </div>
                                        <p className="text-white font-semibold">${payment.amount}</p>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    )}

                    {/* Logout */}
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full h-14 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Выйти из аккаунта
                    </Button>
                </motion.div>

                {/* Edit Profile Dialog */}
                <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
                    <DialogContent className="bg-slate-900 border-slate-700">
                        <DialogHeader>
                            <DialogTitle className="text-white">Редактировать профиль</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label className="text-slate-400">Имя</Label>
                                <Input
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    className="bg-slate-800 border-slate-700 text-white mt-1"
                                    placeholder="Введите имя"
                                />
                            </div>
                        </div>
                        <Button 
                            onClick={handleSaveProfile}
                            className="w-full bg-violet-500 hover:bg-violet-600"
                        >
                            Сохранить
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}