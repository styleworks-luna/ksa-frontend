tests
deploy 


## 로컬 FE 단독 실행

백엔드 없이 원격 API 를 프록시해서 FE 만 띄운다. (Node.js 필요, 추가 설치 없음)

```bash
npm run dev            # /api -> https://api-ksa.styleworks.kr
npm run dev:prod-api   # /api -> https://ceoforum.ksa.or.kr (운영 데이터 주의)
API_TARGET=http://localhost:9000 PORT=8888 npm run dev   # 임의 지정
```

- 사이트: http://127.0.0.1:8888/index.html
- 관리자: http://127.0.0.1:8888/admin/login.html

`js/common.js` 가 localhost 접속 시 API 를 `http://127.0.0.1:8888` 로 호출하므로, dev 서버가 8888 포트에서
정적 파일 + `/api` 프록시를 함께 처리한다. 브라우저 주소는 `localhost` 가 아닌 `127.0.0.1` 을 사용할 것 (동일 출처).

IntelliJ: 실행 구성 `Dev: Server + Site` 실행 (서버 기동 + JS 디버거로 사이트 열기).
