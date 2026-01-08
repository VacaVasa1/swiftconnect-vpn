import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    MessageCircle, Plus, Send, HelpCircle, Book, 
    Headphones, Mail, ChevronRight, Search, ArrowLeft,
    Zap, Shield, Globe, CreditCard
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import TicketCard from '@/components/vpn/TicketCard';

const faqCategories = [
    {
        id: 'connection',
        icon: Globe,
        title: 'Подключение',
        faqs: [
            { q: 'Как подключиться к VPN?', a: 'Выберите сервер из списка и нажмите большую кнопку подключения на главной странице.' },
            { q: 'VPN не подключается', a: 'Проверьте интернет-соединение и попробуйте выбрать другой сервер. Если проблема сохраняется, обратитесь в поддержку.' },
            { q: 'Как выбрать лучший сервер?', a: 'Выбирайте сервер с минимальным пингом и низкой загрузкой для лучшей скорости.' },
        ]
    },
    {
        id: 'speed',
        icon: Zap,
        title: 'Скорость',
        faqs: [
            { q: 'Почему низкая скорость?', a: 'Попробуйте подключиться к ближайшему серверу или серверу с меньшей загрузкой.' },
            { q: 'Как увеличить скорость?', a: 'Обновите план до Pro или Ultimate для доступа к скоростным серверам.' },
        ]
    },
    {
        id: 'security',
        icon: Shield,
        title: 'Безопасность',
        faqs: [
            { q: 'Безопасен ли VPN?', a: 'Мы используем AES-256 шифрование военного уровня и не храним логи вашей активности.' },
            { q: 'Что такое Kill Switch?', a: 'Kill Switch блокирует весь интернет-трафик при обрыве VPN-соединения для защиты ваших данных.' },
        ]
    },
    {
        id: 'billing',
        icon: CreditCard,
        title: 'Оплата',
        faqs: [
            { q: 'Как отменить подписку?', a: 'Вы можете отменить автопродление в настройках профиля. Подписка будет действовать до конца оплаченного периода.' },
            { q: 'Какие способы оплаты?', a: 'Мы принимаем банковские карты, PayPal, криптовалюту, Apple Pay и Google Pay.' },
            { q: 'Есть ли возврат денег?', a: 'Да, мы предоставляем 30-дневную гарантию возврата денег для всех планов.' },
        ]
    },
];

export default function Support() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('faq');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedFaq, setSelectedFaq] = useState(null);
    const [newTicketOpen, setNewTicketOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [ticketForm, setTicketForm] = useState({
        subject: '',
        message: '',
        category: 'other',
        priority: 'medium'
    });
    const queryClient = useQueryClient();

    useEffect(() => {
        base44.auth.me().then(setUser).catch(() => {});
    }, []);

    const { data: tickets = [], isLoading } = useQuery({
        queryKey: ['tickets', user?.email],
        queryFn: () => base44.entities.SupportTicket.filter({ user_email: user?.email }, '-created_date'),
        enabled: !!user?.email,
    });

    const createTicketMutation = useMutation({
        mutationFn: (data) => base44.entities.SupportTicket.create({
            ...data,
            user_email: user?.email
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
            toast.success('Тикет успешно создан');
            setNewTicketOpen(false);
            setTicketForm({ subject: '', message: '', category: 'other', priority: 'medium' });
        },
        onError: () => {
            toast.error('Ошибка при создании тикета');
        }
    });

    const handleSubmitTicket = () => {
        if (!ticketForm.subject || !ticketForm.message) {
            toast.error('Заполните все поля');
            return;
        }
        createTicketMutation.mutate(ticketForm);
    };

    const allFaqs = faqCategories.flatMap(cat => 
        cat.faqs.map(faq => ({ ...faq, category: cat.title }))
    );

    const filteredFaqs = searchQuery 
        ? allFaqs.filter(faq => 
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-4 pb-24">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <motion.div 
                    className="text-center pt-8 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                        <Headphones className="w-8 h-8 text-violet-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Центр поддержки</h1>
                    <p className="text-slate-400">Мы здесь, чтобы помочь вам</p>
                </motion.div>

                {/* Search */}
                <motion.div
                    className="relative mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        placeholder="Поиск по FAQ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-slate-800/50 border-slate-700 text-white pl-12 h-12 rounded-xl"
                    />
                </motion.div>

                {/* Search Results */}
                <AnimatePresence>
                    {searchQuery && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6"
                        >
                            {filteredFaqs.length > 0 ? (
                                <div className="space-y-2">
                                    {filteredFaqs.map((faq, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedFaq(faq)}
                                            className="w-full text-left bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600 transition-colors"
                                        >
                                            <p className="text-white font-medium">{faq.q}</p>
                                            <p className="text-xs text-slate-500 mt-1">{faq.category}</p>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-slate-400 py-4">Ничего не найдено</p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tabs */}
                {!searchQuery && (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                        <TabsList className="w-full bg-slate-800/50 border border-slate-700/50 h-12">
                            <TabsTrigger value="faq" className="flex-1 data-[state=active]:bg-violet-600">
                                <Book className="w-4 h-4 mr-2" />
                                FAQ
                            </TabsTrigger>
                            <TabsTrigger value="tickets" className="flex-1 data-[state=active]:bg-violet-600">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Мои тикеты
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="faq" className="mt-6">
                            <AnimatePresence mode="wait">
                                {selectedCategory ? (
                                    <motion.div
                                        key="category"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <button
                                            onClick={() => setSelectedCategory(null)}
                                            className="flex items-center gap-2 text-violet-400 mb-4 hover:text-violet-300"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Назад
                                        </button>
                                        <h2 className="text-xl font-semibold text-white mb-4">
                                            {selectedCategory.title}
                                        </h2>
                                        <div className="space-y-3">
                                            {selectedCategory.faqs.map((faq, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedFaq(faq)}
                                                    className="w-full text-left bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600 transition-colors"
                                                >
                                                    <p className="text-white font-medium">{faq.q}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="categories"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="grid grid-cols-2 gap-4"
                                    >
                                        {faqCategories.map((category) => (
                                            <motion.button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category)}
                                                className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all text-left"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-3">
                                                    <category.icon className="w-6 h-6 text-violet-400" />
                                                </div>
                                                <p className="text-white font-semibold">{category.title}</p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {category.faqs.length} вопросов
                                                </p>
                                            </motion.button>
                                        ))}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </TabsContent>

                        <TabsContent value="tickets" className="mt-6">
                            {user ? (
                                <>
                                    <Button
                                        onClick={() => setNewTicketOpen(true)}
                                        className="w-full mb-6 h-12 bg-violet-500 hover:bg-violet-600"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Создать тикет
                                    </Button>

                                    {tickets.length > 0 ? (
                                        <div className="space-y-4">
                                            {tickets.map((ticket) => (
                                                <TicketCard key={ticket.id} ticket={ticket} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                            <p className="text-slate-400">У вас пока нет тикетов</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <Mail className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                    <p className="text-slate-400 mb-4">Войдите для создания тикетов</p>
                                    <Button 
                                        onClick={() => base44.auth.redirectToLogin()}
                                        className="bg-violet-500 hover:bg-violet-600"
                                    >
                                        Войти
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}

                {/* Contact Options */}
                <motion.div
                    className="mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <p className="text-sm text-slate-400 text-center mb-4">Или свяжитесь с нами напрямую</p>
                    <div className="flex gap-4">
                        <Button 
                            variant="outline" 
                            className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                        </Button>
                        <Button 
                            variant="outline" 
                            className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Чат
                        </Button>
                    </div>
                </motion.div>

                {/* FAQ Answer Dialog */}
                <Dialog open={!!selectedFaq} onOpenChange={() => setSelectedFaq(null)}>
                    <DialogContent className="bg-slate-900 border-slate-700">
                        <DialogHeader>
                            <DialogTitle className="text-white">{selectedFaq?.q}</DialogTitle>
                        </DialogHeader>
                        <p className="text-slate-300 leading-relaxed">{selectedFaq?.a}</p>
                        <Button 
                            onClick={() => setSelectedFaq(null)}
                            className="w-full bg-violet-500 hover:bg-violet-600 mt-4"
                        >
                            Понятно
                        </Button>
                    </DialogContent>
                </Dialog>

                {/* New Ticket Dialog */}
                <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
                    <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-white">Новый тикет</DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                            <div>
                                <Label className="text-slate-400">Тема</Label>
                                <Input
                                    value={ticketForm.subject}
                                    onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                                    className="bg-slate-800 border-slate-700 text-white mt-1"
                                    placeholder="Кратко опишите проблему"
                                />
                            </div>

                            <div>
                                <Label className="text-slate-400">Категория</Label>
                                <Select 
                                    value={ticketForm.category} 
                                    onValueChange={(v) => setTicketForm({...ticketForm, category: v})}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        <SelectItem value="technical">Техническая проблема</SelectItem>
                                        <SelectItem value="billing">Вопрос по оплате</SelectItem>
                                        <SelectItem value="account">Вопрос по аккаунту</SelectItem>
                                        <SelectItem value="other">Другое</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-slate-400">Сообщение</Label>
                                <Textarea
                                    value={ticketForm.message}
                                    onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                                    className="bg-slate-800 border-slate-700 text-white mt-1 min-h-32"
                                    placeholder="Подробно опишите вашу проблему..."
                                />
                            </div>
                        </div>

                        <Button 
                            onClick={handleSubmitTicket}
                            disabled={createTicketMutation.isPending}
                            className="w-full bg-violet-500 hover:bg-violet-600"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            {createTicketMutation.isPending ? 'Отправка...' : 'Отправить'}
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}