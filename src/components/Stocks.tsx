import { useState } from 'react';
import './Stocks.css';
import type { GameState } from '../types';
import { buyStock, sellStock } from '../game/engine';

interface StocksProps {
  state: GameState;
  setState: (s: GameState) => void;
}

function formatMoney(n: number) {
  if (Math.abs(n) >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
  if (Math.abs(n) >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
  return '$' + n.toLocaleString();
}

export default function Stocks({ state, setState }: StocksProps) {
  const [buyAmounts, setBuyAmounts] = useState<Record<string, string>>({});
  const [sellShares, setSellShares] = useState<Record<string, string>>({});

  const handleBuy = (symbol: string) => {
    const amt = parseInt(buyAmounts[symbol] || '0');
    if (isNaN(amt) || amt <= 0) return;
    const s = buyStock(state, symbol, amt);
    setState(s);
    setBuyAmounts(prev => ({ ...prev, [symbol]: '' }));
  };

  const handleSell = (symbol: string) => {
    const shares = parseInt(sellShares[symbol] || '0');
    if (isNaN(shares) || shares <= 0) return;
    const s = sellStock(state, symbol, shares);
    setState(s);
    setSellShares(prev => ({ ...prev, [symbol]: '' }));
  };

  const portfolioValue = state.stockPortfolio.reduce((a, sp) => {
    const st = state.stocks.find(s => s.symbol === sp.symbol);
    return a + (st ? st.price * sp.shares : 0);
  }, 0);

  const portfolioCost = state.stockPortfolio.reduce((a, sp) => a + sp.avgPrice * sp.shares, 0);
  const portfolioPL = portfolioValue - portfolioCost;
  const portfolioPLPct = portfolioCost > 0 ? (portfolioPL / portfolioCost) * 100 : 0;

  return (
    <div className="stocks-view">
      <div className="stocks-header">
        <h2 className="gradient-text" style={{ fontSize: 22, fontWeight: 800 }}>📈 Фондовый рынок</h2>
        <div className="portfolio-summary">
          <div className="ps-item">
            <div className="ps-label">Стоимость портфеля</div>
            <div className="ps-value" style={{ color: 'var(--accent-cyan)' }}>{formatMoney(portfolioValue)}</div>
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
                  <th>Компания</th>
                  <th>Сектор</th>
                  <th style={{ textAlign: 'right' }}>Цена</th>
                  <th>Купить</th>
                  <th>Продать</th>
                </tr>
              </thead>
              <tbody>
                {state.stocks.map(stock => {
                  const pos = state.stockPortfolio.find(sp => sp.symbol === stock.symbol);
                  return (
                    <tr key={stock.symbol}>
                      <td>
                        <div className="stock-name-cell">
                          <span className="stock-name">{stock.name}</span>
                          <span className="stock-symbol">{stock.symbol}</span>
                        </div>
                      </td>
                      <td><span className="stock-sector-tag">{stock.sector}</span></td>
                      <td className="stock-price">{formatMoney(stock.price)}</td>
                      <td>
                        <div className="stock-actions-cell">
                          <input
                            type="number"
                            placeholder="$"
                            value={buyAmounts[stock.symbol] || ''}
                            onChange={e => setBuyAmounts(prev => ({ ...prev, [stock.symbol]: e.target.value }))}
                          />
                          <button className="btn-success btn-sm" onClick={() => handleBuy(stock.symbol)}>Купить</button>
                        </div>
                      </td>
                      <td>
                        {pos && pos.shares > 0 ? (
                          <div className="stock-actions-cell">
                            <input
                              type="number"
                              placeholder="#"
                              value={sellShares[stock.symbol] || ''}
                              onChange={e => setSellShares(prev => ({ ...prev, [stock.symbol]: e.target.value }))}
                            />
                            <button className="btn-danger btn-sm" onClick={() => handleSell(stock.symbol)}>Продать</button>
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
          {state.stockPortfolio.length === 0 ? (
            <div className="stock-empty">
              <div className="empty-icon">📊</div>
              <p>Нет акций</p>
              <p style={{ fontSize: 12, marginTop: 4, color: 'var(--text-muted)' }}>Начните инвестировать на рынке!</p>
            </div>
          ) : (
            <div className="portfolio-list">
              {state.stockPortfolio.map(pos => {
                const stock = state.stocks.find(s => s.symbol === pos.symbol);
                if (!stock) return null;
                const value = stock.price * pos.shares;
                const cost = pos.avgPrice * pos.shares;
                const pl = value - cost;
                const plPct = cost > 0 ? (pl / cost) * 100 : 0;
                return (
                  <div key={pos.symbol} className="portfolio-item">
                    <div className="left">
                      <span className="p-symbol">{pos.symbol}</span>
                      <span className="p-details">{pos.shares} shares @ ${pos.avgPrice.toFixed(2)} avg</span>
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
              ℹ️ Дивиденды выплачиваются каждые 30 дней по квалифицированным акциям
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
