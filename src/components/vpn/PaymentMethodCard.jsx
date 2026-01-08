import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, Bitcoin, Apple, Chrome } from 'lucide-react';
import { cn } from "@/lib/utils";

const methodIcons = {
    card: CreditCard,
    paypal: Wallet,
    crypto: Bitcoin,
    apple_pay: Apple,
    google_pay: Chrome,
};

const methodLabels = {
    card: 'Банковская карта',
    paypal: 'PayPal',
    crypto: 'Криптовалюта',
    apple_pay: 'Apple Pay',
    google_pay: 'Google Pay',
};

export default function PaymentMethodCard({ method, isSelected, onSelect }) {
    const Icon = methodIcons[method];
    
    return (
        <motion.button
            onClick={() => onSelect(method)}
            className={cn(
                "flex items-center gap-4 p-4 rounded-xl border transition-all w-full",
                isSelected 
                    ? "bg-violet-900/30 border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                    : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
            )}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
        >
            <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                isSelected ? "bg-violet-500/20" : "bg-slate-700/50"
            )}>
                <Icon className={cn(
                    "w-6 h-6",
                    isSelected ? "text-violet-400" : "text-slate-400"
                )} />
            </div>
            <span className={cn(
                "font-medium",
                isSelected ? "text-white" : "text-slate-300"
            )}>
                {methodLabels[method]}
            </span>
            <div className={cn(
                "ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center",
                isSelected ? "border-violet-500 bg-violet-500" : "border-slate-600"
            )}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
        </motion.button>
    );
}