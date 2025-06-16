# 1. Node.js 기반 이미지 사용 (버전은 프로젝트에 맞게 선택)
FROM node:20-alpine

# 2. 앱 디렉토리 생성
WORKDIR /app

# 3. 종속성 설치용 파일 복사
COPY package*.json ./

# 4. 종속성 설치
RUN npm install

# 5. NestJS 코드 전체 복사
COPY . .

# 6. 앱 빌드
RUN npm run build

# 7. 앱 실행
CMD ["node", "dist/main"]

# (선택) 포트 노출
EXPOSE 3000
