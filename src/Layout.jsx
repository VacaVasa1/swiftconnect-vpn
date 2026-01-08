import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { 
    Shield, Globe, CreditCard, User, Headphones,
    Home, Server, DollarSign, HelpCircle, UserCircle
} from 'lucide-react';

const navItems = [
    { name: 'Home', icon: Home, label: 'Главная' },
    { name: 'Servers', icon: Server, label: 'Серверы' },
    { name: 'Pricing', icon: DollarSign, label: 'Тарифы' },
    { name: 'Support', icon: HelpCircle, label: 'Помощь' },
    { name: 'Profile', icon: UserCircle, label: 'Профиль' },
];

export default function Layout({ children, currentPageName }) {
    return (
        <div className="min-h-screen bg-slate-950">
            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 z-50 safe-area-bottom">
                <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
                    {navItems.map((item) => {
                        const isActive = currentPageName === item.name;
                        return (
                            <Link
                                key={item.name}
                                to={createPageUrl(item.name)}
                                className="flex flex-col items-center gap-1 py-2 px-3 relative"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-violet-500/10 rounded-xl"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <item.icon 
                                    className={`w-5 h-5 transition-colors relative z-10 ${
                                        isActive ? 'text-violet-400' : 'text-slate-500'
                                    }`} 
                                />
                                <span 
                                    className={`text-xs font-medium transition-colors relative z-10 ${
                                        isActive ? 'text-violet-400' : 'text-slate-500'
                                    }`}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Safe area for bottom navigation */}
            <div className="h-20" />

            <style>{`
                .safe-area-bottom {
                    padding-bottom: env(safe-area-inset-bottom);
                }
            `}</style>
        </div>
    );
}