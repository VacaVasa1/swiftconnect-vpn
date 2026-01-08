import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Award } from 'lucide-react';

const achievements = {
    first_connection: { icon: Trophy, title: 'Первое подключение!', desc: 'Добро пожаловать в безопасный интернет' },
    speed_demon: { icon: Zap, title: 'Скоростной демон', desc: 'Более 100 MB/s трафика' },
    globe_trotter: { icon: Star, title: 'Путешественник', desc: 'Подключение к 5+ странам' },
    loyal_user: { icon: Award, title: 'Верный пользователь', desc: '24+ часа защищенного времени' }
};

export function showAchievement(type) {
    const achievement = achievements[type];
    if (!achievement) return;

    const div = document.createElement('div');
    div.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
    document.body.appendChild(div);

    const root = require('react-dom/client').createRoot(div);
    
    const Component = () => {
        const Icon = achievement.icon;
        return (
            <motion.div
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl p-4 shadow-2xl min-w-[300px]"
            >
                <div className="flex items-start gap-3">
                    <div className="bg-white/20 rounded-lg p-2">
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{achievement.title}</h3>
                        <p className="text-sm opacity-90">{achievement.desc}</p>
                    </div>
                </div>
            </motion.div>
        );
    };

    root.render(<Component />);

    setTimeout(() => {
        root.unmount();
        document.body.removeChild(div);
    }, 5000);
}