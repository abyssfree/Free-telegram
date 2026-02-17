import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Send, Shield, Globe, Zap, Monitor, AlertTriangle, ChevronDown,
  ChevronRight, ExternalLink, Copy, Check, RefreshCw, Lock,
  Heart, Headphones, BookOpen, ThumbsUp, ThumbsDown, Info, X,
  Languages
} from 'lucide-react';

// ==================== TRANSLATIONS ====================
const translations = {
  ru: {
    // Header
    subtitle: 'Свободный Telegram в России',
    updated: 'Обновлено:',
    // Hero
    heroTitle: 'Telegram замедляется в России',
    heroText: 'С недавнего времени провайдеры начали замедлять работу Telegram. Мы собрали проверенные и безопасные способы восстановить доступ к мессенджеру.',
    // Connection
    connectionTitle: 'Статус работы Telegram:',
    startTest: 'Запустить тест',
    testing: 'Проверка...',
    stepDns: 'Проверка DNS...',
    stepHandshake: 'Установка соединения...',
    stepAuth: 'Авторизация...',
    stepDone: 'Проверка завершена',
    resultSuccess: 'Telegram доступен, но возможны замедления. Рекомендуем использовать прокси или VPN.',
    resultChecking: 'Выполняется проверка соединения...',
    resultWait: 'Нажмите кнопку для проверки соединения',
    // Methods
    methodsTitle: 'Способы обхода блокировки',
    complexity: 'Сложность:',
    time: 'Время:',
    efficiency: 'Эффективность:',
    easy: 'Легко',
    medium: 'Средне',
    details: 'Подробнее',
    close: 'Закрыть',
    whatIsIt: 'Что это?',
    howToUse: 'Как применить?',
    pros: 'Плюсы',
    cons: 'Минусы',
    // Methods data
    proxyTitle: 'Proxy (SOCKS5/MTProto)',
    proxyDesc: 'Прокси-сервер для Telegram',
    vpnTitle: 'VPN Сервисы',
    vpnDesc: 'Виртуальная частная сеть',
    dnsTitle: 'DNS over HTTPS',
    dnsDesc: 'Шифрование DNS-запросов',
    webTitle: 'Telegram Web',
    webDesc: 'Веб-версия мессенджера',
    // Methods details
    proxyWhatIs: 'Прокси-сервер выступает посредником между вашим устройством и серверами Telegram. Весь трафик мессенджера проходит через промежуточный сервер, обходя блокировки провайдера. MTProto прокси специально разработаны для Telegram.',
    proxyHowTo: ['Откройте Telegram → Настройки → Данные и память → Прокси', 'Нажмите "Добавить прокси"', 'Выберите тип (SOCKS5 или MTProto)', 'Введите адрес сервера и порт', 'Или используйте готовые ссылки с нашего сайта — подключение в один клик'],
    proxyPros: ['Бесплатно', 'Легко настроить', 'Не влияет на другие приложения', 'Встроенная поддержка в Telegram'],
    proxyCons: ['Может замедлять соединение', 'Прокси могут перестать работать', 'Спонсорский канал в списке чатов'],
    vpnWhatIs: 'VPN создаёт зашифрованный туннель между вашим устройством и удалённым сервером. Весь интернет-трафик проходит через этот туннель, делая его невидимым для провайдера. Это защищает не только Telegram, но и все остальные приложения.',
    vpnHowTo: ['Скачайте VPN-приложение (рекомендуем: Outline, Amnezia, WireGuard)', 'Создайте аккаунт или используйте бесплатный тариф', 'Выберите сервер в ближайшей стране (Финляндия, Германия, Нидерланды)', 'Подключитесь и пользуйтесь Telegram без ограничений'],
    vpnPros: ['Защищает весь трафик', 'Высокая надёжность', 'Обходит любые блокировки', 'Шифрование данных'],
    vpnCons: ['Платные сервисы работают лучше', 'Может снижать скорость', 'Нужно отдельное приложение', 'Некоторые VPN блокируются'],
    dnsWhatIs: 'DNS over HTTPS (DoH) шифрует ваши DNS-запросы, не позволяя провайдеру видеть, к каким сайтам вы обращаетесь. Это помогает обходить блокировки, основанные на перехвате DNS.',
    dnsHowTo: ['Откройте настройки сети на вашем устройстве', 'Найдите раздел DNS или "Частный DNS"', 'Укажите адрес DoH-сервера (например, 1.1.1.1 от Cloudflare)', 'Сохраните настройки и перезапустите Telegram'],
    dnsPros: ['Бесплатно', 'Системная настройка', 'Защищает DNS-запросы', 'Не требует приложений'],
    dnsCons: ['Помогает не при всех типах блокировок', 'Требует ручной настройки', 'Нужно знать правильный адрес'],
    webWhatIs: 'Telegram Web — это официальная браузерная версия мессенджера, доступная по адресу web.telegram.org. Работает через HTTPS и может быть доступна, даже когда приложение замедлено.',
    webHowTo: ['Откройте браузер', 'Перейдите на web.telegram.org', 'Войдите по номеру телефона', 'Используйте Telegram прямо в браузере'],
    webPros: ['No installation needed', 'Works in any browser', 'Instant access', 'Official solution'],
    webCons: ['Limited functionality', 'No calls', 'Browser-dependent', 'May also be throttled'],
    censorTitle: 'Ничего не помогает?',
    censorText: 'Попробуйте расширение Censor Tracker для браузера.',
    censorBtn: 'Подробнее',
    // Proxy section
    proxyServersTitle: 'Рабочие прокси-серверы',
    proxyNotice: 'Все прокси бесплатны и могут показывать спонсорский канал в списке чатов.',
    lowPing: 'Мин. пинг',
    servers: 'серверов',
    server: 'Сервер',
    online: 'В сети',
    withPass: 'С ПАРОЛЕМ',
    connect: 'Подключить',
    copyLink: 'Копировать',
    report: 'Пожаловаться',
    reportThanks: 'Спасибо! Мы проверим этот сервер.',
    copied: 'Скопировано!',
    checkSpeed: 'Проверить',
    checking: 'Проверка...',
    backToCountries: '← Все страны',
    // DNS section
    dnsSettingsTitle: 'Настройка DNS',
    dnsLeakNote: 'После настройки проверьте отсутствие утечек на',
    // DNS instructions
    androidDnsTitle: 'Настройка Private DNS на Android',
    androidStep1: 'Откройте Настройки → Сеть и интернет',
    androidStep2: 'Найдите "Частный DNS" (Private DNS)',
    androidStep3: 'Выберите "Имя хоста провайдера частного DNS"',
    androidStep4: 'Введите адрес DNS-сервера',
    androidStep5: 'Нажмите "Сохранить"',
    iosTitle: 'Настройка DNS на iOS / macOS',
    iosStep1: 'Откройте Настройки → Wi-Fi',
    iosStep2: 'Нажмите (i) рядом с вашей сетью',
    iosStep3: 'Прокрутите вниз до "Настройка DNS"',
    iosStep4: 'Выберите "Вручную" и добавьте DNS-сервер',
    iosStep5: 'Сохраните настройки',
    windowsTitle: 'Настройка DNS на Windows',
    windowsStep1: 'Откройте Панель управления → Сеть',
    windowsStep2: 'Свойства адаптера → IPv4',
    windowsStep3: 'Выберите "Использовать следующие DNS"',
    windowsStep4: 'Введите адрес DNS-сервера',
    windowsStep5: 'Нажмите "ОК" и перезагрузите соединение',
    // FAQ
    faqTitle: 'Часто задаваемые вопросы',
    faqQ1: 'Что происходит с Telegram?',
    faqA1: 'Российские интернет-провайдеры по указанию Роскомнадзора замедляют работу серверов Telegram. Это приводит к медленной загрузке сообщений, медиафайлов и проблемам с подключением. Полная блокировка пока не введена, но качество работы мессенджера значительно снижается.',
    faqQ2: 'Какой способ обхода самый простой?',
    faqA2: 'Самый простой способ — использовать прокси-сервер. Вы можете подключиться к нему в один клик через ссылки на нашем сайте. Просто нажмите "Подключить" на любом рабочем прокси, и Telegram автоматически настроит соединение.',
    faqQ3: 'Безопасно ли использовать прокси и VPN?',
    faqA3: 'Да, это безопасно. Telegram использует сквозное шифрование (end-to-end encryption), поэтому ни прокси-сервер, ни VPN-провайдер не могут прочитать ваши сообщения. Прокси лишь маршрутизирует трафик, не имея доступа к его содержимому.',
    // Footer
    footerChannel: 'Новости и обновления',
    footerDonate: 'Пожертвовать прокси',
    footerSupport: 'Поддержка',
    footerDisclaimer: 'Копирование материалов сайта запрещено. Все прокси предоставляются бесплатно. Продажа прокси с данного ресурса запрещена.',
    footerRights: 'Все права защищены.',
  },
  en: {
    subtitle: 'Free Telegram in Russia',
    updated: 'Updated:',
    heroTitle: 'Telegram is being throttled in Russia',
    heroText: 'Russian ISPs have recently started throttling Telegram. We have collected verified and safe methods to restore access to the messenger.',
    connectionTitle: 'Telegram Status:',
    startTest: 'Run Test',
    testing: 'Testing...',
    stepDns: 'Checking DNS...',
    stepHandshake: 'Establishing connection...',
    stepAuth: 'Authenticating...',
    stepDone: 'Check complete',
    resultSuccess: 'Telegram is accessible but may be throttled. We recommend using a proxy or VPN.',
    resultChecking: 'Checking connection...',
    resultWait: 'Press the button to check the connection',
    methodsTitle: 'Bypass Methods',
    complexity: 'Complexity:',
    time: 'Time:',
    efficiency: 'Efficiency:',
    easy: 'Easy',
    medium: 'Medium',
    details: 'Details',
    close: 'Close',
    whatIsIt: 'What is it?',
    howToUse: 'How to use?',
    pros: 'Pros',
    cons: 'Cons',
    proxyTitle: 'Proxy (SOCKS5/MTProto)',
    proxyDesc: 'Proxy server for Telegram',
    vpnTitle: 'VPN Services',
    vpnDesc: 'Virtual Private Network',
    dnsTitle: 'DNS over HTTPS',
    dnsDesc: 'Encrypted DNS queries',
    webTitle: 'Telegram Web',
    webDesc: 'Browser version of the messenger',
    proxyWhatIs: 'A proxy server acts as an intermediary between your device and Telegram servers. All messenger traffic passes through an intermediate server, bypassing ISP blocks. MTProto proxies are specifically designed for Telegram.',
    proxyHowTo: ['Open Telegram → Settings → Data and Storage → Proxy', 'Tap "Add Proxy"', 'Select type (SOCKS5 or MTProto)', 'Enter server address and port', 'Or use ready-made links from our site — one-click connection'],
    proxyPros: ['Free', 'Easy to set up', 'Doesn\'t affect other apps', 'Built-in Telegram support'],
    proxyCons: ['May slow down connection', 'Proxies may stop working', 'Sponsor channel in chat list'],
    vpnWhatIs: 'A VPN creates an encrypted tunnel between your device and a remote server. All internet traffic passes through this tunnel, making it invisible to your ISP. It protects not only Telegram but all other applications as well.',
    vpnHowTo: ['Download a VPN app (recommended: Outline, Amnezia, WireGuard)', 'Create an account or use the free tier', 'Select a server in a nearby country (Finland, Germany, Netherlands)', 'Connect and use Telegram without restrictions'],
    vpnPros: ['Protects all traffic', 'High reliability', 'Bypasses any blocks', 'Data encryption'],
    vpnCons: ['Paid services work better', 'May reduce speed', 'Requires a separate app', 'Some VPNs are blocked'],
    dnsWhatIs: 'DNS over HTTPS (DoH) encrypts your DNS queries, preventing your ISP from seeing which sites you visit. This helps bypass DNS-based blocks.',
    dnsHowTo: ['Open network settings on your device', 'Find the DNS or "Private DNS" section', 'Enter the DoH server address (e.g., 1.1.1.1 from Cloudflare)', 'Save settings and restart Telegram'],
    dnsPros: ['Free', 'System-level setting', 'Protects DNS queries', 'No apps required'],
    dnsCons: ['Doesn\'t help with all block types', 'Requires manual setup', 'Need to know the correct address'],
    webWhatIs: 'Telegram Web is the official browser version of the messenger available at web.telegram.org. It works over HTTPS and may be accessible even when the app is throttled.',
    webHowTo: ['Open your browser', 'Go to web.telegram.org', 'Log in with your phone number', 'Use Telegram directly in the browser'],
    webPros: ['No installation needed', 'Works in any browser', 'Instant access', 'Official solution'],
    webCons: ['Limited functionality', 'No calls', 'Browser-dependent', 'May also be throttled'],
    censorTitle: 'Nothing works?',
    censorText: 'Try the Censor Tracker browser extension.',
    censorBtn: 'Learn more',
    proxyServersTitle: 'Working Proxy Servers',
    proxyNotice: 'All proxies are free and may show a sponsor channel in your chat list.',
    lowPing: 'Low ping',
    servers: 'servers',
    server: 'Server',
    online: 'Online',
    withPass: 'PASSWORD',
    connect: 'Connect',
    copyLink: 'Copy',
    report: 'Report',
    reportThanks: 'Thanks! We will check this server.',
    copied: 'Copied!',
    checkSpeed: 'Check',
    checking: 'Checking...',
    backToCountries: '← All countries',
    dnsSettingsTitle: 'DNS Settings',
    dnsLeakNote: 'After setup, check for leaks at',
    androidDnsTitle: 'Private DNS setup on Android',
    androidStep1: 'Open Settings → Network & Internet',
    androidStep2: 'Find "Private DNS"',
    androidStep3: 'Select "Private DNS provider hostname"',
    androidStep4: 'Enter the DNS server address',
    androidStep5: 'Tap "Save"',
    iosTitle: 'DNS setup on iOS / macOS',
    iosStep1: 'Open Settings → Wi-Fi',
    iosStep2: 'Tap (i) next to your network',
    iosStep3: 'Scroll down to "Configure DNS"',
    iosStep4: 'Select "Manual" and add DNS server',
    iosStep5: 'Save settings',
    windowsTitle: 'DNS setup on Windows',
    windowsStep1: 'Open Control Panel → Network',
    windowsStep2: 'Adapter Properties → IPv4',
    windowsStep3: 'Select "Use the following DNS"',
    windowsStep4: 'Enter the DNS server address',
    windowsStep5: 'Click "OK" and restart the connection',
    faqTitle: 'Frequently Asked Questions',
    faqQ1: 'What is happening with Telegram?',
    faqA1: 'Russian ISPs, under instructions from Roskomnadzor, are throttling Telegram servers. This leads to slow message loading, media issues, and connection problems. A full block has not been implemented yet, but the quality of the messenger has significantly decreased.',
    faqQ2: 'What is the easiest bypass method?',
    faqA2: 'The easiest method is to use a proxy server. You can connect to one in a single click through the links on our site. Just click "Connect" on any working proxy, and Telegram will automatically configure the connection.',
    faqQ3: 'Is it safe to use proxies and VPNs?',
    faqA3: 'Yes, it is safe. Telegram uses end-to-end encryption, so neither the proxy server nor the VPN provider can read your messages. The proxy only routes traffic without access to its content.',
    footerChannel: 'News & Updates',
    footerDonate: 'Donate Proxy',
    footerSupport: 'Support',
    footerDisclaimer: 'Copying site materials is prohibited. All proxies are provided for free. Selling proxies from this resource is prohibited.',
    footerRights: 'All rights reserved.',
  }
};

type Lang = 'ru' | 'en';

// ==================== PROXY DATA ====================
interface ProxyItem {
  id: string;
  country: string;
  flag: string;
  ip: string;
  port: number;
  user?: string;
  pass?: string;
  type: 'socks5' | 'mtproto';
  lowPing: boolean;
  status: 'online' | 'checking';
  lastChecked: number;
  hasAuth: boolean;
}

const rawProxies: Omit<ProxyItem, 'id' | 'status' | 'lastChecked'>[] = [
  // Argentina
  { country: 'Аргентина', flag: '🇦🇷', ip: '186.137.21.165', port: 6881, type: 'socks5', lowPing: false, hasAuth: false },
  // Germany
  { country: 'Германия', flag: '🇩🇪', ip: '77.90.178.244', port: 51524, user: 'test24h', pass: 'bGLKIBGlbU', type: 'socks5', lowPing: true, hasAuth: true },
  { country: 'Германия', flag: '🇩🇪', ip: '191.101.126.134', port: 50101, user: 'friman98760pDEu', pass: 'oW4vsSGZBY', type: 'socks5', lowPing: true, hasAuth: true },
  { country: 'Германия', flag: '🇩🇪', ip: '31.59.236.245', port: 50101, user: 'semanticforce', pass: 'a3xCZwrGzG', type: 'socks5', lowPing: true, hasAuth: true },
  // Netherlands
  { country: 'Нидерланды', flag: '🇳🇱', ip: '45.153.163.50', port: 50101, user: 'astap01', pass: '5YBoMtNUoi', type: 'socks5', lowPing: true, hasAuth: true },
  // France
  { country: 'Франция', flag: '🇫🇷', ip: '194.163.160.97', port: 10808, type: 'socks5', lowPing: true, hasAuth: false },
  // UK
  { country: 'Великобритания', flag: '🇬🇧', ip: '81.168.120.134', port: 50101, user: 'yuriilp4p', pass: 'TxWga7PsNX', type: 'socks5', lowPing: false, hasAuth: true },
  { country: 'Великобритания', flag: '🇬🇧', ip: '45.66.95.79', port: 5010, user: 'yuriilp4p', pass: 'TxWga7PsNX', type: 'socks5', lowPing: false, hasAuth: true },
];

// Country name translations
const countryNames: Record<string, string> = {
  'Нидерланды': 'Netherlands',
  'Германия': 'Germany',
  'Франция': 'France',
  'Аргентина': 'Argentina',
  'Великобритания': 'United Kingdom',
};

function deduplicateProxies(proxies: typeof rawProxies) {
  const seen = new Set<string>();
  return proxies.filter(p => {
    const key = `${p.ip}:${p.port}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const uniqueProxies = deduplicateProxies(rawProxies);

// Sort by Country Name (Russian Alphabetical)
uniqueProxies.sort((a, b) => a.country.localeCompare(b.country));

const initialProxies: ProxyItem[] = uniqueProxies.map((p, i) => ({
  ...p,
  id: `proxy-${i}`,
  status: 'online' as const,
  lastChecked: Date.now(),
}));

function getProxyLink(p: ProxyItem): string {
  let url = `https://t.me/socks?server=${p.ip}&port=${p.port}`;
  if (p.user && p.pass) {
    url += `&user=${p.user}&pass=${p.pass}`;
  }
  return url;
}

// ==================== DNS DATA ====================
const dnsServers = [
  { name: 'Cloudflare', ip: '1.1.1.1', secondary: '1.0.0.1', color: 'from-orange-500 to-yellow-500' },
  { name: 'Google', ip: '8.8.8.8', secondary: '8.8.4.4', color: 'from-blue-500 to-green-500' },
  { name: 'Quad9', ip: '9.9.9.9', secondary: '149.112.112.112', color: 'from-purple-500 to-pink-500' },
  { name: 'AdGuard', ip: '94.140.14.14', secondary: '94.140.15.15', color: 'from-green-500 to-teal-500' },
];

// ==================== APP ====================
export default function App() {
  const [lang, setLang] = useState<Lang>('ru');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const t = translations[lang];

  const getCountryName = (ruName: string) => lang === 'en' ? (countryNames[ruName] || ruName) : ruName;

  // Connection test
  const [testRunning, setTestRunning] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [testStep, setTestStep] = useState('');
  const [testDone, setTestDone] = useState(false);
  const testRunningRef = useRef(false);

  const runConnectionTest = useCallback(() => {
    if (testRunningRef.current) return;
    testRunningRef.current = true;
    setTestRunning(true);
    setTestDone(false);
    setTestProgress(0);
    setTestStep(t.stepDns);

    const steps = [
      { progress: 30, step: t.stepDns, delay: 800 },
      { progress: 60, step: t.stepHandshake, delay: 700 },
      { progress: 85, step: t.stepAuth, delay: 600 },
      { progress: 100, step: t.stepDone, delay: 500 },
    ];

    let i = 0;
    const next = () => {
      if (i < steps.length) {
        const s = steps[i];
        setTestProgress(s.progress);
        setTestStep(s.step);
        i++;
        setTimeout(next, s.delay);
      } else {
        setTestRunning(false);
        setTestDone(true);
        testRunningRef.current = false;
      }
    };
    setTimeout(next, 400);
  }, [t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      runConnectionTest();
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, []);

  // Proxies
  const [proxies, setProxies] = useState<ProxyItem[]>(initialProxies);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [checkingProxy, setCheckingProxy] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // Clipboard
  const [copiedDns, setCopiedDns] = useState<string | null>(null);
  const copyToClipboard = (text: string, id?: string) => {
    navigator.clipboard.writeText(text).then(() => {
      if (id) {
        setCopiedDns(id);
        setTimeout(() => setCopiedDns(null), 1500);
      }
      showToast(t.copied);
    });
  };

  // DNS tabs
  const [dnsTab, setDnsTab] = useState<'android' | 'ios' | 'windows'>('android');

  // FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Method details modal
  const [openMethod, setOpenMethod] = useState<string | null>(null);

  // Country groups
  const countryGroups = proxies.reduce<Record<string, ProxyItem[]>>((acc, p) => {
    if (!acc[p.country]) acc[p.country] = [];
    acc[p.country].push(p);
    return acc;
  }, {});

  // Proxy check
  const checkProxy = (id: string) => {
    setCheckingProxy(id);
    setTimeout(() => {
      setProxies(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, status: 'online' as const, lastChecked: Date.now() }
            : p
        )
      );
      setCheckingProxy(null);
    }, 800 + Math.random() * 400);
  };

  // Time ago
  const timeAgo = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return lang === 'ru' ? 'Только что' : 'Just now';
    const mins = Math.floor(diff / 60);
    return lang === 'ru' ? `${mins} мин. назад` : `${mins} min. ago`;
  };

  // Methods data
  const methods = [
    {
      key: 'proxy',
      icon: <Shield className="w-6 h-6" />,
      title: t.proxyTitle,
      desc: t.proxyDesc,
      complexity: t.easy,
      complexityColor: 'text-green-400',
      time: '2 мин.',
      efficiency: 90,
      effColor: 'from-green-500 to-emerald-400',
      whatIs: t.proxyWhatIs,
      howTo: t.proxyHowTo,
      pros: t.proxyPros,
      cons: t.proxyCons,
    },
    {
      key: 'vpn',
      icon: <Globe className="w-6 h-6" />,
      title: t.vpnTitle,
      desc: t.vpnDesc,
      complexity: t.medium,
      complexityColor: 'text-yellow-400',
      time: '5 мин.',
      efficiency: 98,
      effColor: 'from-green-500 to-emerald-400',
      whatIs: t.vpnWhatIs,
      howTo: t.vpnHowTo,
      pros: t.vpnPros,
      cons: t.vpnCons,
    },
    {
      key: 'dns',
      icon: <Zap className="w-6 h-6" />,
      title: t.dnsTitle,
      desc: t.dnsDesc,
      complexity: t.medium,
      complexityColor: 'text-yellow-400',
      time: '3 мин.',
      efficiency: 70,
      effColor: 'from-yellow-500 to-orange-400',
      whatIs: t.dnsWhatIs,
      howTo: t.dnsHowTo,
      pros: t.dnsPros,
      cons: t.dnsCons,
    },
    {
      key: 'web',
      icon: <Monitor className="w-6 h-6" />,
      title: t.webTitle,
      desc: t.webDesc,
      complexity: t.easy,
      complexityColor: 'text-green-400',
      time: '1 мин.',
      efficiency: 60,
      effColor: 'from-orange-500 to-red-400',
      whatIs: t.webWhatIs,
      howTo: t.webHowTo,
      pros: t.webPros,
      cons: t.webCons,
    },
  ];

  const faqItems = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-white relative overflow-hidden">
      {/* Background with Moving Stars */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1120] via-[#0f1729] to-[#0B1120]" />
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/3 rounded-full blur-[150px]" />

        {/* Moving Stars Layers */}
        <div className="stars-layer-1 absolute inset-0 animate-stars-move-slow">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`l1-${i}`}
              className="absolute rounded-full bg-white/20"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
        <div className="stars-layer-2 absolute inset-0 animate-stars-move-medium">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`l2-${i}`}
              className="absolute rounded-full bg-white/40"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
        <div className="stars-layer-3 absolute inset-0 animate-stars-move-fast">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`l3-${i}`}
              className="absolute rounded-full bg-white/60"
              style={{
                width: Math.random() * 4 + 1 + 'px',
                height: Math.random() * 4 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-green-500/90 backdrop-blur-xl text-white px-6 py-3 rounded-xl shadow-2xl shadow-green-500/20 flex items-center gap-2 animate-bounce-in">
          <Check className="w-5 h-5" />
          <span className="font-medium">{toast}</span>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/30">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#24A1DE] to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">FreeTG</h1>
                <p className="text-xs text-slate-400">{t.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 hidden sm:block">{t.updated} 16.02.2026</span>
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 transition-all text-sm active:scale-95"
                >
                  <Languages className="w-4 h-4 text-blue-400" />
                  <span className="font-medium">{lang.toUpperCase()}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                {showLangMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 min-w-[120px]">
                    <button
                      onClick={() => { setLang('ru'); setShowLangMenu(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-700 transition flex items-center gap-2 ${lang === 'ru' ? 'text-blue-400' : 'text-slate-300'}`}
                    >
                      🇷🇺 Русский
                    </button>
                    <button
                      onClick={() => { setLang('en'); setShowLangMenu(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-700 transition flex items-center gap-2 ${lang === 'en' ? 'text-blue-400' : 'text-slate-300'}`}
                    >
                      🇬🇧 English
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
          {/* Hero Alert */}
          <div className="relative bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-6 md:p-8 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 animate-pulse rounded-full" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="flex items-start gap-4 md:gap-6">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                <div className="relative w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-amber-400 animate-bounce drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" style={{ animationDuration: '3s' }} />
                </div>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-amber-100 mb-2">{t.heroTitle}</h2>
                <p className="text-slate-300 leading-relaxed">{t.heroText}</p>
              </div>
            </div>
          </div>

          {/* Connection Test */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#24A1DE]" />
                {t.connectionTitle}
              </h3>
              <button
                onClick={runConnectionTest}
                disabled={testRunning}
                className="px-5 py-2.5 bg-gradient-to-r from-[#24A1DE] to-blue-600 rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2"
              >
                {testRunning ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> {t.testing}</>
                ) : (
                  <><RefreshCw className="w-4 h-4" /> {t.startTest}</>
                )}
              </button>
            </div>

            {/* Progress */}
            {testRunning && (
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-400">{testStep}</span>
                  <span className="text-slate-400">{testProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#24A1DE] to-blue-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${testProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Skeleton */}
            {testRunning && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-4 bg-slate-800/60 rounded-lg animate-pulse" style={{ width: `${70 + i * 10}%` }} />
                ))}
              </div>
            )}

            {/* Result */}
            {testDone && !testRunning && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-start gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1 animate-pulse shadow-lg shadow-green-500/50" />
                <p className="text-green-200 text-sm">{t.resultSuccess}</p>
              </div>
            )}

            {!testRunning && !testDone && (
              <div className="text-slate-500 text-sm text-center py-4">{t.resultWait}</div>
            )}
          </div>

          {/* Methods */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#24A1DE]" />
              {t.methodsTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {methods.map((m) => (
                <div
                  key={m.key}
                  className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-5 hover:border-slate-700/50 transition-all group cursor-pointer active:scale-[0.98]"
                  onClick={() => setOpenMethod(m.key)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#24A1DE]/20 to-blue-600/10 rounded-xl flex items-center justify-center mb-4 text-[#24A1DE] group-hover:scale-110 transition-transform">
                    {m.icon}
                  </div>
                  <h4 className="font-bold mb-1">{m.title}</h4>
                  <p className="text-xs text-slate-400 mb-4">{m.desc}</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t.complexity}</span>
                      <span className={m.complexityColor}>{m.complexity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t.time}</span>
                      <span className="text-slate-300">{m.time}</span>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-500">{t.efficiency}</span>
                        <span className="text-slate-300">{m.efficiency}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${m.effColor} rounded-full`} style={{ width: `${m.efficiency}%` }} />
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 w-full py-2 text-xs text-[#24A1DE] border border-[#24A1DE]/30 rounded-lg hover:bg-[#24A1DE]/10 transition-all flex items-center justify-center gap-1 active:scale-95">
                    {t.details} <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Method Modal */}
          {openMethod && (() => {
            const m = methods.find(x => x.key === openMethod)!;
            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setOpenMethod(null)}>
                <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#24A1DE]/20 rounded-xl flex items-center justify-center text-[#24A1DE]">{m.icon}</div>
                      <h3 className="text-lg font-bold">{m.title}</h3>
                    </div>
                    <button onClick={() => setOpenMethod(null)} className="text-slate-400 hover:text-white transition active:scale-90">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-5">
                    {/* What is it */}
                    <div>
                      <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4" /> {t.whatIsIt}
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{m.whatIs}</p>
                    </div>

                    {/* How to use */}
                    <div>
                      <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4" /> {t.howToUse}
                      </h4>
                      <ol className="space-y-2">
                        {m.howTo.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="flex-shrink-0 w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Pros */}
                    <div>
                      <h4 className="text-sm font-bold text-green-400 flex items-center gap-2 mb-2">
                        <ThumbsUp className="w-4 h-4" /> {t.pros}
                      </h4>
                      <ul className="space-y-1">
                        {m.pros.map((p, i) => (
                          <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cons */}
                    <div>
                      <h4 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-2">
                        <ThumbsDown className="w-4 h-4" /> {t.cons}
                      </h4>
                      <ul className="space-y-1">
                        {m.cons.map((c, i) => (
                          <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full" /> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => setOpenMethod(null)}
                    className="mt-6 w-full py-3 bg-gradient-to-r from-[#24A1DE] to-blue-600 rounded-xl font-medium active:scale-95 transition-all"
                  >
                    {t.close}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Censor Tracker */}
          <div className="bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-purple-200">{t.censorTitle}</h4>
              <p className="text-sm text-slate-400">{t.censorText}</p>
            </div>
            <a
              href="https://censortracker.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 hover:bg-purple-500/30 transition-all text-sm font-medium flex items-center gap-2 active:scale-95 whitespace-nowrap"
            >
              {t.censorBtn} <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Proxy Servers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#24A1DE]" />
                {t.proxyServersTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">{t.proxyNotice}</p>

            {!selectedCountry ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Sort countries alphabetically (by displayed name) logic is handled in initialProxies sort above */}
                {Object.entries(countryGroups)
                  .sort(([a], [b]) => a.localeCompare(b)) // Ensure visual sort
                  .map(([country, items]) => {
                  const isLow = items[0].lowPing;
                  return (
                    <button
                      key={country}
                      onClick={() => setSelectedCountry(country)}
                      className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-5 hover:border-[#24A1DE]/30 transition-all group text-left active:scale-95"
                    >
                      <div className="text-3xl mb-2">{items[0].flag}</div>
                      <h4 className="font-bold text-sm mb-1 group-hover:text-[#24A1DE] transition-colors">{getCountryName(country)}</h4>
                      <p className="text-xs text-slate-500">{items.length} {t.servers}</p>
                      {isLow && (
                        <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] text-green-400">
                          <Zap className="w-3 h-3" /> {t.lowPing}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="mb-4 text-sm text-[#24A1DE] hover:text-blue-300 transition flex items-center gap-1 active:scale-95"
                >
                  {t.backToCountries}
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{countryGroups[selectedCountry][0].flag}</span>
                  <h4 className="text-lg font-bold">{getCountryName(selectedCountry)}</h4>
                  {countryGroups[selectedCountry][0].lowPing && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-xs text-green-400">
                      <Zap className="w-3 h-3" /> {t.lowPing}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {countryGroups[selectedCountry].map((proxy, idx) => {
                    const isChecking = checkingProxy === proxy.id;
                    return (
                      <div
                        key={proxy.id}
                        className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-xl p-4 hover:border-slate-700/50 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium text-sm">{t.server} #{idx + 1}</h5>
                            {proxy.hasAuth && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] text-amber-400">
                                <Lock className="w-2.5 h-2.5" /> {t.withPass}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                            <span className="text-xs text-green-400">{t.online}</span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-400 mb-1 font-mono">{proxy.ip}:{proxy.port}</div>
                        <div className="text-[10px] text-slate-600 mb-3">
                          {lang === 'ru' ? 'Проверка' : 'Check'}: {isChecking ? (lang === 'ru' ? 'проверка...' : 'checking...') : timeAgo(proxy.lastChecked)}
                        </div>

                        <div className="flex gap-2">
                          <a
                            href={getProxyLink(proxy)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 bg-gradient-to-r from-[#24A1DE] to-blue-600 rounded-lg text-xs font-medium text-center hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> {t.connect}
                          </a>
                          <button
                            onClick={() => copyToClipboard(getProxyLink(proxy))}
                            className="px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-xs hover:bg-slate-700/60 transition-all active:scale-95 flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" /> {t.copyLink}
                          </button>
                          <button
                            onClick={() => checkProxy(proxy.id)}
                            disabled={isChecking}
                            className="px-2 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg hover:bg-slate-700/60 transition-all active:scale-95 disabled:opacity-50"
                            title={t.checkSpeed}
                          >
                            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
                          </button>
                          <button
                            onClick={() => showToast(t.reportThanks)}
                            className="px-2 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg hover:bg-red-500/10 hover:border-red-500/20 transition-all active:scale-95"
                            title={t.report}
                          >
                            <AlertTriangle className="w-3 h-3 text-slate-500 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* DNS Settings */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#24A1DE]" />
              {t.dnsSettingsTitle}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {dnsServers.map((dns) => (
                <div key={dns.name} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-xl p-4 text-center">
                  <div className={`w-10 h-10 mx-auto mb-2 bg-gradient-to-br ${dns.color} rounded-xl flex items-center justify-center text-white font-bold text-xs`}>
                    DNS
                  </div>
                  <h4 className="font-bold text-sm mb-1">{dns.name}</h4>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs text-slate-400 font-mono">{dns.ip}</span>
                    <button onClick={() => copyToClipboard(dns.ip, dns.ip)} className="text-slate-500 hover:text-white transition active:scale-90">
                      {copiedDns === dns.ip ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xs text-slate-500 font-mono">{dns.secondary}</span>
                    <button onClick={() => copyToClipboard(dns.secondary, dns.secondary)} className="text-slate-500 hover:text-white transition active:scale-90">
                      {copiedDns === dns.secondary ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DNS Leak Note */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <p className="text-xs text-slate-400">
                {t.dnsLeakNote}{' '}
                <a href="https://dnsleaktest.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">dnsleaktest.com</a>
              </p>
            </div>

            {/* DNS Tabs */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden">
              <div className="flex border-b border-slate-800/50">
                {(['android', 'ios', 'windows'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDnsTab(tab)}
                    className={`flex-1 py-3 text-sm font-medium transition-all ${
                      dnsTab === tab
                        ? 'text-[#24A1DE] bg-[#24A1DE]/5 border-b-2 border-[#24A1DE]'
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    {tab === 'ios' ? 'iOS / macOS' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="p-5">
                {dnsTab === 'android' && (
                  <div>
                    <h4 className="font-bold text-sm mb-3">{t.androidDnsTitle}</h4>
                    <ol className="space-y-2 text-sm text-slate-300">
                      {[t.androidStep1, t.androidStep2, t.androidStep3, t.androidStep4, t.androidStep5].map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 bg-[#24A1DE]/20 text-[#24A1DE] rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                          {s}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {dnsTab === 'ios' && (
                  <div>
                    <h4 className="font-bold text-sm mb-3">{t.iosTitle}</h4>
                    <ol className="space-y-2 text-sm text-slate-300">
                      {[t.iosStep1, t.iosStep2, t.iosStep3, t.iosStep4, t.iosStep5].map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 bg-[#24A1DE]/20 text-[#24A1DE] rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                          {s}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {dnsTab === 'windows' && (
                  <div>
                    <h4 className="font-bold text-sm mb-3">{t.windowsTitle}</h4>
                    <ol className="space-y-2 text-sm text-slate-300">
                      {[t.windowsStep1, t.windowsStep2, t.windowsStep3, t.windowsStep4, t.windowsStep5].map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 bg-[#24A1DE]/20 text-[#24A1DE] rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                          {s}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#24A1DE]" />
              {t.faqTitle}
            </h3>
            <div className="space-y-3">
              {faqItems.map((faq, i) => (
                <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-slate-800/20 transition active:scale-[0.99]"
                  >
                    <span className="font-medium text-sm">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-60' : 'max-h-0'}`}>
                    <p className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 mt-12 backdrop-blur-xl bg-slate-900/30">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#24A1DE] to-blue-600 rounded-lg flex items-center justify-center">
                  <Send className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">FreeTG</span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="https://t.me/freetelegraminRussia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#24A1DE]/10 border border-[#24A1DE]/20 rounded-lg text-sm text-[#24A1DE] hover:bg-[#24A1DE]/20 transition-all flex items-center gap-2 active:scale-95"
                >
                  <Send className="w-4 h-4" /> {t.footerChannel}
                </a>
                <a
                  href="https://t.me/donateproxyintg_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-lg text-sm text-pink-400 hover:bg-pink-500/20 transition-all flex items-center gap-2 active:scale-95"
                >
                  <Heart className="w-4 h-4" /> {t.footerDonate}
                </a>
                <a
                  href="https://t.me/helpfreetg_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-400 hover:bg-green-500/20 transition-all flex items-center gap-2 active:scale-95"
                >
                  <Headphones className="w-4 h-4" /> {t.footerSupport}
                </a>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-600 mb-1">{t.footerDisclaimer}</p>
              <p className="text-xs text-slate-700">© 2026 FreeTG. {t.footerRights}</p>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.9); }
          50% { transform: translateX(-50%) translateY(5px) scale(1.02); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes stars-move-slow {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        @keyframes stars-move-medium {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        @keyframes stars-move-fast {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        .animate-bounce-in { animation: bounce-in 0.4s ease-out forwards; }
        .animate-stars-move-slow { animation: stars-move-slow 120s linear infinite; }
        .animate-stars-move-medium { animation: stars-move-medium 80s linear infinite; }
        .animate-stars-move-fast { animation: stars-move-fast 40s linear infinite; }

        body {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%2324A1DE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>'), auto;
        }
        a, button, [role="button"] {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
