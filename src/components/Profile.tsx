import './Profile.css';
import type { GameState } from '../types';
import { JOB_LIST, EDUCATION_NAMES, EDUCATION_COST, SIDE_HUSTLES } from '../types';
import { investInEducation, startSideHustle, stopSideHustle } from '../game/engine';

interface ProfileProps {
  state: GameState;
  setState: (s: GameState) => void;
}

function formatMoney(n: number) {
  if (Math.abs(n) >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
  if (Math.abs(n) >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
  return '$' + n.toLocaleString();
}

export default function Profile({ state, setState }: ProfileProps) {
  const handleEducation = (name: string) => {
    setState(investInEducation(state, name));
  };

  const applyJob = (idx: number) => {
    if (idx <= state.jobIndex) return;
    const job = JOB_LIST[idx];
    if (job.req !== null && !state.education.includes(job.req)) return;
    const s = { ...state, job: job.name, jobIndex: idx, daysAtJob: 0, performance: 50 };
    s.eventLog.push(`Day ${s.day}: Started new job: ${job.name}`);
    setState(s);
  };

  const availableEducations = EDUCATION_NAMES.filter(
    name => !state.education.includes(name)
  );

  return (
    <div className="profile-view">
      <h2 className="gradient-text" style={{ fontSize: 22, fontWeight: 800 }}>💼 Карьера</h2>

      <div className="profile-grid">
        <div className="profile-section">
          <span className="section-title">Текущая должность</span>
          {state.job ? (
            <>
              <div className="current-job-card">
                <div className="job-left">
                  <div className="job-title">{state.job}</div>
                  <div className="job-req">
                    {JOB_LIST[state.jobIndex]?.req && `Требуется: ${JOB_LIST[state.jobIndex].req}`}
                  </div>
                </div>
                <div className="job-right">
                  <div className="job-salary">+${JOB_LIST[state.jobIndex]?.salary}/day</div>
                </div>
              </div>

              <div className="job-stats-grid">
                <div className="job-stat">
                  <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>{state.daysAtJob}</div>
                  <div className="stat-label">Дней отработано</div>
                </div>
                <div className="job-stat">
                  <div className="stat-value" style={{ color: state.performance >= 70 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>{state.performance}%</div>
                  <div className="stat-label">Продуктивность</div>
                </div>
                <div className="job-stat">
                  <div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>{formatMoney(JOB_LIST[state.jobIndex]?.salary * state.daysAtJob)}</div>
                  <div className="stat-label">Заработано всего</div>
                </div>
              </div>

              <div className="performance-bar-container">
                <div className="performance-bar-fill" style={{ width: `${state.performance}%` }} />
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                💡 Продуктивность +1 в день. <strong>70%</strong> нужно для повышения каждые 30 дней.
                Следующее повышение: <strong>{state.daysAtJob % 30 === 0 ? 'Сегодня!' : `через ${30 - (state.daysAtJob % 30)} дн.`}</strong>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 30 }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.5 }}>💼</div>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 8 }}>Нет работы!</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Выберите должность из списка ниже.</p>
            </div>
          )}
        </div>

        <div className="profile-section">
          <span className="section-title">Статистика</span>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-val text-green">{formatMoney(state.totalEarned)}</div>
              <div className="stat-lbl">Всего заработано</div>
            </div>
            <div className="stat-item">
              <div className="stat-val text-red">{formatMoney(state.totalSpent)}</div>
              <div className="stat-lbl">Всего потрачено</div>
            </div>
            <div className="stat-item">
              <div className="stat-val" style={{ color: 'var(--accent-amber)' }}>{state.day}</div>
              <div className="stat-lbl">Дней сыграно</div>
            </div>
            <div className="stat-item">
              <div className="stat-val text-blue">{formatMoney(state.highestNetWorth)}</div>
              <div className="stat-lbl">Макс. капитал</div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-section" style={{ gridColumn: 1 }}>
          <span className="section-title">Карьерная лестница</span>
          <div className="job-list">
            {JOB_LIST.map((job, idx) => {
              const canApply = job.req === null || state.education.includes(job.req);
              const isCurrent = state.jobIndex === idx;
              const isAvailable = idx > (state.jobIndex >= 0 ? state.jobIndex : -1);
              return (
                <div key={idx} className={`job-list-item ${isCurrent ? 'current-job-item' : ''}`}>
                  <div className="jli-left">
                    <span className={`jli-title ${isCurrent ? 'text-blue' : ''}`}>
                      {isCurrent ? '▸ ' : ''}{job.name}
                    </span>
                    <span className="jli-req">{job.req || 'Без требований'}</span>
                  </div>
                  <div className="jli-right">
                    <span className="jli-salary">${job.salary}/day</span>
                    {isCurrent && <span className="text-muted" style={{ fontSize: 11 }}>Текущая</span>}
                {!isCurrent && isAvailable && canApply && (
                      <button className="btn-primary btn-sm" onClick={() => applyJob(idx)}>Устроиться</button>
                )}
                {!isCurrent && !canApply && (
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>🔒</span>
                )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="profile-section" style={{ gridColumn: 2 }}>
          <span className="section-title">Подработка</span>
          {state.sideHustle ? (
            <div className="current-job-card" style={{ marginBottom: 12 }}>
              <div className="job-left">
                <div className="job-title">{state.sideHustle.name}</div>
                <div className="job-req">+${state.sideHustle.dailyPay}/день · {state.sideHustle.daysActive} дней</div>
              </div>
              <div className="job-right">
                <button className="btn-danger btn-sm" onClick={() => setState(stopSideHustle(state))}>Бросить</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4, marginBottom: 16 }}>
              {SIDE_HUSTLES.map((h, i) => (
                <div key={i} className="job-list-item">
                  <div className="jli-left">
                    <span className="jli-title">{h.name}</span>
                    <span className="jli-req">${h.pay}/день</span>
                  </div>
                  <div className="jli-right">
                    <button className="btn-primary btn-sm" onClick={() => setState(startSideHustle(state, i))}>Начать</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12 }}>
            ⚡ Подработка даёт дополнительный доход, но снижает продуктивность на −2/день.
          </div>

          <span className="section-title">Образование</span>
          <div className="education-list">
            {state.education.length > 0 ? (
              state.education.map(edu => (
                <span key={edu} className="edu-badge">✓ {edu}</span>
              ))
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                Нет образования. Инвестируйте в себя!
              </p>
            )}
          </div>

          <span className="section-title" style={{ marginTop: 16 }}>Доступные курсы</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {availableEducations.map(name => {
              const idx = EDUCATION_NAMES.indexOf(name);
              const canBuy = idx === 0 || state.education.includes(EDUCATION_NAMES[idx - 1]);
              return (
                <div key={name} className="job-list-item">
                  <div className="jli-left">
                    <span className="jli-title">{name}</span>
                    {!canBuy && (
                      <span className="jli-req">Требуется: {EDUCATION_NAMES[idx - 1]}</span>
                    )}
                  </div>
                  <div className="jli-right">
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                      {formatMoney(EDUCATION_COST)}
                    </span>
                    {canBuy && (
                      <button
                        className="btn-primary btn-sm"
                        onClick={() => handleEducation(name)}
                        disabled={state.cash < EDUCATION_COST}
                        style={{ opacity: state.cash < EDUCATION_COST ? 0.5 : 1 }}
                      >
                        {state.cash >= EDUCATION_COST ? 'Учиться' : 'Нужны деньги'}
                      </button>
                    )}
                    {!canBuy && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>🔒</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
