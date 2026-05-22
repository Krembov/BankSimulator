import type { GameState } from '../types';
import { JOB_LIST, VEHICLES_LIST, BUSINESSES_LIST, EDUCATION_COST, EDUCATION_NAMES, SIDE_HUSTLES } from '../types';
import { checkRandomEvent, checkAchievements, getNetWorth, getAchievementName, applyMonthlyExpenses, checkCareerEvent } from './events';

export function advanceDay(state: GameState): GameState {
  const s = JSON.parse(JSON.stringify(state)) as GameState;
  s.day += 1;

  if (s.job !== null && s.jobIndex >= 0) {
    const job = JOB_LIST[s.jobIndex];
    const salary = job.salary;
    s.cash += salary;
    s.totalEarned += salary;
    s.daysAtJob += 1;
    s.performance = Math.min(100, s.performance + 1);

    if (s.daysAtJob % 30 === 0 && s.jobIndex < JOB_LIST.length - 1) {
      const nextJob = JOB_LIST[s.jobIndex + 1];
      const canPromote = nextJob.req === null || s.education.includes(nextJob.req);
      if (s.performance >= 70 && canPromote) {
        s.jobIndex += 1;
        s.job = JOB_LIST[s.jobIndex].name;
        s.daysAtJob = 0;
        s.performance = 50;
        s.eventLog.push(`День ${s.day}: 🎉 Повышение до ${JOB_LIST[s.jobIndex].name}!`);
      }
    }
  }

  if (s.sideHustle !== null) {
    const hustlePay = s.sideHustle.dailyPay + Math.floor(Math.random() * 10);
    s.cash += hustlePay;
    s.totalEarned += hustlePay;
    s.sideHustle.daysActive += 1;
    s.performance = Math.max(0, s.performance - 2);
  }

  s.cash += s.savings * (0.025 / 365);
  s.savings = Math.round(s.savings * 100) / 100;

  s.cds.forEach(cd => { cd.daysLeft -= 1; });
  const maturedCds = s.cds.filter(cd => cd.daysLeft <= 0);
  s.cds = s.cds.filter(cd => cd.daysLeft > 0);
  maturedCds.forEach(cd => {
    const interest = Math.round(cd.amount * cd.rate * (cd.termDays / 365));
    s.cash += cd.amount + interest;
    s.totalEarned += interest;
    s.eventLog.push(`День ${s.day}: Депозит созрел! +$${cd.amount + interest} (${interest} проценты)`);
  });

  s.stocks.forEach(stock => {
    const change = (Math.random() - 0.5) * 2 * stock.volatility;
    const trend = (Math.random() - 0.48) * 0.01;
    stock.price = Math.max(1, Math.round(stock.price * (1 + change + trend) * 100) / 100);

    if (s.day % 30 === 0 && stock.dividendYield > 0) {
      const pos = s.stockPortfolio.find(sp => sp.symbol === stock.symbol);
      if (pos) {
        const dividend = Math.round(pos.shares * stock.price * stock.dividendYield / 12 * 100) / 100;
        s.cash += dividend;
        s.totalEarned += dividend;
        s.eventLog.push(`День ${s.day}: Дивиденды $${dividend} от ${stock.symbol}`);
      }
    }
  });

  s.cryptos.forEach(crypto => {
    const change = (Math.random() - 0.5) * 2 * crypto.volatility;
    const trend = (Math.random() - 0.47) * 0.02;
    crypto.price = Math.max(0.001, Math.round(crypto.price * (1 + change + trend) * 100) / 100);
  });

  s.properties.forEach(p => {
    const marketProp = s.propertiesMarket.find(mp => mp.name === p.name);
    if (marketProp) {
      const change = (Math.random() - 0.5) * 0.02 + marketProp.appreciation / 365;
      p.currentValue = Math.round(p.currentValue * (1 + change));

      const rent = Math.round(marketProp.rent * (1 + (Math.random() - 0.5) * 0.1));
      s.cash += rent;
      s.totalEarned += rent;
    }
  });

  s.vehicles.forEach(v => {
    if (v.isClassic) {
      const change = (Math.random() - 0.4) * 0.01;
      v.currentValue = Math.round(v.currentValue * (1 + change));
    } else {
      v.currentValue = Math.round(v.currentValue * (1 - v.depreciation / 365));
    }
  });

  s.businesses.forEach(b => {
    const variance = 0.8 + Math.random() * 0.4;
    const effMultiplier = 1 + b.employees * 0.1 + b.reputation * 0.005;
    const profit = Math.round(b.dailyProfit * variance * effMultiplier);
    s.cash += profit;
    s.totalEarned += profit;
  });

  if (s.day % 30 === 0 && s.lastExpenseDay < s.day) {
    applyMonthlyExpenses(s);
  }

  const careerResult = checkCareerEvent(s);
  if (careerResult.showEvent) {
    s.showEvent = true;
    s.eventMessage = careerResult.eventMessage;
    s.eventType = careerResult.eventType;
  }

  const nw = getNetWorth(s);
  if (nw > s.highestNetWorth) s.highestNetWorth = nw;

  s.marketData.push({ day: s.day, netWorth: nw, cash: s.cash });
  if (s.marketData.length > 500) s.marketData.shift();

  const newAchievements = checkAchievements(s);
  newAchievements.forEach(a => {
    if (!s.achievements.includes(a)) {
      s.achievements.push(a);
      s.eventLog.push(`🏆 Достижение разблокировано: ${getAchievementName(a)}`);
    }
  });

  const eventResult = checkRandomEvent(s);
  s.showEvent = eventResult.showEvent || s.showEvent;
  s.eventMessage = eventResult.eventMessage || s.eventMessage;
  s.eventType = (eventResult.eventType !== 'info' ? eventResult.eventType : s.eventType) as 'good' | 'bad' | 'info';
  s.stocks = eventResult.stocks || s.stocks;
  s.propertiesMarket = eventResult.propertiesMarket || s.propertiesMarket;
  s.cryptos = eventResult.cryptos || s.cryptos;

  return s;
}

export function buyStock(state: GameState, symbol: string, amount: number): GameState {
  const s = { ...state };
  const stock = s.stocks.find(st => st.symbol === symbol);
  if (!stock || amount <= 0) return state;

  const available = s.cash + s.checking;
  const shares = Math.floor(Math.min(amount, available) / stock.price);
  if (shares <= 0) return state;

  const cost = shares * stock.price;
  if (cost > s.cash) {
    const diff = cost - s.cash;
    s.cash = 0;
    s.checking -= diff;
  } else {
    s.cash -= cost;
  }

  const existing = s.stockPortfolio.find(sp => sp.symbol === symbol);
  if (existing) {
    existing.avgPrice = (existing.avgPrice * existing.shares + cost) / (existing.shares + shares);
    existing.shares += shares;
  } else {
    s.stockPortfolio.push({ symbol, shares, avgPrice: stock.price });
  }

  s.totalSpent += cost;
  return s;
}

export function sellStock(state: GameState, symbol: string, sharesToSell: number): GameState {
  const s = { ...state };
  const pos = s.stockPortfolio.find(sp => sp.symbol === symbol);
  if (!pos || sharesToSell <= 0 || sharesToSell > pos.shares) return state;

  const stock = s.stocks.find(st => st.symbol === symbol);
  if (!stock) return state;

  const revenue = Math.round(sharesToSell * stock.price * 100) / 100;
  pos.shares -= sharesToSell;
  s.cash += revenue;
  s.totalEarned += revenue;

  if (pos.shares <= 0) {
    s.stockPortfolio = s.stockPortfolio.filter(sp => sp.symbol !== symbol);
  }
  return s;
}

export function buyCrypto(state: GameState, symbol: string, amount: number): GameState {
  const s = { ...state };
  const crypto = s.cryptos.find(c => c.symbol === symbol);
  if (!crypto || amount <= 0) return state;

  const available = s.cash + s.checking;
  const coins = Math.floor((Math.min(amount, available) / crypto.price) * 1000) / 1000;
  if (coins <= 0) return state;

  const cost = Math.round(coins * crypto.price * 100) / 100;
  if (cost > s.cash) {
    const diff = cost - s.cash;
    s.cash = 0;
    s.checking -= diff;
  } else {
    s.cash -= cost;
  }

  const existing = s.cryptoPortfolio.find(cp => cp.symbol === symbol);
  if (existing) {
    existing.avgPrice = (existing.avgPrice * existing.coins + cost) / (existing.coins + coins);
    existing.coins += coins;
  } else {
    s.cryptoPortfolio.push({ symbol, coins, avgPrice: crypto.price });
  }

  s.totalSpent += cost;
  return s;
}

export function sellCrypto(state: GameState, symbol: string, coinsToSell: number): GameState {
  const s = { ...state };
  const pos = s.cryptoPortfolio.find(cp => cp.symbol === symbol);
  if (!pos || coinsToSell <= 0 || coinsToSell > pos.coins) return state;

  const crypto = s.cryptos.find(c => c.symbol === symbol);
  if (!crypto) return state;

  const revenue = Math.round(coinsToSell * crypto.price * 100) / 100;
  pos.coins = Math.round((pos.coins - coinsToSell) * 1000) / 1000;
  s.cash += revenue;
  s.totalEarned += revenue;

  if (pos.coins <= 0) {
    s.cryptoPortfolio = s.cryptoPortfolio.filter(cp => cp.symbol !== symbol);
  }
  return s;
}

export function startSideHustle(state: GameState, hustleIndex: number): GameState {
  const s = { ...state };
  const hustle = SIDE_HUSTLES[hustleIndex];
  if (!hustle) return state;
  s.sideHustle = { name: hustle.name, dailyPay: hustle.pay, daysActive: 0 };
  s.eventLog.push(`День ${s.day}: Начата подработка: ${hustle.name} ($${hustle.pay}/день)`);
  return s;
}

export function stopSideHustle(state: GameState): GameState {
  const s = { ...state };
  if (s.sideHustle) {
    s.eventLog.push(`День ${s.day}: Закончена подработка: ${s.sideHustle.name} (${s.sideHustle.daysActive} дней)`);
    s.sideHustle = null;
  }
  return s;
}

export function getLoan(state: GameState, type: 'personal' | 'mortgage' | 'business', amount: number): GameState {
  const s = { ...state };
  const maxLoan = type === 'personal' ? 10000 : type === 'mortgage' ? 500000 : 100000;
  const rate = type === 'personal' ? 0.12 : type === 'mortgage' ? 0.06 : 0.08;
  const adjRate = rate + (0.05 * (650 - s.creditScore) / 350);

  const loanAmount = Math.min(amount, maxLoan);
  if (loanAmount <= 0) return state;

  const id = s.loans.length > 0 ? Math.max(...s.loans.map(l => l.id)) + 1 : 1;
  const monthlyRatio = adjRate / 12;
  const payments = type === 'mortgage' ? 360 : 120;
  const monthlyPayment = Math.round(loanAmount * monthlyRatio * Math.pow(1 + monthlyRatio, payments) / (Math.pow(1 + monthlyRatio, payments) - 1));

  s.loans.push({
    id,
    type,
    amount: loanAmount,
    remaining: loanAmount,
    rate: adjRate,
    monthlyPayment: isNaN(monthlyPayment) ? Math.round(loanAmount / payments) : monthlyPayment,
    missedPayments: 0,
  });
  s.cash += loanAmount;
  s.totalEarned += loanAmount;
  s.eventLog.push(`День ${s.day}: Взят ${type === 'personal' ? 'личный' : type === 'mortgage' ? 'ипотечный' : 'бизнес'} кредит $${loanAmount} под ${(adjRate * 100).toFixed(1)}%`);

  return s;
}

export function payLoan(state: GameState, loanId: number): GameState {
  const s = { ...state };
  const loan = s.loans.find(l => l.id === loanId);
  if (!loan) return state;

  if (s.cash >= loan.remaining) {
    s.cash -= loan.remaining;
    s.totalSpent += loan.remaining;
    s.loans = s.loans.filter(l => l.id !== loanId);
    s.eventLog.push(`День ${s.day}: Погашен ${loan.type === 'personal' ? 'личный' : loan.type === 'mortgage' ? 'ипотечный' : 'бизнес'} кредит ($${loan.remaining})`);
  } else if (s.cash >= loan.monthlyPayment) {
    s.cash -= loan.monthlyPayment;
    loan.remaining -= loan.monthlyPayment;
    loan.missedPayments = 0;
    s.creditScore = Math.min(850, s.creditScore + 2);
  }

  return s;
}

export function buyProperty(state: GameState, propertyId: number): GameState {
  const s = { ...state };
  const marketProp = s.propertiesMarket.find(p => p.id === propertyId);
  if (!marketProp) return state;

  const totalCash = s.cash + s.checking;
  const downPayment = Math.round(marketProp.price * 0.2);
  const mortgageAmt = marketProp.price - downPayment;

  if (totalCash < downPayment) return state;

  if (s.cash >= downPayment) {
    s.cash -= downPayment;
  } else {
    const diff = downPayment - s.cash;
    s.cash = 0;
    s.checking -= diff;
  }

  const loanId = s.loans.length > 0 ? Math.max(...s.loans.map(l => l.id)) + 1 : 1;
  const rate = 0.05 + (0.05 * (650 - s.creditScore) / 350);
  const monthlyRatio = rate / 12;
  const monthlyPayment = Math.round(mortgageAmt * monthlyRatio * Math.pow(1 + monthlyRatio, 360) / (Math.pow(1 + monthlyRatio, 360) - 1));

  s.loans.push({
    id: loanId,
    type: 'mortgage',
    amount: mortgageAmt,
    remaining: mortgageAmt,
    rate,
    monthlyPayment: isNaN(monthlyPayment) ? Math.round(mortgageAmt / 360) : monthlyPayment,
    missedPayments: 0,
  });

  const newId = s.properties.length > 0 ? Math.max(...s.properties.map(p => p.id)) + 1 : 1;
  s.properties.push({
    id: newId,
    name: marketProp.name,
    type: marketProp.type,
    price: marketProp.price,
    currentValue: marketProp.price,
    rent: marketProp.rent,
    loanId,
  });

  s.totalSpent += downPayment;
  s.eventLog.push(`День ${s.day}: Куплен ${marketProp.name} за $${marketProp.price}`);
  return s;
}

export function sellProperty(state: GameState, propertyId: number): GameState {
  const s = { ...state };
  const prop = s.properties.find(p => p.id === propertyId);
  if (!prop) return state;

  s.cash += prop.currentValue;
  s.totalEarned += prop.currentValue;

  if (prop.loanId !== null) {
    const loan = s.loans.find(l => l.id === prop.loanId);
    if (loan) {
      s.cash -= loan.remaining;
      s.loans = s.loans.filter(l => l.id !== prop.loanId);
    }
  }

  s.properties = s.properties.filter(p => p.id !== propertyId);
  s.eventLog.push(`День ${s.day}: Продан ${prop.name} за $${prop.currentValue}`);
  return s;
}

export function buyVehicle(state: GameState, vehicleIndex: number): GameState {
  const s = { ...state };
  const v = VEHICLES_LIST[vehicleIndex];
  if (!v) return state;

  const totalCash = s.cash + s.checking;
  if (totalCash < v.price) return state;

  if (s.cash >= v.price) {
    s.cash -= v.price;
  } else {
    const diff = v.price - s.cash;
    s.cash = 0;
    s.checking -= diff;
  }

  const newId = s.vehicles.length > 0 ? Math.max(...s.vehicles.map(x => x.id)) + 1 : 1;
  s.vehicles.push({
    id: newId,
    name: v.name,
    price: v.price,
    currentValue: v.price,
    depreciation: v.depreciation,
    isClassic: v.isClassic,
  });

  s.totalSpent += v.price;
  s.eventLog.push(`День ${s.day}: Куплен ${v.name} за $${v.price}`);
  return s;
}

export function sellVehicle(state: GameState, vehicleId: number): GameState {
  const s = { ...state };
  const v = s.vehicles.find(veh => veh.id === vehicleId);
  if (!v) return state;

  s.cash += v.currentValue;
  s.totalEarned += v.currentValue;
  s.vehicles = s.vehicles.filter(veh => veh.id !== vehicleId);
  s.eventLog.push(`День ${s.day}: Продан ${v.name} за $${v.currentValue}`);
  return s;
}

export function startBusiness(state: GameState, businessIndex: number): GameState {
  const s = { ...state };
  const bDef = BUSINESSES_LIST[businessIndex];
  if (!bDef) return state;

  if (s.cash + s.checking < bDef.investment) return state;

  if (s.cash >= bDef.investment) {
    s.cash -= bDef.investment;
  } else {
    const diff = bDef.investment - s.cash;
    s.cash = 0;
    s.checking -= diff;
  }

  const newId = s.businesses.length > 0 ? Math.max(...s.businesses.map(b => b.id)) + 1 : 1;
  s.businesses.push({
    id: newId,
    name: bDef.name,
    type: bDef.type,
    investment: bDef.investment,
    dailyProfit: bDef.dailyProfit,
    value: bDef.investment * 1.5,
    level: 1,
    employees: 0,
    reputation: 50,
  });

  s.totalSpent += bDef.investment;
  s.eventLog.push(`День ${s.day}: Открыт бизнес: ${bDef.name}!`);
  return s;
}

export function upgradeBusiness(state: GameState, businessId: number): GameState {
  const s = { ...state };
  const bus = s.businesses.find(b => b.id === businessId);
  if (!bus) return state;

  const cost = bus.level * 10000;
  if (s.cash < cost) return state;

  s.cash -= cost;
  bus.level += 1;
  bus.dailyProfit = Math.round(bus.dailyProfit * 1.3);
  bus.value = Math.round(bus.value * 1.3);
  s.totalSpent += cost;
  s.eventLog.push(`День ${s.day}: Улучшен бизнес: ${bus.name} до уровня ${bus.level}`);

  return s;
}

export function hireEmployee(state: GameState, businessId: number): GameState {
  const s = { ...state };
  const bus = s.businesses.find(b => b.id === businessId);
  if (!bus) return state;

  const cost = 5000;
  if (s.cash < cost) return state;

  s.cash -= cost;
  bus.employees += 1;
  s.totalSpent += cost;
  bus.reputation = Math.min(100, bus.reputation + 3);
  return s;
}

export function investInEducation(state: GameState, educationName: string): GameState {
  const s = { ...state };
  if (s.cash < EDUCATION_COST) return state;
  if (s.education.includes(educationName)) return state;

  const idx = EDUCATION_NAMES.indexOf(educationName);
  if (idx > 0) {
    const prereq = EDUCATION_NAMES[idx - 1];
    if (!s.education.includes(prereq)) return state;
  }

  s.cash -= EDUCATION_COST;
  s.totalSpent += EDUCATION_COST;
  s.education.push(educationName);
  s.eventLog.push(`День ${s.day}: Получено образование: ${educationName}`);
  return s;
}
