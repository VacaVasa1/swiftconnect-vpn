<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NexusVPN - Безопасный доступ к интернету</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        
        @keyframes pulse-ring {
            0% { transform: scale(0.9); opacity: 1; }
            100% { transform: scale(1.3); opacity: 0; }
        }
        
        .pulse-ring {
            animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .animate-spin {
            animation: spin 1s linear infinite;
        }
    </style>
</head>
<body class="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 min-h-screen">
    <div id="app"></div>

    <script>
        // Mock Data
        const mockServers = [
            { id: 1, country: "США", country_code: "US", city: "Нью-Йорк", load: 35, ping: 120, is_premium: false },
            { id: 2, country: "США", country_code: "US", city: "Лос-Анджелес", load: 42, ping: 145, is_premium: false },
            { id: 3, country: "США", country_code: "US", city: "Майами", load: 28, ping: 135, is_premium: true },
            { id: 4, country: "Германия", country_code: "DE", city: "Франкфурт", load: 55, ping: 45, is_premium: false },
            { id: 5, country: "Германия", country_code: "DE", city: "Берлин", load: 38, ping: 48, is_premium: true },
            { id: 6, country: "Нидерланды", country_code: "NL", city: "Амстердам", load: 62, ping: 42, is_premium: false },
            { id: 7, country: "Великобритания", country_code: "GB", city: "Лондон", load: 48, ping: 55, is_premium: false },
            { id: 8, country: "Великобритания", country_code: "GB", city: "Манчестер", load: 25, ping: 58, is_premium: true },
            { id: 9, country: "Франция", country_code: "FR", city: "Париж", load: 51, ping: 50, is_premium: false },
            { id: 10, country: "Швейцария", country_code: "CH", city: "Цюрих", load: 32, ping: 40, is_premium: true },
            { id: 11, country: "Япония", country_code: "JP", city: "Токио", load: 45, ping: 180, is_premium: false },
            { id: 12, country: "Сингапур", country_code: "SG", city: "Сингапур", load: 58, ping: 160, is_premium: false },
        ];

        // State
        let state = {
            isConnected: false,
            isConnecting: false,
            selectedServer: null,
            connectionTime: 0,
            searchQuery: '',
            showServerList: false,
            currentPage: 'home'
        };

        // Helpers
        const flagEmoji = (code) => {
            if (!code) return '🌍';
            const codePoints = code.toUpperCase().split('').map(char => 127397 + char.charCodeAt());
            return String.fromCodePoint(...codePoints);
        };

        const formatTime = (seconds) => {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        };

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

        // Connection Logic
        function toggleConnection() {
            if (state.isConnected) {
                state.isConnected = false;
                state.connectionTime = 0;
            } else {
                if (!state.selectedServer) {
                    state.selectedServer = mockServers.find(s => !s.is_premium) || mockServers[0];
                }
                state.isConnecting = true;
                render();
                setTimeout(() => {
                    state.isConnecting = false;
                    state.isConnected = true;
                    render();
                    startTimer();
                }, 2000);
            }
        }

        function startTimer() {
            setInterval(() => {
                if (state.isConnected) {
                    state.connectionTime++;
                    render();
                }
            }, 1000);
        }

        function selectServer(server) {
            state.selectedServer = server;
            state.showServerList = false;
            render();
        }

        // Render
        function render() {
            const app = document.getElementById('app');
            const filteredServers = mockServers.filter(s => 
                s.country.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                s.city.toLowerCase().includes(state.searchQuery.toLowerCase())
            );

            app.innerHTML = `
                <div class="max-w-lg mx-auto p-4 pb-24">
                    <!-- Header -->
                    <div class="text-center mb-8 pt-4">
                        <div class="flex items-center justify-center gap-2 mb-2">
                            <svg class="w-8 h-8 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                            </svg>
                            <h1 class="text-2xl font-bold text-white">NexusVPN</h1>
                        </div>
                        <p class="text-slate-400 text-sm">Безопасный доступ к интернету</p>
                    </div>

                    <!-- Server Selector -->
                    <button 
                        onclick="state.showServerList = !state.showServerList; render()"
                        class="w-full bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 flex items-center gap-4 mb-8 hover:bg-slate-800/70 transition"
                    >
                        <div class="text-2xl">
                            ${state.selectedServer ? flagEmoji(state.selectedServer.country_code) : '🌍'}
                        </div>
                        <div class="flex-1 text-left">
                            <p class="text-white font-medium">
                                ${state.selectedServer ? state.selectedServer.country : 'Выберите сервер'}
                            </p>
                            <p class="text-sm text-slate-400">
                                ${state.selectedServer ? state.selectedServer.city : 'Автоматический выбор'}
                            </p>
                        </div>
                        <svg class="w-5 h-5 text-slate-400 ${state.showServerList ? 'rotate-180' : ''} transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>

                    <!-- Server List -->
                    ${state.showServerList ? `
                        <div class="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-4 border border-slate-700 mb-8">
                            <input 
                                type="text" 
                                placeholder="Поиск страны или города..."
                                value="${state.searchQuery}"
                                oninput="state.searchQuery = this.value; render()"
                                class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 mb-4"
                            />
                            <div class="space-y-3 max-h-96 overflow-y-auto">
                                ${filteredServers.map(server => `
                                    <button
                                        onclick='selectServer(${JSON.stringify(server)})'
                                        class="w-full p-4 rounded-xl border ${state.selectedServer?.id === server.id ? 'bg-violet-900/50 border-violet-500' : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'} transition flex items-center gap-4"
                                    >
                                        <div class="text-2xl">${flagEmoji(server.country_code)}</div>
                                        <div class="flex-1 text-left">
                                            <p class="text-white font-medium">${server.country}</p>
                                            <p class="text-sm text-slate-400">${server.city}</p>
                                        </div>
                                        <div class="flex flex-col items-end gap-1">
                                            <div class="flex items-center gap-1.5">
                                                <svg class="w-4 h-4 ${getPingColor(server.ping)}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                                </svg>
                                                <span class="text-sm font-medium ${getPingColor(server.ping)}">${server.ping} мс</span>
                                            </div>
                                            <div class="flex items-center gap-1.5">
                                                <div class="w-2 h-2 rounded-full ${getLoadColor(server.load).replace('text-', 'bg-')}"></div>
                                                <span class="text-xs text-slate-500">${server.load}% загрузка</span>
                                            </div>
                                        </div>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Connection Button -->
                    <div class="flex justify-center mb-10">
                        <button 
                            onclick="toggleConnection()"
                            class="relative"
                        >
                            ${state.isConnected ? `
                                <div class="absolute inset-0 rounded-full bg-emerald-500/20 pulse-ring"></div>
                                <div class="absolute inset-0 rounded-full bg-emerald-500/20 pulse-ring" style="animation-delay: 1s;"></div>
                            ` : ''}
                            ${state.isConnecting ? `
                                <div class="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                            ` : ''}
                            <div class="relative w-40 h-40 rounded-full flex items-center justify-center ${
                                state.isConnected ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-[0_0_60px_rgba(16,185,129,0.5)]' :
                                state.isConnecting ? 'bg-gradient-to-br from-violet-500 to-violet-600' :
                                'bg-gradient-to-br from-slate-700 to-slate-800'
                            } border-8 border-slate-900 transition-all duration-300">
                                ${state.isConnecting ? `
                                    <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                    </svg>
                                ` : state.isConnected ? `
                                    <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                    </svg>
                                ` : `
                                    <svg class="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                `}
                            </div>
                        </button>
                    </div>

                    <div class="text-center mb-8">
                        <p class="text-lg font-semibold ${
                            state.isConnected ? 'text-emerald-400' : 
                            state.isConnecting ? 'text-violet-400' : 
                            'text-slate-400'
                        }">
                            ${state.isConnecting ? 'Подключение...' : state.isConnected ? 'Подключено' : 'Отключено'}
                        </p>
                        <p class="text-sm text-slate-500">
                            ${state.isConnecting ? 'Установка защищённого соединения' : 
                              state.isConnected ? 'Ваше соединение защищено' : 
                              'Нажмите для подключения'}
                        </p>
                    </div>

                    <!-- Stats -->
                    ${state.isConnected ? `
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                                <div class="flex items-center gap-2 mb-2">
                                    <svg class="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <p class="text-xs text-slate-400">Время подключения</p>
                                </div>
                                <p class="text-lg font-bold text-violet-400">${formatTime(state.connectionTime)}</p>
                            </div>

                            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                                <div class="flex items-center gap-2 mb-2">
                                    <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <p class="text-xs text-slate-400">IP адрес</p>
                                </div>
                                <p class="text-lg font-bold text-emerald-400">185.xxx.xx</p>
                                <p class="text-xs text-slate-500">Скрыт</p>
                            </div>

                            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                                <div class="flex items-center gap-2 mb-2">
                                    <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                                    </svg>
                                    <p class="text-xs text-slate-400">Загрузка</p>
                                </div>
                                <p class="text-lg font-bold text-blue-400">42.5 MB/s</p>
                            </div>

                            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                                <div class="flex items-center gap-2 mb-2">
                                    <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                    </svg>
                                    <p class="text-xs text-slate-400">Отдача</p>
                                </div>
                                <p class="text-lg font-bold text-amber-400">18.2 MB/s</p>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        // Initialize
        render();
    </script>
</body>
</html>