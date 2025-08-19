# PRD:

요청하신 기술 스택을 기반으로 사용자 인증 기능 구현을 위한 \*\*제품 요구사항 명세서(PRD)\*\*를 작성해 드리겠습니다. 이 문서는 프로젝트의 목표, 기능, 기술적 요구사항을 명확히 정의하여 개발팀이 일관된 방향으로 나아갈 수 있도록 돕습니다.

---

## 🚀 사용자 인증 기능 개발 PRD

### 1\. 개요 (Overview)

본 문서는 React/NestJS 기반 웹 애플리케이션의 핵심 기능인 **사용자 인증 시스템** 개발을 위한 요구사항을 정의합니다. 사용자는 이메일과 비밀번호를 통해 회원가입하고 로그인할 수 있으며, 로그인한 사용자만 접근할 수 있는 전용 페이지를 구현합니다. 전역 상태 관리를 통해 사용자 경험을 향상시키고, 안전한 라우팅을 보장하는 것을 목표로 합니다.

### 2\. 목표 (Goals)

- **핵심 목표:** 사용자가 안전하게 계정을 만들고, 로그인하여 개인화된 서비스를 이용할 수 있는 인증 시스템을 구축한다.
- **프론트엔드 목표:**
  - 재사용 가능한 인증 관련 UI 컴포넌트(로그인/회원가입 폼)를 개발한다.
  - Zustand를 사용해 인증 상태(로그인 여부, 사용자 정보)를 효율적으로 전역 관리한다.
  - 인증 여부에 따라 특정 페이지 접근을 제어하는 Private Route를 구현한다.
- **백엔드 목표:**
  - 사용자 정보를 안전하게 데이터베이스에 저장하고 관리한다.
  - JWT(JSON Web Token) 기반의 토큰 인증 방식을 구현하여 stateless 한 인증을 제공한다.
  - 보안을 위해 사용자 비밀번호를 해싱하여 저장한다.

### 3\. 기능 요구사항 (Functional Requirements)

#### **Frontend (React)**

- **회원가입 페이지 (`/signup`)**

  - **UI:** `email`, `password`, `password 확인` 입력 필드와 `회원가입` 버튼을 포함하는 폼을 `shadcn/ui`와 `Tailwind CSS`를 사용해 구현합니다.
  - **유효성 검사:**
    - Email: 올바른 이메일 형식(@, . 포함)인지 확인합니다.
    - Password: 최소 길이(예: 8자 이상) 등 기본 정책을 적용합니다.
    - Password 확인: 입력한 두 비밀번호가 일치하는지 확인합니다.
  - **API 연동:**
    - `react-query`의 `useMutation`을 사용하여 회원가입 API(`POST /api/auth/signup`)를 호출합니다.
    - 요청 중에는 로딩 상태를 표시하고, 성공/실패 시 사용자에게 피드백(Toast 또는 Alert)을 제공합니다.

- **로그인 페이지 (`/login`)**

  - **UI:** `email`, `password` 입력 필드와 `로그인` 버튼을 포함하는 폼을 구현합니다.
  - **API 연동:**
    - `react-query`의 `useMutation`을 사용하여 로그인 API(`POST /api/auth/login`)를 호출합니다.
  - **인증 토큰 처리:**
    - 로그인 성공 시, 서버로부터 받은 `accessToken(JWT)`을 \*\*로컬 스토리지(Local Storage)\*\*에 저장합니다.
    -

- **전역 인증 상태 관리 (Zustand)**

  - 인증 상태(`isAuthenticated`)와 사용자 정보(`user`)를 관리하는 Store를 생성합니다.
  - 애플리케이션 시작 시 로컬 스토리지의 토큰을 확인하여 초기 인증 상태를 설정합니다.
  - 로그인 성공 시 `isAuthenticated`를 `true`로, `user` 정보를 업데이트합니다.
  - 로그아웃 시 로컬 스토리지의 토큰을 삭제하고, Store의 상태를 초기화합니다.

- **Private/Protected Route 구현**

  - 로그인이 필요한 페이지(예: `/dashboard`, `/profile`)에 접근을 제어하는 `ProtectedRoute` 컴포넌트를 만듭니다.
  - `ProtectedRoute`는 Zustand Store의 `isAuthenticated` 상태를 확인합니다.
  - `isAuthenticated`가 `false`일 경우, 사용자를 `/login` 페이지로 리디렉션(Redirect)합니다.

#### **Backend (NestJS)**

- **사용자(User) 모델 정의 (Prisma)**

  - `User` 테이블은 `id`, `email`, `password`, `createdAt`, `updatedAt` 필드를 포함합니다.
  - `email` 필드는 고유(unique)해야 합니다.

- **인증(Auth) 모듈**

  - **회원가입 API (`POST /api/auth/signup`)**
    - Request Body로 `email`, `password`를 받습니다.
    - `bcrypt` 라이브러리를 사용해 비밀번호를 해싱(hashing)합니다.
    - Prisma를 통해 해싱된 비밀번호와 이메일을 `User` 테이블에 저장합니다.
    - 이미 존재하는 이메일일 경우, 409 Conflict 에러를 반환합니다.
  - **로그인 API (`POST /api/auth/login`)**
    - Request Body로 `email`, `password`를 받습니다.
    - 데이터베이스에서 이메일로 사용자를 조회합니다.
    - 사용자가 존재하면 `bcrypt`를 사용해 입력된 비밀번호와 저장된 해시를 비교합니다.
    - 인증 성공 시, `@nestjs/jwt`를 사용해 사용자의 `id`와 `email`을 담은 JWT(`accessToken`)을 생성하여 반환합니다.
    - 인증 실패 시, 401 Unauthorized 에러를 반환합니다.
  - **인증 가드 (AuthGuard)**
    - `@nestjs/passport`와 `passport-jwt` 전략을 사용하여 JWT를 검증하는 `JwtAuthGuard`를 구현합니다.
    - 이 가드를 적용한 API 엔드포인트는 유효한 JWT가 `Authorization` 헤더에 포함된 경우에만 접근을 허용합니다. (예: `GET /api/profile`)

### 4\. 비기능 요구사항 (Non-Functional Requirements)

- **보안 (Security) 🛡️:**
  - 비밀번호는 반드시 단방향 암호화(bcrypt)하여 저장합니다.
  - JWT의 시크릿 키는 환경 변수로 관리하며, 유출되지 않도록 주의합니다.
  - API 요청 시 기본적인 입력값 검증(Validation)을 수행합니다.
- **코드 품질 (Code Quality) ✨:**
  - `TypeScript`를 사용하여 타입 안정성을 확보합니다.
  - `ESLint`와 `Prettier`를 설정하여 일관된 코드 스타일과 컨벤션을 유지합니다.
- **개발 환경 (Development Environment) 💻:**
  - 프론트엔드: `localhost:5173` (Vite 기본 포트)
  - 백엔드: `localhost:3000` (NestJS 기본 포트)
  - 데이터베이스: PostgreSQL (`localhost:5432`, DB: `react`, User: `postgres`, Pass: `post1234`)

---

### 5\. 기술 스택 (Tech Stack)

| 구분          | 기술                                                                                          |
| :------------ | :-------------------------------------------------------------------------------------------- |
| **Frontend**  | `React`, `Vite`, `TypeScript`, `Zustand`, `React Query`, `Tailwind CSS`, `shadcn/ui`, `Axios` |
| **Backend**   | `NestJS`, `Prisma`, `PostgreSQL`                                                              |
| **Dev Tools** | `ESLint`, `Prettier`, `pnpm` 또는 `yarn`                                                      |

---

### 6\. 데이터베이스 스키마 (Prisma Schema)

```prisma
// schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

### 7\. API 명세 (API Specification)

API 엔드포인트는 `/api` 접두사를 사용합니다.

| 기능            | Method | Endpoint             | Request Body            | Success Response (2xx)                          | Error Response (4xx)                                                 |
| :-------------- | :----- | :------------------- | :---------------------- | :---------------------------------------------- | :------------------------------------------------------------------- |
| **회원가입**    | `POST` | `/api/auth/signup`   | `{ email, password }`   | **201 Created**: `{ id, email, createdAt }`     | **400 Bad Request**: 유효성 실패\<br/\>**409 Conflict**: 이메일 중복 |
| **로그인**      | `POST` | `/api/auth/login`    | `{ email, password }`   | **200 OK**: `{ accessToken: "jwt.token.here" }` | **401 Unauthorized**: 인증 정보 불일치                               |
| **프로필 조회** | `GET`  | `/api/users/profile` | (Header: Authorization) | **200 OK**: `{ id, email }`                     | **401 Unauthorized**: 토큰 없음 또는 만료                            |

---

### 8\. 개발 로드맵 (Roadmap)

1.  **1단계: 백엔드 설정 및 API 구현**

    - NestJS 프로젝트 생성, Prisma 및 PostgreSQL 연동
    - `schema.prisma` 파일에 User 모델 정의 및 마이그레이션
    - 회원가입/로그인 비즈니스 로직 및 API 엔드포인트 구현
    - JWT 발급 및 검증 로직, AuthGuard 구현

2.  **2단계: 프론트엔드 설정 및 UI 개발**

    - Vite + React + TS 프로젝트 생성
    - Tailwind CSS, shadcn/ui 설정
    - 로그인, 회원가입 페이지 UI 컴포넌트 개발

3.  **3단계: 프론트엔드 로직 및 상태 관리 구현**

    - Zustand를 이용한 전역 인증 스토어 생성
    - Axios 인스턴스 설정 (API 요청용)
    - React Query를 사용하여 회원가입/로그인 Mutation 구현

4.  **4단계: 연동 및 최종 테스트**

    - 로그인 성공 시 JWT를 로컬 스토리지에 저장하는 로직 구현
    - Protected Route 컴포넌트 구현 및 라우터에 적용
    - 전체 인증 플로우(회원가입 → 로그인 → 보호된 페이지 접근 → 로그아웃) 테스트 및 디버깅
