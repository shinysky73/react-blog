# 코드 분할(Code Splitting) 적용 개발 계획 (`React.lazy`, `Suspense`)

## 목표
`App.tsx`의 라우팅 설정에 코드 분할을 적용하여 애플리케이션의 초기 로딩 성능을 개선합니다. `React.lazy`를 사용해 각 페이지 컴포넌트를 동적으로 임포트하고, `Suspense`를 활용하여 컴포넌트 로딩 중에 사용자에게 로딩 상태를 보여줍니다.

---

## 1단계: 분석 및 준비 (Analysis & Preparation)

### 1.1. 현재 라우팅 구조 분석
- **목표:** `frontend/src/App.tsx` 파일의 현재 라우팅 구조와 컴포넌트 임포트 방식을 파악합니다.
- **수행 작업:**
    - `App.tsx` 파일에서 `react-router-dom`을 사용하여 설정된 모든 라우트(`<Route>`)를 식별합니다.
    - 각 라우트에 연결된 페이지 컴포넌트들(예: `HomePage`, `LoginPage`, `DashboardPage` 등)이 파일 상단에서 정적(`import ... from ...`)으로 임포트되고 있음을 확인합니다.
    - 이 방식이 초기 번들 파일 크기를 증가시키는 원인임을 인지합니다.

### 1.2. `Suspense` 폴백(Fallback) UI 컴포넌트 준비
- **목표:** 페이지 컴포넌트가 로딩되는 동안 사용자에게 보여줄 UI를 준비합니다.
- **수행 작업:**
    - 간단한 로딩 인디케이터 컴포넌트를 생성하거나 기존 UI 라이브러리(shadcn/ui)의 스피너 등을 활용할 수 있습니다.
    - 예시: `LoadingSpinner.tsx` 컴포넌트를 만들거나, 간단한 `<p>Loading...</p>` 텍스트를 사용하기로 결정합니다.

---

## 2단계: 구현 (Implementation)

### 2.1. 페이지 컴포넌트 동적 임포트(Dynamic Import)로 전환
- **목표:** `React.lazy`를 사용하여 각 페이지 컴포넌트를 동적으로 임포트하도록 코드를 수정합니다.
- **수행 작업:**
    - `App.tsx` 상단의 모든 페이지 컴포넌트 `import` 구문을 삭제합니다.
    - `React.lazy`와 동적 `import()` 문법을 사용하여 각 페이지 컴포넌트를 라우트 설정 바로 위에서 선언합니다.
      ```typescript
      // Before
      import HomePage from './pages/Home';
      import LoginPage from './pages/Login';
      // ... other pages

      // After
      import React, { lazy } from 'react';
      const HomePage = lazy(() => import('./pages/Home'));
      const LoginPage = lazy(() => import('./pages/Login'));
      // ... other pages
      ```

### 2.2. `Suspense` 컴포넌트 적용
- **목표:** 동적으로 로드되는 컴포넌트들을 `Suspense`로 감싸서 로딩 상태를 처리합니다.
- **수행 작업:**
    - `react-router-dom`의 `<Routes>` 컴포넌트를 `React.Suspense` 컴포넌트로 감싸줍니다.
    - `Suspense`의 `fallback` prop에 1.2 단계에서 준비한 로딩 UI를 전달합니다.
      ```typescript
      import React, { Suspense } from 'react';
      // ... lazy loaded components

      function App() {
        return (
          <Router>
            <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* ... other routes */}
              </Routes>
            </Suspense>
          </Router>
        );
      }
      ```

---

## 3단계: 검증 (Verification)

### 3.1. 기능 테스트
- **목표:** 코드 분할 적용 후에도 애플리케이션의 모든 라우팅 기능이 정상적으로 동작하는지 확인합니다.
- **수행 작업:**
    - 애플리케이션을 실행하고 모든 페이지(홈, 로그인, 대시보드 등)로 이동하며 각 페이지가 올바르게 렌더링되는지 확인합니다.
    - 페이지를 처음 로드하거나 새로고침할 때 `fallback`으로 설정한 로딩 UI가 잠시 나타나는지 확인합니다.

### 3.2. 성능 개선 확인
- **목표:** 초기 번들 파일의 크기가 줄어들고, 페이지가 필요할 때만 해당 코드 청크(chunk)가 로드되는지 확인합니다.
- **수행 작업:**
    - 브라우저 개발자 도구(F12)의 **Network** 탭을 엽니다.
    - 페이지를 새로고침하여 초기 로드되는 JavaScript 파일들을 확인합니다. (번들 파일 크기가 이전보다 작아졌는지 확인)
    - 다른 페이지로 이동할 때, 해당 페이지에 해당하는 새로운 `.js` 파일(청크)이 네트워크 요청을 통해 로드되는 것을 확인합니다.

### 3.3. 코드 정리
- **목표:** 최종 코드를 정리합니다.
- **수행 작업:**
    - `import` 구문을 정리하여 사용하지 않는 변수나 라이브러리가 없도록 합니다.
    - 코드 포맷터(`Prettier`) 및 린터(`ESLint`)를 실행하여 코드 스타일을 통일합니다.
