import React from 'react';
import { KeyRound, ShieldCheck, RefreshCw, AlertTriangle, Lightbulb } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'checker', label: '비밀번호 검사', icon: ShieldCheck },
    { id: 'generator', label: '비밀번호 만들기', icon: RefreshCw },
    { id: 'diagnosis', label: '보안 진단', icon: AlertTriangle },
    { id: 'tips', label: '보안 팁', icon: Lightbulb },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => setActiveTab('all')} role="button" tabIndex={0}>
          <div className="logo-icon-wrap">
            <KeyRound className="logo-icon" size={22} />
          </div>
          <span className="logo-text">KeyCheck</span>
        </div>

        <nav className="navbar-nav">
          <button
            type="button"
            className={`nav-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            전체 보기
          </button>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
