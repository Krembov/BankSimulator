import './Vehicles.css';
import type { GameState } from '../types';
import { buyVehicle, sellVehicle } from '../game/engine';
import { VEHICLES_LIST } from '../types';

interface VehiclesProps {
  state: GameState;
  setState: (s: GameState) => void;
}

function formatMoney(n: number) {
  if (Math.abs(n) >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
  if (Math.abs(n) >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
  return '$' + n.toLocaleString();
}

export default function Vehicles({ state, setState }: VehiclesProps) {
  return (
    <div className="vehicles-view">
      <h2 className="gradient-text" style={{ fontSize: 22, fontWeight: 800 }}>🚗 Автосалон</h2>

      <div className="card">
        <span className="section-title">Ваш гараж</span>
        {state.vehicles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)', fontSize: 14 }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.5 }}>🚘</div>
              <p>Нет автомобилей</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Купите первую машину ниже!</p>
          </div>
        ) : (
          <div className="owned-vehicles-list">
            {state.vehicles.map(v => {
              const change = ((v.currentValue - v.price) / v.price) * 100;
              return (
                <div key={v.id} className="owned-v-item">
                  <div className="v-left">
                    <span className="v-owned-name">{v.isClassic ? '🏆' : '🚗'} {v.name}</span>
                    <span className="v-owned-details">
                      {v.isClassic ? '📈 Растущий актив' : '📉 Падающий актив'}
                      {' • '}{v.isClassic ? '+' : '-'}{Math.abs(v.depreciation * 100).toFixed(1)}%/год
                    </span>
                  </div>
                  <div className="v-right">
                    <div className="v-owned-value">{formatMoney(v.currentValue)}</div>
                    <div className={`v-owned-change ${change >= 0 ? 'text-green' : 'text-red'}`}>
                      {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                    </div>
                    <button className="btn-danger btn-sm" onClick={() => setState(sellVehicle(state, v.id))}>Продать</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card">
        <span className="section-title">В наличии</span>
        <div className="vehicles-grid">
          {VEHICLES_LIST.map((v, idx) => (
            <div key={idx} className="vehicle-card">
              <div className="v-top">
                {v.isClassic && <span className="v-classic-tag">Classic</span>}
              </div>
              <div className="v-name">{v.name}</div>
              <div className="v-price">{formatMoney(v.price)}</div>
              <div className="v-details">
                {v.isClassic
                  ? `📈 Растёт в цене ${Math.abs(v.depreciation * 100).toFixed(1)}%/год`
                  : `📉 Дешевеет на ${(v.depreciation * 100).toFixed(1)}%/год`
                }
              </div>
              <button
                className="btn-primary"
                onClick={() => setState(buyVehicle(state, idx))}
                disabled={state.cash + state.checking < v.price}
                style={{ opacity: state.cash + state.checking < v.price ? 0.5 : 1 }}
              >
                {state.cash + state.checking >= v.price ? 'Купить' : 'Не хватает денег'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
