import React from 'react';
import { motion } from 'framer-motion';
import { Signal, Crown, Check } from 'lucide-react';
import { cn } from "@/lib/utils";

const getLoadColor = (load) => {
    if (load < 40) return 'text-emerald-400';
    if (load < 70) return 'text-yellow-400';
    return 'text-red-400';
};

const getPingColor = (ping) => {
    if (ping < 50) return 'text-emerald-400';
    if (ping < 100) return 'text-yellow-400';
    return 'text-red-400';
};

const flagEmoji = (code) => {
    const codePoints = code
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
};

export default function ServerCard({ server, isSelected, onSelect, userPlan }) {
    const canAccess = !server.is_premium || ['pro', 'ultimate'].includes(userPlan);
    
    return (
        <motion.div
            onClick={() => canAccess && onSelect(server)}
            className={cn(
                "relative p-4 rounded-2xl border cursor-pointer transition-all duration-300",
                isSelected 
                    ? "bg-gradient-to-br from-violet-900/50 to-slate-800 border-violet-500 shadow-[0_0_30px_rgba(139,92,246,0.2)]"
                    : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600",
                !canAccess && "opacity-50 cursor-not-allowed"
            )}
            whileHover={canAccess ? { scale: 1.02 } : {}}
            whileTap={canAccess ? { scale: 0.98 } : {}}
        >
            {server.is_premium && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-1.5">
                    <Crown className="w-3 h-3 text-white" />
                </div>
            )}
            
            <div className="flex items-center gap-4">
                <div className="text-3xl">{flagEmoji(server.country_code)}</div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white truncate">{server.country}</h3>
                        {isSelected && <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-slate-400">{server.city}</p>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5">
                        <Signal className={cn("w-4 h-4", getPingColor(server.ping))} />
                        <span className={cn("text-sm font-medium", getPingColor(server.ping))}>
                            {server.ping} мс
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className={cn("w-2 h-2 rounded-full", getLoadColor(server.load).replace('text-', 'bg-'))} />
                        <span className="text-xs text-slate-500">{server.load}% загрузка</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}