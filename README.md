# React & NestJS 블로그 플랫폼

React (Vite)와 NestJS를 사용하여 구축한 모던 풀스택 블로그 예제 플랫폼 입니다.
이 프로젝트는 JWT 기반의 안전한 사용자 인증 시스템과 게시물 CRUD(생성, 읽기, 수정, 삭제) 기능을 중심으로 구현되었습니다.

## ✨ 주요 기능

- **사용자 인증**: JWT(JSON Web Tokens)를 사용한 안전한 회원가입 및 로그인 기능.
- **게시물 CRUD**: 로그인한 사용자는 자신의 게시물을 자유롭게 생성, 조회, 수정, 삭제할 수 있습니다.
- **보호된 라우팅**: 로그인한 사용자만 접근할 수 있는 페이지(대시보드, 게시물 작성/수정 등)를 구현했습니다.
- **다크 모드**: 시스템 설정에 따르거나 사용자가 직접 라이트/다크 모드를 선택할 수 있습니다.
- **공통 레이아웃**: 인증 상태에 따라 다른 메뉴를 보여주는 공용 레이아웃을 적용하여 일관된 UI/UX를 제공합니다.
- **전역 에러 처리**: Error Boundary를 통해 렌더링 오류 발생 시 앱 전체가 중단되는 것을 방지합니다.
- **커스텀 훅**: `useAuth`와 같은 커스텀 훅을 사용하여 코드를 추상화하고 재사용성을 높였습니다.

## 🛠️ 기술 스택

### **Frontend**

- **Framework**: React (with Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand (Global), TanStack/React-Query (Server)
- **Routing**: React Router
- **API Client**: Axios
- **Form Management**: React Hook Form, Zod

### **Backend**

- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (Passport.js)
- **Security**: bcrypt

### **Tooling & Environment**

- **Package Manager**: pnpm (with Workspaces)
- **Linting/Formatting**: ESLint, Prettier

## 🚀 시작하기

### 사전 요구사항

- Node.js (v18 이상 권장)
- pnpm
- PostgreSQL 데이터베이스

### 설치 및 설정

1.  **저장소 복제:**

    ```bash
    git clone https://github.com/shinysky73/react-blog.git
    cd react-blog
    ```

2.  **의존성 설치 (루트 디렉터리에서 실행):**

    ```bash
    pnpm install
    ```

3.  **백엔드 환경 변수 설정:**

    - `backend` 디렉터리에 `.env` 파일을 생성하고 아래 내용을 채워주세요.

    ```env
    # PostgreSQL 연결 정보 (사용자, 비밀번호, 호스트, 포트, 데이터베이스명)
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

    # JWT 서명에 사용할 시크릿 키
    JWT_SECRET="your-super-secret-and-long-key"
    ```

4.  **데이터베이스 마이그레이션:**
    - 아래 명령어를 실행하여 Prisma 스키마를 데이터베이스에 적용합니다.
    ```bash
    pnpm --filter backend exec prisma migrate dev
    ```

## 🏃‍♂️ 애플리케이션 실행

애플리케이션을 실행하려면 두 개의 터미널이 필요합니다.

1.  **백엔드 서버 실행 (첫 번째 터미널):**

    ```bash
    pnpm --filter backend run start:dev
    ```

    - 서버는 `http://localhost:3000`에서 실행됩니다.

2.  **프런트엔드 서버 실행 (두 번째 터미널):**
    ```bash
    pnpm --filter frontend run dev
    ```
    - 프런트엔드는 `http://localhost:5173`에서 실행됩니다.

## ✅ 주요 스크립트

- **백엔드 테스트 실행:**

  ```bash
  # Unit Tests
  pnpm --filter backend run test

  # E2E Tests
  pnpm --filter backend run test:e2e
  ```

- **Linter 실행:**

  ```bash
  # Frontend
  pnpm --filter frontend run lint

  # Backend
  pnpm --filter backend run lint
  ```
