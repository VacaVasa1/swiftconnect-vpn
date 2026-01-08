import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/components/setup/MockAPI';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Signal, Globe, Crown, Zap, MapPin } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import ServerCard from '@/components/vpn/ServerCard';

const regions = [
    { id: 'all', name: 'Все регионы' },
    { id: 'europe', name: 'Европа', countries: ['DE', 'FR', 'NL', 'GB', 'CH', 'SE', 'PL', 'IT', 'ES'] },
    { id: 'americas', name: 'Америка', countries: ['US', 'CA', 'BR', 'MX', 'AR'] },
    { id: 'asia', name: 'Азия', countries: ['JP', 'SG', 'KR', 'HK', 'IN', 'TW'] },
    { id: 'oceania', name: 'Океания', countries: ['AU', 'NZ'] },
];

export default function Servers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [sortBy, setSortBy] = useState('ping');
    const [showPremiumOnly, setShowPremiumOnly] = useState(false);
    const [user, setUser] = useState(null);
    const [userPlan, setUserPlan] = useState('free');

    useEffect(() => {
        base44.auth.me().then(setUser).catch(() => {});
    }, []);

    const { data: servers = [], isLoading } = useQuery({
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

    const filteredServers = servers
        .filter(server => {
            const matchesSearch = server.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  server.city.toLowerCase().includes(searchQuery.toLowerCase());
            
            const region = regions.find(r => r.id === selectedRegion);
            const matchesRegion = selectedRegion === 'all' || 
                                  (region?.countries?.includes(server.country_code));
            
            const matchesPremium = !showPremiumOnly || server.is_premium;
            
            return matchesSearch && matchesRegion && matchesPremium && server.status === 'online';
        })
        .sort((a, b) => {
            if (sortBy === 'ping') return a.ping - b.ping;
            if (sortBy === 'load') return a.load - b.load;
            if (sortBy === 'country') return a.country.localeCompare(b.country);
            return 0;
        });

    const stats = {
        total: servers.length,
        online: servers.filter(s => s.status === 'online').length,
        premium: servers.filter(s => s.is_premium).length,
        countries: [...new Set(servers.map(s => s.country_code))].length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-4 pb-24">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div 
                    className="text-center pt-8 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl font-bold text-white mb-2">Серверы</h1>
                    <p className="text-slate-400">Выберите оптимальный сервер для подключения</p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="grid grid-cols-4 gap-3 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/50">
                        <Globe className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                        <p className="text-xl font-bold text-white">{stats.countries}</p>
                        <p className="text-xs text-slate-400">Стран</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/50">
                        <MapPin className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <p className="text-xl font-bold text-white">{stats.total}</p>
                        <p className="text-xs text-slate-400">Серверов</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/50">
                        <Zap className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                        <p className="text-xl font-bold text-white">{stats.online}</p>
                        <p className="text-xs text-slate-400">Онлайн</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/50">
                        <Crown className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                        <p className="text-xl font-bold text-white">{stats.premium}</p>
                        <p className="text-xs text-slate-400">Премиум</p>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    className="space-y-4 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Поиск по стране или городу..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-800/50 border-slate-700 text-white pl-12 h-12 rounded-xl"
                        />
                    </div>

                    {/* Region Tabs */}
                    <Tabs value={selectedRegion} onValueChange={setSelectedRegion}>
                        <TabsList className="w-full bg-slate-800/50 border border-slate-700/50 h-auto p-1 flex-wrap">
                            {regions.map((region) => (
                                <TabsTrigger 
                                    key={region.id} 
                                    value={region.id}
                                    className="flex-1 data-[state=active]:bg-violet-600 text-xs sm:text-sm"
                                >
                                    {region.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    {/* Sort and Filter */}
                    <div className="flex gap-3">
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white flex-1">
                                <SelectValue placeholder="Сортировка" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                                <SelectItem value="ping">По пингу</SelectItem>
                                <SelectItem value="load">По загрузке</SelectItem>
                                <SelectItem value="country">По стране</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant={showPremiumOnly ? "default" : "outline"}
                            onClick={() => setShowPremiumOnly(!showPremiumOnly)}
                            className={showPremiumOnly 
                                ? "bg-amber-500 hover:bg-amber-600" 
                                : "border-slate-700 text-slate-300 hover:bg-slate-800"
                            }
                        >
                            <Crown className="w-4 h-4 mr-2" />
                            Премиум
                        </Button>
                    </div>
                </motion.div>

                {/* Server List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 animate-pulse">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-700 rounded-full" />
                                        <div className="flex-1">
                                            <div className="h-4 bg-slate-700 rounded w-32 mb-2" />
                                            <div className="h-3 bg-slate-700 rounded w-20" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredServers.length > 0 ? (
                        <div className="space-y-3">
                            {filteredServers.map((server, index) => (
                                <motion.div
                                    key={server.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ServerCard
                                        server={server}
                                        isSelected={false}
                                        onSelect={() => {}}
                                        userPlan={userPlan}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Globe className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400">Серверы не найдены</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}