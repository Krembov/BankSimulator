import { useState } from 'react';
import './Bank.css';
import type { GameState } from '../types';
import { getLoan, payLoan } from '../game/engine';

interface BankProps {
  state: GameState;
  setState: (s: GameState) => void;
}

function formatMoney(n: number) {
  if (Math.abs(n) >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
  if (Math.abs(n) >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
  return '$' + n.toLocaleString();
}

export default function Bank({ state, setState }: BankProps) {
  const [depositAmt, setDepositAmt] = useState('');
  const [withdrawAmt, setWithdrawAmt] = useState('');
  const [savingsDeposit, setSavingsDeposit] = useState('');
  const [savingsWithdraw, setSavingsWithdraw] = useState('');
  const [cdAmount, setCdAmount] = useState('');
  const [cdTerm, setCdTerm] = useState<'6m' | '1y' | '3y'>('1y');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanType, setLoanType] = useState<'personal' | 'business'>('personal');

  const deposit = () => {
    const amt = parseInt(depositAmt);
    if (isNaN(amt) || amt <= 0 || amt > state.cash) return;
    const s = { ...state, cash: state.cash - amt, checking: state.checking + amt };
    setState(s);
    setDepositAmt('');
  };

  const withdraw = () => {
    const amt = parseInt(withdrawAmt);
    if (isNaN(amt) || amt <= 0 || amt > state.checking) return;
    const s = { ...state, cash: state.cash + amt, checking: state.checking - amt };
    setState(s);
    setWithdrawAmt('');
  };

  const depositSavings = () => {
    const amt = parseInt(savingsDeposit);
    if (isNaN(amt) || amt <= 0 || amt > state.cash) return;
    const s = { ...state, cash: state.cash - amt, savings: state.savings + amt };
    setState(s);
    setSavingsDeposit('');
  };

  const withdrawSavings = () => {
    const amt = parseInt(savingsWithdraw);
    if (isNaN(amt) || amt <= 0 || amt > state.savings) return;
    const s = { ...state, cash: state.cash + amt, savings: state.savings - amt };
    setState(s);
    setSavingsWithdraw('');
  };

  const openCD = () => {
    const amt = parseInt(cdAmount);
    if (isNaN(amt) || amt <= 0 || amt > state.cash) return;
    const termDays = cdTerm === '6m' ? 180 : cdTerm === '1y' ? 365 : 1095;
    const rate = cdTerm === '6m' ? 0.04 : cdTerm === '1y' ? 0.05 : 0.065;
    const s = { ...state, cash: state.cash - amt };
    s.cds.push({ amount: amt, rate, termDays, daysLeft: termDays });
    setState(s);
    setCdAmount('');
  };

  const takeLoan = () => {
    const amt = parseInt(loanAmount);
    if (isNaN(amt) || amt <= 0) return;
    const s = getLoan(state, loanType, amt);
    setState(s);
    setLoanAmount('');
  };

  const repayLoan = (loanId: number) => {
    const s = payLoan(state, loanId);
    setState(s);
  };

  const cdRates: Record<string, number> = { '6m': 4.0, '1y': 5.0, '3y': 6.5 };

  return (
    <div className="bank-view">
      <h2 className="gradient-text" style={{ fontSize: 22, fontWeight: 800 }}>🏦 Банк</h2>

      <div className="bank-grid">
        <div className="bank-account-card">
          <div className="card-header">
            <h3>Расчётный счёт</h3>
            <span className="card-icon">💳</span>
          </div>
          <div className="balance" style={{ color: 'var(--text-primary)' }}>{formatMoney(state.checking)}</div>
          <div className="rate">0% годовых &middot; Мгновенный доступ</div>
          <div className="bank-actions">
            <div className="input-row">
              <input type="number" placeholder="Amount" value={depositAmt} onChange={e => setDepositAmt(e.target.value)} />
              <button className="btn-primary btn-sm" onClick={deposit}>Внести</button>
            </div>
            <div className="input-row">
              <input type="number" placeholder="Amount" value={withdrawAmt} onChange={e => setWithdrawAmt(e.target.value)} />
              <button className="btn-ghost btn-sm" onClick={withdraw}>Снять</button>
            </div>
          </div>
        </div>

        <div className="bank-account-card">
          <div className="card-header">
            <h3>Сберегательный счёт</h3>
            <span className="card-icon">💰</span>
          </div>
          <div className="balance text-green">{formatMoney(state.savings)}</div>
          <div className="rate">2.5% годовых &middot; Ежедневная капитализация</div>
          <div className="bank-actions">
            <div className="input-row">
              <input type="number" placeholder="Amount" value={savingsDeposit} onChange={e => setSavingsDeposit(e.target.value)} />
              <button className="btn-success btn-sm" onClick={depositSavings}>Внести</button>
            </div>
            <div className="input-row">
              <input type="number" placeholder="Amount" value={savingsWithdraw} onChange={e => setSavingsWithdraw(e.target.value)} />
              <button className="btn-ghost btn-sm" onClick={withdrawSavings}>Снять</button>
            </div>
          </div>
        </div>

        <div className="bank-account-card">
          <div className="card-header">
            <h3>Наличные</h3>
            <span className="card-icon">💵</span>
          </div>
          <div className="balance" style={{ color: 'var(--text-primary)' }}>{formatMoney(state.cash)}</div>
          <div className="rate">Физические деньги &middot; Без процентов &middot; Всегда под рукой</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, padding: '8px 0' }}>
            Используйте наличные для инвестиций, покупок и трат. Переводите на счёт для безопасности!
          </div>
        </div>
      </div>

      <div className="bank-grid">
        <div className="card" style={{ gridColumn: '1 / 3' }}>
          <span className="section-title">Срочные вклады (CD)</span>
          <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
            {(['6m', '1y', '3y'] as const).map(t => (
              <div key={t} style={{ flex: 1, textAlign: 'center', padding: 12, background: cdTerm === t ? 'var(--accent-blue-glow)' : 'var(--bg-glass)', border: cdTerm === t ? '1px solid var(--accent-blue)' : '1px solid var(--border-light)', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setCdTerm(t)}>
                <div style={{ fontSize: 13, fontWeight: 700, color: cdTerm === t ? 'var(--accent-blue)' : 'var(--text-secondary)' }}>{t}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-green)', marginTop: 4 }}>{cdRates[t]}%</div>
              </div>
            ))}
          </div>
          <div className="bank-actions" style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
            <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>Сумма инвестиции</div>
              <input type="number" placeholder="Сколько вложить?" value={cdAmount} onChange={e => setCdAmount(e.target.value)} style={{ width: '100%' }} />
            </div>
            <button className="btn-success" onClick={openCD}>Открыть депозит</button>
          </div>
          {state.cds.length > 0 && (
            <div className="cd-list" style={{ marginTop: 16 }}>
              <span className="section-title" style={{ marginBottom: 8 }}>Ваши вклады</span>
              {state.cds.map((cd, i) => (
                <div key={i} className="cd-item">
                  <div className="cd-info">
                    <span className="cd-amount">{formatMoney(cd.amount)}</span>
                    <span className="cd-days">{(cd.rate * 100).toFixed(1)}% годовых &middot; Осталось {cd.daysLeft} дн.</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-amber)' }}>{cd.daysLeft}d</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{Math.round(cd.amount * cd.rate * (cd.termDays / 365) * 100) / 100} процентов</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <span className="section-title">Кредиты</span>
          <div style={{ marginBottom: 12, display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Кредитный рейтинг:</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-blue)' }}>{state.creditScore}</span>
          </div>
          <div className="bank-actions" style={{ gap: 8 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className={`btn-sm ${loanType === 'personal' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setLoanType('personal')}>Личный</button>
              <button className={`btn-sm ${loanType === 'business' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setLoanType('business')}>Бизнес</button>
            </div>
            <div className="input-row">
              <input type="number" placeholder="Сумма кредита" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
              <button className="btn-warning btn-sm" onClick={takeLoan}>Взять кредит</button>
            </div>
          </div>
          {state.loans.length > 0 && (
            <div className="loan-list" style={{ marginTop: 8 }}>
              {state.loans.map(loan => (
                <div key={loan.id} className="loan-item">
                  <div className="loan-info">
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{loan.type === 'mortgage' ? '🏠' : loan.type === 'business' ? '🏪' : '💳'} {loan.type} loan</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {(loan.rate * 100).toFixed(1)}% &middot; {formatMoney(loan.remaining)} осталось &middot; {formatMoney(loan.monthlyPayment)}/мес
                    </div>
                  </div>
                  <button className="btn-danger btn-sm" onClick={() => repayLoan(loan.id)}>Оплатить</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="liquid-assets-card">
        <span className="la-label">Всего ликвидных средств</span>
        <span className="la-total">{formatMoney(state.cash + state.checking + state.savings)}</span>
        <div className="la-tips">
          <div className="la-tip">💡 Финансовая подушка — держите 3-6 месяцев расходов на счету</div>
          <div className="la-tip">💰 Сбережения приносят 2.5% годовых с ежедневной капитализацией</div>
          <div className="la-tip">📜 Вклады блокируют деньги на 6-36 месяцев под 4-6.5% годовых</div>
        </div>
      </div>
    </div>
  );
}
