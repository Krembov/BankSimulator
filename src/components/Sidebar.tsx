import './Sidebar.css';
import { getNetWorth } from '../game/events';
import type { GameState } from '../types';

interface SidebarProps {
  state: GameState;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Панель', icon: '📊' },
  { id: 'profile', label: 'Карьера', icon: '💼' },
  { id: 'bank', label: 'Банк', icon: '🏦' },
  { id: 'stocks', label: 'Акции', icon: '📈' },
  { id: 'crypto', label: 'Крипта', icon: '₿' },
  { id: 'realestate', label: 'Недвижимость', icon: '🏠' },
  { id: 'vehicles', label: 'Авто', icon: '🚗' },
  { id: 'business', label: 'Бизнес', icon: '🏪' },
];

export default function Sidebar({ state, activeTab, onTabChange }: SidebarProps) {
  const nw = getNetWorth(state);
  const pctToGoal = Math.min(100, (nw / 10000000) * 100);
  const formatMoney = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">🏦</div>
          <span className="logo-text">BankSim</span>
        </div>
        <div className="subtitle">Строитель империи</div>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="day-display">
          📅 День <span className="day-num">{state.day}</span>
        </div>
        <div className="nw-preview">
          <div className="label">Капитал</div>
          <div className="value">{formatMoney(nw)}</div>
          <div className="progress-to-goal">
            <div className="progress-fill" style={{ width: `${pctToGoal}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
