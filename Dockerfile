# 베이스 이미지
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 1. package*.json만 복사
COPY package*.json ./

# 2. 캐시 가능한 npm install
RUN npm ci

# 3. 나머지 소스 복사
COPY . .

# 4. NestJS 빌드
RUN npm run build

# 5. 앱 실행
CMD ["node", "dist/main"]


# (선택) 포트 노출
EXPOSE 3000
