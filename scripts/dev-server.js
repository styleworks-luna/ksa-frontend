#!/usr/bin/env node
/**
 * FE 단독 로컬 개발 서버 (의존성 없음)
 *
 * - 프로젝트 루트를 정적 파일로 서빙 (/js/common.js 같은 루트 절대경로 지원)
 * - /api/** 요청은 원격 백엔드(API_TARGET)로 프록시
 *
 * js/common.js 는 localhost/127.0.0.1 에서 접속하면 base_url 을 http://127.0.0.1:8888 로 고정하므로,
 * 이 서버를 8888 포트로 띄우면 소스 수정 없이 FE 단독 구동이 가능하다.
 * (브라우저에서는 반드시 http://127.0.0.1:8888 으로 접속 — 동일 출처가 되어 CORS/토큰 이슈 없음)
 *
 * 환경변수
 *   PORT        (기본 8888)
 *   API_TARGET  (기본 https://api-ksa.styleworks.kr)
 */
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || 8888);
const API_TARGET = new URL(process.env.API_TARGET || "https://api-ksa.styleworks.kr");

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".map": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".otf": "font/otf",
    ".eot": "application/vnd.ms-fontobject",
    ".pdf": "application/pdf",
    ".mp4": "video/mp4",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

function proxy(req, res) {
    const client = API_TARGET.protocol === "https:" ? https : http;
    const headers = { ...req.headers, host: API_TARGET.host };
    // 동일 출처 요청으로 보이게 해서 백엔드 CORS 검사를 피한다
    delete headers.origin;
    delete headers.referer;

    const upstream = client.request(
        {
            protocol: API_TARGET.protocol,
            hostname: API_TARGET.hostname,
            port: API_TARGET.port || undefined,
            method: req.method,
            path: req.url,
            headers,
        },
        (up) => {
            const outHeaders = { ...up.headers };
            for (const h of Object.keys(outHeaders)) {
                if (h.startsWith("access-control-")) delete outHeaders[h];
            }
            // 원격 쿠키의 Domain/Secure 속성 제거 (로컬 http 에서 저장되도록)
            if (outHeaders["set-cookie"]) {
                outHeaders["set-cookie"] = outHeaders["set-cookie"].map((c) =>
                    c.replace(/;\s*Domain=[^;]*/gi, "").replace(/;\s*Secure/gi, "").replace(/;\s*SameSite=None/gi, "")
                );
            }
            res.writeHead(up.statusCode || 502, outHeaders);
            up.pipe(res);
        }
    );
    upstream.on("error", (err) => {
        console.error(`[proxy] ${req.method} ${req.url} -> ${err.message}`);
        if (!res.headersSent) res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(`Proxy error: ${err.message}`);
    });
    req.pipe(upstream);
}

function serveStatic(req, res) {
    let pathname;
    try {
        pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
        res.writeHead(400);
        return res.end("Bad Request");
    }
    let filePath = path.normalize(path.join(ROOT, pathname));
    if (!filePath.startsWith(ROOT) || /[\\/]\.(git|idea)([\\/]|$)/.test(filePath)) {
        res.writeHead(403);
        return res.end("Forbidden");
    }

    fs.stat(filePath, (err, stat) => {
        if (!err && stat.isDirectory()) {
            if (!pathname.endsWith("/")) {
                res.writeHead(301, { Location: pathname + "/" });
                return res.end();
            }
            filePath = path.join(filePath, "index.html");
        }
        fs.readFile(filePath, (err2, data) => {
            if (err2) {
                res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
                return res.end(`404 Not Found: ${pathname}`);
            }
            res.writeHead(200, {
                "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream",
                "Cache-Control": "no-cache",
            });
            res.end(data);
        });
    });
}

http
    .createServer((req, res) => {
        if (req.url.startsWith("/api/")) {
            console.log(`[api] ${req.method} ${req.url}`);
            return proxy(req, res);
        }
        serveStatic(req, res);
    })
    .listen(PORT, "127.0.0.1", () => {
        console.log(`KSA frontend dev server`);
        console.log(`  site  : http://127.0.0.1:${PORT}/index.html`);
        console.log(`  admin : http://127.0.0.1:${PORT}/admin/login.html`);
        console.log(`  /api  -> ${API_TARGET.origin}`);
    })
    .on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`포트 ${PORT} 가 이미 사용 중입니다. (로컬 백엔드가 떠 있나요?) PORT 환경변수로 변경 가능`);
        } else {
            console.error(err);
        }
        process.exit(1);
    });
