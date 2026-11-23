// Web Crypto API 기반의 암호학적으로 안전한 비밀번호 유틸리티
// 외부 API를 일절 호출하지 않고 브라우저 내부에서만 안전하게 동작합니다.

// 흔한 비밀번호 상위 목록
const COMMON_PASSWORDS = new Set([
  '123456', 'password', '12345678', 'qwerty', '123456789', '12345', '1234',
  '111111', '1234567', 'dragon', 'welcome', 'ninja', 'admin', 'password1',
  'football', 'iloveyou', 'sunshine', 'princess', 'monkey', 'secret',
  'solo', 'starwars', 'master', 'superman', 'trustno1', 'killer', 'pass123',
  'qwertz', 'asdfgh', '123123', 'qwertyuiop', '000000', 'google', 'login',
  'default', 'root', 'user', 'guest', 'korea', 'korea123', 'hello', 'hello123',
  'qwer1234', 'test1234', 'asdf1234', 'abcd1234', 'qwerasdf', 'zxcv1234'
]);

// 키보드 연속 패턴
const KEYBOARD_PATTERNS = [
  'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
  '1234567890', '0987654321',
  'poiuytrewq', 'lkjhgfdsa', 'mnbvcxz'
];

/**
 * 비밀번호 강도 계산
 * @param {string} password 
 * @returns {object} 강도 측정 결과
 */
export function calculateStrength(password) {
  if (!password) {
    return {
      score: 0,
      label: '입력 대기',
      color: '#94a3b8',
      length: 0,
      hasUpper: false,
      hasLower: false,
      hasNumber: false,
      hasSpecial: false,
      improvements: ['비밀번호를 입력해 주세요.']
    };
  }

  const length = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  const improvements = [];

  // 길이 점수 (최대 40점)
  if (length >= 16) {
    score += 40;
  } else if (length >= 12) {
    score += 30;
  } else if (length >= 8) {
    score += 18;
    improvements.push('길이를 12자 이상으로 늘리면 훨씬 안전합니다.');
  } else {
    score += 5;
    improvements.push('최소 8자 이상, 권장 12자 이상으로 입력하세요.');
  }

  // 문자 다양성 점수 (최대 40점)
  let varietyCount = 0;
  if (hasUpper) varietyCount++;
  else improvements.push('대문자(A-Z)를 포함해 보세요.');

  if (hasLower) varietyCount++;
  else improvements.push('소문자(a-z)를 포함해 보세요.');

  if (hasNumber) varietyCount++;
  else improvements.push('숫자(0-9)를 포함해 보세요.');

  if (hasSpecial) varietyCount++;
  else improvements.push('특수문자(!@#$% 등)를 추가해 보세요.');

  score += varietyCount * 10;

  // 보너스 점수 (조합 완성도 & 길이 보너스, 최대 20점)
  if (varietyCount === 4 && length >= 12) {
    score += 20;
  } else if (varietyCount >= 3 && length >= 10) {
    score += 10;
  }

  // 감점 요인 (단순 반복이나 흔한 패턴)
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(score - 15, 5);
    improvements.push('연속으로 반복되는 문자는 피해주세요.');
  }

  // 점수 범위 0 ~ 100 보정
  score = Math.min(Math.max(score, 5), 100);

  // 단계 판정: 매우 약함, 약함, 보통, 강함, 매우 강함
  let label = '매우 약함';
  let color = '#ef4444'; // 빨간색

  if (score >= 85) {
    label = '매우 강함';
    color = '#10b981'; // 녹색
  } else if (score >= 70) {
    label = '강함';
    color = '#22c55e'; // 연녹색
  } else if (score >= 50) {
    label = '보통';
    color = '#eab308'; // 노란색
  } else if (score >= 30) {
    label = '약함';
    color = '#f97316'; // 주황색
  } else {
    label = '매우 약함';
    color = '#ef4444'; // 빨간색
  }

  if (improvements.length === 0) {
    improvements.push('모든 보안 기준을 만족하는 강력한 비밀번호입니다.');
  }

  return {
    score,
    label,
    color,
    length,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    improvements
  };
}

/**
 * 암호학적으로 안전한 난수를 사용한 비밀번호 생성
 * Math.random() 대신 crypto.getRandomValues() 사용
 */
export function generateSecurePassword(options = {}) {
  const {
    length = 16,
    useUpper = true,
    useLower = true,
    useNumber = true,
    useSpecial = true
  } = options;

  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let charPool = '';
  const mandatoryChars = [];

  // 안전한 난수 인덱스 선택 함수 (편향 방지)
  const getRandomChar = (charset) => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return charset[array[0] % charset.length];
  };

  if (useUpper) {
    charPool += upperChars;
    mandatoryChars.push(getRandomChar(upperChars));
  }
  if (useLower) {
    charPool += lowerChars;
    mandatoryChars.push(getRandomChar(lowerChars));
  }
  if (useNumber) {
    charPool += numberChars;
    mandatoryChars.push(getRandomChar(numberChars));
  }
  if (useSpecial) {
    charPool += specialChars;
    mandatoryChars.push(getRandomChar(specialChars));
  }

  // 아무 옵션도 선택되지 않았을 경우 기본값 적용
  if (!charPool) {
    charPool = lowerChars + numberChars;
    mandatoryChars.push(getRandomChar(lowerChars));
    mandatoryChars.push(getRandomChar(numberChars));
  }

  const result = [...mandatoryChars];
  const remainingLength = Math.max(length - mandatoryChars.length, 0);

  if (remainingLength > 0) {
    const randomBuffer = new Uint32Array(remainingLength);
    window.crypto.getRandomValues(randomBuffer);
    for (let i = 0; i < remainingLength; i++) {
      result.push(charPool[randomBuffer[i] % charPool.length]);
    }
  }

  // Fisher-Yates 셔플로 순서 무작위화 (crypto.getRandomValues 사용)
  for (let i = result.length - 1; i > 0; i--) {
    const rand = new Uint32Array(1);
    window.crypto.getRandomValues(rand);
    const j = rand[0] % (i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result.slice(0, length).join('');
}

/**
 * 정밀 보안 진단 수행
 * @param {string} password 
 * @returns {Array} 진단 결과 목록
 */
export function diagnosePassword(password) {
  if (!password) return [];

  const lowerPass = password.toLowerCase();
  const diagnoses = [];

  // 1. 짧은 비밀번호
  if (password.length < 8) {
    diagnoses.push({
      id: 'length',
      title: '짧은 비밀번호',
      severity: 'danger', // danger, warning, safe
      description: `현재 길이가 ${password.length}자입니다. 8자 미만의 비밀번호는 무차별 대입(Brute-force) 공격에 몇 초 만에 뚫릴 수 있습니다.`,
      solution: '비밀번호를 최소 12자 이상으로 설정하세요.'
    });
  } else if (password.length < 12) {
    diagnoses.push({
      id: 'length',
      title: '비밀번호 길이 주의',
      severity: 'warning',
      description: `현재 길이가 ${password.length}자입니다. 안전한 편이지만 현대 연산 속도를 감안할 때 12자 이상이 권장됩니다.`,
      solution: '문장 형태(Passphrase)나 추가 단어를 결합해 12자 이상으로 늘려보세요.'
    });
  } else {
    diagnoses.push({
      id: 'length',
      title: '충분한 비밀번호 길이',
      severity: 'safe',
      description: `현재 길이가 ${password.length}자로 충분히 깁니다. 무차별 대입 공격에 강합니다.`,
      solution: '현재 길이를 유지하세요.'
    });
  }

  // 2. 반복 문자 (동일 문자 3회 이상)
  const repeatMatch = /(.)\1{2,}/.test(password);
  if (repeatMatch) {
    diagnoses.push({
      id: 'repetition',
      title: '반복 문자 포함',
      severity: 'danger',
      description: '동일한 문자가 연속으로 3회 이상 반복되고 있습니다 (예: aaa, 111). 엔트로피(복잡도)가 크게 감소합니다.',
      solution: '연속된 반복 문자를 제거하고 다른 임의의 문자로 교체하세요.'
    });
  } else {
    diagnoses.push({
      id: 'repetition',
      title: '반복 문자 없음',
      severity: 'safe',
      description: '연속으로 3번 이상 중복되는 문자가 없어 안전합니다.',
      solution: '좋은 패턴입니다.'
    });
  }

  // 3. 연속된 숫자 (123, 321, 789 등)
  let hasSequentialNumber = false;
  for (let i = 0; i < password.length - 2; i++) {
    const c1 = password.charCodeAt(i);
    const c2 = password.charCodeAt(i + 1);
    const c3 = password.charCodeAt(i + 2);
    // 0-9 ascii: 48-57
    if (c1 >= 48 && c1 <= 57 && c2 >= 48 && c2 <= 57 && c3 >= 48 && c3 <= 57) {
      if ((c2 === c1 + 1 && c3 === c2 + 1) || (c2 === c1 - 1 && c3 === c2 - 1)) {
        hasSequentialNumber = true;
        break;
      }
    }
  }

  if (hasSequentialNumber) {
    diagnoses.push({
      id: 'seq-numbers',
      title: '연속된 숫자 패턴',
      severity: 'danger',
      description: '123, 789, 321과 같이 연속되거나 역순인 숫자가 포함되어 있어 공격 사전에서 1순위로 대입됩니다.',
      solution: '순서대로 이어지는 숫자 대신 불규칙한 숫자를 사용하세요.'
    });
  } else {
    diagnoses.push({
      id: 'seq-numbers',
      title: '연속된 숫자 없음',
      severity: 'safe',
      description: '단순하게 증가하거나 감소하는 숫자 배열이 감지되지 않았습니다.',
      solution: '안전한 숫자 조합입니다.'
    });
  }

  // 4. 연속된 문자 (키보드 또는 알파벳 연속)
  let hasSequentialAlpha = false;
  for (let i = 0; i < lowerPass.length - 2; i++) {
    const c1 = lowerPass.charCodeAt(i);
    const c2 = lowerPass.charCodeAt(i + 1);
    const c3 = lowerPass.charCodeAt(i + 2);
    if (c1 >= 97 && c1 <= 122 && c2 >= 97 && c2 <= 122 && c3 >= 97 && c3 <= 122) {
      if ((c2 === c1 + 1 && c3 === c2 + 1) || (c2 === c1 - 1 && c3 === c2 - 1)) {
        hasSequentialAlpha = true;
        break;
      }
    }
  }

  let hasKeyboardPattern = false;
  for (const pattern of KEYBOARD_PATTERNS) {
    for (let i = 0; i <= pattern.length - 3; i++) {
      const sub = pattern.substring(i, i + 3);
      if (lowerPass.includes(sub)) {
        hasKeyboardPattern = true;
        break;
      }
    }
    if (hasKeyboardPattern) break;
  }

  if (hasSequentialAlpha || hasKeyboardPattern) {
    diagnoses.push({
      id: 'seq-chars',
      title: '연속된 문자 / 키보드 배열',
      severity: 'warning',
      description: 'abc, cba 또는 qwerty, asdf처럼 키보드상에서 연속된 자판이나 알파벳 순서가 포함되어 있습니다.',
      solution: '자판을 손가락 가는 대로 누르는 패턴을 피하고 예측 불가능한 단어를 사용하세요.'
    });
  } else {
    diagnoses.push({
      id: 'seq-chars',
      title: '연속된 문자열 없음',
      severity: 'safe',
      description: '예측하기 쉬운 키보드 배열이나 알파벳 순서가 없습니다.',
      solution: '규칙 없는 불규칙 배열을 유지하세요.'
    });
  }

  // 5. 흔한 비밀번호 (사전 대입)
  const isCommon = COMMON_PASSWORDS.has(lowerPass);
  if (isCommon) {
    diagnoses.push({
      id: 'common',
      title: '가장 흔한 비밀번호 목록에 포함',
      severity: 'danger',
      description: '전 세계 해킹 유출 통계에서 수백만 번 이상 쓰인 전형적인 취약 비밀번호입니다.',
      solution: '이 비밀번호는 절대 사용해서는 안 됩니다. 즉시 새로운 무작위 비밀번호로 바꾸세요.'
    });
  } else {
    diagnoses.push({
      id: 'common',
      title: '흔한 비밀번호 목록 미포함',
      severity: 'safe',
      description: '대표적인 취약 비밀번호 목록과 일치하지 않습니다.',
      solution: '독창적인 조합입니다.'
    });
  }

  // 6. 예측하기 쉬운 패턴 (생년월일, 전화번호 등)
  const isYearPattern = /(19\d{2}|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])/.test(password);
  const isPhonePattern = /010\d{8}|010-\d{4}-\d{4}/.test(password);
  if (isYearPattern || isPhonePattern) {
    diagnoses.push({
      id: 'predictable',
      title: '개인정보 유추 패턴 감지 (생년월일/연락처)',
      severity: 'danger',
      description: '생년월일(YYYYMMDD) 또는 휴대전화 번호 형태의 숫자가 포함되어 있어 지인이나 소셜 엔지니어링 공격에 취약합니다.',
      solution: '자신이나 가족의 생일, 전화번호와 무관한 임의의 숫자 조합을 사용하세요.'
    });
  } else {
    diagnoses.push({
      id: 'predictable',
      title: '개인정보 유추 패턴 없음',
      severity: 'safe',
      description: '생년월일이나 전화번호 등 쉽게 알아낼 수 있는 개인정보 패턴이 감지되지 않았습니다.',
      solution: '신상정보와 결합되지 않은 상태를 유지하세요.'
    });
  }

  return diagnoses;
}
