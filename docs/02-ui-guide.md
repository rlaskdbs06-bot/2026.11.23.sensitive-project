# 02. UI 구현 지침

이 문서는 **Step 2(정적 UI)** 에서 사용합니다. 색, 글꼴, 간격, 화면 구성, HTML 구조, 반응형, 접근성을 정합니다.
여기 적힌 값 외의 색·크기를 새로 만들지 않습니다.

---

## 1. 디자인 방향

첨부된 디자인 분석 문서(자동차 브랜드 마케팅 사이트 분석)의 **분위기와 수치**를 감성 분석 서비스에 맞게 옮깁니다.

### 1-1. 참고 문서에서 가져오는 것

| 요소 | 적용 |
|---|---|
| 거의 검은 배경 `#181818` (완전한 검정 금지) + 흰 글자 | 페이지 전체 배경 |
| 강조색 빨강 `#da291c` 단 하나, **아껴서** 사용 | 주 버튼(감성 분석하기)과 로고 옆 작은 사각형에만 |
| 날카로운 모서리 0px | 버튼, 카드, 패널 전부. 입력창만 4px, 배지만 알약형 |
| 절제된 굵기: 제목 500, 본문 400 | 제목을 굵게(700) 만들지 않음. 숫자(신뢰도)만 700 |
| 대문자 + 넓은 자간의 작은 영문 라벨 | `AI SENTIMENT ANALYSIS`, `RESULT` 같은 라벨 |
| 8px 단위 간격 체계 (4 ~ 128px) | §2 간격 토큰 |
| 그림자 없음, 밝기 차이로 층 구분 | 카드는 `#303030`, 배경은 `#181818` |
| 노란색 `#f6e500`은 포커스 표시 전용 | 키보드 포커스 테두리 |

### 1-2. 가져오지 않는 것 (상표·저작권 보호)

- 브랜드 이름, 말 로고, 전용 글꼴(FerrariSans) → **Pretendard**로 대체
- 자동차·레이싱 사진, 전체 화면 사진 히어로 → 사진 대신 **어두운 그라데이션 배경**
- F1 순위, 드라이버 카드, 중고차 목록 등 자동차 전용 컴포넌트
- 외부 이미지 파일 일체 (이 프로젝트에는 이미지 파일이 없음)

### 1-3. 한글에 맞춘 조정 (원본과 다른 점)

| 항목 | 원본 | 이 프로젝트 | 이유 |
|---|---|---|---|
| 큰 제목 줄간격 | 1.05~1.2 | 1.25 | 한글은 글자 높이가 높아 줄이 붙어 보임 |
| 본문 줄간격 | 1.5 | 1.6 | 한글 가독성 |
| 버튼 글자 자간 | 1.4px (영문 대문자) | 0.5px | 한글에 넓은 자간은 어색함 |
| 입력창 글자 크기 | 14px | 16px | 아이폰에서 16px 미만 입력창은 확대(zoom)됨 |
| 카드 위 보조 글자색 | `#969696` | `#ffffff` | `#969696`은 `#303030` 위에서 대비 4.46:1로 기준(4.5:1) 미달 |
| 버튼 hover | 문서화 안 됨 | `#b01e0a` (누름 색과 같음) | 마우스 사용자에게 반응 표시 |

---

## 2. 디자인 토큰 (`style.css` 맨 위에 그대로)

```css
:root {
  /* 색상 — 이 목록 외의 hex 사용 금지 */
  --color-accent: #da291c;          /* 주 버튼 배경, 로고 사각형 */
  --color-accent-active: #b01e0a;   /* 주 버튼 hover·누름 */
  --color-canvas: #181818;          /* 페이지 배경 */
  --color-elevated: #303030;        /* 카드·패널 배경, 구분선 */
  --color-hero-top: #3c3c3c;        /* 히어로 그라데이션 시작색 */
  --color-ink: #ffffff;             /* 주요 글자 */
  --color-body: #969696;            /* 보조 글자 (#181818 배경 위에서만) */
  --color-muted: #666666;           /* 입력창 테두리 */
  --color-placeholder: #8f8f8f;     /* 입력창 안내 글자, 비활성 버튼 글자 */
  --color-focus: #f6e500;           /* 키보드 포커스 테두리 */
  --color-positive: #03904a;        /* 긍정 */
  --color-negative: #f13a2c;        /* 부정, 오류 */
  --color-neutral: #969696;         /* 중립 */

  /* 글꼴 */
  --font-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;

  /* 간격 (8px 체계) */
  --space-xxxs: 4px;
  --space-xxs: 8px;
  --space-xs: 16px;
  --space-sm: 24px;
  --space-md: 32px;
  --space-lg: 48px;
  --space-xl: 64px;
  --space-xxl: 96px;
  --space-super: 128px;

  /* 모서리 */
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-full: 9999px;

  /* 너비 */
  --container-max: 1280px;  /* 헤더·히어로·푸터 */
  --content-max: 800px;     /* 입력·결과 영역 */

  /* 움직임 */
  --duration-fast: 150ms;
  --duration-bar: 400ms;
}
```

### 2-1. 색 대비 확인값 (WCAG 2.1 기준, 계산값)

| 글자/요소 | 배경 | 대비 | 사용 가능 범위 |
|---|---|---|---|
| `#ffffff` | `#181818` | 17.76 | 모든 글자 |
| `#969696` | `#181818` | 6.00 | 모든 글자 |
| `#8f8f8f` | `#181818` | 5.49 | 안내 글자(placeholder) |
| `#f13a2c` | `#181818` | 4.55 | 입력 오류 문구(13px 이상) |
| `#666666` | `#181818` | 3.09 | **글자 금지**, 입력창 테두리만 (3:1 이상) |
| `#ffffff` | `#303030` | 13.20 | 카드 안 모든 글자 |
| `#969696` | `#303030` | 4.46 | **카드 안 글자 금지** |
| `#ffffff` | `#da291c` | 4.87 | 주 버튼 글자 |
| `#03904a` / `#f13a2c` / `#969696` | `#303030` | 3.20 / 3.38 / 4.46 | 막대·점·테두리만 (글자 금지) |

---

## 3. 글꼴 (웹폰트)

`style.css`의 `:root` 바로 **위**에 아래 블록을 **글자 그대로** 넣는다.

```css
@font-face {
  font-family: 'Pretendard';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Thin.woff2') format('woff2');
  font-weight: 100;
  font-display: swap;
}
@font-face {
  font-family: 'Pretendard';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-ExtraLight.woff2') format('woff2');
  font-weight: 200;
  font-display: swap;
}
@font-face {
  font-family: 'Pretendard';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Light.woff2') format('woff2');
  font-weight: 300;
  font-display: swap;
}
@font-face {
  font-family: 'Pretendard';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'Pretendard';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Medium.woff2') format('woff2');
  font-weight: 500;
  font-display: swap;
}
@font-face {
  font-family: 'Pretendard';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
}
@font-face {
  font-family: 'Pretendard';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Bold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}
@font-face {
  font-family: 'Pretendard';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-ExtraBold.woff2') format('woff2');
  font-weight: 800;
  font-display: swap;
}
@font-face {
  font-family: 'Pretendard';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Black.woff2') format('woff2');
  font-weight: 900;
  font-display: swap;
}
@font-face {
  font-family: 'PretendardVariable';
  src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/2611030106@font-variable-694/variable-694/PretendardVariable.woff2') format('woff2');
  font-weight: 45 930;
  font-display: swap;
}
/* 가변: font-family: 'PretendardVariable'; font-variation-settings: "wght" 400; */
```

**사용 규칙**
- 모든 요소의 글꼴은 `font-family: var(--font-sans);` (= 고정 굵기 `Pretendard`).
- 실제로 쓰는 굵기는 **400, 500, 600, 700 네 가지뿐**이다. 브라우저는 쓰이는 굵기 파일만 내려받으므로 나머지 선언은 그대로 둬도 된다.
- `PretendardVariable`(가변 글꼴)은 **사용하지 않는다**. 선언만 남겨 둔다.
- 글꼴을 못 불러와도 `font-display: swap` 덕분에 시스템 글꼴로 먼저 보인다.

---

## 4. 글자 스타일

| 이름 | 쓰는 곳 | 크기 (모바일 / 태블릿 / 데스크톱) | 굵기 | 줄간격 | 자간 | 색 |
|---|---|---|---|---|---|---|
| hero-title | 큰 제목 h1 | 32 / 44 / 56px | 500 | 1.25 | -0.02em | ink |
| section-title | "분석 결과" h2 | 22 / 26 / 26px | 500 | 1.4 | 0 | ink |
| result-label | 긍정/부정/중립 | 32 / 36 / 36px | 500 | 1.2 | -0.01em | ink |
| confidence-value | `87%` | 44 / 56 / 56px | 700 | 1.0 | -0.02em | ink, `font-variant-numeric: tabular-nums` |
| reason-title / error-title | "분석 이유" h3 | 18px | 700 | 1.3 | 0 | ink |
| text-lg | 히어로 설명, 분석 이유 본문, 입력창 | 16px | 400 | 1.6 | 0 | 위치별 지정 |
| field-label | "분석할 텍스트" | 16px | 500 | 1.4 | 0 | ink |
| body | 빈 상태·로딩 문구 | 14px | 400 | 1.6 | 0 | 위치별 지정 |
| footer | 푸터 | 13px | 400 | 1.6 | 0 | body |
| caption | 글자 수, 힌트, 안내 문구, 입력 오류 | 13px | 400 | 1.5 | 0 | 위치별 지정 |
| eyebrow | 영문 대문자 라벨 | 11px | 600 | 1.4 | 1.1px, `text-transform: uppercase` | body (카드 안에서는 ink) |
| button | 버튼 글자 | 15px | 700 | 1.0 | 0.5px | 버튼별 지정 |
| wordmark | 헤더 로고 글자 | 13px | 600 | 1.0 | 0.65px, uppercase | ink |

- 모든 글자: `word-break: keep-all;` (한글 단어 중간 줄바꿈 방지), `overflow-wrap: anywhere;` (긴 영문·URL이 넘치지 않게)

---

## 5. 화면 구성

### 5-1. 와이어프레임 (데스크톱)

```
┌──────────────────────────────────────────────────────────────┐
│ ■ SENTIMENT LAB                                [AI ANALYSIS] │ 헤더 64px
├──────────────────────────────────────────────────────────────┤
│░░ 히어로 (회색→검정 그라데이션) ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│  AI SENTIMENT ANALYSIS                                       │
│  문장 속 감정을                                               │
│  읽어드립니다                                                 │
│  텍스트를 입력하면 AI가 긍정·부정·중립을 …                    │
├──────────────────────────────────────────────────────────────┤
│            ┌── 800px ───────────────────────────┐            │
│            │ 분석할 텍스트                        │            │
│            │ ┌────────────────────────────────┐ │            │
│            │ │ textarea                        │ │            │
│            │ └────────────────────────────────┘ │            │
│            │ (입력 오류)                0 / 1,000 │            │
│            │ [■ 감성 분석하기 ] [ 지우기 ]        │            │
│            │ Ctrl + Enter …                      │            │
│            │                                     │            │
│            │ RESULT                              │            │
│            │ 분석 결과                            │            │
│            │ ┌ #303030 패널 ──────────────────┐ │            │
│            │ │▌● POSITIVE                      │ │            │
│            │ │▌긍정                             │ │            │
│            │ │▌CONFIDENCE · 신뢰도              │ │            │
│            │ │▌87%                              │ │            │
│            │ │▌██████████████████░░░            │ │            │
│            │ │▌분석 이유                         │ │            │
│            │ │▌'정말 행복'이라는 표현이 …         │ │            │
│            │ └────────────────────────────────┘ │            │
│            │ 신뢰도는 AI가 스스로 추정한 값이며 … │            │
│            └─────────────────────────────────────┘            │
├──────────────────────────────────────────────────────────────┤
│ SENTIMENT LAB · OpenAI API로 분석합니다.                       │ 푸터
│ 이 서비스는 입력한 텍스트를 저장하지 않습니다. …               │
└──────────────────────────────────────────────────────────────┘
```

### 5-2. 영역별 명세

| 영역 | 배경 | 크기·간격 | 내용 |
|---|---|---|---|
| 헤더 `.site-header` | canvas, 아래 1px elevated 선 | 높이 64px, 좌우 padding: 모바일 16 / 그 외 24px | 왼쪽: 8×8px accent 사각형 + `SENTIMENT LAB`(간격 8px). 오른쪽: 배지 `AI ANALYSIS` |
| 히어로 `.hero` | `linear-gradient(180deg, var(--color-hero-top) 0%, var(--color-canvas) 100%)` | 위/아래 padding: 모바일 64/32, 태블릿 96/48, 데스크톱 128/64px | eyebrow → (16px) → h1 → (24px) → 설명(text-lg, body색, 최대폭 560px) |
| 분석 영역 `.analyzer` | canvas | 위/아래 padding: 모바일 48/64, 그 외 64/96px. 안쪽 `.content` 최대폭 800px 가운데 정렬, 좌우 padding 16(모바일)/24px | 입력 블록 → (48px) → 결과 블록 |
| 푸터 `.site-footer` | canvas, 위 1px elevated 선 | padding 48px 위아래, 좌우는 헤더와 같음 | footer 스타일 2줄, 줄 사이 8px |

`.container`: `max-width: var(--container-max); margin: 0 auto;` + 위 좌우 padding.

---

## 6. 화면 상태 5가지

결과 패널(`#result-panel`) 안의 4개 요소 중 **항상 정확히 1개만** 보인다. 숨김은 HTML `hidden` 속성으로만 한다 (CSS `display:none` 클래스 사용 금지).

| 상태 | 보이는 요소 | 버튼 | 설명 |
|---|---|---|---|
| `idle` (처음) | `#result-empty` | 분석 버튼 활성 | 첫 화면, [지우기] 후 |
| `loading` | `#result-loading` | 분석 버튼 `disabled`, 글자 "분석 중…" / 지우기 `disabled` | 패널에 `aria-busy="true"` |
| `success` | `#result-card` | 활성 | 결과 표시 |
| `error` | `#result-error` | 활성 | 서버·네트워크 오류 |
| 입력 오류 | (패널 상태는 그대로) `#input-error` 표시 | 활성 | 빈 입력·길이 초과. 입력창 `aria-invalid="true"` |

> `hidden` 속성이 CSS의 `display` 지정에 덮이지 않도록 style.css에 반드시 `[hidden] { display: none !important; }` 를 넣는다.

---

## 7. HTML 구조 (`public/index.html` 전체 — 그대로 사용)

`id`는 JavaScript와 검사에서 쓰이므로 **바꾸지 않는다**.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SENTIMENT LAB — AI 감성 분석</title>
  <meta name="description" content="문장을 입력하면 AI가 긍정·부정·중립과 신뢰도, 판단 이유를 알려드립니다.">
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="stylesheet" href="/css/style.css">
  <script src="/js/app.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#analyzer">본문으로 건너뛰기</a>

  <header class="site-header">
    <div class="container header-inner">
      <a class="wordmark" href="/">
        <span class="wordmark-mark" aria-hidden="true"></span>
        SENTIMENT LAB
      </a>
      <span class="badge-pill">AI ANALYSIS</span>
    </div>
  </header>

  <main>
    <section class="hero" aria-labelledby="hero-title">
      <div class="container">
        <p class="eyebrow">AI SENTIMENT ANALYSIS</p>
        <h1 id="hero-title" class="hero-title">문장 속 감정을<br>읽어드립니다</h1>
        <p class="hero-desc">텍스트를 입력하면 AI가 긍정·부정·중립을 판단하고, 신뢰도와 판단 이유를 함께 알려드립니다.</p>
      </div>
    </section>

    <section id="analyzer" class="analyzer" aria-label="감성 분석" tabindex="-1">
      <div class="content">
        <form id="analyze-form" class="input-block" novalidate>
          <label for="input-text" class="field-label">분석할 텍스트</label>
          <textarea id="input-text" name="text" class="text-input" maxlength="1000" rows="8"
            placeholder="예: 오늘 받은 택배가 생각보다 훨씬 좋아서 기분이 좋아요."
            aria-describedby="input-help input-error"></textarea>
          <div class="field-meta">
            <p id="input-error" class="field-error" role="alert" hidden></p>
            <p class="char-count"><span id="char-count">0</span> / 1,000</p>
          </div>
          <div class="actions">
            <button type="submit" id="analyze-btn" class="btn btn-primary">감성 분석하기</button>
            <button type="button" id="clear-btn" class="btn btn-outline">지우기</button>
          </div>
          <p id="input-help" class="hint">Ctrl + Enter (Mac은 ⌘ + Enter)로도 분석할 수 있어요.</p>
        </form>

        <section class="result-block" aria-labelledby="result-title">
          <p class="eyebrow">RESULT</p>
          <h2 id="result-title" class="section-title">분석 결과</h2>

          <div id="result-panel" class="result-panel" aria-live="polite" aria-busy="false">
            <p id="result-empty" class="result-empty">아직 분석한 내용이 없어요. 텍스트를 입력하고 ‘감성 분석하기’를 눌러 보세요.</p>

            <div id="result-loading" class="result-loading" hidden>
              <span class="loading-bar" aria-hidden="true"></span>
              <p>AI가 문장을 분석하고 있어요…</p>
            </div>

            <article id="result-card" class="result-card" data-sentiment="" hidden>
              <span id="result-badge" class="badge-pill badge-sentiment"></span>
              <p id="result-label" class="result-label"></p>
              <div class="confidence">
                <p class="eyebrow eyebrow-on-card">CONFIDENCE · 신뢰도</p>
                <p id="result-confidence" class="confidence-value"></p>
                <div id="confidence-bar" class="confidence-track" role="meter" aria-label="신뢰도"
                  aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                  <span id="confidence-fill" class="confidence-fill"></span>
                </div>
              </div>
              <div class="reason">
                <h3 class="reason-title">분석 이유</h3>
                <p id="result-reason" class="reason-text"></p>
              </div>
            </article>

            <div id="result-error" class="result-error" hidden>
              <h3 class="error-title">분석하지 못했어요</h3>
              <p id="error-message" class="error-message"></p>
              <button type="button" id="retry-btn" class="btn btn-outline" hidden>다시 시도</button>
            </div>
          </div>

          <p class="disclaimer">신뢰도는 AI가 스스로 추정한 값이며, 결과의 정확도를 보장하지 않습니다.</p>
        </section>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>SENTIMENT LAB · OpenAI API로 분석합니다.</p>
      <p>이 서비스는 입력한 텍스트를 저장하지 않습니다. 단, 분석을 위해 텍스트가 OpenAI 서버로 전송됩니다.</p>
    </div>
  </footer>
</body>
</html>
```

---

## 8. 컴포넌트 스타일 명세

### 8-1. 버튼 `.btn`

| 속성 | `.btn-primary` (감성 분석하기) | `.btn-outline` (지우기, 다시 시도) |
|---|---|---|
| 배경 | `--color-accent` | 투명 |
| 글자색 | `--color-ink` | `--color-ink` |
| 테두리 | 없음 | 1px solid `--color-ink` |
| 높이 | 48px | 48px |
| 좌우 padding | 32px | 31px (테두리 1px 보정) |
| 모서리 | 0 | 0 |
| 글자 | button 스타일 (§4) | 같음 |
| hover / active | 배경 `--color-accent-active` | 배경 `--color-elevated` |
| disabled | 배경 `--color-elevated`, 글자 `--color-placeholder`, `cursor: not-allowed` | 테두리·글자 `--color-placeholder`, `cursor: not-allowed` |
| 전환 | `background-color var(--duration-fast)` | 같음 |

- 버튼 2개는 가로로 나란히, 간격 16px. 모바일(<640px)은 **세로로 쌓고 각각 너비 100%** (주 버튼이 위).

### 8-2. 입력창 `.text-input`

| 속성 | 값 |
|---|---|
| 너비 | 100% |
| 최소 높이 | 모바일 160px / 그 외 200px, `resize: vertical` |
| 배경 | `--color-canvas` |
| 테두리 | 1px solid `--color-muted` |
| 모서리 | `--radius-sm` (4px) |
| padding | 14px 16px |
| 글자 | text-lg (16px / 400 / 1.6), `--color-ink` |
| placeholder | `--color-placeholder` |
| `aria-invalid="true"`일 때 | 테두리 `--color-negative` |
| 라벨과 간격 | 라벨 아래 8px |

`.field-meta`: 입력창 아래 8px, 가로 양끝 정렬(`justify-content: space-between`, 오류 왼쪽 / 글자 수 오른쪽). 글자 수는 caption, body 색. `.field-error`는 caption, `--color-negative`, 앞에 `!` 같은 기호를 붙이지 않는다(문구만).
`.actions`: field-meta 아래 24px. `.hint`: actions 아래 12px, caption, body색.

### 8-3. 배지 `.badge-pill`

배경 `--color-elevated`(헤더) / `--color-canvas`(카드 안 `.badge-sentiment`), 글자 eyebrow 스타일 + ink, 모서리 `--radius-full`, padding 4px 12px, `display: inline-flex; align-items: center; gap: 8px`.
`.badge-sentiment::before`: 8×8px 원(`border-radius: 50%`), 배경 `var(--sentiment-color)`.

### 8-4. 결과 패널 `.result-panel`

배경 `--color-elevated`, 모서리 0, padding 모바일 24px / 그 외 32px, 최소 높이 200px, 제목(h2) 아래 24px. 그림자 없음.
`.result-empty`, `.result-loading p`: body 스타일, ink 색.
`.disclaimer`: 패널 아래 16px, caption, body 색.
`.result-block` 안의 eyebrow → (8px) → h2.

### 8-5. 로딩 `.loading-bar`

높이 2px, 너비 100%, 배경 `--color-canvas`, 그 안에서 너비 30%의 `--color-ink` 막대가 왼쪽→오른쪽으로 1.2초마다 반복 이동(`@keyframes`, `::after`로 구현). 막대 아래 16px에 문구.
`prefers-reduced-motion: reduce`이면 애니메이션 없이 막대를 멈춘 상태로 표시.

### 8-6. 결과 카드 `.result-card`

- 감성별 색 변수:
  ```css
  .result-card[data-sentiment="positive"] { --sentiment-color: var(--color-positive); }
  .result-card[data-sentiment="negative"] { --sentiment-color: var(--color-negative); }
  .result-card[data-sentiment="neutral"]  { --sentiment-color: var(--color-neutral); }
  ```
- 왼쪽 테두리 4px solid `var(--sentiment-color)`, 왼쪽 padding 24px (모바일 16px).
- 세로 순서와 간격: 배지 → (16px) → `.result-label` → (32px) → `.confidence` → (32px, 위에 1px `--color-canvas` 구분선 + 위 padding 32px) → `.reason`
- `.eyebrow-on-card`: eyebrow 스타일, 색은 **ink**. 아래 8px.
- `.confidence-value`: 아래 16px.
- `.confidence-track`: 높이 8px, 배경 `--color-canvas`, 모서리 0, 너비 100%.
- `.confidence-fill`: `display:block; height:100%;` 배경 `var(--sentiment-color)`, 너비는 JS가 `style.width = '87%'`로 지정, `transition: width var(--duration-bar) ease-out` (reduced-motion이면 transition 없음).
- `.reason-title` 아래 8px, `.reason-text`: text-lg, ink.

### 8-7. 오류 카드 `.result-error`

왼쪽 테두리 4px solid `--color-negative`, 왼쪽 padding 24px(모바일 16px). `.error-title`(18/700, ink) → (8px) → `.error-message`(text-lg, ink) → (24px) → [다시 시도] 버튼.
부정 결과와 헷갈리지 않도록 배지·신뢰도를 표시하지 않고, 제목 "분석하지 못했어요"를 항상 보여준다.

### 8-8. 기타

- `.skip-link`: 평소에는 화면 밖(`position:absolute; left:-9999px`), 포커스되면 왼쪽 위(16px, 16px)에 accent 배경·ink 글자로 나타남.
- `body`: 배경 canvas, 글자 ink, `font-family: var(--font-sans)`, `margin: 0`, `-webkit-font-smoothing: antialiased`.
- `box-sizing: border-box`를 모든 요소에 적용. 기본 margin 초기화(`h1, h2, h3, p { margin: 0; }`).

---

## 9. 반응형

모바일 먼저 작성하고 `min-width` 미디어 쿼리로 넓힌다.

| 이름 | 폭 | 미디어 쿼리 |
|---|---|---|
| 모바일 | 0 ~ 639px | (기본) |
| 태블릿 | 640 ~ 1023px | `@media (min-width: 640px)` |
| 데스크톱 | 1024px 이상 | `@media (min-width: 1024px)` |

크기가 바뀌는 값은 §4, §5-2, §8에 모두 적혀 있다. 그 외 값은 화면 폭과 관계없이 같다.
360px 폭에서 가로 스크롤이 생기면 안 된다.

---

## 10. 접근성

- [ ] `<html lang="ko">`
- [ ] 모든 입력에 `<label>` 연결 (`for="input-text"`)
- [ ] 키보드 포커스: `:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }` — 버튼, 입력창, 링크 전부. `outline: none`만 쓰고 대체 표시를 안 하는 것 금지
- [ ] 결과 패널 `aria-live="polite"`: 결과·오류가 나타나면 스크린리더가 읽음
- [ ] 입력 오류 `#input-error`는 `role="alert"`
- [ ] 신뢰도 막대 `role="meter"` + `aria-valuenow` 갱신
- [ ] 색만으로 의미 전달 금지: 감성은 글자(긍정)·배지(POSITIVE)로도 표시
- [ ] 버튼·입력 터치 영역 높이 48px 이상
- [ ] `@media (prefers-reduced-motion: reduce)`에서 애니메이션·전환 제거
- [ ] §2-1 대비표 위반 없음

---

## 11. Step 2 완료 기준

- [ ] §7 HTML이 글자 그대로 들어가 있다.
- [ ] `style.css`에 §3 → §2 순서로 블록이 있고, 그 아래 컴포넌트 스타일이 있다.
- [ ] `style.css`에서 §2에 없는 hex 색상이 검색되지 않는다.
- [ ] 개발자 도구에서 `hidden` 속성을 바꿔 5가지 상태(§6)를 각각 눈으로 확인했다. (결과 카드는 임시로 텍스트를 넣어 확인 후 원래대로 되돌린다)
- [ ] docs/05의 U1, U12, U13이 통과한다.
