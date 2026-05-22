export interface GameState {
  day: number;
  cash: number;
  job: string | null;
  jobIndex: number;
  daysAtJob: number;
  performance: number;
  education: string[];
  checking: number;
  savings: number;
  cds: CDInvestment[];
  loans: Loan[];
  creditScore: number;
  stockPortfolio: StockPosition[];
  cryptoPortfolio: CryptoPosition[];
  properties: Property[];
  vehicles: Vehicle[];
  businesses: Business[];
  totalEarned: number;
  totalSpent: number;
  highestNetWorth: number;
  lastExpenseDay: number;
  sideHustle: SideHustle | null;
  eventLog: string[];
  achievements: string[];
  marketData: MarketDay[];
  stocks: Stock[];
  cryptos: Crypto[];
  propertiesMarket: PropertyMarket[];
  showEvent: boolean;
  eventMessage: string;
  eventType: 'good' | 'bad' | 'info';
}

export interface CDInvestment {
  amount: number;
  rate: number;
  termDays: number;
  daysLeft: number;
}

export interface Loan {
  id: number;
  type: 'personal' | 'mortgage' | 'business';
  amount: number;
  remaining: number;
  rate: number;
  monthlyPayment: number;
  missedPayments: number;
}

export interface StockPosition {
  symbol: string;
  shares: number;
  avgPrice: number;
}

export interface CryptoPosition {
  symbol: string;
  coins: number;
  avgPrice: number;
}

export interface Crypto {
  symbol: string;
  name: string;
  price: number;
  volatility: number;
}

export interface SideHustle {
  name: string;
  dailyPay: number;
  daysActive: number;
}

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  volatility: number;
  dividendYield: number;
}

export interface PropertyMarket {
  id: number;
  name: string;
  type: string;
  price: number;
  rent: number;
  appreciation: number;
}

export interface Property {
  id: number;
  name: string;
  type: string;
  price: number;
  currentValue: number;
  rent: number;
  loanId: number | null;
}

export interface Vehicle {
  id: number;
  name: string;
  price: number;
  currentValue: number;
  depreciation: number;
  isClassic: boolean;
}

export interface Business {
  id: number;
  name: string;
  type: string;
  investment: number;
  dailyProfit: number;
  value: number;
  level: number;
  employees: number;
  reputation: number;
}

export interface MarketDay {
  day: number;
  netWorth: number;
  cash: number;
}

export const JOB_LIST = [
  { name: 'Курьер', salary: 50, req: null },
  { name: 'Кассир', salary: 60, req: null },
  { name: 'Официант', salary: 70, req: null },
  { name: 'Строитель', salary: 85, req: null },
  { name: 'Водитель', salary: 95, req: 'Водительские права' },
  { name: 'Электрик', salary: 115, req: 'Проф. сертификат' },
  { name: 'Медсестра', salary: 140, req: 'Высшее образование' },
  { name: 'Разработчик ПО', salary: 180, req: 'Высшее образование' },
  { name: 'Инженер', salary: 200, req: 'Высшее образование' },
  { name: 'Бухгалтер', salary: 170, req: 'Высшее образование' },
  { name: 'Менеджер', salary: 230, req: 'Магистратура' },
  { name: 'Юрист', salary: 280, req: 'Юридическое образование' },
  { name: 'Врач', salary: 320, req: 'Медицинское образование' },
  { name: 'Директор', salary: 380, req: 'Магистратура' },
  { name: 'Вице-президент', salary: 500, req: 'Магистратура' },
  { name: 'CEO', salary: 700, req: 'Большой опыт' },
  { name: 'Инвест-банкир', salary: 900, req: 'MBA' },
  { name: 'Хедж-фонд менеджер', salary: 1200, req: 'MBA' },
  { name: 'Технический директор', salary: 1500, req: 'PhD' },
  { name: 'Медиа-магнат', salary: 2000, req: 'Большой опыт' },
];

export const STOCK_LIST: Stock[] = [
  { symbol: 'ITEC', name: 'ИнноТех', sector: 'Технологии', price: 150, volatility: 0.04, dividendYield: 0.005 },
  { symbol: 'CLDS', name: 'ОблакоСинк', sector: 'Технологии', price: 85, volatility: 0.05, dividendYield: 0.002 },
  { symbol: 'DVT', name: 'ДатаВолт', sector: 'Технологии', price: 120, volatility: 0.045, dividendYield: 0.003 },
  { symbol: 'GRNP', name: 'ЗелёнаяЭнергия', sector: 'Энергетика', price: 65, volatility: 0.035, dividendYield: 0.015 },
  { symbol: 'PTMX', name: 'ПетроМакс', sector: 'Энергетика', price: 95, volatility: 0.04, dividendYield: 0.025 },
  { symbol: 'BLC', name: 'БлюКапитал', sector: 'Финансы', price: 110, volatility: 0.03, dividendYield: 0.02 },
  { symbol: 'FNF', name: 'ФинПоток', sector: 'Финансы', price: 75, volatility: 0.05, dividendYield: 0.008 },
  { symbol: 'VITA', name: 'ВитаЗдоровье', sector: 'Здравоохранение', price: 140, volatility: 0.035, dividendYield: 0.01 },
  { symbol: 'MDCR', name: 'МедЯдро', sector: 'Здравоохранение', price: 90, volatility: 0.04, dividendYield: 0.012 },
  { symbol: 'LXBR', name: 'ЛюксБренд', sector: 'Потребление', price: 200, volatility: 0.04, dividendYield: 0.008 },
  { symbol: 'FRMK', name: 'СвежийРынок', sector: 'Потребление', price: 45, volatility: 0.025, dividendYield: 0.018 },
  { symbol: 'STLW', name: 'СтальПром', sector: 'Промышленность', price: 70, volatility: 0.035, dividendYield: 0.02 },
  { symbol: 'BLDC', name: 'СтройКорп', sector: 'Промышленность', price: 55, volatility: 0.04, dividendYield: 0.015 },
  { symbol: 'VISM', name: 'ВижнМедиа', sector: 'Развлечения', price: 130, volatility: 0.05, dividendYield: 0.004 },
  { symbol: 'GMFR', name: 'ИгроКузня', sector: 'Развлечения', price: 100, volatility: 0.06, dividendYield: 0.002 },
  { symbol: 'AERO', name: 'АэроФлотТех', sector: 'Промышленность', price: 80, volatility: 0.05, dividendYield: 0.01 },
  { symbol: 'BIOG', name: 'БиоТехГен', sector: 'Здравоохранение', price: 160, volatility: 0.06, dividendYield: 0.003 },
  { symbol: 'CYBR', name: 'КиберЩит', sector: 'Технологии', price: 95, volatility: 0.055, dividendYield: 0.001 },
  { symbol: 'GOLDX', name: 'ЗолотойЗапас', sector: 'Финансы', price: 180, volatility: 0.025, dividendYield: 0.03 },
  { symbol: 'EDUC', name: 'ЭдюТек', sector: 'Технологии', price: 40, volatility: 0.06, dividendYield: 0.001 },
  { symbol: 'SHIP', name: 'МорскиеЛинии', sector: 'Промышленность', price: 60, volatility: 0.045, dividendYield: 0.02 },
  { symbol: 'EATM', name: 'ЭкоПродукты', sector: 'Потребление', price: 55, volatility: 0.03, dividendYield: 0.015 },
  { symbol: 'SPACE', name: 'КосмоИндустрия', sector: 'Технологии', price: 250, volatility: 0.08, dividendYield: 0.001 },
  { symbol: 'DEFN', name: 'ОборонПром', sector: 'Промышленность', price: 130, volatility: 0.04, dividendYield: 0.018 },
];

export const CRYPTO_LIST: Crypto[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 42000, volatility: 0.06 },
  { symbol: 'ETH', name: 'Ethereum', price: 2800, volatility: 0.07 },
  { symbol: 'SOL', name: 'Solana', price: 140, volatility: 0.09 },
  { symbol: 'ADA', name: 'Cardano', price: 0.65, volatility: 0.08 },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.12, volatility: 0.12 },
  { symbol: 'DOT', name: 'Polkadot', price: 8.50, volatility: 0.08 },
  { symbol: 'LINK', name: 'Chainlink', price: 16.00, volatility: 0.07 },
  { symbol: 'MATIC', name: 'Polygon', price: 0.85, volatility: 0.09 },
];

export const PROPERTIES_MARKET: PropertyMarket[] = [
  { id: 1, name: 'Студия', type: 'Квартира', price: 50000, rent: 30, appreciation: 0.015 },
  { id: 2, name: 'Однокомнатная', type: 'Квартира', price: 80000, rent: 45, appreciation: 0.018 },
  { id: 3, name: 'Двухкомнатная', type: 'Квартира', price: 120000, rent: 65, appreciation: 0.02 },
  { id: 4, name: 'Дом в пригороде', type: 'Дом', price: 200000, rent: 90, appreciation: 0.025 },
  { id: 5, name: 'Таунхаус', type: 'Дом', price: 160000, rent: 75, appreciation: 0.022 },
  { id: 6, name: 'Люкс апартаменты', type: 'Квартира', price: 350000, rent: 150, appreciation: 0.028 },
  { id: 7, name: 'Коммерческое помещение', type: 'Коммерческая', price: 300000, rent: 200, appreciation: 0.02 },
  { id: 8, name: 'Дом у моря', type: 'Дом', price: 450000, rent: 200, appreciation: 0.03 },
  { id: 9, name: 'Многоквартирный дом', type: 'Коммерческая', price: 800000, rent: 400, appreciation: 0.025 },
  { id: 10, name: 'Вилла', type: 'Дом', price: 500000, rent: 220, appreciation: 0.028 },
  { id: 11, name: 'Горный домик', type: 'Дом', price: 300000, rent: 130, appreciation: 0.02 },
  { id: 12, name: 'Особняк', type: 'Дом', price: 1200000, rent: 500, appreciation: 0.025 },
  { id: 13, name: 'Складское помещение', type: 'Коммерческая', price: 250000, rent: 180, appreciation: 0.018 },
  { id: 14, name: 'Офисное здание', type: 'Коммерческая', price: 600000, rent: 350, appreciation: 0.022 },
  { id: 15, name: 'Пентхаус', type: 'Квартира', price: 700000, rent: 300, appreciation: 0.03 },
  { id: 16, name: 'Замок', type: 'Дом', price: 3000000, rent: 1000, appreciation: 0.02 },
  { id: 17, name: 'Торговый центр', type: 'Коммерческая', price: 2000000, rent: 1200, appreciation: 0.02 },
  { id: 18, name: 'Коттеджный посёлок', type: 'Коммерческая', price: 1500000, rent: 800, appreciation: 0.025 },
];

export const VEHICLES_LIST = [
  { name: 'Подержанный велосипед', price: 200, depreciation: 0.1, isClassic: false },
  { name: 'Скутер', price: 1000, depreciation: 0.15, isClassic: false },
  { name: 'Подержанный Honda Civic', price: 5000, depreciation: 0.12, isClassic: false },
  { name: 'Toyota Corolla', price: 15000, depreciation: 0.1, isClassic: false },
  { name: 'Honda Accord', price: 22000, depreciation: 0.09, isClassic: false },
  { name: 'Ford Mustang', price: 35000, depreciation: 0.08, isClassic: false },
  { name: 'BMW 3 Series', price: 45000, depreciation: 0.1, isClassic: false },
  { name: 'Audi A4', price: 50000, depreciation: 0.09, isClassic: false },
  { name: 'Tesla Model 3', price: 55000, depreciation: 0.07, isClassic: false },
  { name: 'Mercedes C-Class', price: 60000, depreciation: 0.09, isClassic: false },
  { name: 'BMW 5 Series', price: 75000, depreciation: 0.08, isClassic: false },
  { name: 'Porsche 911', price: 150000, depreciation: 0.04, isClassic: false },
  { name: 'Tesla Model S', price: 90000, depreciation: 0.06, isClassic: false },
  { name: 'Lamborghini Huracan', price: 350000, depreciation: 0.05, isClassic: false },
  { name: 'Ferrari F8', price: 400000, depreciation: 0.04, isClassic: false },
  { name: 'Rolls Royce Ghost', price: 500000, depreciation: 0.05, isClassic: false },
  { name: 'Классический 1969 Mustang', price: 80000, depreciation: -0.02, isClassic: true },
  { name: 'Классический 1957 Chevy', price: 120000, depreciation: -0.015, isClassic: true },
  { name: 'Классический Ferrari 250', price: 300000, depreciation: -0.01, isClassic: true },
  { name: 'Lamborghini Urus', price: 250000, depreciation: 0.06, isClassic: false },
  { name: 'McLaren 720S', price: 350000, depreciation: 0.05, isClassic: false },
  { name: 'Bugatti Chiron', price: 2500000, depreciation: 0.03, isClassic: false },
  { name: 'Классический 1967 Shelby GT', price: 200000, depreciation: -0.02, isClassic: true },
  { name: 'Электромотоцикл', price: 8000, depreciation: 0.08, isClassic: false },
  { name: 'Lada Niva (восстановленная)', price: 3000, depreciation: 0.14, isClassic: false },
  { name: 'Maybach S-Class', price: 200000, depreciation: 0.06, isClassic: false },
  { name: 'Bentley Continental', price: 350000, depreciation: 0.05, isClassic: false },
  { name: 'Aston Martin DB12', price: 300000, depreciation: 0.05, isClassic: false },
];

export const BUSINESSES_LIST = [
  { name: 'Фудтрак', type: 'Еда', investment: 10000, dailyProfit: 20, maxProfit: 60 },
  { name: 'Автомойка', type: 'Услуги', investment: 20000, dailyProfit: 40, maxProfit: 100 },
  { name: 'Кофейня', type: 'Еда', investment: 30000, dailyProfit: 60, maxProfit: 150 },
  { name: 'Пекарня', type: 'Еда', investment: 25000, dailyProfit: 50, maxProfit: 130 },
  { name: 'Интернет-магазин', type: 'Розница', investment: 15000, dailyProfit: 35, maxProfit: 200 },
  { name: 'Тренажёрный зал', type: 'Фитнес', investment: 50000, dailyProfit: 100, maxProfit: 300 },
  { name: 'Ресторан', type: 'Еда', investment: 80000, dailyProfit: 150, maxProfit: 400 },
  { name: 'IT-агентство', type: 'Технологии', investment: 40000, dailyProfit: 120, maxProfit: 500 },
  { name: 'Маркетинговое агентство', type: 'Услуги', investment: 30000, dailyProfit: 90, maxProfit: 350 },
  { name: 'Логистическая компания', type: 'Транспорт', investment: 100000, dailyProfit: 300, maxProfit: 800 },
  { name: 'Отель', type: 'Гостиницы', investment: 500000, dailyProfit: 800, maxProfit: 2000 },
  { name: 'Салон красоты', type: 'Услуги', investment: 15000, dailyProfit: 40, maxProfit: 120 },
  { name: 'Автосервис', type: 'Услуги', investment: 35000, dailyProfit: 80, maxProfit: 250 },
  { name: 'Ферма', type: 'Сельское хозяйство', investment: 40000, dailyProfit: 70, maxProfit: 180 },
  { name: 'Крипто-майнинг ферма', type: 'Технологии', investment: 60000, dailyProfit: 180, maxProfit: 500 },
  { name: 'Студия разработки игр', type: 'Технологии', investment: 50000, dailyProfit: 140, maxProfit: 400 },
  { name: 'Клиника', type: 'Медицина', investment: 200000, dailyProfit: 500, maxProfit: 1500 },
  { name: 'Авиакомпания', type: 'Транспорт', investment: 1000000, dailyProfit: 1500, maxProfit: 4000 },
];

export const SIDE_HUSTLES = [
  { name: 'Выгул собак', pay: 15 },
  { name: 'Репетиторство', pay: 25 },
  { name: 'Фриланс', pay: 40 },
  { name: 'Консультации', pay: 60 },
  { name: 'Частные уроки', pay: 35 },
  { name: 'Такси (по выходным)', pay: 30 },
];

const EDUCATION_COST = 5000;
const EDUCATION_NAMES = [
  'Водительские права',
  'Проф. сертификат',
  'Высшее образование',
  'Магистратура',
  'Юридическое образование',
  'Медицинское образование',
  'MBA',
  'PhD',
  'Большой опыт',
];

export { EDUCATION_COST, EDUCATION_NAMES };
