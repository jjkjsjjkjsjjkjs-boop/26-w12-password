import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, CheckCircle2, XCircle, Info } from 'lucide-react';
import { calculateStrength } from '../utils/passwordSecurity';
import './PasswordChecker.css';

export default function PasswordChecker({ password, setPassword }) {
  const [showPassword, setShowPassword] = useState(false);
  const result = calculateStrength(password);

  const criteria = [
    { label: '길이 8자 이상 (12자 이상 권장)', valid: result.length >= 8 },
    { label: '영문 대문자 (A-Z)', valid: result.hasUpper },
    { label: '영문 소문자 (a-z)', valid: result.hasLower },
    { label: '숫자 (0-9)', valid: result.hasNumber },
    { label: '특수문자 (!@#$%^&*)', valid: result.hasSpecial },
  ];

  return (
    <div className="card checker-card" id="checker">
      <div className="card-header">
        <div className="card-icon-title">
          <ShieldCheck className="card-header-icon" size={20} />
          <h2>비밀번호 검사</h2>
        </div>
        <span className="card-badge">실시간 분석</span>
      </div>

      <p className="card-desc">
        사용 중이거나 사용할 비밀번호를 입력하면 실시간으로 강도와 보안 조건을 검사합니다.
      </p>

      {/* 비밀번호 입력 필드 */}
      <div className="input-group">
        <label htmlFor="checker-input" className="input-label">
          비밀번호 입력
        </label>
        <div className="password-input-wrap">
          <input
            id="checker-input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="password-input"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="button"
            className="toggle-visibility-btn"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* 비밀번호 길이 및 강도 상태 바 */}
      {password.length > 0 && (
        <div className="strength-container">
          <div className="strength-summary">
            <span className="strength-label">
              보안 강도:{' '}
              <strong style={{ color: result.color }}>{result.label}</strong>
            </span>
            <span className="length-info">총 <strong>{result.length}</strong>자</span>
          </div>

          <div className="strength-meter-bg">
            <div
              className="strength-meter-fill"
              style={{
                width: `${result.score}%`,
                backgroundColor: result.color,
              }}
            />
          </div>
        </div>
      )}

      {/* 보안 조건 체크리스트 */}
      <div className="criteria-section">
        <h3 className="section-subtitle">구성 조건 확인</h3>
        <ul className="criteria-list">
          {criteria.map((item, idx) => (
            <li key={idx} className={`criteria-item ${item.valid ? 'valid' : 'invalid'}`}>
              {item.valid ? (
                <CheckCircle2 size={16} className="crit-icon crit-valid" />
              ) : (
                <XCircle size={16} className="crit-icon crit-invalid" />
              )}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 개선 방법 안내 */}
      {password.length > 0 && result.improvements.length > 0 && (
        <div className="improvement-box">
          <div className="improvement-header">
            <Info size={16} className="info-icon" />
            <span>개선 방법 안내</span>
          </div>
          <ul className="improvement-list">
            {result.improvements.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
