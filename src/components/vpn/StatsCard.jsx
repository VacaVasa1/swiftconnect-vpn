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
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50"
            whileHover={{ y: -2 }}
        >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${colorClasses[color].split(' ').pop()}`} />
            </div>
            <p className="text-sm text-slate-400 mb-1">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {subvalue && <p className="text-xs text-slate-500 mt-1">{subvalue}</p>}
        </motion.div>
    );
}