import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuthGuard({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const authenticated = await base44.auth.isAuthenticated();
            setIsAuthenticated(authenticated);
        } catch (error) {
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = () => {
        base44.auth.redirectToLogin(window.location.pathname);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <Loader2 className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Загрузка...</p>
                </motion.div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full text-center"
                >
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
                        <motion.div
                            animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                ease: "easeInOut" 
                            }}
                            className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
                        >
                            <Shield className="w-10 h-10 text-white" />
                        </motion.div>

                        <h1 className="text-3xl font-bold text-white mb-3">
                            NexusVPN
                        </h1>
                        <p className="text-slate-400 mb-8">
                            Безопасный и быстрый VPN сервис
                        </p>

                        <Button
                            onClick={handleLogin}
                            className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold"
                        >
                            Войти / Регистрация
                        </Button>

                        <p className="text-xs text-slate-500 mt-4">
                            Войдите, чтобы получить доступ к защищенному интернету
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return children;
}