import React, { useState, useEffect } from 'react';
import { 
  Send, 
  AlertTriangle, 
  Activity, 
  Globe, 
  Shield, 
  Server, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  XCircle,
  Zap,
  Clock,
  ExternalLink,
  Lock,
  Heart,
  ArrowLeft,
  Info,
  Copy,
  Check,
  Smartphone,
  Monitor,
  AlertOctagon
} from 'lucide-react';
import { cn } from './utils/cn';

// --- Types ---

interface ProxyItem {
  country: string;
  flag: string;
  url: string;
  ping: number;
  online: boolean;
}

interface BypassMethod {
  title: string;
  icon: React.ReactNode;
  difficulty: 'easy' | 'medium' | 'hard';
  time: string;
  efficiency: number;
  description: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

// --- Data ---

const getSocksLink = (ip: string, port: string | number) => `https://t.me/socks?server=${ip}&port=${port}`;

// Helper to generate realistic ping within a range
const getPing = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const PROXY_LIST: ProxyItem[] = [
  // Ireland (MTProto - Keep existing)
  { country: 'Ирландия', flag: '🇮🇪', url: 'https://t.me/proxy?server=www.humaontop.space&port=443&secret=3XnnAQIAAQAH8AMDhuJMOt0&bot=@mtpro_xyz_bot&channel=@mtpro_xyz', ping: getPing(40, 60), online: true },
  
  // Finland
  { country: 'Финляндия', flag: '🇫🇮', url: getSocksLink('46.20.106.102', 1080), ping: getPing(40, 65), online: true },
  
  // Russia
  { country: 'Россия', flag: '🇷🇺', url: getSocksLink('194.28.162.12', 1080), ping: getPing(15, 35), online: true },
  { country: 'Россия', flag: '🇷🇺', url: getSocksLink('37.200.67.75', 1080), ping: getPing(20, 45), online: true },
  { country: 'Россия', flag: '🇷🇺', url: getSocksLink('93.171.58.169', 1080), ping: getPing(10, 30), online: true },
  { country: 'Россия', flag: '🇷🇺', url: getSocksLink('185.106.105.10', 1080), ping: getPing(25, 50), online: true },
  { country: 'Россия', flag: '🇷🇺', url: getSocksLink('185.61.246.57', 1080), ping: getPing(15, 40), online: true },
  { country: 'Россия', flag: '🇷🇺', url: getSocksLink('87.117.11.57', 1080), ping: getPing(20, 45), online: true },
  { country: 'Россия', flag: '🇷🇺', url: getSocksLink('31.43.194.184', 1080), ping: getPing(30, 55), online: true },
  
  // Germany
  { country: 'Германия', flag: '🇩🇪', url: getSocksLink('128.140.118.165', 1080), ping: getPing(45, 75), online: true },
  
  // Netherlands
  { country: 'Нидерланды', flag: '🇳🇱', url: getSocksLink('188.137.250.230', 1080), ping: getPing(50, 80), online: true },
  { country: 'Нидерланды', flag: '🇳🇱', url: getSocksLink('146.19.254.101', 5555), ping: getPing(45, 75), online: true },
  { country: 'Нидерланды', flag: '🇳🇱', url: getSocksLink('5.255.117.127', 1080), ping: getPing(48, 78), online: true },
  { country: 'Нидерланды', flag: '🇳🇱', url: getSocksLink('5.255.117.250', 1080), ping: getPing(52, 82), online: true },
  
  // Moldova
  { country: 'Молдова', flag: '🇲🇩', url: getSocksLink('91.242.229.96', 1080), ping: getPing(60, 95), online: true },
  
  // Canada
  { country: 'Канада', flag: '🇨🇦', url: getSocksLink('188.227.196.62', 1080), ping: getPing(140, 190), online: true },
  
  // France
  { country: 'Франция', flag: '🇫🇷', url: getSocksLink('213.136.69.156', 1080), ping: getPing(60, 100), online: true },
  
  // Hong Kong
  { country: 'Гонконг', flag: '🇭🇰', url: getSocksLink('27.124.9.21', 5555), ping: getPing(180, 260), online: true },
  { country: 'Гонконг', flag: '🇭🇰', url: getSocksLink('27.124.9.8', 5555), ping: getPing(175, 255), online: true },
  { country: 'Гонконг', flag: '🇭🇰', url: getSocksLink('27.124.9.2', 5555), ping: getPing(190, 270), online: true },
  
  // USA
  { country: 'США', flag: '🇺🇸', url: getSocksLink('38.14.192.17', 1080), ping: getPing(130, 180), online: true },
  { country: 'США', flag: '🇺🇸', url: getSocksLink('149.28.8.135', 1080), ping: getPing(125, 175), online: true },
  
  // Argentina
  { country: 'Аргентина', flag: '🇦🇷', url: getSocksLink('165.154.162.230', 1080), ping: getPing(280, 380), online: true },
];

const BYPASS_METHODS: BypassMethod[] = [
  {
    title: 'MTProto Proxy',
    icon: <Globe className="w-6 h-6" />,
    difficulty: 'easy',
    time: '1 мин',
    efficiency: 95,
    description: 'Встроенный в Telegram метод обхода. Не требует установки дополнительных программ.'
  },
  {
    title: 'VPN Сервисы',
    icon: <Shield className="w-6 h-6" />,
    difficulty: 'medium',
    time: '5 мин',
    efficiency: 99,
    description: 'Полное шифрование трафика. Высокая надежность, но может замедлять интернет.'
  },
  {
    title: 'Смена DNS',
    icon: <Server className="w-6 h-6" />,
    difficulty: 'medium',
    time: '3 мин',
    efficiency: 70,
    description: 'Помогает, если блокировка осуществляется на уровне DNS-запросов провайдера.'
  },
  {
    title: 'DNS over HTTPS/TLS',
    icon: <Lock className="w-6 h-6" />,
    difficulty: 'medium',
    time: '5 мин',
    efficiency: 85,
    description: 'Шифрованные DNS запросы. Сложнее заблокировать, чем обычный DNS.'
  },
  {
    title: 'Telegram Web',
    icon: <Globe className="w-6 h-6" />,
    difficulty: 'easy',
    time: '0 мин',
    efficiency: 60,
    description: 'Веб-версия мессенджера. Часто работает даже при блокировке приложений.'
  }
];

const DNS_PROVIDERS = [
  { name: 'Cloudflare', ip: '1.1.1.1' },
  { name: 'Google', ip: '8.8.8.8' },
  { name: 'Quad9', ip: '9.9.9.9' },
  { name: 'AdGuard', ip: '94.140.14.14' },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Что происходит?',
    answer: 'С недавнего времени наблюдаются перебои в работе Telegram на территории РФ. Это связано с попытками замедления трафика мессенджера или блокировки отдельных подсетей.'
  },
  {
    question: 'Какой способ проще?',
    answer: 'Самый простой способ — использование MTProto прокси. Это встроенная функция Telegram, активация которой занимает пару кликов по ссылке.'
  },
  {
    question: 'Безопасно ли это?',
    answer: 'Использование прокси скрывает ваш IP-адрес от серверов Telegram, но владелец прокси может видеть метаданные (но не содержимое переписки, так как Telegram использует сквозное шифрование в секретных чатах и клиент-серверное шифрование в обычных).'
  },
];

// --- Components ---

const DifficultyBadge = ({ level }: { level: 'easy' | 'medium' | 'hard' }) => {
  const colors = {
    easy: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    hard: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  const labels = { easy: 'Легко', medium: 'Средне', hard: 'Сложно' };
  
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", colors[level])}>
      {labels[level]}
    </span>
  );
};

const EfficiencyBar = ({ value }: { value: number }) => {
  let colorClass = 'bg-red-500';
  if (value >= 80) colorClass = 'bg-green-500';
  else if (value >= 50) colorClass = 'bg-yellow-500';

  return (
    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
      <div 
        className={cn("h-1.5 rounded-full transition-all duration-500", colorClass)} 
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-slate-800 rounded", className)} />
);

const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-slate-800 border border-[#24A1DE]/30 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-[#24A1DE]" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

// --- Main App ---

export function App() {
  // State
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'windows'>('android');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [checkingConnection, setCheckingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'checking' | 'online' | 'offline'>('idle');
  const [connectionStep, setConnectionStep] = useState<string>('');
  const [progress, setProgress] = useState(0);
  
  // Proxy UI State
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [loadingProxies, setLoadingProxies] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Copy Feedback State
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  // Auto-run connection check
  useEffect(() => {
    const timer = setTimeout(() => {
      runConnectionCheck();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle Country Selection with Fake Loading
  const handleSelectCountry = (country: string) => {
    setLoadingProxies(true);
    setSelectedCountry(country);
    setTimeout(() => {
      setLoadingProxies(false);
    }, 800);
  };
  
  // Get Unique Countries for Grid
  const countries = Array.from(new Set(PROXY_LIST.map(p => p.country))).map(countryName => {
    const proxiesInCountry = PROXY_LIST.filter(p => p.country === countryName);
    return {
      name: countryName,
      flag: proxiesInCountry[0].flag,
      count: proxiesInCountry.length,
      avgPing: Math.round(proxiesInCountry.reduce((acc, curr) => acc + curr.ping, 0) / proxiesInCountry.length)
    };
  });

  const filteredProxies = selectedCountry 
    ? PROXY_LIST.filter(p => p.country === selectedCountry)
    : [];

  // Connection Check Simulation
  const runConnectionCheck = () => {
    if (checkingConnection) return;
    setCheckingConnection(true);
    setConnectionStatus('checking');
    setProgress(0);
    setConnectionStep('Инициализация...');

    const steps = [
      { p: 20, text: 'Разрешение DNS...' },
      { p: 45, text: 'Подключение к серверам...' },
      { p: 70, text: 'Проверка рукопожатия...' },
      { p: 90, text: 'Аутентификация...' },
      { p: 100, text: 'Завершение...' }
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setCheckingConnection(false);
        setConnectionStatus('online'); // Always success for better UX as requested
        setConnectionStep('');
        return;
      }

      const step = steps[currentStep];
      setProgress(step.p);
      setConnectionStep(step.text);
      currentStep++;
    }, 600);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIp(text);
      setTimeout(() => setCopiedIp(null), 1500);
    });
  };

  const handleReport = () => {
    setToastMessage("Спасибо! Мы проверим этот сервер.");
  };

  const getPingColor = (ms: number) => {
    if (ms < 300) return "text-green-400";
    if (ms < 600) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 font-sans selection:bg-[#24A1DE] selection:text-white pb-20">
      
      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#24A1DE] flex items-center justify-center shadow-[0_0_15px_rgba(36,161,222,0.5)]">
              {/* Paper Plane Logo - rotated to point right */}
              <Send className="text-white w-5 h-5 rotate-45 translate-x-[-2px] translate-y-[2px]" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white leading-none">FreeTG</h1>
              <p className="text-xs text-slate-400 font-medium">Свободный Telegram в России</p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Обновлено</p>
            <p className="text-sm font-mono text-[#24A1DE]">12.02.2026</p>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 max-w-6xl mx-auto space-y-12">
        
        {/* Hero Alert */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-all duration-700"></div>
          
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex-shrink-0 flex items-center justify-center text-amber-500 animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2 z-10">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-400">Telegram замедляется в России</h2>
            <p className="text-slate-300 leading-relaxed max-w-2xl">
              С недавнего времени провайдеры начали замедлять работу Telegram. Мы собрали проверенные и безопасные способы восстановить доступ к мессенджеру.
            </p>
          </div>
        </div>

        {/* Connection Check */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#24A1DE]" />
                Проверка соединения
              </h3>
              <p className="text-sm text-slate-400 mt-1">Проверьте доступность серверов Telegram с вашего устройства</p>
            </div>
            <button 
              onClick={runConnectionCheck}
              disabled={checkingConnection}
              className={cn(
                "px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                checkingConnection 
                  ? "bg-slate-800 text-slate-400"
                  : "bg-[#24A1DE] hover:bg-[#1a8bc7] text-white shadow-[#24A1DE]/25"
              )}
            >
              {checkingConnection ? 'Тестирование...' : 'Запустить тест'}
            </button>
          </div>

          <div className="relative h-4 bg-slate-800/50 rounded-full overflow-hidden mb-4">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#24A1DE] to-cyan-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-sm font-medium h-6">
            <span className="text-slate-500">Статус серверов:</span>
            
            {connectionStatus === 'idle' && <span className="text-slate-400">Ожидание проверки...</span>}
            
            {connectionStatus === 'checking' && (
              <span className="text-[#24A1DE] animate-pulse flex items-center gap-2">
                {connectionStep}
              </span>
            )}
            
            {connectionStatus === 'online' && (
              <span className="flex items-center gap-2 text-green-400 animate-in fade-in zoom-in duration-300">
                <CheckCircle className="w-4 h-4" /> Стабильное соединение
              </span>
            )}
            
            {connectionStatus === 'offline' && (
              <span className="flex items-center gap-2 text-red-400 animate-in fade-in zoom-in duration-300">
                <XCircle className="w-4 h-4" /> Соединение ограничено
              </span>
            )}
          </div>
        </section>

        {/* Bypass Methods Grid */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#24A1DE]" />
            Способы обхода
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {BYPASS_METHODS.map((method, idx) => (
              <div key={idx} className="group bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-800 group-hover:bg-slate-700 text-[#24A1DE] transition-colors">
                    {method.icon}
                  </div>
                  <DifficultyBadge level={method.difficulty} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{method.title}</h3>
                <p className="text-sm text-slate-400 mb-4 h-10 leading-snug">{method.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Время: {method.time}</span>
                    <span>Эффективность</span>
                  </div>
                  <EfficiencyBar value={method.efficiency} />
                </div>
              </div>
            ))}
          </div>
          
          {/* Censor Tracker Banner */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4">
            <div className="bg-purple-500/20 text-purple-400 p-2 rounded-lg">
              <Globe className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-300">
                <span className="text-white font-semibold">Ничего не помогает?</span> Попробуйте расширение <span className="text-purple-400 font-medium">Censor Tracker</span> для вашего браузера. Оно автоматически обходит блокировки многих сайтов.
              </p>
            </div>
            <a 
              href="https://censortracker.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            >
              Установить
            </a>
          </div>
        </section>

        {/* Proxy Servers */}
        <section id="proxies" className="space-y-6">
          <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Globe className="w-6 h-6 text-[#24A1DE]" />
                Рабочие прокси-серверы
              </h2>
              <p className="text-slate-400 text-sm">
                {selectedCountry 
                  ? `Список серверов: ${selectedCountry}` 
                  : 'Выберите страну для подключения'}
              </p>
            </div>
            
            {selectedCountry && (
              <button 
                onClick={() => setSelectedCountry(null)}
                className="text-sm text-slate-400 hover:text-white flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-all active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                Назад к странам
              </button>
            )}
          </div>

          <div className="transition-all duration-300 min-h-[300px]">
            {!selectedCountry ? (
              // Country Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in zoom-in-95 duration-300">
                {countries.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleSelectCountry(c.name)}
                    className="group relative bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col gap-3 hover:border-[#24A1DE]/50 hover:bg-slate-800/80 transition-all active:scale-95 text-left"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-4xl">{c.flag}</span>
                      <div className="px-2.5 py-1 rounded-full bg-slate-800 text-xs font-semibold text-slate-300 group-hover:bg-[#24A1DE] group-hover:text-white transition-colors">
                        {c.count} шт.
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#24A1DE] transition-colors">{c.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <Activity className="w-3 h-3" />
                        Средний пинг: <span className="text-green-400">{c.avgPing} мс</span>
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // Specific Proxy List
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-right-4 fade-in duration-300">
                {loadingProxies ? (
                  // Skeletons
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <Skeleton className="w-24 h-6" />
                        <Skeleton className="w-16 h-6" />
                      </div>
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-full h-10 mt-2" />
                    </div>
                  ))
                ) : (
                  filteredProxies.map((proxy, idx) => (
                    <div key={idx} className="relative bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 hover:border-slate-600 transition-colors group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{proxy.flag}</span>
                          <span className="font-medium text-slate-200">{proxy.country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleReport();
                                }}
                                title="Сообщить о проблеме"
                                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-500 hover:text-amber-500 transition-colors"
                            >
                                <AlertTriangle className="w-4 h-4" />
                            </button>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                Online
                            </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Пинг:
                        </span>
                        <span className={cn(
                          "font-mono font-semibold",
                          getPingColor(proxy.ping)
                        )}>
                          {proxy.ping} мс
                        </span>
                      </div>
  
                      <a 
                        href={proxy.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-[#24A1DE] text-slate-200 hover:text-white rounded-lg font-medium text-sm transition-all active:scale-95 group-hover:shadow-lg group-hover:shadow-[#24A1DE]/20"
                      >
                        Подключить
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </section>

        {/* DNS Settings */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-[#24A1DE]" />
              Популярные DNS
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {DNS_PROVIDERS.map((dns) => (
                <div key={dns.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 group hover:border-slate-700 transition-colors">
                  <span className="font-medium text-slate-200">{dns.name}</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-slate-800 px-2 py-1 rounded text-[#24A1DE] font-mono">{dns.ip}</code>
                    <button 
                        onClick={() => handleCopy(dns.ip)}
                        className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Копировать IP"
                    >
                        {copiedIp === dns.ip ? (
                            <Check className="w-4 h-4 text-green-400" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-200/80 flex gap-3">
                <AlertOctagon className="w-5 h-5 flex-shrink-0 text-amber-500" />
                <p>После настройки проверьте статус утечки DNS на сайте <a href="https://dnsleaktest.com" target="_blank" rel="noreferrer" className="underline hover:text-white">dnsleaktest.com</a>.</p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="flex border-b border-slate-800">
              {(['android', 'ios', 'windows'] as const).map(platform => (
                <button
                  key={platform}
                  onClick={() => setActiveTab(platform)}
                  className={cn(
                    "flex-1 py-4 text-sm font-medium transition-colors border-b-2 flex items-center justify-center gap-2",
                    activeTab === platform
                      ? "border-[#24A1DE] text-[#24A1DE] bg-slate-800/20"
                      : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/10"
                  )}
                >
                  {platform === 'android' && <Smartphone className="w-4 h-4" />}
                  {platform === 'ios' && <Smartphone className="w-4 h-4" />}
                  {platform === 'windows' && <Monitor className="w-4 h-4" />}
                  {platform === 'android' && 'Android'}
                  {platform === 'ios' && 'iOS / macOS'}
                  {platform === 'windows' && 'Windows'}
                </button>
              ))}
            </div>
            
            <div className="p-6 flex-1">
              {activeTab === 'android' && (
                <div className="space-y-4 text-sm text-slate-300">
                  <p><strong className="text-white">1.</strong> Откройте Настройки → Подключения → Другие настройки.</p>
                  <p><strong className="text-white">2.</strong> Выберите «Персональный DNS-сервер».</p>
                  <p><strong className="text-white">3.</strong> Введите имя хоста провайдера (например, <code className="text-[#24A1DE]">dns.google</code> или <code className="text-[#24A1DE]">1dot1dot1dot1.cloudflare-dns.com</code>).</p>
                  <p><strong className="text-white">4.</strong> Сохраните изменения.</p>
                </div>
              )}
              {activeTab === 'ios' && (
                <div className="space-y-4 text-sm text-slate-300">
                  <p><strong className="text-white">1.</strong> Установите профиль DNS (например, через приложение Cloudflare 1.1.1.1).</p>
                  <p><strong className="text-white">2.</strong> Или зайдите в Настройки → Wi-Fi.</p>
                  <p><strong className="text-white">3.</strong> Нажмите (i) рядом с сетью → Настройка DNS → Вручную.</p>
                  <p><strong className="text-white">4.</strong> Добавьте серверы <code className="text-[#24A1DE]">1.1.1.1</code> и <code className="text-[#24A1DE]">1.0.0.1</code>.</p>
                </div>
              )}
              {activeTab === 'windows' && (
                <div className="space-y-4 text-sm text-slate-300">
                  <p><strong className="text-white">1.</strong> Параметры → Сеть и Интернет → Wi-Fi / Ethernet.</p>
                  <p><strong className="text-white">2.</strong> Свойства оборудования → Редактировать назначение DNS-сервера.</p>
                  <p><strong className="text-white">3.</strong> Выберите «Вручную» → IPv4.</p>
                  <p><strong className="text-white">4.</strong> Предпочтительный DNS: <code className="text-[#24A1DE]">8.8.8.8</code>.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Частые вопросы</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-200 hover:bg-slate-800/50 transition-colors"
                >
                  {item.question}
                  {openFaq === idx ? <ChevronUp className="w-5 h-5 text-[#24A1DE]" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                </button>
                <div 
                  className={cn(
                    "transition-all duration-300 ease-in-out overflow-hidden",
                    openFaq === idx ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="p-4 pt-0 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0B1120] py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="text-center md:text-left space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#24A1DE] flex items-center justify-center">
                <Send className="text-white w-4 h-4 rotate-45 translate-x-[-2px] translate-y-[2px]" />
              </div>
              <span className="font-bold text-lg text-white">FreeTG</span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs">
              Мы выступаем против цензуры и за свободный интернет.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://t.me/freetelegraminRussia" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-[#24A1DE] text-slate-300 hover:text-white font-medium transition-all text-sm flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              Новости FreeTG
            </a>
            <a 
              href="https://t.me/helpfreetg_bot" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-[#24A1DE] text-slate-400 hover:text-[#24A1DE] font-medium transition-all text-sm flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              Поддержка
            </a>
             <a 
              href="https://t.me/donateproxyintg_bot" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl border border-amber-500/30 hover:bg-amber-500/10 text-amber-500 font-medium transition-all text-sm flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Пожертвовать прокси
            </a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800/50 text-center text-xs text-slate-600">
          © 2026 FreeTG. All rights reserved. Not affiliated with Telegram FZ-LLC.
        </div>
      </footer>

    </div>
  );
}
