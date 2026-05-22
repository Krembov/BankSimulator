import type { GameState } from '../types';
import { STOCK_LIST, PROPERTIES_MARKET, CRYPTO_LIST } from '../types';

const SAVE_KEY = 'bank-simulator-save';

export function createInitialState(): GameState {
  return {
    day: 1,
    cash: 2000,
    job: null,
    jobIndex: -1,
    daysAtJob: 0,
    performance: 50,
    education: [],
    checking: 0,
    savings: 0,
    cds: [],
    loans: [],
    creditScore: 650,
    stockPortfolio: [],
    cryptoPortfolio: [],
    properties: [],
    vehicles: [],
    businesses: [],
    totalEarned: 0,
    totalSpent: 0,
    highestNetWorth: 2000,
    lastExpenseDay: 0,
    sideHustle: null,
    eventLog: ['Добро пожаловать в Bank Simulator! Ваш путь к $10M начинается сегодня.'],
    achievements: [],
    marketData: [{ day: 1, netWorth: 2000, cash: 2000 }],
    stocks: STOCK_LIST.map(s => ({ ...s })),
    cryptos: CRYPTO_LIST.map(c => ({ ...c })),
    propertiesMarket: PROPERTIES_MARKET.map(p => ({ ...p })),
    showEvent: false,
    eventMessage: '',
    eventType: 'info',
  };
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    console.error('Failed to save game');
  }
}

export function loadGame(): GameState | null {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (data) {
      const parsed = JSON.parse(data) as GameState;
      return parsed;
    }
  } catch {
    console.error('Failed to load game');
  }
  return null;
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
