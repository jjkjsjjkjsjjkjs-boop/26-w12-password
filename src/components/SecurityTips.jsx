import React from 'react';
import { Lightbulb, Maximize2, Layers, Key, ShieldCheck, AlertCircle } from 'lucide-react';
import './SecurityTips.css';

export default function SecurityTips() {
  const tips = [
    {
      icon: Maximize2,
      title: '긴 비밀번호 사용하기',
      badge: '길이가 핵심',
      description:
        '특수문자가 많이 들어간 8자리보다, 외우기 쉬운 단어 3~4개를 조합한 16자 이상의 문장형 비밀번호(Passphrase)가 무차별 대입 공격에 훨씬 강력합니다.',
      actionGuide: '최소 12자 이상, 권장 16자 이상으로 설정하세요.',
    },
    {
      icon: Layers,
      title: '사이트마다 다른 비밀번호 사용하기',
      badge: '재사용 금지',
      description:
        '단 한 곳의 웹사이트가 해킹당하더라도 동일한 비밀번호를 쓰지 않았다면 다른 주요 계정(이메일, 금융, 포털)은 안전하게 보호됩니다.',
      actionGuide: '중요한 계정일수록 독립된 고유 비밀번호를 지정하세요.',
    },
    {
      icon: ShieldCheck,
      title: '2단계 인증 (2FA) 활성화하기',
      badge: '최선의 방어',
      description:
        '비밀번호가 노출되더라도 모바일 OTP(Google Authenticator 등)나 생체인증이 있어야 로그인이 완료되므로 계정 탈취를 99% 이상 예방할 수 있습니다.',
      actionGuide: '포털, SNS, 이메일 설정에서 2단계 인증을 켜두세요.',
    },
    {
      icon: Key,
      title: '비밀번호 관리자 사용하기',
      badge: '편리한 보안',
      description:
        '모든 사이트의 복잡한 비밀번호를 사람이 직접 외우기는 불가능합니다. 신뢰할 수 있는 비밀번호 관리자(Bitwarden, 1Password 등)를 활용하세요.',
      actionGuide: '마스터 비밀번호 하나만 안전하게 기억하면 됩니다.',
    },
    {
      icon: AlertCircle,
      title: '피싱 사이트 주의하기',
      badge: '주소창 확인',
      description:
        '공격자는 가짜 로그인 페이지를 만들어 비밀번호를 직접 가로챕니다. 이메일이나 문자 링크를 누르지 말고 브라우저 주소창(URL)의 철자를 반드시 확인하세요.',
      actionGuide: '로그인 전 https:// 및 공식 도메인 여부를 확인하세요.',
    },
  ];

  return (
    <div className="card tips-card" id="tips">
      <div className="card-header">
        <div className="card-icon-title">
          <Lightbulb className="card-header-icon" size={20} />
          <h2>보안 팁</h2>
        </div>
        <span className="card-badge">안전 수칙</span>
      </div>

      <p className="card-desc">
        누구나 쉽게 실천할 수 있는 5가지 필수 비밀번호 보안 수칙입니다.
      </p>

      <div className="tips-grid">
        {tips.map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <div key={idx} className="tip-item-card">
              <div className="tip-item-header">
                <div className="tip-icon-box">
                  <Icon size={18} />
                </div>
                <div className="tip-title-wrap">
                  <h4 className="tip-title">{tip.title}</h4>
                  <span className="tip-badge">{tip.badge}</span>
                </div>
              </div>
              <p className="tip-desc">{tip.description}</p>
              <div className="tip-action">
                <span className="action-tag">실천 가이드:</span>
                <span className="action-text">{tip.actionGuide}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
