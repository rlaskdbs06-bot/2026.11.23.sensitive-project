# 01. 프로젝트 생성 지침

이 문서는 **Step 1(프로젝트 뼈대)** 에서 사용합니다. 폴더 구조, 설정 파일, 로컬 실행 방법을 정합니다.

---

## 1. 사용자가 미리 준비할 것 (에이전트가 대신할 수 없음)

| 준비물 | 방법 | 확인 방법 |
|---|---|---|
| Node.js 22 이상 | https://nodejs.org 에서 **LTS** 버전 설치 | 터미널에 `node -v` → `v22.x.x` 이상 |
| OpenAI API 키 | OpenAI 플랫폼(https://platform.openai.com)에 로그인 → API keys 메뉴에서 새 키 생성 → 결제 수단 등록 | `sk-`로 시작하는 문자열을 받음 (한 번만 보이므로 안전한 곳에 보관) |
| 사용할 모델 ID | OpenAI 모델 문서(https://developers.openai.com/api/docs/models)에서 **저렴하고 빠르며 Structured Outputs를 지원하는** 모델을 골라 ID를 복사 | 모델 페이지에 표시된 ID 문자열 (예시를 일부러 적지 않음 — 모델 목록이 자주 바뀌기 때문) |
| GitHub 계정 | https://github.com | 배포 단계(docs/04)에서 필요 |
| Vercel 계정 | https://vercel.com (GitHub로 가입 가능) | 배포 단계에서 필요 |

> 메뉴 이름이나 화면 구성은 각 서비스가 바꿀 수 있습니다. 위 문서의 이름과 다르면 비슷한 메뉴를 찾거나 에이전트에게 화면을 설명해 주세요.

---

## 2. 파일 구조와 각 파일의 역할

```
sentiment-lab/
├── AGENTS.md                작업 규칙
├── PRD.md                   제품 요구사항
├── docs/                    구현 문서
├── public/                  ← 배포 시 이 폴더가 그대로 웹사이트가 됨
│   ├── index.html           화면 뼈대 (docs/02 §7)
│   ├── css/style.css        디자인 (docs/02)
│   └── js/app.js            화면 동작 (docs/03 §7)
├── api/
│   └── analyze.js           감성 분석 서버 코드 → 주소 /api/analyze (docs/03)
├── scripts/
│   ├── dev-server.js        내 컴퓨터에서 실행할 때만 쓰는 서버 (아래 §5)
│   └── test-api.js          API 자동 검사 (docs/05 §2)
├── package.json             프로젝트 정보와 실행 명령
├── vercel.json              Vercel 배포 설정
├── .vercelignore            Vercel에 올리지 않을 파일 목록
├── .gitignore               Git에 올리지 않을 파일 목록
├── .env.example             환경변수 예시 (값은 비워 둠)
└── .env                     실제 비밀값 (사용자가 직접 만듦)
```

**왜 로컬 서버(`dev-server.js`)를 따로 두나요?**
Vercel에서는 `public/` 폴더와 `api/analyze.js`를 자동으로 연결해 줍니다. 내 컴퓨터에는 그런 기능이 없으므로, 같은 연결을 해 주는 작은 서버를 Node.js 기본 기능만으로 만듭니다. 이렇게 하면 Vercel CLI 설치나 로그인 없이도 개발할 수 있습니다.

---

## 3. 설정 파일 (내용을 그대로 사용)

### 3-1. `package.json`

```json
{
  "name": "sentiment-lab",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "dev": "node --env-file=.env scripts/dev-server.js",
    "check": "node --check api/analyze.js && node --check scripts/dev-server.js && node --check scripts/test-api.js && node --check public/js/app.js",
    "test:api": "node scripts/test-api.js"
  }
}
```

- `"type": "module"`: `import`/`export` 문법을 쓰겠다는 표시.
- `dependencies` 항목이 **없어야** 한다 (npm 패키지 0개).
- `build` 명령이 없어야 한다 (빌드 과정 없음).
- `--env-file=.env`: Node.js 내장 기능으로 `.env` 파일을 읽는다. `.env`가 없으면 실행 시 오류가 나므로 먼저 만들어야 한다.

### 3-2. `vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "outputDirectory": "public",
  "functions": {
    "api/analyze.js": {
      "maxDuration": 30
    }
  }
}
```

- `framework: null`: 프레임워크 없음(Vercel 화면의 "Other").
- `outputDirectory: "public"`: `public/` 폴더를 웹사이트로 사용.
- `maxDuration: 30`: 서버 함수가 최대 30초까지 실행될 수 있게 함 (서버는 OpenAI를 20초까지만 기다림).

### 3-3. `.vercelignore`

```
docs/
scripts/
.env
.env.*
```

### 3-4. `.gitignore`

```
node_modules/
.env
.env.*
!.env.example
.vercel/
.DS_Store
Thumbs.db
```

### 3-5. `.env.example`

```
# OpenAI API 키 (sk- 로 시작). 절대 공유하거나 Git에 올리지 마세요.
OPENAI_API_KEY=

# 사용할 OpenAI 모델 ID. https://developers.openai.com/api/docs/models 에서 복사해 넣으세요.
# Structured Outputs를 지원하는 모델이어야 합니다.
OPENAI_MODEL=
```

### 3-6. `.env` (사용자가 직접 만듦)

`.env.example`을 복사해 이름을 `.env`로 바꾸고 `=` 뒤에 실제 값을 붙여 넣는다. 따옴표나 공백 없이 쓴다.

```
OPENAI_API_KEY=sk-여기에_실제_키
OPENAI_MODEL=여기에_모델_ID
```

---

## 4. 처음 만들 때 비워 둘 파일

Step 1에서는 아래처럼 **최소 내용**만 넣고, 실제 내용은 다음 단계에서 채운다.

| 파일 | Step 1 내용 |
|---|---|
| `public/index.html` | docs/02 §7의 HTML 전체 (내용이 있어야 접속 확인 가능) |
| `public/css/style.css` | docs/02 §3의 `@font-face` + §2의 `:root` 토큰만 |
| `public/js/app.js` | `// 화면 동작 (Step 4에서 구현)` 주석 한 줄 |
| `api/analyze.js` | docs/03 §5 참조 코드 전체 |
| `scripts/test-api.js` | `// API 자동 검사 (Step 5에서 구현)` 주석 한 줄 |

---

## 5. 참조 코드: `scripts/dev-server.js` (그대로 사용)

```js
// 로컬 개발 전용 서버: public/ 정적 파일 제공 + /api/analyze 연결 (Vercel 배포에는 쓰이지 않음)
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import handler from '../api/analyze.js';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const PORT = Number(process.env.PORT) || 3000;
const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// /api/analyze 요청을 Vercel과 같은 방식(Web Request)으로 바꿔 핸들러에 전달한다
async function handleApi(req, res, url) {
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const hasBody = !['GET', 'HEAD'].includes(req.method);
    const request = new Request(url, {
      method: req.method,
      headers: { 'content-type': req.headers['content-type'] ?? '' },
      body: hasBody ? Buffer.concat(chunks) : undefined
    });
    const response = await handler.fetch(request);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (err) {
    console.error('[dev-server] API 처리 실패:', err.name);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: false, error: { code: 'AI_UPSTREAM_ERROR', message: '서버 오류' } }));
  }
}

// public/ 폴더 안의 파일만 돌려준다 (폴더 밖 접근 차단)
async function serveStatic(pathname, res) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    res.writeHead(400);
    return res.end('Bad Request');
  }
  let filePath = path.join(PUBLIC_DIR, path.normalize(decoded));
  if (filePath !== PUBLIC_DIR && !filePath.startsWith(PUBLIC_DIR + path.sep)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  if (decoded.endsWith('/')) filePath = path.join(filePath, 'index.html');
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': CONTENT_TYPES[path.extname(filePath)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  if (url.pathname === '/api/analyze') return handleApi(req, res, url);
  return serveStatic(url.pathname, res);
});

server.listen(PORT, () => {
  console.log(`로컬 서버 실행 중: http://localhost:${PORT}`);
});
```

---

## 6. 실행 방법 (사용자용)

1. 프로젝트 폴더에서 터미널을 연다.
2. `.env` 파일이 있는지 확인한다 (§3-6).
3. `npm run dev` 입력 → `로컬 서버 실행 중: http://localhost:3000` 이 보이면 성공.
4. 브라우저에서 http://localhost:3000 접속.
5. 끌 때는 터미널에서 `Ctrl + C`.

`npm install`은 **필요 없다** (설치할 패키지가 없음).

### 자주 나는 문제

| 증상 | 원인 | 해결 |
|---|---|---|
| `.env: not found` 비슷한 오류 | `.env` 파일이 없음 | §3-6대로 `.env` 만들기 |
| `bad option: --env-file` | Node.js 버전이 낮음 | Node.js 22 이상 설치 |
| `EADDRINUSE` | 3000번 포트를 다른 프로그램이 사용 중 | 다른 터미널의 서버를 끄거나 컴퓨터 재시작 |
| 화면에서 "서버 설정에 문제가 있어요" | `.env` 값이 비었거나 틀림 | 키·모델 ID 다시 확인 후 서버 재시작 |

`.env`를 고친 뒤에는 **서버를 껐다 켜야** 반영된다.

---

## 7. Step 1 완료 기준

- [ ] §2 구조대로 파일이 있고, 그 외 파일이 없다.
- [ ] `package.json`, `vercel.json`, `.vercelignore`, `.gitignore`, `.env.example`이 §3과 글자 그대로 같다.
- [ ] `npm run check` 실행 시 오류 없이 끝난다.
- [ ] 사용자에게 `.env` 생성을 요청했다 (Step 1에서는 값이 비어 있어도 서버는 실행됨).
- [ ] `.env`가 있는 상태에서 `npm run dev` 실행 → http://localhost:3000 접속 시 페이지가 열린다.
- [ ] http://localhost:3000/api/analyze 를 브라우저 주소창으로 열면(GET) `METHOD_NOT_ALLOWED` JSON이 보인다.
