import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import type { GameState } from './types';
import { createInitialState, saveGame, loadGame, deleteSave } from './game/save';
import { advanceDay } from './game/engine';
import { getNetWorth } from './game/events';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Bank from './components/Bank';
import Stocks from './components/Stocks';
import RealEstate from './components/RealEstate';
import Vehicles from './components/Vehicles';
import Business from './components/Business';
import Profile from './components/Profile';
import Crypto from './components/Crypto';
import EventModal from './components/EventModal';

export default function App() {
  const [state, setState] = useState<GameState | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [autoMode, setAutoMode] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const saved = loadGame();
    setHasSave(saved !== null);
    if (saved) {
      setState(saved);
    }
  }, []);

  useEffect(() => {
    if (state) {
      saveGame(state);
    }
  }, [state]);

  useEffect(() => {
    if (autoMode) {
      autoRef.current = setInterval(() => {
        setState(prev => prev ? advanceDay(prev) : prev);
      }, 500);
    } else {
      if (autoRef.current) {
        clearInterval(autoRef.current);
        autoRef.current = null;
      }
    }
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [autoMode]);

  const handleNewGame = () => {
    setState(createInitialState());
    deleteSave();
    setHasSave(false);
  };

  const handleLoadGame = () => {
    const saved = loadGame();
    if (saved) {
      setState(saved);
    }
  };

  const handleAdvanceDay = useCallback(() => {
    setState(prev => prev ? advanceDay(prev) : prev);
  }, []);

  const handleDismissEvent = useCallback(() => {
    setState(prev => prev ? { ...prev, showEvent: false } : prev);
  }, []);

  if (!state) {
    return (
      <div className="new-game-overlay">
        <div className="new-game-card">
          <div className="ng-logo">🏦</div>
          <h1>Bank Simulator</h1>
          <p className="ng-subtitle">Стройте свою финансовую империю с нуля.<br />Зарабатывайте, копите, инвестируйте — достигните $10M капитала!</p>
          <div className="features">
            <div className="feature"><span className="f-icon">💼</span><span className="f-label">Career</span></div>
            <div className="feature"><span className="f-icon">🏦</span><span className="f-label">Banking</span></div>
            <div className="feature"><span className="f-icon">📈</span><span className="f-label">Stocks</span></div>
            <div className="feature"><span className="f-icon">🏠</span><span className="f-label">Real Estate</span></div>
            <div className="feature"><span className="f-icon">🚗</span><span className="f-label">Vehicles</span></div>
            <div className="feature"><span className="f-icon">🏪</span><span className="f-label">Business</span></div>
          </div>
          <button className="start-btn" onClick={handleNewGame}>▶ Новая игра</button>
          {hasSave && (
            <>
              <div className="ng-divider" />
              <button className="load-btn" onClick={handleLoadGame}>📂 Продолжить игру</button>
            </>
          )}
        </div>
      </div>
    );
  }

  const nw = getNetWorth(state);
  const won = nw >= 10000000;

  if (won) {
    return (
      <div className="new-game-overlay">
        <div className="new-game-card">
          <div className="win-screen">
            <span className="trophy">👑</span>
            <h1>Вы победили!</h1>
            <p>
              Вы достигли <strong>$10,000,000</strong> капитала за {state.day} дней!<br />
              Вы финансовый гений!
            </p>
            <div className="win-stat">
              <div className="ws-label">Финальный капитал</div>
              <div className="ws-value">${nw.toLocaleString()}</div>
            </div>
            <button className="start-btn" onClick={handleNewGame}>▶ Сыграть ещё</button>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard state={state} onAdvanceDay={handleAdvanceDay} onToggleAuto={() => setAutoMode(!autoMode)} autoMode={autoMode} />;
      case 'bank': return <Bank state={state} setState={setState} />;
      case 'stocks': return <Stocks state={state} setState={setState} />;
      case 'realestate': return <RealEstate state={state} setState={setState} />;
      case 'vehicles': return <Vehicles state={state} setState={setState} />;
      case 'crypto': return <Crypto state={state} setState={setState} />;
      case 'business': return <Business state={state} setState={setState} />;
      case 'profile': return <Profile state={state} setState={setState} />;
      default: return <Dashboard state={state} onAdvanceDay={handleAdvanceDay} onToggleAuto={() => setAutoMode(!autoMode)} autoMode={autoMode} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar state={state} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="app-content">
        {renderContent()}
      </div>
      {state.showEvent && (
        <EventModal message={state.eventMessage} type={state.eventType} onClose={handleDismissEvent} />
      )}
    </div>
  );
}
