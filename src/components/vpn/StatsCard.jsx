import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ icon: Icon, label, value, subvalue, color = "violet" }) {
    const colorClasses = {
        violet: "from-violet-500/20 to-transparent text-violet-400",
        emerald: "from-emerald-500/20 to-transparent text-emerald-400",
        blue: "from-blue-500/20 to-transparent text-blue-400",
        amber: "from-amber-500/20 to-transparent text-amber-400",
    };
    
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 cursor-pointer"
        >
            <motion.div 
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-3`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
            >
                <Icon className={`w-5 h-5 ${colorClasses[color].split(' ').pop()}`} />
            </motion.div>
            <p className="text-sm text-slate-400 mb-1">{label}</p>
            <motion.p 
                className="text-2xl font-bold text-white"
                key={value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {value}
            </motion.p>
            {subvalue && <p className="text-xs text-slate-500 mt-1">{subvalue}</p>}
        </motion.div>
    );
}