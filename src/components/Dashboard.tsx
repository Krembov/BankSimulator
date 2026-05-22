import './Dashboard.css';
import { getNetWorth, getAchievementName } from '../game/events';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import type { GameState } from '../types';

interface DashboardProps {
  state: GameState;
  onAdvanceDay: () => void;
  onToggleAuto: () => void;
  autoMode: boolean;
}

function formatMoney(n: number) {
  if (Math.abs(n) >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
  if (Math.abs(n) >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
  return '$' + n.toLocaleString();
}

export default function Dashboard({ state, onAdvanceDay, onToggleAuto, autoMode }: DashboardProps) {
  const nw = getNetWorth(state);
  const totalAssets = state.cash + state.checking + state.savings +
    state.cds.reduce((a, c) => a + c.amount, 0) +
    state.properties.reduce((a, p) => a + p.currentValue, 0) +
    state.vehicles.reduce((a, v) => a + v.currentValue, 0) +
    state.businesses.reduce((a, b) => a + b.value, 0) +
    state.stockPortfolio.reduce((a, sp) => {
      const stock = state.stocks.find(s => s.symbol === sp.symbol);
      return a + (stock ? stock.price * sp.shares : 0);
    }, 0);
  const totalDebt = state.loans.reduce((a, l) => a + l.remaining, 0);

  const chartData = state.marketData.map(d => ({
    ...d,
    nwFormatted: formatMoney(d.netWorth),
  }));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="stat-card">
          <div className="stat-top">
            <span className="label">Капитал</span>
            <span className="stat-icon">💰</span>
          </div>
          <div className="value gradient-text-green">{formatMoney(nw)}</div>
          <div className="sub">Цель: $10M &middot; {Math.min(100, (nw / 10000000) * 100).toFixed(1)}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-top">
            <span className="label">Наличные</span>
            <span className="stat-icon">💵</span>
          </div>
          <div className="value" style={{ color: 'var(--text-primary)' }}>{formatMoney(state.cash)}</div>
          <div className="sub">+ {formatMoney(state.checking)} на счету</div>
        </div>
        <div className="stat-card">
          <div className="stat-top">
            <span className="label">Всего активов</span>
            <span className="stat-icon">📦</span>
          </div>
          <div className="value text-blue">{formatMoney(totalAssets)}</div>
          <div className="sub">+ {formatMoney(state.savings)} в копилке</div>
        </div>
        <div className="stat-card">
          <div className="stat-top">
            <span className="label">Всего долгов</span>
            <span className="stat-icon">📉</span>
          </div>
          <div className="value text-red">{formatMoney(totalDebt)}</div>
          <div className="sub">Кредитный рейтинг: {state.creditScore}</div>
        </div>
      </div>

      <div className="day-controls">
        <button className="day-btn" onClick={onAdvanceDay}>
          ▶ Следующий день
        </button>
        <button className={`auto-btn ${autoMode ? 'active' : ''}`} onClick={onToggleAuto}>
          {autoMode ? '⏸ Стоп' : '▶ Авто'}
        </button>
        <div className="day-info">
          📅 День <strong>{state.day}</strong>
          {state.job && <span>• <span style={{ color: 'var(--accent-green)' }}>{state.job}</span></span>}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card dashboard-section">
          <span className="section-title">История капитала</span>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="nwGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.3)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(12,18,32,0.95)',
                    border: '1px solid rgba(51,65,85,0.6)',
                    borderRadius: 8,
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                  }}
                  labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                  formatter={(value: any) => [formatMoney(Number(value)), 'Капитал']}
                />
                <Area type="monotone" dataKey="netWorth" stroke="#10b981" strokeWidth={2} fill="url(#nwGradient)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card dashboard-section">
          <span className="section-title">Состав портфеля</span>
          <div className="holdings-list">
            <div className="h-item">
              <span className="h-name">💵 Наличные и банк</span>
              <span className="h-value">{formatMoney(state.cash + state.checking + state.savings)}</span>
            </div>
            <div className="h-item">
              <span className="h-name">📈 Акции</span>
              <span className="h-value" style={{ color: 'var(--accent-cyan)' }}>{formatMoney(state.stockPortfolio.reduce((a, sp) => {
                const st = state.stocks.find(s => s.symbol === sp.symbol);
                return a + (st ? st.price * sp.shares : 0);
              }, 0))}</span>
            </div>
            <div className="h-item">
              <span className="h-name">🏠 Недвижимость</span>
              <span className="h-value" style={{ color: 'var(--accent-blue)' }}>{formatMoney(state.properties.reduce((a, p) => a + p.currentValue, 0))}</span>
            </div>
            <div className="h-item">
              <span className="h-name">🚗 Авто</span>
              <span className="h-value" style={{ color: 'var(--accent-amber)' }}>{formatMoney(state.vehicles.reduce((a, v) => a + v.currentValue, 0))}</span>
            </div>
            <div className="h-item">
              <span className="h-name">🏪 Бизнес</span>
              <span className="h-value" style={{ color: 'var(--accent-purple)' }}>{formatMoney(state.businesses.reduce((a, b) => a + b.value, 0))}</span>
            </div>
            <div className="h-item h-total">
              <span className="h-name" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Всего активов</span>
              <span className="h-value text-blue">{formatMoney(totalAssets)}</span>
            </div>
            <div className="h-item">
              <span className="h-name">Долги</span>
              <span className="h-value text-red">−{formatMoney(totalDebt)}</span>
            </div>
          </div>

          <div style={{ marginTop: 16, height: 60, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ flex: 1, height: 8, background: 'rgba(51,65,85,0.3)', borderRadius: 4, display: 'flex', overflow: 'hidden' }}>
              {totalAssets > 0 && (
                <>
                  <div style={{ flex: state.cash + state.checking + state.savings, background: 'var(--text-muted)', minWidth: 2 }} />
                  <div style={{ flex: state.stockPortfolio.reduce((a, sp) => { const st = state.stocks.find(s => s.symbol === sp.symbol); return a + (st ? st.price * sp.shares : 0); }, 0), background: 'var(--accent-cyan)', minWidth: 2 }} />
                  <div style={{ flex: state.properties.reduce((a, p) => a + p.currentValue, 0), background: 'var(--accent-blue)', minWidth: 2 }} />
                  <div style={{ flex: state.vehicles.reduce((a, v) => a + v.currentValue, 0), background: 'var(--accent-amber)', minWidth: 2 }} />
                  <div style={{ flex: state.businesses.reduce((a, b) => a + b.value, 0), background: 'var(--accent-purple)', minWidth: 2 }} />
                </>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'var(--text-muted)' }}>
            <span>● Наличные</span>
            <span>● Акции</span>
            <span>● Недвиж.</span>
            <span>● Авто</span>
            <span>● Бизнес</span>
          </div>

          {state.achievements.length > 0 && (
            <>
              <span className="section-title" style={{ marginTop: 20 }}>Достижения</span>
              <div className="achievement-list">
                {state.achievements.map(a => (
                  <span key={a} className="achievement-badge">
                    {getAchievementName(a).split('—')[0].trim()}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card">
          <span className="section-title">Лог событий</span>
        <div className="event-log">
          {state.eventLog.slice(-30).reverse().map((entry, i) => (
            <div key={i} className="log-entry">
              {entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
