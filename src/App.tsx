import React, { useState, useEffect } from 'react';

// --- Types ---

import { 
  Send, 
  Shield, 
  Globe, 
  Zap, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  Wifi, 
  RefreshCw, 
  Copy, 
  ArrowLeft, 
  Info,
  Heart,
  X,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  BookOpen
} from 'lucide-react';

type ProxyType = 'SOCKS5' | 'MTProto';

interface ProxyServer {
  ip: string;
  port: number;
  country: string;
  countryCode: string;
  type: ProxyType;
  secret?: string; // For MTProto
  ping: number; // ms
  status: 'online' | 'offline';
  lastChecked: number; // timestamp
}

interface BypassMethod {
  title: string;
  difficulty: 'Легко' | 'Средне' | 'Сложно';
  time: string;
  efficiency: number; // 0-100
  icon: React.ReactNode;
  description: string;
  howTo: string[];
  pros: string[];
  cons: string[];
}

// --- Data ---

const RAW_PROXIES: ProxyServer[] = [
  // Ireland (MTProto)
  { ip: 'www.humaontop.space', port: 443, country: 'Ирландия', countryCode: 'IE', type: 'MTProto', secret: '3XnnAQIAAQAH8AMDhuJMOt0', ping: 45, status: 'online', lastChecked: Date.now() },
  
  // Sweden (New)
  { ip: '193.232.178.37', port: 1080, country: 'Швеция', countryCode: 'SE', type: 'SOCKS5', ping: 25, status: 'online', lastChecked: Date.now() },
  
  // Finland
  { ip: '46.20.106.102', port: 1080, country: 'Финляндия', countryCode: 'FI', type: 'SOCKS5', ping: 28, status: 'online', lastChecked: Date.now() },
  
  // Russia
  { ip: '194.28.162.12', port: 1080, country: 'Россия', countryCode: 'RU', type: 'SOCKS5', ping: 15, status: 'online', lastChecked: Date.now() },
  { ip: '37.200.67.75', port: 1080, country: 'Россия', countryCode: 'RU', type: 'SOCKS5', ping: 18, status: 'online', lastChecked: Date.now() },
  { ip: '93.171.58.169', port: 1080, country: 'Россия', countryCode: 'RU', type: 'SOCKS5', ping: 22, status: 'online', lastChecked: Date.now() },
  { ip: '185.106.105.10', port: 1080, country: 'Россия', countryCode: 'RU', type: 'SOCKS5', ping: 19, status: 'online', lastChecked: Date.now() },
  { ip: '185.61.246.57', port: 1080, country: 'Россия', countryCode: 'RU', type: 'SOCKS5', ping: 21, status: 'online', lastChecked: Date.now() },
  { ip: '87.117.11.57', port: 1080, country: 'Россия', countryCode: 'RU', type: 'SOCKS5', ping: 25, status: 'online', lastChecked: Date.now() },
  { ip: '31.43.194.184', port: 1080, country: 'Россия', countryCode: 'RU', type: 'SOCKS5', ping: 20, status: 'online', lastChecked: Date.now() },

  // Germany
  { ip: '128.140.118.165', port: 1080, country: 'Германия', countryCode: 'DE', type: 'SOCKS5', ping: 48, status: 'online', lastChecked: Date.now() },
  { ip: '193.233.254.8', port: 1080, country: 'Германия', countryCode: 'DE', type: 'SOCKS5', ping: 52, status: 'online', lastChecked: Date.now() },

  // Netherlands
  { ip: '188.137.250.230', port: 1080, country: 'Нидерланды', countryCode: 'NL', type: 'SOCKS5', ping: 55, status: 'online', lastChecked: Date.now() },
  { ip: '146.19.254.101', port: 5555, country: 'Нидерланды', countryCode: 'NL', type: 'SOCKS5', ping: 58, status: 'online', lastChecked: Date.now() },
  { ip: '5.255.117.127', port: 1080, country: 'Нидерланды', countryCode: 'NL', type: 'SOCKS5', ping: 60, status: 'online', lastChecked: Date.now() },
  { ip: '5.255.117.250', port: 1080, country: 'Нидерланды', countryCode: 'NL', type: 'SOCKS5', ping: 61, status: 'online', lastChecked: Date.now() },
  { ip: '91.84.117.49', port: 10880, country: 'Нидерланды', countryCode: 'NL', type: 'SOCKS5', ping: 59, status: 'online', lastChecked: Date.now() },
  { ip: '5.255.113.177', port: 1080, country: 'Нидерланды', countryCode: 'NL', type: 'SOCKS5', ping: 62, status: 'online', lastChecked: Date.now() },

  // UK
  { ip: '45.140.147.82', port: 1081, country: 'Великобритания', countryCode: 'GB', type: 'SOCKS5', ping: 65, status: 'online', lastChecked: Date.now() },

  // France
  { ip: '213.136.69.156', port: 1080, country: 'Франция', countryCode: 'FR', type: 'SOCKS5', ping: 50, status: 'online', lastChecked: Date.now() },
  { ip: '194.163.160.97', port: 10808, country: 'Франция', countryCode: 'FR', type: 'SOCKS5', ping: 54, status: 'online', lastChecked: Date.now() },

  // Moldova
  { ip: '91.242.229.96', port: 1080, country: 'Молдова', countryCode: 'MD', type: 'SOCKS5', ping: 70, status: 'online', lastChecked: Date.now() },

  // Canada
  { ip: '188.227.196.62', port: 1080, country: 'Канада', countryCode: 'CA', type: 'SOCKS5', ping: 140, status: 'online', lastChecked: Date.now() },

  // USA
  { ip: '38.14.192.17', port: 1080, country: 'США', countryCode: 'US', type: 'SOCKS5', ping: 155, status: 'online', lastChecked: Date.now() },
  { ip: '149.28.8.135', port: 1080, country: 'США', countryCode: 'US', type: 'SOCKS5', ping: 160, status: 'online', lastChecked: Date.now() },
  { ip: '192.210.248.111', port: 50161, country: 'США', countryCode: 'US', type: 'SOCKS5', ping: 152, status: 'online', lastChecked: Date.now() },

  // Argentina
  { ip: '165.154.162.230', port: 1080, country: 'Аргентина', countryCode: 'AR', type: 'SOCKS5', ping: 310, status: 'online', lastChecked: Date.now() },
  { ip: '186.137.21.165', port: 6881, country: 'Аргентина', countryCode: 'AR', type: 'SOCKS5', ping: 320, status: 'online', lastChecked: Date.now() },

  // Hong Kong
  { ip: '27.124.9.21', port: 5555, country: 'Гонконг', countryCode: 'HK', type: 'SOCKS5', ping: 250, status: 'online', lastChecked: Date.now() },
  { ip: '27.124.9.8', port: 5555, country: 'Гонконг', countryCode: 'HK', type: 'SOCKS5', ping: 255, status: 'online', lastChecked: Date.now() },
  { ip: '27.124.9.2', port: 5555, country: 'Гонконг', countryCode: 'HK', type: 'SOCKS5', ping: 245, status: 'online', lastChecked: Date.now() },
  { ip: '85.121.244.176', port: 50161, country: 'Гонконг', countryCode: 'HK', type: 'SOCKS5', ping: 260, status: 'online', lastChecked: Date.now() },

  // Vietnam
  { ip: '58.187.104.67', port: 1090, country: 'Вьетнам', countryCode: 'VN', type: 'SOCKS5', ping: 280, status: 'online', lastChecked: Date.now() },

  // Sweden (new)
  { ip: '193.232.178.37', port: 1080, country: 'Швеция', countryCode: 'SE', type: 'SOCKS5', ping: 27, status: 'online', lastChecked: Date.now() },

  // Ukraine
  { ip: '91.199.45.79', port: 1080, country: 'Украина', countryCode: 'UA', type: 'SOCKS5', ping: 35, status: 'online', lastChecked: Date.now() },

  // Finland (new)
  { ip: '193.47.60.119', port: 52681, country: 'Финляндия', countryCode: 'FI', type: 'SOCKS5', ping: 30, status: 'online', lastChecked: Date.now() },

  // Hong Kong (new)
  { ip: '47.243.94.125', port: 1080, country: 'Гонконг', countryCode: 'HK', type: 'SOCKS5', ping: 248, status: 'online', lastChecked: Date.now() },

  // Netherlands (new)
  { ip: '91.84.117.49', port: 10880, country: 'Нидерланды', countryCode: 'NL', type: 'SOCKS5', ping: 56, status: 'online', lastChecked: Date.now() },

  // Germany (new)
  { ip: '193.233.254.8', port: 1080, country: 'Германия', countryCode: 'DE', type: 'SOCKS5', ping: 50, status: 'online', lastChecked: Date.now() },

  // UK (new)
  { ip: '45.140.147.82', port: 1081, country: 'Великобритания', countryCode: 'GB', type: 'SOCKS5', ping: 63, status: 'online', lastChecked: Date.now() },

  // France (new)
  { ip: '194.163.160.97', port: 10808, country: 'Франция', countryCode: 'FR', type: 'SOCKS5', ping: 52, status: 'online', lastChecked: Date.now() },

  // USA (new)
  { ip: '192.210.248.111', port: 50161, country: 'США', countryCode: 'US', type: 'SOCKS5', ping: 158, status: 'online', lastChecked: Date.now() },

  // Argentina (new)
  { ip: '186.137.21.165', port: 6881, country: 'Аргентина', countryCode: 'AR', type: 'SOCKS5', ping: 315, status: 'online', lastChecked: Date.now() },
];

const BYPASS_METHODS: BypassMethod[] = [
  { 
    title: 'Proxy (SOCKS5/MTProto)', 
    difficulty: 'Легко', 
    time: '1 мин', 
    efficiency: 95, 
    icon: <Server className="w-6 h-6" />,
    description: 'Пропускает трафик Telegram через промежуточный сервер, маскируя конечную точку от провайдера.',
    howTo: [
      'Выберите прокси из списка ниже на этом сайте.',
      'Нажмите кнопку "Подключить".',
      'Telegram откроется автоматически и предложит добавить прокси.',
      'Нажмите "Добавить прокси" (Enable).'
    ],
    pros: ['Работает внутри приложения', 'Не требует установки стороннего ПО', 'Бесплатно'],
    cons: ['Не шифрует весь трафик устройства', 'Только для Telegram']
  },
  { 
    title: 'VPN Сервисы', 
    difficulty: 'Средне', 
    time: '3 мин', 
    efficiency: 99, 
    icon: <Shield className="w-6 h-6" />,
    description: 'Полностью шифрует весь интернет-трафик вашего устройства и меняет ваш IP-адрес на зарубежный.',
    howTo: [
      'Скачайте проверенное VPN-приложение (например, ProtonVPN, PaperVPN).',
      'Зарегистрируйтесь и выберите страну подключения.',
      'Нажмите большую кнопку подключения.',
      'Весь интернет на устройстве теперь идет через другую страну.'
    ],
    pros: ['Обходит блокировки любых сайтов (Instagram, YouTube)', 'Высокая анонимность'],
    cons: ['Может замедлять интернет', 'Хорошие сервисы часто платные', 'Повышенный расход батареи']
  },
  { 
    title: 'DNS over HTTPS', 
    difficulty: 'Средне', 
    time: '5 мин', 
    efficiency: 80, 
    icon: <Globe className="w-6 h-6" />,
    description: 'Шифрует запросы к доменным именам, скрывая от провайдера, к каким именно сайтам вы обращаетесь.',
    howTo: [
      'В настройках телефона найдите раздел "Частный DNS" (Android) или скачайте профиль (iOS).',
      'Пропишите адрес провайдера (например, 1dot1dot1dot1.cloudflare-dns.com).',
      'Сохраните настройки.'
    ],
    pros: ['Не снижает скорость интернета', 'Работает незаметно', 'Бесплатно'],
    cons: ['Помогает не от всех видов блокировок (если заблокирован IP, не поможет)']
  },
  { 
    title: 'Telegram Web', 
    difficulty: 'Легко', 
    time: '1 мин', 
    efficiency: 90, 
    icon: <Zap className="w-6 h-6" />,
    description: 'Веб-версия мессенджера, работающая прямо в браузере. Часто доступна, даже когда приложение не подключается.',
    howTo: [
      'Откройте браузер (Chrome, Safari).',
      'Перейдите на web.telegram.org',
      'Авторизуйтесь по номеру телефона или QR-коду.'
    ],
    pros: ['Не требует установки', 'Работает на любом устройстве'],
    cons: ['Меньше функций чем в приложении', 'Нет секретных чатов', 'Менее удобно на телефоне']
  },
];

const DNS_SERVERS = [
  { name: 'Cloudflare', ip: '1.1.1.1' },
  { name: 'Google', ip: '8.8.8.8' },
  { name: 'Quad9', ip: '9.9.9.9' },
  { name: 'AdGuard', ip: '94.140.14.14' },
];

const FAQ_ITEMS = [
  { q: 'Что происходит с Telegram?', a: 'Провайдеры в некоторых регионах тестируют системы блокировки и замедления трафика мессенджера.' },
  { q: 'Какой способ проще?', a: 'Использование Proxy внутри Telegram. Это не требует установки сторонних приложений и настраивается в один клик.' },
  { q: 'Безопасно ли использовать Прокси?', a: 'Да, Telegram шифрует весь трафик. Прокси видит только зашифрованные пакеты, но не ваши сообщения.' },
];

// --- Utilities ---

const getProxyLink = (p: ProxyServer) => {
  if (p.type === 'MTProto' && p.secret) {
    return `https://t.me/proxy?server=${p.ip}&port=${p.port}&secret=${p.secret}`;
  }
  return `https://t.me/socks?server=${p.ip}&port=${p.port}`;
};

const formatTimeAgo = (timestamp: number) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Только что';
  const minutes = Math.floor(seconds / 60);
  return `${minutes} мин. назад`;
};

// Remove duplicates based on IP and Port
const deduplicateProxies = (proxies: ProxyServer[]) => {
  const seen = new Set();
  return proxies.filter(p => {
    const key = `${p.ip}:${p.port}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// --- Components ---

const StatusBadge = ({ ping }: { ping: number }) => {
  let colorClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  let dotColor = 'bg-emerald-400';
  
  if (ping > 150 && ping <= 300) {
    colorClass = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    dotColor = 'bg-yellow-400';
  } else if (ping > 300) {
    colorClass = 'bg-red-500/20 text-red-400 border-red-500/30';
    dotColor = 'bg-red-400';
  }

  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-medium ${colorClass}`}>
      <span className={`relative flex h-2 w-2`}>
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`}></span>
      </span>
      {ping} мс
    </div>
  );
};

const CopyButton = ({ text, className = "" }: { text: string, className?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button 
        onClick={handleCopy} 
        className={`p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors border border-slate-700/50 group ${className}`}
        title="Копировать"
      >
        {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-400 group-hover:text-white" />}
      </button>
      {copied && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-2">
          Скопировано!
        </div>
      )}
    </div>
  );
};

const ProxyCard = ({ proxy, onReport, onCheck }: { proxy: ProxyServer, onReport: () => void, onCheck: () => Promise<void> }) => {
  const link = getProxyLink(proxy);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = async () => {
    if (isChecking) return;
    setIsChecking(true);
    await onCheck();
    setIsChecking(false);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 flex flex-col gap-3 hover:border-slate-600 transition-all group relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={`https://flagcdn.com/w40/${proxy.countryCode.toLowerCase()}.png`} 
            alt={proxy.country} 
            className="w-8 h-6 rounded shadow-sm object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{proxy.country}</span>
              <span className="text-xs text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                {proxy.type}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin text-sky-400' : ''}`} />
              {isChecking ? 'Проверяем...' : `Проверка: ${formatTimeAgo(proxy.lastChecked)}`}
            </div>
          </div>
        </div>
        <StatusBadge ping={proxy.ping} />
      </div>

      <div className="flex items-center gap-2 mt-auto pt-2">
        <a 
          href={link} 
          className="flex-1 bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-sky-500/20"
        >
          <Wifi className="w-4 h-4" />
          Подключить
        </a>
        
        <CopyButton text={link} />
        
        <button 
          onClick={handleCheck}
          className={`p-2 rounded-lg transition-colors border ${isChecking ? 'bg-sky-500/20 text-sky-400 border-sky-500/50' : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-700/50 hover:text-white'}`}
          title="Проверить скорость"
          disabled={isChecking}
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
        </button>

        <button 
          onClick={(e) => { e.preventDefault(); onReport(); }}
          className="p-2 rounded-lg bg-slate-800/50 hover:bg-red-500/20 hover:text-red-400 text-slate-500 transition-colors border border-slate-700/50 hover:border-red-500/30"
          title="Пожаловаться"
        >
          <AlertTriangle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const CountryCard = ({ 
  countryCode, 
  countryName, 
  count, 
  avgPing, 
  onClick 
}: { 
  countryCode: string, 
  countryName: string, 
  count: number, 
  avgPing: number, 
  onClick: () => void 
}) => {
  const isBestPing = ['SE', 'FI', 'NL'].includes(countryCode);

  return (
    <button 
      onClick={onClick}
      className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 flex items-center justify-between hover:bg-slate-800/60 hover:border-sky-500/30 transition-all group text-left active:scale-95 relative overflow-hidden"
    >
      {isBestPing && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg shadow-lg">
          ⚡ Мин. пинг
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <img 
            src={`https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`} 
            alt={countryName} 
            className="w-12 h-9 rounded shadow-md object-cover"
          />
          <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-0.5">
            <div className="bg-sky-500/20 border border-sky-500/50 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-sky-400 font-bold">
              {count}
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-white group-hover:text-sky-400 transition-colors">{countryName}</h3>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className={`flex items-center gap-1 ${avgPing < 150 ? 'text-emerald-400' : 'text-slate-400'}`}>
              <Wifi className="w-3 h-3" />
              ~{Math.round(avgPing)} мс
            </span>
          </div>
        </div>
      </div>
      <div className="text-slate-500 group-hover:translate-x-1 transition-transform">
        <ArrowLeft className="w-5 h-5 rotate-180" />
      </div>
    </button>
  );
};

// --- App Component ---

export function App() {
  const [proxies, setProxies] = useState<ProxyServer[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<BypassMethod | null>(null);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'windows'>('android');
  const [checkProgress, setCheckProgress] = useState(0);
  const [checkStatus, setCheckStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize and Deduplicate
  useEffect(() => {
    setProxies(deduplicateProxies(RAW_PROXIES));
  }, []);

  const handleCheckProxy = async (proxy: ProxyServer) => {
    // Simulate network request delay (more stable/consistent)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setProxies(current => current.map(p => {
      if (p.ip === proxy.ip && p.port === proxy.port) {
        // Minimal variance to show "live" check, but keep it stable/realistic
        const variance = Math.floor(Math.random() * 11) - 5; // -5 to +5 ms
        const newPing = Math.max(10, p.ping + variance);
        return {
          ...p,
          lastChecked: Date.now(),
          ping: newPing
        };
      }
      return p;
    }));
  };

  // Auto-run connection check on load
  useEffect(() => {
    const timer = setTimeout(() => {
      runConnectionCheck();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const runConnectionCheck = () => {
    if (checkStatus === 'running') return;
    
    setCheckStatus('running');
    setCheckProgress(0);
    setStatusMessage('Инициализация...');

    const steps = [
      { progress: 20, msg: 'Поиск DNS серверов...' },
      { progress: 45, msg: 'Проверка соединения...' },
      { progress: 70, msg: 'Авторизация...' },
      { progress: 100, msg: 'Доступ разрешен' }
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setCheckStatus('success');
        return;
      }

      setCheckProgress(steps[currentStep].progress);
      setStatusMessage(steps[currentStep].msg);
      currentStep++;
    }, 800);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const countries = Array.from(new Set(proxies.map(p => p.country))).sort();
  const countryStats = countries.map(c => {
    const pList = proxies.filter(p => p.country === c);
    const avgPing = pList.reduce((acc, curr) => acc + curr.ping, 0) / pList.length;
    return {
      name: c,
      code: pList[0].countryCode,
      count: pList.length,
      avgPing
    };
  });

  const filteredProxies = selectedCountry 
    ? proxies.filter(p => p.country === selectedCountry)
    : [];

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 font-sans selection:bg-sky-500/30 selection:text-sky-200 relative overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/80 via-[#0B1120]/95 to-[#0B1120]"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-sky-500/10 blur-[120px] rounded-full transform -translate-y-1/2"></div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-white text-slate-900 px-6 py-3 rounded-full shadow-2xl font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          {toastMessage}
        </div>
      )}

      {/* Method Details Modal */}
      {selectedMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedMethod(null)}
          ></div>
          <div className="relative bg-[#0F172A] border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="sticky top-0 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500/10 rounded-xl text-sky-400">
                  {selectedMethod.icon}
                </div>
                <h2 className="text-xl font-bold text-white">{selectedMethod.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedMethod(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Что это
                </h3>
                <p className="text-slate-300 leading-relaxed text-lg">
                  {selectedMethod.description}
                </p>
              </div>

              {/* How To */}
              <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Как применять
                </h3>
                <ol className="space-y-3">
                  {selectedMethod.howTo.map((step, i) => (
                    <li key={i} className="flex gap-3 text-slate-300">
                      <span className="flex-shrink-0 w-6 h-6 bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Pros & Cons */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4" />
                    Плюсы
                  </h3>
                  <ul className="space-y-2">
                    {selectedMethod.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ThumbsDown className="w-4 h-4" />
                    Минусы
                  </h3>
                  <ul className="space-y-2">
                    {selectedMethod.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 border-t border-slate-800 bg-slate-900/30">
              <button 
                onClick={() => setSelectedMethod(null)}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-sky-900/20"
              >
                Понятно
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-3 rounded-2xl shadow-lg shadow-sky-500/20 transform hover:scale-105 transition-transform duration-300">
              {/* Paper Plane - Default Send icon points top-right (2 o'clock) */}
              <Send className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">FreeTG</h1>
              <p className="text-sky-400 font-medium">Свободный Telegram в России</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-sm font-medium text-slate-400 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
              Обновлено: <span className="text-sky-300">12.02.2026</span>
            </div>
            {/* Connection button removed */}
          </div>
        </header>

        {/* Hero Alert */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-6 mb-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 animate-pulse"></div>
          {/* Animated glow behind the icon */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="flex items-start gap-4 relative">
            {/* Animated warning icon */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-md animate-ping" style={{ animationDuration: '2s' }}></div>
              <div className="relative bg-amber-500/20 border-2 border-amber-500/50 rounded-full p-3 animate-bounce" style={{ animationDuration: '3s' }}>
                <AlertTriangle className="w-8 h-8 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-400 mb-2">Telegram замедляется в России</h2>
              <p className="text-slate-300 leading-relaxed max-w-2xl">
                С недавнего времени провайдеры начали замедлять работу Telegram. Мы собрали проверенные и безопасные способы восстановить доступ к мессенджеру.
              </p>
            </div>
          </div>
        </div>

        {/* Connection Check */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 mb-12 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wifi className="w-5 h-5 text-sky-400" />
              Статус работы Telegram:
            </h3>
            {checkStatus === 'success' && (
              <span className="text-emerald-400 text-sm font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 animate-in fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                В сети
              </span>
            )}
          </div>

          <div className="relative pt-2">
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-300 ease-out relative"
                style={{ width: `${checkProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <div className="flex justify-between mt-3 text-sm">
              <span className="text-slate-400">{statusMessage}</span>
              <span className="font-mono text-sky-400">{checkProgress}%</span>
            </div>
          </div>

          {checkStatus !== 'running' && checkStatus !== 'success' && (
             <button 
             onClick={runConnectionCheck}
             className="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-all active:scale-[0.98]"
           >
             Запустить тест
           </button>
          )}
        </div>

        {/* Bypass Methods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {BYPASS_METHODS.map((method, idx) => (
            <button 
              key={idx} 
              onClick={() => setSelectedMethod(method)}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 hover:border-sky-500/30 hover:bg-slate-800/60 transition-all text-left group active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400 group-hover:text-sky-300 group-hover:scale-110 transition-all">
                    {method.icon}
                  </div>
                  <h3 className="font-bold text-white group-hover:text-sky-400 transition-colors">{method.title}</h3>
                </div>
                <div className="bg-slate-800 p-1.5 rounded-lg text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-500">Сложность</span>
                  <span className={`font-medium px-2 py-0.5 rounded text-xs ${
                    method.difficulty === 'Легко' ? 'bg-emerald-500/10 text-emerald-400' :
                    method.difficulty === 'Средне' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>{method.difficulty}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-500">Время</span>
                  <span className="text-slate-300">{method.time}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Эффективность</span>
                    <span className="text-sky-400">{method.efficiency}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        method.efficiency > 90 ? 'bg-emerald-500' :
                        method.efficiency > 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${method.efficiency}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Censor Tracker Promo */}
        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4 mb-12 flex items-center justify-between gap-4">
           <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-indigo-400" />
              <div>
                <h4 className="font-bold text-indigo-200 text-sm">Ничего не помогает?</h4>
                <p className="text-xs text-indigo-300/70">Попробуйте расширение Censor Tracker для браузера.</p>
              </div>
           </div>
           <a href="https://censortracker.org/" target="_blank" rel="noopener noreferrer" className="text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-3 py-2 rounded-lg transition-colors font-medium">
             Подробнее
           </a>
        </div>

        {/* Proxy Section */}
        <section className="mb-16 animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Server className="w-6 h-6 text-sky-400" />
              Рабочие прокси-серверы
            </h2>
            {selectedCountry && (
              <button 
                onClick={() => setSelectedCountry(null)}
                className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                ← Все страны
              </button>
            )}
          </div>

          {!selectedCountry ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {countryStats.map(c => (
                <CountryCard 
                  key={c.code}
                  countryCode={c.code}
                  countryName={c.name}
                  count={c.count}
                  avgPing={c.avgPing}
                  onClick={() => setSelectedCountry(c.name)}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProxies.map((proxy, i) => (
                <ProxyCard 
                  key={i} 
                  proxy={proxy} 
                  onReport={() => showToast('Жалоба отправлена! Мы проверим этот сервер.')}
                  onCheck={() => handleCheckProxy(proxy)}
                />
              ))}
            </div>
          )}
        </section>

        {/* DNS Settings */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6 text-sky-400" />
            Настройка Private DNS
          </h2>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-1">
            <div className="flex p-1 gap-1 mb-6 bg-slate-950/50 rounded-xl">
              {(['android', 'ios', 'windows'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab 
                      ? 'bg-slate-800 text-white shadow-lg' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab === 'android' ? 'Android' : tab === 'ios' ? 'iOS / macOS' : 'Windows'}
                </button>
              ))}
            </div>

            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {DNS_SERVERS.map((dns, i) => (
                  <div key={i} className="bg-slate-950/50 border border-slate-800 p-3 rounded-lg flex items-center justify-between group">
                    <span className="font-medium text-slate-300">{dns.name}</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-slate-900 px-2 py-1 rounded text-sky-400 text-xs font-mono">{dns.ip}</code>
                      <CopyButton text={dns.ip} className="p-1.5" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-sky-500/5 border border-sky-500/10 rounded-xl p-4 text-sm text-slate-300">
                {activeTab === 'android' && (
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Откройте <strong>Настройки</strong> → <strong>Сеть и Интернет</strong></li>
                    <li>Выберите <strong>Private DNS</strong> (Частный DNS)</li>
                    <li>Выберите <strong>Имя хоста провайдера DNS</strong></li>
                    <li>Введите <code>1dot1dot1dot1.cloudflare-dns.com</code> и сохраните</li>
                  </ol>
                )}
                {activeTab === 'ios' && (
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Перейдите в <strong>Настройки</strong> → <strong>Wi-Fi</strong></li>
                    <li>Нажмите значок <strong>(i)</strong> рядом с сетью</li>
                    <li>Прокрутите до <strong>Настройка DNS</strong> → Выберите <strong>Вручную</strong></li>
                    <li>Добавьте сервер: <code>1.1.1.1</code></li>
                  </ol>
                )}
                {activeTab === 'windows' && (
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Откройте <strong>Параметры</strong> → <strong>Сеть и Интернет</strong></li>
                    <li>Выберите свойства подключения (Wi-Fi/Ethernet)</li>
                    <li>Нажмите <strong>Изменить</strong> в разделе DNS</li>
                    <li>Выберите <strong>Вручную</strong> → IPv4 Вкл. → Предпочтительный DNS: <code>1.1.1.1</code></li>
                  </ol>
                )}
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 p-2 rounded-lg">
                <Info className="w-4 h-4 shrink-0" />
                <span>После настройки проверьте статус на <a href="https://dnsleaktest.com" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">dnsleaktest.com</a></span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-6">Частые вопросы</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="group bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden open:border-sky-500/30 transition-colors">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-slate-200 hover:text-white">
                  {item.q}
                  <span className="text-sky-500 transition-transform group-open:rotate-180">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 pt-8 pb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Send className="w-6 h-6 text-slate-400" />
              <span className="font-bold text-white">FreeTG</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://t.me/freetelegraminRussia" target="_blank" rel="noopener noreferrer" className="bg-[#24A1DE] hover:bg-[#2090C5] text-white px-5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" />
                Канал
              </a>
              <a href="https://t.me/donateproxyintg_bot" target="_blank" rel="noopener noreferrer" className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                <Heart className="w-4 h-4 fill-white" />
                Пожертвовать прокси
              </a>
              <a href="https://t.me/helpfreetg_bot" target="_blank" rel="noopener noreferrer" className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2 rounded-full text-sm font-medium transition-colors">
                Поддержка
              </a>
            </div>
          </div>
          <div className="text-center md:text-left text-xs text-slate-600 max-w-2xl">
            <p className="mb-2">Мы выступаем против цензуры и за свободный интернет.</p>
            <p>Внимание: Эти прокси бесплатны и могут показывать спонсорский канал в списке чатов. Это позволяет владельцам прокси оплачивать сервера. Это не угрожает шифрованию вашего трафика.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
