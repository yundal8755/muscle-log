# Muscle Log API 🏋️

운동 기록 관리를 위한 NestJS 백엔드 API 서버입니다.

## 기술 스택

- **NestJS**: Node.js 프레임워크
- **Prisma**: ORM (Object-Relational Mapping)
- **PostgreSQL**: 데이터베이스
- **Swagger**: API 문서화

## 사전 준비사항

### 1. PostgreSQL 설치 (macOS)
```bash
# Homebrew로 PostgreSQL 설치
brew install postgresql@14

# PostgreSQL 서비스 시작
brew services start postgresql@14
```

### 2. 데이터베이스 생성
```bash
# PostgreSQL에 접속
psql postgres

# muscle_log 데이터베이스 생성
CREATE DATABASE muscle_log;

# 종료
\q
```

## 설치 및 실행

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일이 이미 생성되어 있습니다. 필요시 데이터베이스 연결 정보를 수정하세요:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/muscle_log?schema=public"
PORT=3000
```

> **주의**: PostgreSQL 사용자명과 비밀번호를 본인의 설정에 맞게 변경하세요!

### 3. Prisma 설정

#### Prisma Client 생성
```bash
npm run prisma:generate
```

#### 데이터베이스 마이그레이션
```bash
npm run prisma:migrate
```
마이그레이션 이름을 입력하라고 하면 `init`이라고 입력하세요.

### 4. 서버 실행

#### 개발 모드로 서버 시작
```bash
npm run start:dev
```

서버가 실행되면:
- **API 서버**: http://localhost:3000
- **Swagger 문서**: http://localhost:3000/api

## API 엔드포인트

### 운동 기록 생성 (POST)
```http
POST /workouts
Content-Type: application/json

{
  "exerciseName": "벤치프레스",
  "sets": 3,
  "reps": 10,
  "weight": 60.5,
  "date": "2026-02-14T10:00:00.000Z",
  "memo": "오늘 컨디션 좋았음"
}
```

### 모든 운동 기록 조회 (GET)
```http
GET /workouts
```

### 특정 운동 기록 조회 (GET)
```http
GET /workouts/:id
```

## Swagger로 쉽게 테스트하기 🎯

1. 브라우저에서 http://localhost:3000/api 접속
2. `POST /workouts`를 클릭
3. **"Try it out"** 버튼 클릭
4. Request body에 아래 예시 데이터 입력:
```json
{
  "exerciseName": "스쿼트",
  "sets": 4,
  "reps": 12,
  "weight": 80,
  "memo": "무릎이 조금 아팠음"
}
```
5. **"Execute"** 버튼 클릭하여 API 테스트
6. 응답 결과 확인
7. `GET /workouts`로 방금 생성한 데이터 조회해보기

## 유용한 명령어

```bash
# Prisma Studio 실행 (데이터베이스 GUI 툴)
npm run prisma:studio

# 코드 포맷팅
npm run format

# 린트 체크
npm run lint

# 테스트
npm run test
```

## 프로젝트 구조

```
src/
├── main.ts                    # 진입점, Swagger 설정
├── app.module.ts              # 루트 모듈
├── prisma/                    # Prisma 관련
│   ├── prisma.module.ts      # Prisma 모듈 (전역)
│   └── prisma.service.ts     # Prisma 서비스 (DB 연결 관리)
└── workouts/                  # 운동 기록 모듈
    ├── dto/
    │   └── create-workout.dto.ts    # 요청 데이터 검증
    ├── entities/
    │   └── workout.entity.ts        # 응답 데이터 형식
    ├── workouts.controller.ts       # API 엔드포인트
    ├── workouts.service.ts          # 비즈니스 로직
    └── workouts.module.ts           # 모듈 설정
```

## 각 파일 설명 📝

### Prisma 관련
- **prisma.service.ts**: PostgreSQL 데이터베이스와의 연결을 관리
- **prisma.module.ts**: Prisma를 전역 모듈로 설정하여 다른 모듈에서 사용 가능하게 함

### Workouts 모듈
- **create-workout.dto.ts**: API 요청 시 데이터 유효성 검사 (예: 세트 수는 1 이상이어야 함)
- **workout.entity.ts**: API 응답 데이터의 형태를 정의하고 Swagger 문서 생성
- **workouts.controller.ts**: API 엔드포인트 정의 (POST /workouts, GET /workouts 등)
- **workouts.service.ts**: 실제 데이터베이스 작업 수행 (생성, 조회)
- **workouts.module.ts**: 컨트롤러와 서비스를 연결

### 설정 파일
- **main.ts**: Swagger 설정, ValidationPipe 설정 (자동 유효성 검사)
- **app.module.ts**: 모든 모듈을 하나로 묶는 루트 모듈

## 트러블슈팅 🔧

### 데이터베이스 연결 오류
```bash
# PostgreSQL 상태 확인
brew services list

# PostgreSQL 재시작
brew services restart postgresql@14

# 데이터베이스 목록 확인
psql -l
```

### Prisma 관련 오류
```bash
# Prisma Client 재생성
npm run prisma:generate

# 마이그레이션 상태 확인
npx prisma migrate status

# 마이그레이션 리셋 (주의: 모든 데이터 삭제됨!)
npx prisma migrate reset
```

### Port 이미 사용 중 오류
```bash
# 3000 포트 사용 중인 프로세스 확인
lsof -i :3000

# 프로세스 종료 (PID는 위 명령어 결과에서 확인)
kill -9 <PID>
```

## 학습 포인트 💡

이 프로젝트를 통해 배울 수 있는 것들:

1. **NestJS 기본 구조**: 모듈, 컨트롤러, 서비스의 역할
2. **Prisma ORM**: TypeScript로 타입 안전하게 DB 작업하기
3. **DTO와 Validation**: 요청 데이터 검증 자동화
4. **Swagger**: API 문서 자동 생성 및 테스트
5. **PostgreSQL**: 관계형 데이터베이스 사용법

## 다음 단계 🚀

- [ ] UPDATE, DELETE API 추가 (운동 기록 수정/삭제)
- [ ] 날짜별 운동 기록 필터링
- [ ] 운동별 통계 기능 (최고 무게, 총 세트 수 등)
- [ ] 사용자 인증 기능 (JWT)
- [ ] Flutter 앱과 연동하여 모바일 앱 완성

## VS Code 추천 익스텐션

- **Prisma** (Prisma.prisma): Prisma 스키마 파일 하이라이팅
- **REST Client** (humao.rest-client): HTTP 요청 테스트
- **Thunder Client** (rangav.vscode-thunder-client): API 테스트 툴
- **ESLint** (dbaeumer.vscode-eslint): 코드 품질 체크

## 참고 자료

- [NestJS 공식 문서](https://docs.nestjs.com)
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [Swagger 가이드](https://docs.nestjs.com/openapi/introduction)
