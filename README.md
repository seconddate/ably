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