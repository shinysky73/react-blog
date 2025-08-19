# 워크플로우: 코드 품질 및 유지보수성 개선

`docs/improve_prd.md` 문서에 명시된 요구사항을 기반으로 다음과 같은 상세 구현 워크플로우를 수립합니다.

## Phase 1: 인증 로직 추상화 (`useAuth` 커스텀 훅)

**목표:** 반복되는 인증 관련 로직을 `useAuth` 커스텀 훅으로 분리하여 재사용성을 높이고 코드의 명확성을 개선합니다.

### 1.1. `useAuth` 훅 생성
-   [ ] **Task:** `frontend/src/hooks` 디렉터리 생성 (없는 경우).
-   [ ] **Task:** `frontend/src/hooks/useAuth.ts` 파일 생성.
-   [ ] **Task:** `useAuth.ts` 내부에 `useAuthStore`의 상태와 액션을 반환하는 `useAuth` 커스텀 훅 로직 작성.
    -   **Acceptance Criteria:**
        -   훅은 `user`, `token`, `isAuthenticated`, `logout`, `checkAuth`를 반환해야 합니다.

### 1.2. 기존 컴포넌트 리팩토링
-   [ ] **Task:** `useAuthStore`를 직접 사용하고 있는 컴포넌트 식별.
    -   `frontend/src/components/Layout.tsx`
    -   `frontend/src/App.tsx`
-   [ ] **Task:** `Layout.tsx`에서 `useAuthStore` 호출을 `useAuth()`로 변경.
-   [ ] **Task:** `App.tsx`에서 `useAuthStore` 호출을 `useAuth()`로 변경.
    -   **Acceptance Criteria:**
        -   리팩토링 후에도 로그인, 로그아웃 및 인증 상태 확인 기능이 이전과 동일하게 작동해야 합니다.

## Phase 2: 전역 에러 처리 시스템 구축

**목표:** `Error Boundary`를 도입하여 렌더링 시 발생하는 자바스크립트 오류로부터 애플리케이션을 보호하고, 사용자에게 친화적인 오류 화면을 제공합니다.

### 2.1. `ErrorBoundary` 컴포넌트 생성
-   [ ] **Task:** `frontend/src/components/ErrorBoundary.tsx` 파일 생성.
-   [ ] **Task:** React의 클래스 컴포넌트를 사용하여 `ErrorBoundary` 로직 구현.
    -   `getDerivedStateFromError`를 사용하여 오류 상태를 업데이트합니다.
    -   `componentDidCatch`를 사용하여 오류 정보를 콘솔에 로깅합니다.
    -   `render` 메서드에서 `hasError` 상태에 따라 자식 컴포넌트 또는 대체 UI를 렌더링합니다.
-   [ ] **Task:** 대체 UI 디자인 및 구현.
    -   **Acceptance Criteria:**
        -   대체 UI는 "오류가 발생했습니다"와 같은 명확한 메시지를 포함해야 합니다.
        -   사용자가 페이지를 새로고침하여 문제를 해결할 수 있도록 "새로고침" 버튼을 제공해야 합니다.

### 2.2. `ErrorBoundary` 전역 적용
-   [ ] **Task:** `frontend/src/main.tsx` 파일 수정.
-   [ ] **Task:** 생성된 `ErrorBoundary` 컴포넌트를 가져와 `<App />` 컴포넌트를 감싸도록 적용.
    -   **Acceptance Criteria:**
        -   `ErrorBoundary`는 `QueryClientProvider`의 바깥, `StrictMode`의 안쪽에 위치하여 앱 전체에 적용되어야 합니다.

## Phase 3: 검증 및 테스트

**목표:** 구현된 개선 사항들이 올바르게 작동하는지 확인하고, 잠재적인 부작용이 없는지 검증합니다.

### 3.1. 기능 검증
-   [ ] **Task:** 수동으로 전체 인증 플로우(로그인, 로그아웃, 보호된 경로 접근)를 테스트하여 `useAuth` 훅 리팩토링이 정상적으로 이루어졌는지 확인합니다.
-   [ ] **Task:** 의도적으로 특정 컴포넌트에서 렌더링 오류를 발생시켜 `ErrorBoundary`가 오류를 정상적으로 처리하고 대체 UI를 보여주는지 테스트합니다.
    -   *테스트 방법: 특정 컴포넌트의 렌더링 부분에 `throw new Error('Test Error');` 코드를 임시로 추가하여 확인.*

### 3.2. 코드 리뷰
-   [ ] **Task:** 변경된 모든 파일에 대해 코드 리뷰를 진행하여 컨벤션, 가독성 등을 확인합니다.
-   [ ] **Task:** 더 이상 `useAuthStore`를 불필요하게 직접 사용하는 곳이 없는지 확인합니다.
