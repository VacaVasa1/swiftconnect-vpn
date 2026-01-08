import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function DataCounter({ isConnected }) {
    const [dataProtected, setDataProtected] = useState(0);

    useEffect(() => {
        if (!isConnected) {
            setDataProtected(0);
            return;
        }

        const interval = setInterval(() => {
            setDataProtected(prev => prev + Math.random() * 50 + 10);
        }, 100);

        return () => clearInterval(interval);
    }, [isConnected]);

    const formatData = (bytes) => {
        if (bytes < 1024) return `${bytes.toFixed(0)} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };

    if (!isConnected) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-center mb-6"
        >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/10 to-emerald-500/10 border border-violet-500/30 rounded-full px-4 py-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300">Защищено:</span>
                <motion.span 
                    className="text-sm font-bold text-emerald-400"
                    key={Math.floor(dataProtected)}
                >
                    {formatData(dataProtected)}
                </motion.span>
            </div>
        </motion.div>
    );
}