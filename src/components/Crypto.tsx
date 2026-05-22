import { useState } from 'react';
import './Stocks.css';
import './Crypto.css';
import type { GameState } from '../types';
import { buyCrypto, sellCrypto } from '../game/engine';

interface CryptoProps {
  state: GameState;
  setState: (s: GameState) => void;
}

function formatMoney(n: number) {
  if (Math.abs(n) >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
  if (Math.abs(n) >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
  return '$' + n.toLocaleString();
}

function formatCrypto(n: number) {
  if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (n >= 1) return n.toFixed(3);
  return n.toFixed(6);
}

export default function Crypto({ state, setState }: CryptoProps) {
  const [buyAmounts, setBuyAmounts] = useState<Record<string, string>>({});
  const [sellCoins, setSellCoins] = useState<Record<string, string>>({});

  const handleBuy = (symbol: string) => {
    const amt = parseFloat(buyAmounts[symbol] || '0');
    if (isNaN(amt) || amt <= 0) return;
    const s = buyCrypto(state, symbol, amt);
    setState(s);
    setBuyAmounts(prev => ({ ...prev, [symbol]: '' }));
  };

  const handleSell = (symbol: string) => {
    const coins = parseFloat(sellCoins[symbol] || '0');
    if (isNaN(coins) || coins <= 0) return;
    const s = sellCrypto(state, symbol, coins);
    setState(s);
    setSellCoins(prev => ({ ...prev, [symbol]: '' }));
  };

  const portfolioValue = state.cryptoPortfolio.reduce((a, cp) => {
    const c = state.cryptos.find(cr => cr.symbol === cp.symbol);
    return a + (c ? c.price * cp.coins : 0);
  }, 0);
  const portfolioCost = state.cryptoPortfolio.reduce((a, cp) => a + cp.avgPrice * cp.coins, 0);
  const portfolioPL = portfolioValue - portfolioCost;
  const portfolioPLPct = portfolioCost > 0 ? (portfolioPL / portfolioCost) * 100 : 0;

  return (
    <div className="stocks-view crypto-view">
      <div className="stocks-header">
        <h2 className="gradient-text" style={{ fontSize: 22, fontWeight: 800 }}>₿ Криптовалюта</h2>
        <div className="portfolio-summary">
          <div className="ps-item">
            <div className="ps-label">Стоимость портфеля</div>
            <div className="ps-value" style={{ color: 'var(--accent-amber)' }}>{formatMoney(portfolioValue)}</div>
          </div>
          <div className="ps-item">
            <div className="ps-label">Прибыль</div>
            <div className="ps-value" style={{ color: portfolioPL >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {portfolioPL >= 0 ? '+' : ''}{portfolioPLPct.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className="stocks-grid">
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Монета</th>
                  <th style={{ textAlign: 'right' }}>Цена</th>
                  <th>Купить</th>
                  <th>Продать</th>
                </tr>
              </thead>
              <tbody>
                {state.cryptos.map(crypto => {
                  const pos = state.cryptoPortfolio.find(cp => cp.symbol === crypto.symbol);
                  return (
                    <tr key={crypto.symbol}>
                      <td>
                        <div className="stock-name-cell">
                          <span className="stock-name">{crypto.name}</span>
                          <span className="stock-symbol">{crypto.symbol}</span>
                        </div>
                      </td>
                      <td className="stock-price">{formatMoney(crypto.price)}</td>
                      <td>
                        <div className="stock-actions-cell">
                          <input
                            type="number"
                            placeholder="$"
                            value={buyAmounts[crypto.symbol] || ''}
                            onChange={e => setBuyAmounts(prev => ({ ...prev, [crypto.symbol]: e.target.value }))}
                          />
                          <button className="btn-success btn-sm" onClick={() => handleBuy(crypto.symbol)}>Купить</button>
                        </div>
                      </td>
                      <td>
                        {pos && pos.coins > 0 ? (
                          <div className="stock-actions-cell">
                            <input
                              type="number"
                              placeholder="кол-во"
                              value={sellCoins[crypto.symbol] || ''}
                              onChange={e => setSellCoins(prev => ({ ...prev, [crypto.symbol]: e.target.value }))}
                            />
                            <button className="btn-danger btn-sm" onClick={() => handleSell(crypto.symbol)}>Продать</button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <span className="section-title">Ваш портфель</span>
          {state.cryptoPortfolio.length === 0 ? (
            <div className="stock-empty">
              <div className="empty-icon">₿</div>
              <p>Нет крипты</p>
              <p style={{ fontSize: 12, marginTop: 4, color: 'var(--text-muted)' }}>Купите свою первую монету!</p>
            </div>
          ) : (
            <div className="portfolio-list">
              {state.cryptoPortfolio.map(pos => {
                const crypto = state.cryptos.find(c => c.symbol === pos.symbol);
                if (!crypto) return null;
                const value = crypto.price * pos.coins;
                const cost = pos.avgPrice * pos.coins;
                const pl = value - cost;
                const plPct = cost > 0 ? (pl / cost) * 100 : 0;
                return (
                  <div key={pos.symbol} className="portfolio-item">
                    <div className="left">
                      <span className="p-symbol">{pos.symbol}</span>
                      <span className="p-details">{formatCrypto(pos.coins)} coins @ ${pos.avgPrice.toFixed(2)} avg</span>
                    </div>
                    <div className="right">
                      <div className="p-value">{formatMoney(value)}</div>
                      <div className={`p-pl ${pl >= 0 ? 'text-green' : 'text-red'}`}>
                        {pl >= 0 ? '+' : ''}{plPct.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(10, 17, 33, 0.5)', borderRadius: 8, border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
              ⚠️ Криптовалюта очень волатильна! Цены могут резко меняться каждый день.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
