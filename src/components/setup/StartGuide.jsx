import React, { useState, useEffect } from 'react';
import { base44 } from './MockAPI';
import { Button } from "@/components/ui/button";
import { Shield, LogIn, CheckCircle2 } from 'lucide-react';

export default function StartGuide() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        base44.auth.isAuthenticated().then(setIsLoggedIn);
        base44.auth.me().then(u => setUserName(u.full_name)).catch(() => {});
    }, []);

    const handleDemoLogin = () => {
        const user = {
            id: 'demo-' + Date.now(),
            email: 'demo@nexusvpn.com',
            full_name: 'Demo User',
            role: 'user'
        };
        localStorage.setItem('mock_user', JSON.stringify(user));
        setIsLoggedIn(true);
        setUserName(user.full_name);
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 rounded-3xl bg-violet-500/20 flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-10 h-10 text-violet-400" />
                </div>
                
                <h1 className="text-3xl font-bold text-white mb-2">NexusVPN</h1>
                <p className="text-slate-400 mb-8">Безопасный доступ к интернету</p>

                {!isLoggedIn ? (
                    <div className="space-y-4">
                        <p className="text-slate-300 mb-6">Это демо-версия приложения. Для начала работы войдите в аккаунт.</p>
                        <Button
                            onClick={handleDemoLogin}
                            className="w-full h-12 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-semibold"
                        >
                            <LogIn className="w-5 h-5 mr-2" />
                            Войти (демо-аккаунт)
                        </Button>
                        <p className="text-xs text-slate-500">
                            Все данные хранятся локально в вашем браузере
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <div className="text-left">
                                <p className="text-white font-medium">Вы авторизованы!</p>
                                <p className="text-sm text-slate-400">{userName}</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => {
                                localStorage.removeItem('mock_user');
                                setIsLoggedIn(false);
                            }}
                            variant="outline"
                            className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                            Выйти
                        </Button>
                    </div>
                )}

                <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <p className="text-xs text-slate-400 leading-relaxed">
                        <strong>💡 Совет:</strong> Все функции работают локально. Выбирайте серверы, управляйте профилем и создавайте тикеты поддержки. Данные сохраняются в LocalStorage вашего браузера.
                    </p>
                </div>
            </div>
        </div>
    );
}