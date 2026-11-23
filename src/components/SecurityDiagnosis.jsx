import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, ShieldAlert, Sparkles, RefreshCcw } from 'lucide-react';
import { diagnosePassword } from '../utils/passwordSecurity';
import './SecurityDiagnosis.css';

export default function SecurityDiagnosis({ password, setPassword }) {
  const [customInput, setCustomInput] = useState('');
  const activePassword = password || customInput;
  const diagnoses = diagnosePassword(activePassword);

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'danger':
        return <span className="diag-badge danger"><AlertCircle size={13} /> 취약</span>;
      case 'warning':
        return <span className="diag-badge warning"><AlertTriangle size={13} /> 주의</span>;
      case 'safe':
      default:
        return <span className="diag-badge safe"><CheckCircle size={13} /> 안전</span>;
    }
  };

  return (
    <div className="card diagnosis-card" id="diagnosis">
      <div className="card-header">
        <div className="card-icon-title">
          <AlertTriangle className="card-header-icon" size={20} />
          <h2>보안 진단</h2>
        </div>
        <span className="card-badge">취약 패턴 분석</span>
      </div>

      <p className="card-desc">
        짧은 길이, 연속된 자판이나 숫자, 생년월일, 흔한 비밀번호 등 해커들이 노리는 취약 패턴을 정밀 진단합니다.
      </p>

      {/* 진단 대상 비밀번호 입력 또는 상태 */}
      <div className="diagnosis-target-box">
        <label className="input-label" htmlFor="diag-input">
          진단 대상 비밀번호
        </label>
        <div className="diag-input-row">
          <input
            id="diag-input"
            type="text"
            className="password-input"
            value={password || customInput}
            onChange={(e) => {
              if (setPassword) setPassword(e.target.value);
              setCustomInput(e.target.value);
            }}
            placeholder="진단할 비밀번호를 입력하거나 위에서 입력하세요"
            autoComplete="off"
            spellCheck="false"
          />
          {activePassword && (
            <button
              type="button"
              className="clear-diag-btn"
              onClick={() => {
                if (setPassword) setPassword('');
                setCustomInput('');
              }}
              title="비우기"
            >
              <RefreshCcw size={15} />
            </button>
          )}
        </div>
        {!activePassword && (
          <div className="test-examples">
            <span className="example-label">테스트해보기:</span>
            <button
              type="button"
              className="example-btn"
              onClick={() => {
                if (setPassword) setPassword('123456');
                setCustomInput('123456');
              }}
            >
              123456
            </button>
            <button
              type="button"
              className="example-btn"
              onClick={() => {
                if (setPassword) setPassword('qwerty111');
                setCustomInput('qwerty111');
              }}
            >
              qwerty111
            </button>
            <button
              type="button"
              className="example-btn"
              onClick={() => {
                if (setPassword) setPassword('pass19980512');
                setCustomInput('pass19980512');
              }}
            >
              pass19980512
            </button>
          </div>
        )}
      </div>

      {/* 진단 결과 항목들 */}
      {activePassword ? (
        <div className="diagnosis-items-grid">
          {diagnoses.map((diag) => (
            <div key={diag.id} className={`diag-item-card severity-${diag.severity}`}>
              <div className="diag-item-header">
                <h4 className="diag-item-title">{diag.title}</h4>
                {getSeverityBadge(diag.severity)}
              </div>
              <p className="diag-item-desc">{diag.description}</p>
              <div className="diag-solution">
                <strong className="solution-tag">해결 방법</strong>
                <span>{diag.solution}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-diagnosis">
          <Sparkles size={24} className="empty-icon" />
          <p>비밀번호를 입력하면 6대 보안 취약 항목을 즉시 검사합니다.</p>
        </div>
      )}

      {/* 비밀번호 재사용 위험 안내 박스 */}
      <div className="reuse-warning-box">
        <div className="reuse-warning-header">
          <ShieldAlert size={18} className="reuse-icon" />
          <h3>비밀번호 재사용의 치명적 위험 (크리덴셜 스터핑)</h3>
        </div>
        <p className="reuse-warning-text">
          여러 웹사이트와 서비스에서 <strong>동일하거나 유사한 비밀번호를 재사용</strong>할 경우, 단 한 곳의 중소 사이트에서 데이터가 유출되어도 해커는 자동화 도구로 여러분의 포털, SNS, 금융 계정까지 동일 비밀번호로 접속을 시도합니다. 반드시 서비스마다 서로 다른 비밀번호를 설정하세요.
        </p>
      </div>
    </div>
  );
}
