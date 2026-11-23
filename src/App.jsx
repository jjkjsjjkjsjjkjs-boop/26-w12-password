import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PasswordChecker from './components/PasswordChecker';
import PasswordGenerator from './components/PasswordGenerator';
import SecurityDiagnosis from './components/SecurityDiagnosis';
import SecurityTips from './components/SecurityTips';
import { ShieldCheck, RefreshCw, AlertTriangle, Lightbulb, Lock } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [sharedPassword, setSharedPassword] = useState('');

  // 퀵 카드 목록 (메인 화면 4대 기능 바로가기)
  const quickCards = [
    {
      id: 'checker',
      title: '비밀번호 검사',
      desc: '실시간 강도 측정 및 조건 검사',
      icon: ShieldCheck,
      color: '#2563eb',
    },
    {
      id: 'generator',
      title: '비밀번호 만들기',
      desc: 'Web Crypto 기반 안전한 난수 생성',
      icon: RefreshCw,
      color: '#0284c7',
    },
    {
      id: 'diagnosis',
      title: '보안 진단',
      desc: '연속 문자·반복·흔한 비밀번호 분석',
      icon: AlertTriangle,
      color: '#d97706',
    },
    {
      id: 'tips',
      title: '보안 팁',
      desc: '실천 가능한 5가지 비밀번호 수칙',
      icon: Lightbulb,
      color: '#059669',
    },
  ];

  const handleCardClick = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUseGeneratedPassword = (pass) => {
    setSharedPassword(pass);
    const checkerEl = document.getElementById('checker');
    if (checkerEl) {
      checkerEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      {/* 상단 네비게이션 헤더 */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 중앙 메인 히어로 섹션 */}
      <main className="main-content">
        <section className="hero-section">
          <div className="hero-badge">
            <Lock size={14} /> 브라우저 내부 단독 처리 · 외부 전송 0%
          </div>
          <h1 className="hero-title">비밀번호, 안전하게 관리하세요.</h1>
          <p className="hero-subtitle">
            간단한 검사로 비밀번호의 보안 수준을 확인해보세요.
          </p>

          {/* 4대 기능 퀵 카드 */}
          <div className="quick-cards-grid">
            {quickCards.map((card) => {
              const Icon = card.icon;
              const isSelected = activeTab === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  className={`quick-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleCardClick(card.id)}
                >
                  <div
                    className="quick-card-icon"
                    style={{ backgroundColor: `${card.color}15`, color: card.color }}
                  >
                    <Icon size={22} />
                  </div>
                  <div className="quick-card-text">
                    <h3 className="quick-card-title">{card.title}</h3>
                    <p className="quick-card-desc">{card.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 메인 기능 섹션 목록 */}
        <div className="features-container">
          {(activeTab === 'all' || activeTab === 'checker') && (
            <PasswordChecker
              password={sharedPassword}
              setPassword={setSharedPassword}
            />
          )}

          {(activeTab === 'all' || activeTab === 'generator') && (
            <PasswordGenerator onUsePassword={handleUseGeneratedPassword} />
          )}

          {(activeTab === 'all' || activeTab === 'diagnosis') && (
            <SecurityDiagnosis
              password={sharedPassword}
              setPassword={setSharedPassword}
            />
          )}

          {(activeTab === 'all' || activeTab === 'tips') && <SecurityTips />}
        </div>
      </main>

      {/* 하단 푸터 */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-title"><strong>KeyCheck</strong> – 간편 비밀번호 보안 도구</p>
          <p className="footer-notice">
            입력된 모든 비밀번호는 외부 서버로 절대 전송되지 않으며, 사용자 브라우저의 Web Crypto API를 통해 즉시 분석 후 파기됩니다.
          </p>
          <p className="footer-copy">© 2026 KeyCheck. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
