import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/components/setup/MockAPI';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Globe, Download, Upload, Clock, Shield } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import ConnectionButton from '@/components/vpn/ConnectionButton';
import ServerCard from '@/components/vpn/ServerCard';
import StatsCard from '@/components/vpn/StatsCard';
import DataCounter from '@/components/vpn/DataCounter';
import { showAchievement } from '@/components/vpn/AchievementToast';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export default function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [selectedServer, setSelectedServer] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState(null);
    const [userPlan, setUserPlan] = useState('free');
    const [connectionTime, setConnectionTime] = useState(0);
    const [hasConnectedBefore, setHasConnectedBefore] = useState(
        localStorage.getItem('hasConnectedBefore') === 'true'
    );

    useEffect(() => {
        base44.auth.me().then(setUser).catch(() => {});
    }, []);

    const { data: servers = [] } = useQuery({
        queryKey: ['servers'],
        queryFn: () => base44.entities.Server.list(),
    });

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

    useEffect(() => {
        let interval;
        if (isConnected) {
            interval = setInterval(() => {
                setConnectionTime(prev => prev + 1);
            }, 1000);
        } else {
            setConnectionTime(0);
        }
        return () => clearInterval(interval);
    }, [isConnected]);

    const handleConnect = async () => {
        if (!selectedServer && !isConnected) {
            const bestServer = servers.find(s => !s.is_premium) || servers[0];
            setSelectedServer(bestServer);
        }
        
        // Haptic feedback (вибрация на мобильных)
        if (navigator.vibrate) {
            navigator.vibrate(isConnected ? 50 : [50, 100, 50]);
        }
        
        if (isConnected) {
            setIsConnected(false);
            toast.info('🔓 Отключено от VPN', {
                description: 'Ваше соединение больше не защищено'
            });
        } else {
            setIsConnecting(true);
            toast.loading('Подключение к серверу...', { id: 'connect' });
            await new Promise(r => setTimeout(r, 2000));
            setIsConnecting(false);
            setIsConnected(true);
            toast.success('🔒 Подключено к VPN!', {
                id: 'connect',
                description: `Вы защищены через ${selectedServer?.city || 'сервер'}`
            });
            
            // Конфетти эффект
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#8b5cf6', '#10b981', '#3b82f6']
            });

            // Achievement для первого подключения
            if (!hasConnectedBefore) {
                setTimeout(() => showAchievement('first_connection'), 1000);
                localStorage.setItem('hasConnectedBefore', 'true');
                setHasConnectedBefore(true);
            }
        }
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const filteredServers = servers.filter(s => 
        s.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const flagEmoji = (code) => {
        if (!code) return '🌍';
        const codePoints = code.toUpperCase().split('').map(char => 127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-4 pb-24 relative overflow-hidden">
            {/* Анимированный фон */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-violet-500/20 rounded-full"
                        initial={{ 
                            x: Math.random() * window.innerWidth, 
                            y: -20,
                            scale: Math.random() * 0.5 + 0.5
                        }}
                        animate={{
                            y: window.innerHeight + 20,
                            x: Math.random() * window.innerWidth
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            <div className="max-w-lg mx-auto relative z-10">
                {/* Header */}
                <motion.div 
                    className="text-center mb-8 pt-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield className="w-8 h-8 text-violet-500" />
                        <h1 className="text-2xl font-bold text-white">NexusVPN</h1>
                    </div>
                    <p className="text-slate-400 text-sm">Безопасный доступ к интернету</p>
                </motion.div>

                {/* Server Selector */}
                <Sheet>
                    <SheetTrigger asChild>
                        <motion.button
                            className="w-full bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 flex items-center gap-4 mb-8"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <div className="text-2xl">
                                {selectedServer ? flagEmoji(selectedServer.country_code) : '🌍'}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-white font-medium">
                                    {selectedServer ? selectedServer.country : 'Выберите сервер'}
                                </p>
                                <p className="text-sm text-slate-400">
                                    {selectedServer ? selectedServer.city : 'Автоматический выбор'}
                                </p>
                            </div>
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                        </motion.button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="bg-slate-900 border-slate-700 rounded-t-3xl h-[70vh]">
                        <SheetHeader className="mb-4">
                            <SheetTitle className="text-white">Выберите сервер</SheetTitle>
                        </SheetHeader>
                        <Input
                            placeholder="Поиск страны или города..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 mb-4"
                        />
                        <ScrollArea className="h-[calc(100%-120px)]">
                            <div className="space-y-3 pr-4">
                                {filteredServers.map((server, index) => (
                                    <motion.div
                                        key={server.id}
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <ServerCard
                                            server={server}
                                            isSelected={selectedServer?.id === server.id}
                                            onSelect={(s) => setSelectedServer(s)}
                                            userPlan={userPlan}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>

                {/* Connection Button */}
                <div className="flex justify-center mb-10 relative">
                    {isConnected && (
                        <>
                            <motion.div
                                className="absolute inset-0 -z-10"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0, 0.3]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-violet-500 blur-2xl" />
                            </motion.div>
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                                    initial={{ x: 0, y: 0, opacity: 1 }}
                                    animate={{
                                        x: Math.cos((i / 8) * Math.PI * 2) * 100,
                                        y: Math.sin((i / 8) * Math.PI * 2) * 100,
                                        opacity: 0
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.1
                                    }}
                                />
                            ))}
                        </>
                    )}
                    <ConnectionButton
                        isConnected={isConnected}
                        isConnecting={isConnecting}
                        onToggle={handleConnect}
                    />
                </div>

                <DataCounter isConnected={isConnected} />

                {/* Stats */}
                <AnimatePresence>
                    {isConnected && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <StatsCard
                                icon={Clock}
                                label="Время подключения"
                                value={formatTime(connectionTime)}
                                color="violet"
                            />
                            <StatsCard
                                icon={Globe}
                                label="IP адрес"
                                value="185.xxx.xxx.xx"
                                subvalue="Скрыт"
                                color="emerald"
                            />
                            <StatsCard
                                icon={Download}
                                label="Загрузка"
                                value="42.5 MB/s"
                                color="blue"
                            />
                            <StatsCard
                                icon={Upload}
                                label="Отдача"
                                value="18.2 MB/s"
                                color="amber"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}