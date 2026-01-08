import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const statusConfig = {
    open: { label: 'Открыт', color: 'bg-blue-500/20 text-blue-400', icon: MessageCircle },
    in_progress: { label: 'В работе', color: 'bg-amber-500/20 text-amber-400', icon: Loader2 },
    resolved: { label: 'Решён', color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle },
    closed: { label: 'Закрыт', color: 'bg-slate-500/20 text-slate-400', icon: AlertCircle },
};

const categoryLabels = {
    technical: 'Техническая',
    billing: 'Оплата',
    account: 'Аккаунт',
    other: 'Другое',
};

export default function TicketCard({ ticket, onClick }) {
    const status = statusConfig[ticket.status];
    const StatusIcon = status.icon;
    
    return (
        <motion.div
            onClick={onClick}
            className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 cursor-pointer hover:border-slate-600 transition-all"
            whileHover={{ scale: 1.01 }}
        >
            <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-semibold text-white line-clamp-1">{ticket.subject}</h3>
                <Badge className={`${status.color} flex items-center gap-1.5 flex-shrink-0`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                </Badge>
            </div>
            
            <p className="text-sm text-slate-400 line-clamp-2 mb-4">{ticket.message}</p>
            
            <div className="flex items-center justify-between text-xs text-slate-500">
                <Badge variant="outline" className="border-slate-600 text-slate-400">
                    {categoryLabels[ticket.category]}
                </Badge>
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {format(new Date(ticket.created_date), 'd MMM yyyy', { locale: ru })}
                </div>
            </div>
        </motion.div>
    );
}