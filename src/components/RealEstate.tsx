import './RealEstate.css';
import type { GameState } from '../types';
import { buyProperty, sellProperty } from '../game/engine';

interface RealEstateProps {
  state: GameState;
  setState: (s: GameState) => void;
}

function formatMoney(n: number) {
  if (Math.abs(n) >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
  if (Math.abs(n) >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
  return '$' + n.toLocaleString();
}

export default function RealEstate({ state, setState }: RealEstateProps) {
  const totalEquity = state.properties.reduce((a, p) => {
    const loan = state.loans.find(l => l.id === p.loanId);
    return a + p.currentValue - (loan?.remaining || 0);
  }, 0);

  const totalRent = state.properties.reduce((a, p) => a + p.rent, 0);

  return (
    <div className="re-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="gradient-text" style={{ fontSize: 22, fontWeight: 800 }}>🏠 Недвижимость</h2>
        <div style={{ display: 'flex', gap: 16 }}>
          <div className="card" style={{ padding: '10px 16px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.8 }}>Собственный капитал</div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }} className={totalEquity >= 0 ? 'text-green' : 'text-red'}>
              {formatMoney(totalEquity)}
            </div>
          </div>
          <div className="card" style={{ padding: '10px 16px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.8 }}>Аренда/день</div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }} className="text-green">
              +{formatMoney(totalRent)}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <span className="section-title">Ваша недвижимость</span>
        {state.properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)', fontSize: 14 }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.5 }}>🏘️</div>
              <p>Нет недвижимости</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Купите первый объект с первоначальным взносом 20%</p>
          </div>
        ) : (
          <div className="owned-re-list">
            {state.properties.map(p => {
              const loan = state.loans.find(l => l.id === p.loanId);
              const change = ((p.currentValue - p.price) / p.price) * 100;
              return (
                <div key={p.id} className="owned-re-item">
                  <div className="re-left">
                    <span className="re-owned-name">{p.name}</span>
                    <span className="re-owned-details">{p.type} &middot; ✦ {formatMoney(p.rent)}/день аренда</span>
                    {loan && <span className="re-owned-details">🏦 {formatMoney(loan.remaining)} ипотека &middot; {formatMoney(loan.monthlyPayment)}/мес</span>}
                  </div>
                  <div className="re-right">
                    <div className="re-owned-value">{formatMoney(p.currentValue)}</div>
                    <div className={`re-owned-change ${change >= 0 ? 'text-green' : 'text-red'}`}>
                      {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                    </div>
                    <button className="btn-danger btn-sm" onClick={() => setState(sellProperty(state, p.id))}>Продать</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card">
        <span className="section-title">Предложения на рынке (взнос 20%)</span>
        <div className="re-grid">
          {state.propertiesMarket.map(p => {
            const owned = state.properties.find(op => op.name === p.name);
            return (
              <div key={p.id} className="re-card" style={{ opacity: owned ? 0.5 : 1 }}>
                <div className="re-top">
                  <span className="re-type">{p.type}</span>
                </div>
                <div className="re-name">{p.name}</div>
                <div className="re-price">{formatMoney(p.price)}</div>
                <div className="re-details">
                  <span className="re-rent-badge">✦ +{formatMoney(p.rent)}/day</span>
                  <br />
                  Down: {formatMoney(Math.round(p.price * 0.20))}
                  </div>
                {!owned ? (
                  <button className="btn-primary" onClick={() => setState(buyProperty(state, p.id))}>Купить</button>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 600, padding: '5px 0' }}>✓ В собственности</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
