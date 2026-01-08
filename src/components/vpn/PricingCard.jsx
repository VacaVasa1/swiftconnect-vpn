import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PricingCard({ plan, isPopular, isCurrent, onSelect }) {
    return (
        <motion.div
            className={cn(
                "relative rounded-3xl p-6 border transition-all duration-300",
                isPopular 
                    ? "bg-gradient-to-br from-violet-900/80 to-slate-800 border-violet-500 shadow-[0_0_40px_rgba(139,92,246,0.2)]"
                    : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
            )}
            whileHover={{ y: -5 }}
        >
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Популярный
                </div>
            )}
            
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-slate-400">/мес</span>
                </div>
                {plan.savings && (
                    <p className="text-sm text-emerald-400 mt-2">Экономия {plan.savings}%</p>
                )}
            </div>
            
            <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center",
                            isPopular ? "bg-violet-500/20" : "bg-slate-700"
                        )}>
                            <Check className={cn(
                                "w-3 h-3",
                                isPopular ? "text-violet-400" : "text-slate-400"
                            )} />
                        </div>
                        <span className="text-sm text-slate-300">{feature}</span>
                    </div>
                ))}
            </div>
            
            <Button
                onClick={() => onSelect(plan)}
                disabled={isCurrent}
                className={cn(
                    "w-full rounded-xl h-12 font-semibold transition-all duration-300",
                    isCurrent 
                        ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                        : isPopular 
                            ? "bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/25"
                            : "bg-slate-700 hover:bg-slate-600 text-white"
                )}
            >
                {isCurrent ? 'Текущий план' : 'Выбрать план'}
            </Button>
        </motion.div>
    );
}