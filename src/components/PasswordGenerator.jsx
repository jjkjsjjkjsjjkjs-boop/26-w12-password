import React, { useState } from 'react';
import { RefreshCw, Copy, Check, Sliders, Shield } from 'lucide-react';
import { generateSecurePassword, calculateStrength } from '../utils/passwordSecurity';
import './PasswordGenerator.css';

export default function PasswordGenerator({ onUsePassword }) {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumber, setUseNumber] = useState(true);
  const [useSpecial, setUseSpecial] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState(() => 
    generateSecurePassword({ length: 16, useUpper: true, useLower: true, useNumber: true, useSpecial: true })
  );
  const [copied, setCopied] = useState(false);

  const generateWithParams = (len, up, low, num, spec) => {
    const actualUpper = up || (!low && !num && !spec);
    const newPass = generateSecurePassword({
      length: len,
      useUpper: actualUpper,
      useLower: low,
      useNumber: num,
      useSpecial: spec,
    });
    setGeneratedPassword(newPass);
    setCopied(false);
  };

  const handleGenerate = () => {
    generateWithParams(length, useUpper, useLower, useNumber, useSpecial);
  };

  const handleLengthChange = (e) => {
    const newLen = Number(e.target.value);
    setLength(newLen);
    generateWithParams(newLen, useUpper, useLower, useNumber, useSpecial);
  };

  const handleUpperChange = (e) => {
    const val = e.target.checked;
    setUseUpper(val);
    generateWithParams(length, val, useLower, useNumber, useSpecial);
  };

  const handleLowerChange = (e) => {
    const val = e.target.checked;
    setUseLower(val);
    generateWithParams(length, useUpper, val, useNumber, useSpecial);
  };

  const handleNumberChange = (e) => {
    const val = e.target.checked;
    setUseNumber(val);
    generateWithParams(length, useUpper, useLower, val, useSpecial);
  };

  const handleSpecialChange = (e) => {
    const val = e.target.checked;
    setUseSpecial(val);
    generateWithParams(length, useUpper, useLower, useNumber, val);
  };

  const handleCopy = async () => {
    if (!generatedPassword) return;
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 API 미지원 환경 fallback
      const textArea = document.createElement('textarea');
      textArea.value = generatedPassword;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const strength = calculateStrength(generatedPassword);

  return (
    <div className="card generator-card" id="generator">
      <div className="card-header">
        <div className="card-icon-title">
          <RefreshCw className="card-header-icon" size={20} />
          <h2>비밀번호 만들기</h2>
        </div>
        <span className="card-badge secure-badge">
          <Shield size={12} /> Web Crypto 난수
        </span>
      </div>

      <p className="card-desc">
        <code>crypto.getRandomValues()</code> 기반의 암호학적 난수를 이용해 안전한 비밀번호를 생성합니다.
      </p>

      {/* 생성된 비밀번호 표시 및 액션 */}
      <div className="generated-display-wrap">
        <div className="generated-password-box">
          <span className="generated-password-text">{generatedPassword}</span>
        </div>
        <div className="generated-actions">
          <button
            type="button"
            className="action-btn copy-btn"
            onClick={handleCopy}
            title="클립보드에 복사"
          >
            {copied ? (
              <>
                <Check size={16} className="btn-icon success-icon" />
                <span>복사됨!</span>
              </>
            ) : (
              <>
                <Copy size={16} className="btn-icon" />
                <span>복사</span>
              </>
            )}
          </button>
          <button
            type="button"
            className="action-btn regenerate-btn"
            onClick={handleGenerate}
            title="새 비밀번호 생성"
          >
            <RefreshCw size={16} className="btn-icon" />
            <span>새로 생성</span>
          </button>
          {onUsePassword && (
            <button
              type="button"
              className="action-btn check-now-btn"
              onClick={() => onUsePassword(generatedPassword)}
              title="이 비밀번호로 검사하기"
            >
              <span>검사창에 적용</span>
            </button>
          )}
        </div>
      </div>

      {/* 강도 표시 바 */}
      <div className="generator-strength-bar">
        <div className="gen-strength-label">
          <span>생성된 비밀번호 강도:</span>
          <strong style={{ color: strength.color }}>{strength.label} ({strength.length}자)</strong>
        </div>
        <div className="gen-meter-bg">
          <div
            className="gen-meter-fill"
            style={{ width: `${strength.score}%`, backgroundColor: strength.color }}
          />
        </div>
      </div>

      {/* 옵션 설정 */}
      <div className="options-container">
        <div className="length-setting">
          <div className="setting-header">
            <span className="setting-title">
              <Sliders size={16} /> 길이 설정: <strong>{length}자</strong>
            </span>
            <span className="setting-guide">(8 ~ 64자)</span>
          </div>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={handleLengthChange}
            className="length-slider"
          />
        </div>

        <div className="char-options-grid">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={useUpper}
              onChange={handleUpperChange}
            />
            <span>대문자 (A-Z)</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={useLower}
              onChange={handleLowerChange}
            />
            <span>소문자 (a-z)</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={useNumber}
              onChange={handleNumberChange}
            />
            <span>숫자 (0-9)</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={useSpecial}
              onChange={handleSpecialChange}
            />
            <span>특수문자 (!@#$%^&*)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
