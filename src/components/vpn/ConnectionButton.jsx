import React from 'react';
import { motion } from 'framer-motion';
import { Power, Shield, ShieldCheck } from 'lucide-react';

export default function ConnectionButton({ isConnected, isConnecting, onToggle }) {
    return (
        <div className="flex flex-col items-center gap-6">
            <motion.button
                onClick={onToggle}
                disabled={isConnecting}
                className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isConnected 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-[0_0_60px_rgba(16,185,129,0.4)]' 
                        : 'bg-gradient-to-br from-slate-700 to-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.3)]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Outer ring */}
                <div className={`absolute inset-0 rounded-full border-4 ${
                    isConnected ? 'border-emerald-400/30' : 'border-slate-600/30'
                }`} />
                
                {/* Pulsing ring when connecting */}
                {isConnecting && (
                    <motion.div
                        className="absolute inset-0 rounded-full border-4 border-violet-500"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                )}
                
                {/* Inner glow */}
                <div className={`absolute inset-4 rounded-full ${
                    isConnected 
                        ? 'bg-gradient-to-br from-emerald-400/20 to-transparent' 
                        : 'bg-gradient-to-br from-slate-600/20 to-transparent'
                }`} />
                
                {/* Icon */}
                {isConnecting ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Shield className="w-20 h-20 text-violet-400" />
                    </motion.div>
                ) : isConnected ? (
                    <ShieldCheck className="w-20 h-20 text-white drop-shadow-lg" />
                ) : (
                    <Power className="w-20 h-20 text-slate-400" />
                )}
            </motion.button>
            
            <div className="text-center">
                <motion.p 
                    className={`text-2xl font-semibold ${
                        isConnected ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                    key={isConnected ? 'connected' : 'disconnected'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {isConnecting ? 'Подключение...' : isConnected ? 'Защищено' : 'Не подключено'}
                </motion.p>
                <p className="text-sm text-slate-500 mt-1">
                    {isConnected ? 'Ваше соединение зашифровано' : 'Нажмите для подключения'}
                </p>
            </div>
        </div>
    );
}