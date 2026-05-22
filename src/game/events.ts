import type { GameState } from '../types';

const GOOD_EVENTS = [
  { msg: 'Вы нашли $500 на улице!', cash: 500 },
  { msg: 'Дядя прислал подарок — $1000!', cash: 1000 },
  { msg: 'Вы выиграли $2000 в лотерею!', cash: 2000 },
  { msg: 'Кэшбэк: $300 зачислено на счёт!', cash: 300 },
  { msg: 'Продали старые вещи за $800!', cash: 800 },
  { msg: 'Премия за хорошую работу: $1500!', cash: 1500 },
  { msg: 'Выиграли в покер с друзьями: $700!', cash: 700 },
  { msg: 'Нашли забытую подарочную карту: $200!', cash: 200 },
  { msg: 'Инвестиция окупилась: $2500!', cash: 2500 },
  { msg: 'Получили страховую выплату: $1200!', cash: 1200 },
  { msg: 'Сосед попросил присмотреть за домом: $400!', cash: 400 },
  { msg: 'Продали ненужный хлам: $350!', cash: 350 },
  { msg: 'Выиграли в конкурсе: $600!', cash: 600 },
  { msg: 'Пришёл налоговый вычет: $1800!', cash: 1800 },
  { msg: 'Подруга вернула долг: $900!', cash: 900 },
];

const BAD_EVENTS = [
  { msg: 'Срочный ремонт авто: −$1000', cash: -1000 },
  { msg: 'Медицинский счёт: −$2000', cash: -2000 },
  { msg: 'Штраф за парковку: −$150', cash: -150 },
  { msg: 'Украли телефон: −$500', cash: -500 },
  { msg: 'Сломался холодильник: −$600', cash: -600 },
  { msg: 'Прорвало трубу: −$1500', cash: -1500 },
  { msg: 'Ограбили квартиру: −$3000', cash: -3000 },
  { msg: 'Сгорел ноутбук: −$1200', cash: -1200 },
  { msg: 'Штраф за превышение: −$300', cash: -300 },
  { msg: 'ДТП (мелкое): −$2000', cash: -2000 },
  { msg: 'Пришёл налог на имущество: −$2500', cash: -2500 },
  { msg: 'Потеряли кошелёк: −$400', cash: -400 },
  { msg: 'Сломался кондиционер: −$800', cash: -800 },
  { msg: 'Судебные издержки: −$1800', cash: -1800 },
  { msg: 'Угнали велосипед: −$700', cash: -700 },
];

const MARKET_EVENTS = [
  { msg: '💹 Бум на рынке! Все акции растут!', type: 'good', mult: 1.1 },
  { msg: '📉 Обвал рынка! Акции падают!', type: 'bad', mult: 0.85 },
  { msg: '🏗️ Строительный бум! Недвижимость дорожает!', type: 'good', mult: 1.08 },
  { msg: '💼 Корпоративный скандал! Технологии падают!', type: 'bad', mult: 0.88, sector: 'Технологии' },
  { msg: '⚡ Энергетический кризис! Энергетика взлетает!', type: 'good', mult: 1.15, sector: 'Энергетика' },
  { msg: '🏦 Центробанк снижает ставки! Рынки растут!', type: 'good', mult: 1.05 },
  { msg: '📊 Страх рецессии! Рынок падает!', type: 'bad', mult: 0.92 },
  { msg: '🛒 Рост потребления! Потребительский сектор растёт!', type: 'good', mult: 1.12, sector: 'Потребление' },
  { msg: '💊 Прорыв в медицине! Здравоохранение взлетает!', type: 'good', mult: 1.1, sector: 'Здравоохранение' },
  { msg: '🤖 ИИ-революция! Технологии взлетают!', type: 'good', mult: 1.15, sector: 'Технологии' },
  { msg: '🌍 Геополитический кризис! Все рынки падают!', type: 'bad', mult: 0.88 },
  { msg: '🛢️ Нефтяной шок! Энергетика взлетает!', type: 'good', mult: 1.2, sector: 'Энергетика' },
  { msg: '📱 Запуск нового iPhone! Потребление растёт!', type: 'good', mult: 1.08, sector: 'Потребление' },
  { msg: '🏥 Эпидемия! Здравоохранение падает!', type: 'bad', mult: 0.9, sector: 'Здравоохранение' },
  { msg: '💸 Крах криптобиржи! Криптовалюты падают!', type: 'bad', mult: 0.75, isCrypto: true },
  { msg: '🚀 Крипто-бум! Все монеты растут!', type: 'good', mult: 1.15, isCrypto: true },
  { msg: '🔧 Промышленный подъём! Промышленность растёт!', type: 'good', mult: 1.1, sector: 'Промышленность' },
  { msg: '🎬 Блокбастер вышел! Развлечения растут!', type: 'good', mult: 1.12, sector: 'Развлечения' },
];

export function checkRandomEvent(state: GameState): GameState {
  const roll = Math.random();
  if (roll < 0.08) {
    const event = GOOD_EVENTS[Math.floor(Math.random() * GOOD_EVENTS.length)];
    state.cash += event.cash;
    state.totalEarned += event.cash;
    state.eventLog.push(`День ${state.day}: ${event.msg}`);
    return { ...state, showEvent: true, eventMessage: event.msg, eventType: 'good' };
  }
  if (roll < 0.16) {
    const event = BAD_EVENTS[Math.floor(Math.random() * BAD_EVENTS.length)];
    state.cash = Math.max(0, state.cash + event.cash);
    state.eventLog.push(`День ${state.day}: ${event.msg}`);
    return { ...state, showEvent: true, eventMessage: event.msg, eventType: 'bad' };
  }
  if (roll < 0.22) {
    const event = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];

    if (event.isCrypto) {
      state.cryptos.forEach(c => {
        c.price = Math.max(0.001, Math.round(c.price * event.mult * 100) / 100);
      });
    } else {
      state.stocks.forEach(s => {
        if (!event.sector || s.sector === event.sector) {
          s.price = Math.round(s.price * event.mult * 100) / 100;
        }
      });
      if (event.type === 'good') {
        state.propertiesMarket.forEach(p => { p.price = Math.round(p.price * 1.03); p.rent = Math.round(p.rent * 1.05); });
      }
    }

    state.eventLog.push(`День ${state.day}: ${event.msg}`);
    return { ...state, showEvent: true, eventMessage: event.msg, eventType: event.type as 'good' | 'bad' };
  }
  return state;
}

export function applyMonthlyExpenses(state: GameState): GameState {
  const food = 100 + Math.floor(Math.random() * 200);
  const utilities = 80 + Math.floor(Math.random() * 150);
  const transport = state.vehicles.length > 0 ? 50 + Math.floor(Math.random() * 100) : 30;
  const total = food + utilities + transport;
  state.cash = Math.max(0, state.cash - total);
  state.totalSpent += total;
  state.eventLog.push(`День ${state.day}: Ежемесячные расходы: еда $${food}, ЖКХ $${utilities}, транспорт $${transport} = $${total}`);
  state.lastExpenseDay = state.day;
  return state;
}

export function checkCareerEvent(state: GameState): GameState {
  const roll = Math.random();
  if (state.job === null) return state;

  if (roll < 0.03) {
    const bonus = Math.round(JOB_LIST[state.jobIndex].salary * (1 + Math.random() * 3));
    state.cash += bonus;
    state.totalEarned += bonus;
    state.performance = Math.min(100, state.performance + 5);
    state.eventLog.push(`День ${state.day}: 🎉 Премия на работе: +$${bonus}!`);
    return { ...state, showEvent: true, eventMessage: `Вам выписали премию $${bonus}!`, eventType: 'good' };
  }
  if (roll < 0.05) {
    const penalty = Math.round(JOB_LIST[state.jobIndex].salary * 0.5);
    state.cash = Math.max(0, state.cash - penalty);
    state.performance = Math.max(0, state.performance - 10);
    state.eventLog.push(`День ${state.day}: ⚠️ Штраф на работе: −$${penalty}`);
    return { ...state, showEvent: true, eventMessage: `Вы оштрафованы на работе на $${penalty}!`, eventType: 'bad' };
  }
  if (roll < 0.055 && state.jobIndex > 0) {
    state.cash = Math.max(0, state.cash - 0);
    state.jobIndex -= 1;
    state.job = JOB_LIST[state.jobIndex].name;
    state.daysAtJob = 0;
    state.performance = 30;
    state.eventLog.push(`День ${state.day}: 🔻 Вас понизили до ${state.job}!`);
    return { ...state, showEvent: true, eventMessage: `Вас понизили до ${state.job} из-за низкой производительности.`, eventType: 'bad' };
  }
  return state;
}

export function checkAchievements(state: GameState): string[] {
  const newAchievements: string[] = [];
  const nw = getNetWorth(state);

  if (nw >= 10000 && !state.achievements.includes('first_10k')) newAchievements.push('first_10k');
  if (nw >= 100000 && !state.achievements.includes('first_100k')) newAchievements.push('first_100k');
  if (nw >= 1000000 && !state.achievements.includes('millionaire')) newAchievements.push('millionaire');
  if (nw >= 10000000 && !state.achievements.includes('ten_million')) newAchievements.push('ten_million');
  if (state.jobIndex >= 12 && !state.achievements.includes('career_milestone')) newAchievements.push('career_milestone');
  if (state.properties.length >= 3 && !state.achievements.includes('landlord')) newAchievements.push('landlord');
  if (state.businesses.length >= 2 && !state.achievements.includes('entrepreneur')) newAchievements.push('entrepreneur');
  if (state.vehicles.length >= 3 && !state.achievements.includes('collector')) newAchievements.push('collector');
  if (state.savings >= 50000 && !state.achievements.includes('saver')) newAchievements.push('saver');
  if (state.day >= 365 && !state.achievements.includes('veteran')) newAchievements.push('veteran');
  if (state.cryptoPortfolio.length > 0 && !state.achievements.includes('crypto_investor')) newAchievements.push('crypto_investor');
  if (state.businesses.length >= 5 && !state.achievements.includes('tycoon')) newAchievements.push('tycoon');
  if (state.jobIndex >= 17 && !state.achievements.includes('top_exec')) newAchievements.push('top_exec');
  if (state.sideHustle !== null && state.sideHustle.daysActive >= 30 && !state.achievements.includes('hustler')) newAchievements.push('hustler');
  if (state.properties.length >= 10 && !state.achievements.includes('real_estate_mogul')) newAchievements.push('real_estate_mogul');
  if (state.vehicles.length >= 5 && !state.achievements.includes('garage_king')) newAchievements.push('garage_king');
  if (state.stockPortfolio.reduce((a, sp) => { const st = state.stocks.find(s => s.symbol === sp.symbol); return a + (st ? st.price * sp.shares : 0); }, 0) >= 100000 && !state.achievements.includes('stock_whale')) newAchievements.push('stock_whale');

  return newAchievements;
}

import { JOB_LIST } from '../types';

export function getNetWorth(state: GameState): number {
  let total = state.cash + state.checking + state.savings;

  state.cds.forEach(cd => total += cd.amount);
  state.stockPortfolio.forEach(sp => {
    const stock = state.stocks.find(s => s.symbol === sp.symbol);
    if (stock) total += stock.price * sp.shares;
  });
  state.cryptoPortfolio.forEach(cp => {
    const crypto = state.cryptos.find(c => c.symbol === cp.symbol);
    if (crypto) total += crypto.price * cp.coins;
  });
  state.properties.forEach(p => total += p.currentValue);
  state.vehicles.forEach(v => total += v.currentValue);
  state.businesses.forEach(b => total += b.value);
  state.loans.forEach(l => total -= l.remaining);

  return Math.round(total);
}

const ACHIEVEMENT_NAMES: Record<string, string> = {
  first_10k: '💰 Первые $10K — Достигните $10,000 капитала',
  first_100k: '💵 Первые $100K — Достигните $100,000 капитала',
  millionaire: '🤑 Миллионер — Достигните $1,000,000 капитала',
  ten_million: '👑 Десять Миллионов — Достигните $10,000,000! Вы победили!',
  career_milestone: '💼 Карьерист — Получите топ-должность',
  landlord: '🏠 Арендодатель — Владейте 3+ объектами',
  entrepreneur: '🚀 Предприниматель — Владейте 2+ бизнесами',
  collector: '🚗 Коллекционер — Владейте 3+ авто',
  saver: '🏦 Копилка — Накопите $50,000 в банке',
  veteran: '🎖️ Ветеран — Сыграйте 365 дней',
  crypto_investor: '₿ Криптоинвестор — Купите криптовалюту',
  tycoon: '🏢 Магнат — Владейте 5+ бизнесами',
  top_exec: '👔 Топ-менеджер — Достигните топ-5 должности',
  hustler: '💪 Халтурщик — 30 дней подработки',
  real_estate_mogul: '🏘️ Девелопер — Владейте 10+ объектами',
  garage_king: '🏎️ Автокороль — Владейте 5+ авто',
  stock_whale: '🐋 Кит — Акций на $100K+',
};

export function getAchievementName(id: string): string {
  return ACHIEVEMENT_NAMES[id] || id;
}
