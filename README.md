# ably 사전과제

## 사용한 기술
```
Adonis.js(v5)
Node.js(v18.12.1)
TypeScript(v4.6)
```
## Database는 Local Mysql(v5,7)을 이용해주세요.
```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=ably
MYSQL_PASSWORD=ably1234!
MYSQL_DB_NAME=ably
```

## DB 스키마 마이그레이션
```bash
node ace migration:run # 마이그레이션 실행
node ace migration:rollback # 롤백이 필요할 경우
```


