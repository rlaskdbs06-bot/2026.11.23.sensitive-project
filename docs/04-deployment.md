# 04. Vercel 배포 지침

이 문서는 **Step 6(배포 준비)** 과 그 뒤 **사용자가 직접 하는 배포**에 사용합니다.
에이전트는 §1까지 준비하고, §2부터는 사용자가 진행합니다 (계정 로그인과 비밀값 입력이 필요하기 때문).

> Vercel·GitHub·OpenAI의 메뉴 이름과 화면 배치는 바뀔 수 있습니다. 이 문서와 다르게 보이면 비슷한 이름의 메뉴를 찾거나, 화면을 에이전트에게 설명하고 물어보세요.

---

## 1. 배포 전 점검 (에이전트가 확인)

- [ ] `vercel.json`, `.vercelignore`, `.gitignore`가 docs/01 §3과 글자 그대로 같다.
- [ ] `package.json`에 `build` 명령과 `dependencies`가 없다.
- [ ] `public/index.html`, `public/css/style.css`, `public/js/app.js`, `api/analyze.js`가 있다.
- [ ] docs/05의 S1~S4(보안 점검) 통과.
- [ ] 로컬에서 docs/05 §2 자동 검사가 모두 PASS 또는 WARN.

**Vercel이 이 프로젝트를 읽는 방식**

| 폴더/파일 | Vercel에서 |
|---|---|
| `public/` | 웹사이트 파일로 제공 (`vercel.json`의 `outputDirectory`) |
| `api/analyze.js` | 서버 함수로 실행, 주소 `/api/analyze` |
| `scripts/`, `docs/`, `.env` | 업로드 제외 (`.vercelignore`) |

---

## 2. GitHub에 올리기 (사용자)

1. GitHub에서 새 저장소(Repository)를 만든다. 이름 예: `sentiment-lab`. 공개 여부는 자유 (API 키는 올라가지 않음).
2. 프로젝트 폴더를 저장소에 올린다. 터미널을 쓴다면:
   ```
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/내아이디/sentiment-lab.git
   git push -u origin main
   ```
   터미널이 어렵다면 GitHub Desktop 프로그램을 써도 된다.
3. **확인**: GitHub 저장소 화면에 `.env` 파일이 **없어야** 한다. 보이면 즉시 저장소를 지우고, OpenAI에서 그 키를 삭제(revoke)한 뒤 새 키를 만든다.

---

## 3. Vercel에서 프로젝트 만들기 (사용자)

1. https://vercel.com 에 GitHub 계정으로 로그인.
2. **Add New… → Project** → 방금 만든 GitHub 저장소를 **Import**.
3. 설정 화면에서 확인:

| 항목 | 값 |
|---|---|
| Framework Preset | **Other** |
| Root Directory | 비워 둠 (`./`) |
| Build Command | 비워 둠 |
| Output Directory | `public` (`vercel.json`이 지정하므로 비워 둬도 됨) |
| Install Command | 비워 둠 |

4. **Environment Variables**(환경변수)에 두 개를 추가:

| Name | Value |
|---|---|
| `OPENAI_API_KEY` | `sk-`로 시작하는 실제 키 |
| `OPENAI_MODEL` | 로컬 `.env`에 넣은 것과 같은 모델 ID |

   - 이름은 대소문자까지 정확히. 값 앞뒤에 공백·따옴표 없이.
   - 적용 환경(Environment)을 고르는 칸이 있으면 **Production**과 **Preview**를 선택.
5. **Deploy** 클릭 → 완료되면 `https://프로젝트이름.vercel.app` 같은 주소가 생긴다.

---

## 4. 배포 후 확인 (사용자 + 에이전트)

- [ ] 배포 주소에 접속하면 화면이 보인다.
- [ ] 문장을 넣고 분석하면 결과가 나온다.
- [ ] 터미널에서 `npm run test:api -- https://내주소.vercel.app` 실행 → FAIL 0개 (docs/05 §2).
- [ ] 브라우저 개발자 도구(F12) → Network 탭 → `analyze` 요청의 응답에 API 키가 없다.

---

## 5. 환경변수를 바꿨을 때

Vercel에서 환경변수를 추가·수정해도 **이미 배포된 사이트에는 바로 반영되지 않는다.**
수정 후 **Deployments** 화면에서 가장 최근 배포의 메뉴(…) → **Redeploy**를 눌러 다시 배포한다.

모델을 바꿀 때도 `OPENAI_MODEL` 값만 바꾸고 다시 배포하면 된다. 코드는 고치지 않는다.

---

## 6. 문제 해결

| 증상 | 확인할 것 |
|---|---|
| 화면은 뜨는데 분석 시 "서버 설정에 문제가 있어요" | Vercel 환경변수 이름·값, 수정 후 Redeploy 했는지. 프로젝트의 **Logs** 화면에서 `[config]` 또는 `[openai] HTTP 401/404` 기록 확인 |
| "요청이 많거나 사용 한도를 넘었어요" | OpenAI 대시보드에서 결제 수단·잔액(크레딧)·사용 한도 확인 |
| 화면이 404 | `vercel.json`의 `outputDirectory`가 `public`인지, `public/index.html`이 저장소에 올라갔는지 |
| 분석 요청이 404 | `api/analyze.js`가 저장소 **최상위** `api` 폴더에 있는지 |
| 로컬에서는 되는데 배포에서만 안 됨 | 거의 항상 환경변수 문제. §5대로 다시 배포 |

---

## 7. 비용과 안전 (꼭 읽기)

- OpenAI API는 **사용한 만큼 요금**이 나간다. ChatGPT 구독료와는 별개다.
- 배포 주소를 아는 사람은 누구나 분석을 요청할 수 있고, 비용은 키 주인에게 청구된다. 이번 버전에는 요청 횟수 제한이 없다.
- 그래서 **OpenAI 대시보드에서 월 사용 한도(budget/limit)를 낮게 설정**하고, 주소는 필요한 사람에게만 공유한다.
- 키가 유출됐다고 의심되면 OpenAI에서 그 키를 즉시 삭제하고 새 키로 Vercel 환경변수를 바꾼 뒤 Redeploy한다.
