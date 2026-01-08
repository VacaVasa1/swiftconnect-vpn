import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SuccessAnimation({ plan, onClose }) {
    React.useEffect(() => {
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b']
        });
    }, []);

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center py-8"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6 relative"
            >
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mx-auto flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-white" />
                </div>
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{
                            scale: [0, 1, 0],
                            x: Math.cos((i / 8) * Math.PI * 2) * 60,
                            y: Math.sin((i / 8) * Math.PI * 2) * 60,
                        }}
                        transition={{ delay: 0.3 + i * 0.05, duration: 1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                    </motion.div>
                ))}
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold text-white mb-3"
            >
                Оплата успешна! 🎉
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-slate-400 mb-8"
            >
                Вы успешно подписались на план <span className="text-violet-400 font-semibold">{plan}</span>
            </motion.p>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all"
            >
                Отлично!
            </motion.button>
        </motion.div>
    );
}