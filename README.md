[사용 기술]
- Adonis.js Framework
- TypeScript
- Node.js
- Docker
- swagger

[설명]

요구사항의 모든 기능을 개발하였습니다. oat를 기반으로한 Adonis.js Auth를 적용하였고, 비밀번호는 Hash 암호화를 적용하였습니다.

모든 API는 Swagger(http://127.0.0.1:3333/docs/index.html)를 통해 실행가능합니다.

EventListener까지 등록하여서 EvnetListener에 나중에 인증코드 발송 로직만  추가하면 인증번호 구현도 쉽게 가능합니다.

[실행방법]
```sh
# 도커실행
docker-compose up -d

# server 컨테이너 접속
docker exsec -it ably_server sh
# 테이블 생성
node ace migration:run
# 서버 시작
node ace serve 

# Swagger에서 API 실행시키시면 됩니다!
http://127.0.0.1:3333/docs/index.html
```