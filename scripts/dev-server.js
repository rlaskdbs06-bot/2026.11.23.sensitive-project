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
