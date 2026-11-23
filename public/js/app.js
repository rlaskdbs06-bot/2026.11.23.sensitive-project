// 화면 동작: 입력 검사 → /api/analyze 요청 → 결과·오류 표시
(() => {
  'use strict';

  const MAX_LENGTH = 1000;
  const CLIENT_TIMEOUT_MS = 30000;

  // 오류 코드 → 사용자 문구 (docs/03 §6 표와 글자 그대로 같아야 함)
  const MESSAGES = {
    EMPTY_INPUT: '분석할 텍스트를 입력해 주세요.',
    TEXT_TOO_LONG: '텍스트는 1,000자 이하로 입력해 주세요.',
    INVALID_REQUEST: '요청 형식이 올바르지 않아요. 페이지를 새로고침한 뒤 다시 시도해 주세요.',
    METHOD_NOT_ALLOWED: '허용되지 않은 요청 방식이에요.',
    AI_REFUSED: '이 텍스트는 분석할 수 없어요. 다른 문장으로 시도해 주세요.',
    RATE_LIMITED: '요청이 많거나 사용 한도를 넘었어요. 잠시 후 다시 시도해 주세요.',
    CONFIG_ERROR: '서버 설정에 문제가 있어요. 관리자에게 문의해 주세요.',
    AI_BAD_RESPONSE: 'AI 응답을 해석하지 못했어요. 다시 시도해 주세요.',
    AI_UPSTREAM_ERROR: 'AI 서비스에 일시적인 문제가 있어요. 잠시 후 다시 시도해 주세요.',
    AI_TIMEOUT: 'AI 응답이 너무 오래 걸려요. 잠시 후 다시 시도해 주세요.',
    NETWORK_ERROR: '서버에 연결하지 못했어요. 인터넷 연결을 확인해 주세요.',
    UNKNOWN_ERROR: '알 수 없는 오류가 발생했어요. 다시 시도해 주세요.'
  };

  // 같은 텍스트로 다시 시도할 의미가 있는 오류
  const RETRYABLE = new Set(['RATE_LIMITED', 'AI_TIMEOUT', 'AI_BAD_RESPONSE', 'AI_UPSTREAM_ERROR', 'NETWORK_ERROR', 'UNKNOWN_ERROR']);

  // 입력창 아래에 표시하는 오류
  const FIELD_ERRORS = new Set(['EMPTY_INPUT', 'TEXT_TOO_LONG']);

  // 서버 값 → 화면 표시
  const SENTIMENT_TEXT = {
    positive: { label: '긍정', badge: 'POSITIVE' },
    negative: { label: '부정', badge: 'NEGATIVE' },
    neutral: { label: '중립', badge: 'NEUTRAL' }
  };

  const el = {
    form: document.getElementById('analyze-form'),
    input: document.getElementById('input-text'),
    charCount: document.getElementById('char-count'),
    inputError: document.getElementById('input-error'),
    analyzeBtn: document.getElementById('analyze-btn'),
    clearBtn: document.getElementById('clear-btn'),
    panel: document.getElementById('result-panel'),
    empty: document.getElementById('result-empty'),
    loading: document.getElementById('result-loading'),
    card: document.getElementById('result-card'),
    badge: document.getElementById('result-badge'),
    label: document.getElementById('result-label'),
    confidence: document.getElementById('result-confidence'),
    bar: document.getElementById('confidence-bar'),
    fill: document.getElementById('confidence-fill'),
    reason: document.getElementById('result-reason'),
    error: document.getElementById('result-error'),
    errorMessage: document.getElementById('error-message'),
    retryBtn: document.getElementById('retry-btn')
  };

  let isLoading = false;
  let lastText = '';

  // 글자 수 표시를 갱신한다
  function updateCharCount() {
    el.charCount.textContent = el.input.value.length.toLocaleString('ko-KR');
  }

  // 입력창 아래에 오류 문구를 보여준다
  function showFieldError(code) {
    el.inputError.textContent = MESSAGES[code];
    el.inputError.hidden = false;
    el.input.setAttribute('aria-invalid', 'true');
  }

  // 입력창 아래 오류 문구를 지운다
  function clearFieldError() {
    el.inputError.textContent = '';
    el.inputError.hidden = true;
    el.input.removeAttribute('aria-invalid');
  }

  // 결과 패널 상태(idle/loading/success/error)를 바꾼다
  function setPanelState(state) {
    el.empty.hidden = state !== 'idle';
    el.loading.hidden = state !== 'loading';
    el.card.hidden = state !== 'success';
    el.error.hidden = state !== 'error';
    isLoading = state === 'loading';
    el.panel.setAttribute('aria-busy', String(isLoading));
    el.analyzeBtn.disabled = isLoading;
    el.clearBtn.disabled = isLoading;
    el.analyzeBtn.textContent = isLoading ? '분석 중…' : '감성 분석하기';
  }

  // 성공 결과를 결과 카드에 그린다
  function renderResult(data) {
    const text = SENTIMENT_TEXT[data.sentiment];
    el.card.dataset.sentiment = data.sentiment;
    el.badge.textContent = text.badge;
    el.label.textContent = text.label;
    el.confidence.textContent = `${data.confidence}%`;
    el.bar.setAttribute('aria-valuenow', String(data.confidence));
    el.reason.textContent = data.reason;
    setPanelState('success');
    el.fill.style.width = '0%';
    void el.fill.offsetWidth; // 막대가 0%에서 늘어나는 전환 효과를 위해 다시 계산
    el.fill.style.width = `${data.confidence}%`;
  }

  // 오류를 결과 패널에 그린다
  function renderError(code) {
    el.errorMessage.textContent = MESSAGES[code] ?? MESSAGES.UNKNOWN_ERROR;
    el.retryBtn.hidden = !RETRYABLE.has(code);
    setPanelState('error');
  }

  // 서버가 보낸 성공 데이터가 규칙에 맞는지 검사한다
  function isValidData(data) {
    return Boolean(data)
      && Object.hasOwn(SENTIMENT_TEXT, data.sentiment)
      && Number.isInteger(data.confidence)
      && data.confidence >= 0
      && data.confidence <= 100
      && typeof data.reason === 'string'
      && data.reason.trim() !== '';
  }

  // 서버에 분석을 요청하고 { ok: true, data } 또는 { ok: false, code }를 돌려준다
  async function requestAnalysis(text) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal
      });
      let json;
      try {
        json = await res.json();
      } catch {
        return { ok: false, code: 'UNKNOWN_ERROR' };
      }
      if (json && json.ok === true && isValidData(json.data)) return { ok: true, data: json.data };
      const code = json?.error?.code;
      return { ok: false, code: Object.hasOwn(MESSAGES, code ?? '') ? code : 'UNKNOWN_ERROR' };
    } catch (err) {
      return { ok: false, code: err.name === 'AbortError' ? 'AI_TIMEOUT' : 'NETWORK_ERROR' };
    } finally {
      clearTimeout(timer);
    }
  }

  // 텍스트를 검사한 뒤 분석을 실행하고 결과를 표시한다
  async function analyze(text) {
    if (isLoading) return;
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      showFieldError('EMPTY_INPUT');
      el.input.focus();
      return;
    }
    if (trimmed.length > MAX_LENGTH) {
      showFieldError('TEXT_TOO_LONG');
      el.input.focus();
      return;
    }
    clearFieldError();
    lastText = trimmed;
    setPanelState('loading');

    const result = await requestAnalysis(trimmed);
    if (result.ok) {
      renderResult(result.data);
      return;
    }
    if (FIELD_ERRORS.has(result.code)) {
      setPanelState('idle');
      showFieldError(result.code);
      return;
    }
    renderError(result.code);
  }

  // 폼 제출(분석 버튼 클릭)을 처리한다
  function handleSubmit(event) {
    event.preventDefault();
    analyze(el.input.value);
  }

  // 입력창에서 Ctrl/⌘ + Enter를 누르면 분석한다 (한글 조합 중에는 무시)
  function handleKeydown(event) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.isComposing) {
      event.preventDefault();
      analyze(el.input.value);
    }
  }

  // 입력할 때마다 글자 수를 갱신하고, 내용이 생기면 입력 오류를 지운다
  function handleInput() {
    updateCharCount();
    if (!el.inputError.hidden && el.input.value.trim() !== '') clearFieldError();
  }

  // 입력·결과·오류를 모두 지우고 처음 상태로 돌아간다
  function handleClear() {
    el.input.value = '';
    lastText = '';
    updateCharCount();
    clearFieldError();
    setPanelState('idle');
    el.input.focus();
  }

  // 마지막으로 보낸 텍스트로 다시 요청한다
  function handleRetry() {
    if (lastText) analyze(lastText);
  }

  el.form.addEventListener('submit', handleSubmit);
  el.input.addEventListener('input', handleInput);
  el.input.addEventListener('keydown', handleKeydown);
  el.clearBtn.addEventListener('click', handleClear);
  el.retryBtn.addEventListener('click', handleRetry);

  updateCharCount();
  setPanelState('idle');
})();
