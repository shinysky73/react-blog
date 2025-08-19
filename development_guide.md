# React & NestJS 인증 앱: 단계별 개발 가이드

이 문서는 React(Vite), NestJS, Prisma, Zustand를 사용하여 사용자 인증 기능을 처음부터 구축하는 전체 과정을 상세히 안내합니다. 각 단계별로 사용된 프롬프트와 명령어를 포함하여 누구나 쉽게 따라 할 수 있도록 구성했습니다.

---

## 🏁 0단계: 프로젝트 초기 설정

### 1. 프로젝트 구조 생성

> **사용자 프롬프트:**
> 
> ```
> /sg:task @workflow.md 파일에 따라 단계별로 개발을 진행해보자.
> ```

이 프롬프트에 따라 먼저 백엔드와 프론트엔드 프로젝트를 생성하고 pnpm 워크스페이스를 설정합니다.

```bash
# 1. NestJS 백엔드 프로젝트 생성
pnpm dlx @nestjs/cli new backend --skip-git --package-manager=pnpm

# 2. React + Vite 프론트엔드 프로젝트 생성
pnpm create vite frontend --template react-ts

# 3. pnpm 워크스페이스 설정 파일 생성
# pnpm-workspace.yaml
echo "packages:\n  - 'frontend'\n  - 'backend'" > pnpm-workspace.yaml

# 4. 전체 의존성 설치
pnpm install
```

---

## ⚙️ 1단계: 백엔드 API 구현

### 2. 데이터베이스 및 Prisma 설정

```bash
# 1. 백엔드에 Prisma 라이브러리 추가
pnpm --filter backend add prisma

# 2. Prisma 초기화 (PostgreSQL 사용)
pnpm --filter backend exec prisma init --datasource-provider postgresql
```

**`backend/prisma/schema.prisma` 파일 수정:** `User` 모델을 추가합니다.

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**`backend/.env` 파일 생성 및 수정:** 데이터베이스 연결 URL을 추가합니다.

```env
DATABASE_URL="postgresql://postgres:post1234@localhost:5432/react?schema=public"
JWT_SECRET="your-super-secret-key-that-is-long-and-random" # JWT 시크릿 키도 미리 추가
```

**데이터베이스 마이그레이션 실행:**

```bash
pnpm --filter backend exec prisma migrate dev --name init
```

### 3. 인증 모듈 및 API 구현

```bash
# 1. Auth 모듈, 서비스, 컨트롤러 생성
pnpm --filter backend exec nest g module auth
pnpm --filter backend exec nest g service auth --no-spec
pnpm --filter backend exec nest g controller auth --no-spec

# 2. 비밀번호 해싱을 위한 bcrypt 설치
pnpm --filter backend add bcrypt && pnpm --filter backend add -D @types/bcrypt

# 3. Prisma 서비스를 위한 모듈/서비스 생성 및 의존성 주입 설정
pnpm --filter backend exec nest g module prisma --no-spec
pnpm --filter backend exec nest g service prisma --no-spec
# (이후 코드 수정을 통해 PrismaService를 PrismaModule로 분리하고 AuthModule에 주입)

# 4. DTO 유효성 검사를 위한 class-validator 설치
pnpm --filter backend add class-validator class-transformer

# 5. JWT 및 Passport 관련 라이브러리 설치
pnpm --filter backend add @nestjs/jwt @nestjs/passport passport passport-jwt
pnpm --filter backend add -D @types/passport-jwt

# 6. 환경변수 관리를 위한 @nestjs/config 설치
pnpm --filter backend add @nestjs/config
```

이후 단계별 코드 수정은 이 가이드의 이전 대화 내용을 참조하여 `AuthService`, `AuthController`, `JwtStrategy` 등을 구현하고, `main.ts`에 글로벌 파이프 및 CORS 설정을 추가합니다.

---

## 🎨 2단계: 프론트엔드 UI 개발

### 4. UI 라이브러리 및 스타일링 설정

> **초기 문제:** `tailwindcss` v4 CLI가 `pnpm` 워크스페이스 환경에서 제대로 동작하지 않았습니다.
> 
> **해결:** `tailwindcss` v3로 다운그레이드하여 안정적인 CLI를 사용했습니다.

```bash
# 1. Tailwind CSS v3 및 관련 의존성 설치
pnpm --filter frontend add -D tailwindcss@^3.0.0 postcss autoprefixer

# 2. package.json에 스크립트 추가 (frontend/package.json)
# "scripts": { ... "tailwind:init": "tailwindcss init -p" }

# 3. Tailwind 설정 파일 생성
pnpm --filter frontend run tailwind:init
```

**`frontend/tailwind.config.js` 및 `frontend/src/index.css` 설정**

`tailwind.config.js`의 `content`를 설정하고, `index.css`에 `@tailwind` 지시어를 추가합니다.

### 5. `shadcn/ui` 설정

> **초기 문제:** `tsconfig.json`에 import alias가 없어 `shadcn` 초기화가 실패했습니다.
> 
> **해결:** `tsconfig.app.json`과 `vite.config.ts`에 alias(`@/*`)를 설정했습니다.
> 
> **두 번째 문제:** 회사 네트워크 등에서 `self-signed certificate` 오류 발생.
> 
> **해결:** `NODE_TLS_REJECT_UNAUTHORIZED=0` 환경 변수를 사용하여 SSL 검증을 일시적으로 우회했습니다.

```bash
# 1. tsconfig.app.json 및 vite.config.ts에 alias 추가
# (이전 대화 내용 참조)

# 2. shadcn/ui 초기화 (인증서 오류 시)
NODE_TLS_REJECT_UNAUTHORIZED=0 pnpm dlx shadcn@latest init

# 3. 필요한 컴포넌트 추가 (인증서 오류 시)
NODE_TLS_REJECT_UNAUTHORIZED=0 pnpm dlx shadcn@latest add button input card label
```

### 6. 라우팅 및 페이지 구현

```bash
# 1. react-router-dom 설치
pnpm --filter frontend add react-router-dom
```

이후 `src/pages` 디렉토리를 만들고 `Home`, `Login`, `Signup`, `Dashboard` 페이지 컴포넌트를 생성한 뒤, `App.tsx`에서 라우터를 설정합니다. `shadcn/ui` 컴포넌트를 사용하여 로그인/회원가입 폼 UI를 완성합니다.

---

## 🧠 3단계: 프론트엔드 로직 및 상태 관리

### 7. API 및 상태관리 라이브러리 설치

```bash
# 1. axios, react-query 설치
pnpm --filter frontend add axios @tanstack/react-query

# 2. zustand 설치
pnpm --filter frontend add zustand
```

### 8. 로직 구현

-   **API 인스턴스 생성:** `src/lib/api.ts` 파일을 생성하여 `axios` 인스턴스를 설정합니다.
-   **React Query 설정:** `main.tsx`에 `QueryClientProvider`를 추가합니다.
-   **Zustand 스토어 생성:** `src/stores/authStore.ts`를 생성하여 인증 상태를 관리합니다.
-   **API 연동:** `LoginPage.tsx`와 `SignupPage.tsx`에서 `useMutation`을 사용하여 API 호출 로직을 구현합니다.

---

## 🔗 4단계: 연동, 테스트 및 리팩토링

### 9. CORS 및 프록시 문제 해결

> **문제:** 프론트엔드(`:5173`)와 백엔드(`:3000`) 포트가 달라 `Network Error` 발생.
> 
> **사용자 프롬프트:**
> 
> ```
> 회원가입시 Signup.tsx:31Signup failed: AxiosError {message: 'Network Error', ...}
> ```
> 
> **해결:** Vite 개발 서버에 프록시 설정을 추가하고, NestJS에 CORS 설정을 추가했습니다.

-   **`frontend/vite.config.ts` 수정:** `server.proxy` 옵션 추가.
-   **`backend/src/main.ts` 수정:** `app.enableCors()` 추가.

### 10. 새로고침 시 인증 유지

> **문제:** 대시보드에서 새로고침하면 인증 상태가 초기화됨.
> 
> **사용자 프롬프트:**
> 
> ```
> dashboard 에서 브라우저 새로고침하면 인증이 끊기고 있어.
> ```
> 
> **해결:** `authStore`의 `checkAuth` 함수가 페이지 로드 시 `/api/users/profile`을 호출하여 토큰 유효성을 검증하고 사용자 정보를 다시 가져오도록 수정했습니다.

### 11. Zustand `persist` 미들웨어 적용

> **요청:** `localStorage`를 직접 사용하는 대신 `persist` 미들웨어를 사용하고 싶음.
> 
> **사용자 프롬프트:**
> 
> ```
> useAuthStore 를 zustand middleware 인 persist를 사용하고 싶어.
> ```
> 
> **해결:**
> 
> 1.  `authStore.ts`를 `persist` 미들웨어를 사용하도록 리팩토링.
> 2.  `lib/api.ts`의 인터셉터가 `localStorage` 대신 스토어(`useAuthStore.getState().token`)에서 토큰을 읽도록 수정.
> 3.  `LoginPage.tsx`에서 `localStorage`를 직접 조작하는 코드를 제거하고 스토어 액션만 호출하도록 단순화.

---

## 🚀 최종 실행

모든 개발과 리팩토링이 완료되었습니다. 아래 명령어로 개발 서버를 실행하여 최종 테스트를 진행할 수 있습니다.

```bash
# 1. 백엔드 서버 시작
pnpm --filter backend run start:dev

# 2. 프론트엔드 서버 시작 (새 터미널에서)
pnpm --filter frontend run dev
```

브라우저에서 `http://localhost:5173`에 접속하여 회원가입, 로그인, 로그아웃, 페이지 접근 제어, 새로고침 시 인증 유지 등의 기능이 모두 정상적으로 동작하는지 확인합니다.

```