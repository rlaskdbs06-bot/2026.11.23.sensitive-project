# AGENTS.md — 작업 규칙

이 파일은 AI 코딩 에이전트가 이 프로젝트에서 **반드시 지켜야 하는 규칙**입니다.
무엇을 만드는지는 `PRD.md`, 어떻게 만드는지는 `docs/` 폴더에 있습니다.
사용자(프로젝트 주인)는 **비전공자**입니다.

---

## 0. 가장 중요한 원칙 6가지

1. **문서에 없는 것은 만들지 않는다.** 기능, 화면, 파일, 라이브러리를 임의로 추가하지 않는다.
2. **추측하지 않는다.** 문서에 답이 없으면 작업을 멈추고 §7 형식으로 사용자에게 질문한다.
3. **API 키는 절대 브라우저 코드에 넣지 않는다.** OpenAI 호출은 서버 파일 `api/analyze.js`에서만 한다.
4. **한 단계씩 만들고, 단계마다 검증한다.** §5 순서를 지키고, 각 단계의 완료 기준을 통과한 뒤 보고한다.
5. **각 단계가 끝나면 사용자 확인을 기다린다.** 사용자가 "다음"이라고 하기 전에는 다음 단계로 넘어가지 않는다.
6. **확인하지 않은 것을 "완료"라고 말하지 않는다.** 실행하지 못한 검증은 "미검증"과 이유를 적는다.

---

## 1. 문서 읽는 순서와 우선순위

| 순서 | 파일 | 담긴 내용 |
|---|---|---|
| 1 | `AGENTS.md` | 작업 규칙 (이 파일) |
| 2 | `PRD.md` | 제품 요구사항, 범위, 완료 기준 |
| 3 | `docs/01-project-setup.md` | 폴더 구조, 설정 파일, 로컬 실행 |
| 4 | `docs/02-ui-guide.md` | 디자인 토큰, 화면 구성, HTML 구조, 반응형, 접근성 |
| 5 | `docs/03-feature-spec.md` | API 규격, OpenAI 호출, 오류 처리, 프론트 동작 |
| 6 | `docs/04-deployment.md` | Vercel 배포 |
| 7 | `docs/05-test-checklist.md` | 검증 항목 전체 |

- 문서끼리 내용이 다르면 **위 표에서 더 위에 있는 문서**를 따른다. 그리고 단계 보고에 "문서 충돌: A 문서 ○○ vs B 문서 ○○, A를 따름"이라고 적는다.
- 어느 문서에도 답이 없으면 따르지 말고 **질문**한다.

---

## 2. 기술 스택 (고정 — 바꾸지 말 것)

| 구분 | 사용 기술 | 비고 |
|---|---|---|
| 화면(프론트엔드) | HTML5, CSS3, JavaScript(바닐라) | 프레임워크 없음, 빌드 과정 없음 |
| 서버(백엔드) | Node.js 22 이상, Vercel Function 1개 | `api/analyze.js`, Web 표준 `fetch` 핸들러 |
| AI | OpenAI **Responses API** | `POST https://api.openai.com/v1/responses`, Node 내장 `fetch`로 직접 호출 |
| 배포 | Vercel | `vercel.json`으로 설정 |
| 글꼴 | Pretendard 웹폰트 | jsDelivr CDN, `docs/02` §3 |
| npm 패키지 | **0개** | `dependencies`, `devDependencies` 모두 없음 |

---

## 3. 금지 사항

- React, Vue, jQuery, Tailwind, Bootstrap 등 **프레임워크·라이브러리 사용**
- `npm install`로 패키지 추가 (openai SDK, express, dotenv 포함). Node 내장 기능만 쓴다.
- TypeScript, Vite, webpack 등 **빌드 도구**
- 데이터베이스, 로그인, 분석 기록 저장, 쿠키, `localStorage`
- **OpenAI 모델 이름을 코드에 직접 쓰기** → 반드시 환경변수 `OPENAI_MODEL`에서 읽는다
- `docs/03` §3에 없는 OpenAI 요청 파라미터 추가 (`temperature`, `reasoning`, `max_output_tokens` 등 — 모델에 따라 오류가 날 수 있음)
- 사용자가 입력한 텍스트나 API 키를 `console.log`/`console.error`로 **출력**
- AI 응답이나 사용자 입력을 `innerHTML`로 화면에 넣기 → **`textContent`만 사용**
- 오류 문구를 새로 지어내기 → `docs/03` §6 표의 문구를 **글자 그대로** 사용
- `docs/02` §2에 없는 색상 hex 값 사용
- 디자인 참고 문서의 **브랜드 요소 사용**: 브랜드 이름, 말 로고, 전용 글꼴(FerrariSans), 자동차·레이싱 사진, F1 관련 컴포넌트. 참고 문서에서는 색·간격·모서리·글자 크기 같은 **수치와 분위기만** 가져온다.
- 외부 이미지, 아이콘 폰트, 이모지를 UI 요소로 사용
- §4 파일 구조에 없는 파일·폴더 생성

---

## 4. 파일 구조 (이 외의 파일은 만들지 않는다)

```
sentiment-lab/
├── AGENTS.md
├── PRD.md
├── docs/                    # 구현 문서 (수정 금지, 사용자만 수정)
├── public/                  # 브라우저에 그대로 전달되는 파일
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── api/
│   └── analyze.js           # 감성 분석 API (Vercel Function)
├── scripts/
│   ├── dev-server.js        # 로컬 개발용 서버 (배포에 쓰이지 않음)
│   └── test-api.js          # API 자동 검사 스크립트
├── package.json
├── vercel.json
├── .vercelignore
├── .gitignore
├── .env.example             # 환경변수 예시 (값 비움, Git에 올림)
└── .env                     # 실제 키 (사용자가 직접 만듦, Git에 올리지 않음)
```

`.env`는 에이전트가 만들거나 내용을 읽지 않는다. 필요하면 사용자에게 만들어 달라고 요청한다.

---

## 5. 작업 순서와 단계별 완료 기준

| 단계 | 할 일 | 참고 문서 | 완료 기준 |
|---|---|---|---|
| Step 1 | 프로젝트 뼈대 | docs/01 | `npm run check` 통과, `npm run dev` 실행 후 http://localhost:3000 접속 시 페이지가 열림 |
| Step 2 | 화면(정적 UI) | docs/02 | docs/05의 U1, U12, U13 통과. 5가지 상태(§docs/02 6장)를 `hidden` 전환으로 확인 가능 |
| Step 3 | 서버 API | docs/03 §1~§6 | docs/05의 A4~A8 통과 (OpenAI 키 없이도 확인 가능한 항목) |
| Step 4 | 화면과 API 연결 | docs/03 §7 | 사용자가 `.env`를 만든 뒤 docs/05의 A1~A3, U2~U11, U14~U15 통과 |
| Step 5 | 자동 검사 스크립트 | docs/05 §2 | `npm run test:api` 실행 시 모든 항목 PASS |
| Step 6 | 배포 준비 | docs/04 | `vercel.json`, `.vercelignore`, `.gitignore` 내용이 문서와 같음, docs/05 S1~S4 통과 |
| Step 7 | 최종 점검 | docs/05 | 필수 항목 전부 PASS 또는 "미검증 + 사유" 기재 |

- 실제 Vercel 배포(계정 로그인, 환경변수 입력)는 **사용자가** docs/04를 보고 진행한다. 에이전트는 준비까지만 한다.
- OpenAI 키가 필요한 검사를 키 없이 "통과"로 처리하지 않는다.

---

## 6. 코드 작성 규칙

- 들여쓰기 2칸, 세미콜론 사용, 문자열은 작은따옴표
- 이름: 변수·함수 `camelCase`, 상수 `UPPER_SNAKE_CASE`, CSS 클래스 `kebab-case`
- 모든 함수 바로 위에 **무슨 일을 하는지 한국어 한 줄 주석**
- 색·간격·글자 크기는 CSS 변수(`var(--...)`)로만 쓴다
- `docs/02` §7의 HTML `id`는 이름을 바꾸지 않는다 (검사에 사용됨)
- 비밀값은 `process.env`로만 읽는다
- `docs/01`, `docs/03`에 "참조 코드"로 제시된 코드는 **그대로** 사용한다. 고쳐야 할 이유가 있으면 고치기 전에 질문한다.

---

## 7. 질문과 보고 형식

**질문할 때**

```
[확인 필요] 무엇이 불명확한지 한 문장
- 선택지 A: …
- 선택지 B: …
- 추천: A (이유 한 줄)
```

**단계를 마쳤을 때**

```
[Step N 완료]
- 만든/수정한 파일: …
- 검증: 실행한 명령 또는 확인 방법 → 결과 (PASS / FAIL / 미검증+사유)
- 문서와 다르게 한 점: 없음 (있으면 무엇을, 왜)
- 사용자가 할 일: 없음 (있으면 쉬운 말로 순서대로)
- 다음 단계: Step N+1 — 진행할까요?
```

- 보고와 설명은 한국어로 한다. 전문 용어는 처음 나올 때 괄호로 한 줄 풀이를 붙인다. 예: 환경변수(프로그램 밖에 따로 보관하는 설정값)

---

## 8. 완료의 정의

아래를 모두 만족해야 프로젝트가 "완료"다.

- [ ] `PRD.md` §8 수용 기준을 모두 충족
- [ ] `docs/05-test-checklist.md`의 필수 항목 PASS (미검증 항목은 사유 기재)
- [ ] 브라우저 콘솔 오류 0개
- [ ] `public/`, `api/`, `scripts/` 어디에도 API 키 문자열이 없음
- [ ] `package.json`에 `dependencies`, `devDependencies`가 없음
- [ ] §4 외의 파일이 없음
