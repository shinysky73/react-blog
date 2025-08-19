# 사용자 인증 기능 구현 워크플로우

이 문서는 `prd.md` 파일의 요구사항을 기반으로 사용자 인증 기능 구현을 위한 상세 작업 목록을 정의합니다.

---

## 🏁 0단계: 프로젝트 초기 설정 (Initial Setup)

- [ ] **공통 설정 (Common Setup)**

  - [ ] `pnpm`으로 워크스페이스 관리자로 초기화
  - [ ] `ESLint` 및 `Prettier` 설정으로 코드 포맷팅 및 린팅 규칙 통일
  - [ ] Git 레포지토리 초기화 및 `.gitignore` 파일 설정

- [ ] **백엔드 프로젝트 생성 (Backend Setup)**

  - [ ] `nest new backend` 명령어로 NestJS 프로젝트 생성
  - [ ] `TypeScript` 기본 설정 확인

- [ ] **프론트엔드 프로젝트 생성 (Frontend Setup)**
  - [ ] `vite`를 사용하여 React 프로젝트 생성 (`pnpm create vite frontend --template react-ts`)
  - [ ] `TypeScript` 템플릿으로 프로젝트 설정

---

## ⚙️ 1단계: 백엔드 설정 및 API 구현 (Backend API)

- [ ] **데이터베이스 및 Prisma 설정**

  - [ ] PostgreSQL 데이터베이스 준비 (`react` DB 생성)
  - [ ] NestJS 프로젝트에 `Prisma` 라이브러리 추가
  - [ ] `schema.prisma` 파일에 `User` 모델 정의 (PRD 참조)
  - [ ] `.env` 파일에 `DATABASE_URL` 환경 변수 설정
  - [ ] `prisma migrate dev` 명령어로 데이터베이스 마이그레이션 실행

- [ ] **인증(Auth) 모듈 구현**

  - [ ] `AuthModule`, `AuthService`, `AuthController` 생성
  - [ ] `bcrypt` 라이브러리 추가 (`pnpm add bcrypt @types/bcrypt`)

- [ ] **회원가입 API 구현 (`POST /api/auth/signup`)**

  - [ ] DTO(Data Transfer Object) 생성 (`CreateUserDto`) 및 유효성 검사 파이프라인 추가
  - [ ] `AuthService`에 비밀번호를 해싱하고 사용자를 생성하는 로직 구현
  - [ ] `AuthController`에 API 엔드포인트 정의
  - [ ] 이메일 중복 시 `409 Conflict` 에러 처리

- [ ] **로그인 API 구현 (`POST /api/auth/login`)**

  - [ ] DTO 생성 (`LoginUserDto`)
  - [ ] `AuthService`에 사용자 조회 및 비밀번호 비교 로직 구현
  - [ ] 인증 실패 시 `401 Unauthorized` 에러 처리

- [ ] **JWT 기반 인증 구현**

  - [ ] `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt` 라이브러리 추가
  - [ ] `AuthModule`에 `JwtModule` 설정 (`.env` 파일에 `JWT_SECRET` 추가)
  - [ ] 로그인 성공 시 `accessToken`을 생성하여 반환하는 로직 추가
  - [ ] JWT 검증을 위한 `JwtStrategy` 구현
  - [ ] API 보호를 위한 `JwtAuthGuard` 구현

- [ ] **사용자 프로필 API 구현 (`GET /api/users/profile`)**
  - [ ] `UsersModule` 생성
  - [ ] `JwtAuthGuard`를 사용하여 엔드포인트 보호
  - [ ] 요청을 보낸 사용자의 정보(`id`, `email`)를 반환하는 로직 구현

---

## 🎨 2단계: 프론트엔드 UI 개발 (Frontend UI)

- [ ] **UI 라이브러리 및 스타일링 설정**

  - [ ] `Tailwind CSS` 설정
  - [ ] `shadcn/ui` 초기화 및 필요한 컴포넌트(Button, Input, Card 등) 추가

- [ ] **공통 레이아웃 및 라우팅 설정**

  - [ ] `react-router-dom` 라이브러리 추가
  - [ ] 기본 라우터 설정 (`/`, `/login`, `/signup`, `/dashboard`)

- [ ] **회원가입 페이지 UI 개발 (`/signup`)**

  - [ ] `shadcn/ui`를 사용하여 `email`, `password`, `password 확인` 필드를 포함한 폼 컴포넌트 생성
  - [ ] 폼 상태 관리를 위한 `react-hook-form` 추가 (선택사항)

- [ ] **로그인 페이지 UI 개발 (`/login`)**

  - [ ] `shadcn/ui`를 사용하여 `email`, `password` 필드를 포함한 폼 컴포넌트 생성

- [ ] **대시보드 및 프로필 페이지 UI 스켈레톤**
  - [ ] 로그인 후 보여줄 간단한 대시보드 페이지(`Dashboard.tsx`) 생성
  - [ ] 사용자 정보를 표시할 프로필 페이지(`Profile.tsx`) 생성

---

## 🧠 3단계: 프론트엔드 로직 및 상태 관리 (Frontend Logic)

- [ ] **API 연동 설정**

  - [ ] `axios` 라이브러리 추가
  - [ ] API 요청을 위한 `axios` 인스턴스 생성 (Base URL, 헤더 등 설정)
  - [ ] `react-query` (`@tanstack/react-query`) 라이브러리 추가 및 `QueryClientProvider` 설정

- [ ] **전역 상태 관리 설정 (Zustand)**

  - [ ] `zustand` 라이브러리 추가
  - [ ] 인증 상태(`isAuthenticated`)와 사용자 정보(`user`)를 관리하는 `authStore` 생성
  - [ ] `login`, `logout`, `setUser` 등의 액션(action) 정의

- [ ] **회원가입/로그인 로직 구현**
  - [ ] `react-query`의 `useMutation`을 사용하여 회원가입 API 호출 로직 구현
  - [ ] `react-query`의 `useMutation`을 사용하여 로그인 API 호출 로직 구현
  - [ ] API 요청 성공/실패 시 사용자 피드백(Toast 등) 처리 로직 추가 (`react-hot-toast` 또는 `sonner` 사용)

---

## 🔗 4단계: 연동 및 최종 테스트 (Integration & Testing)

- [ ] **인증 상태 연동**

  - [ ] 로그인 성공 시, 서버로부터 받은 `accessToken`을 로컬 스토리지에 저장
  - [ ] `authStore`의 `login` 액션을 호출하여 전역 상태 업데이트
  - [ ] 애플리케이션 시작 시 로컬 스토리지의 토큰을 확인하여 `authStore` 상태를 초기화하는 로직 추가

- [ ] **Protected Route 구현 및 적용**

  - [ ] `isAuthenticated` 상태를 확인하여 접근을 제어하는 `ProtectedRoute` 컴포넌트 구현
  - [ ] `react-router-dom` 설정에 `ProtectedRoute`를 적용하여 `/dashboard`, `/profile` 등의 페이지 보호

- [ ] **로그아웃 기능 구현**

  - [ ] 로그아웃 버튼 클릭 시 로컬 스토리지의 토큰을 삭제
  - [ ] `authStore`의 `logout` 액션을 호출하여 상태 초기화
  - [ ] 사용자를 로그인 페이지로 리디렉션

- [ ] **전체 플로우 테스트**

  - [ ] **시나리오 1: 회원가입**
    - [ ] 유효하지 않은 입력값으로 회원가입 시도 (에러 메시지 확인)
    - [ ] 정상적인 정보로 회원가입 성공
    - [ ] 동일한 이메일로 재가입 시도 (중복 에러 확인)
  - [ ] **시나리오 2: 로그인 및 접근 제어**
    - [ ] 잘못된 정보로 로그인 시도 (인증 실패 메시지 확인)
    - [ ] 정상적인 정보로 로그인 성공
    - [ ] 보호된 페이지(`/dashboard`) 접근 성공
    - [ ] 로그아웃 후 보호된 페이지 접근 시도 (로그인 페이지로 리디렉션 확인)
  - [ ] **시나리오 3: 인증 상태 유지**
    - [ ] 로그인 후 페이지 새로고침 시에도 로그인 상태가 유지되는지 확인

- [ ] **최종 코드 리뷰 및 리팩토링**
  - [ ] 불필요한 코드 제거
  - [ ] 컴포넌트 및 로직 재사용성 검토
  - [ ] 주석 및 문서 정리
