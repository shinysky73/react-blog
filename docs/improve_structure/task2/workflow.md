# 렌더링 성능 최적화 개발 계획 (`React.memo`, `useCallback`)

## 목표
`Dashboard.tsx`에서 포스트 목록을 표시할 때, `PostCard` 컴포넌트의 불필요한 리렌더링을 방지하여 애플리케이션의 렌더링 성능을 최적화합니다. 이를 위해 `React.memo`와 `useCallback`을 적용합니다.

---

## 1단계: 분석 및 현재 상태 파악 (Analysis)

### 1.1. 컴포넌트 구조 및 데이터 흐름 분석
- **목표:** `Dashboard.tsx`와 `PostCard.tsx` 간의 관계와 `props` 전달 방식을 파악합니다.
- **수행 작업:**
    - `Dashboard.tsx`가 포스트 목록 데이터를 어떻게 가져오는지 확인합니다. (`useQuery` 사용)
    - `Dashboard.tsx`가 `map` 함수를 통해 `PostCard` 컴포넌트 목록을 렌더링하는 방식을 분석합니다.
    - `PostCard` 컴포넌트로 전달되는 `props` (예: `post`, `onDelete`, `onEdit`)를 모두 식별합니다.
    - `PostCard` 내부에서 `props`가 어떻게 사용되는지 확인합니다.

### 1.2. 리렌더링 발생 시나리오 확인
- **목표:** 어떤 상황에서 `PostCard`가 불필요하게 리렌더링될 수 있는지 예측합니다.
- **수행 작업:**
    - `Dashboard.tsx`의 상태(state)가 변경될 때, 변경되지 않은 `PostCard` 컴포넌트까지 리렌더링되는지 확인합니다. (예: `React DevTools`의 "Highlight updates when components render" 기능 활용)
    - 특히, `Dashboard.tsx`가 리렌더링될 때마다 `onDelete`, `onEdit`과 같은 함수들이 새로 생성되어 `PostCard`에 전달됨으로써 불필요한 렌더링을 유발하는 것을 확인합니다.

---

## 2단계: 구현 (Implementation)

### 2.1. `PostCard.tsx`에 `React.memo` 적용
- **목표:** `props`가 변경되지 않으면 `PostCard` 컴포넌트가 리렌더링되지 않도록 합니다.
- **수행 작업:**
    - `PostCard` 컴포넌트 선언부를 `React.memo`로 감싸줍니다.
      ```typescript
      // Before
      export default function PostCard(...) { ... }

      // After
      import React from 'react';
      const PostCard = React.memo((...) => { ... });
      export default PostCard;
      ```

### 2.2. `Dashboard.tsx`에 `useCallback` 적용
- **목표:** `Dashboard.tsx`가 리렌더링될 때마다 `PostCard`에 전달되는 함수들이 재생성되는 것을 방지합니다.
- **수행 작업:**
    - `PostCard`에 `props`로 전달하는 `onDelete`, `onEdit` 등의 함수를 `useCallback`으로 감싸줍니다.
    - `useCallback`의 의존성 배열(`dependency array`)에 해당 함수가 의존하는 값(예: `mutation.mutate`)을 정확하게 명시합니다.
      ```typescript
      // Before
      const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
      };

      // After
      import { useCallback } from 'react';
      const handleDelete = useCallback((id: number) => {
        deleteMutation.mutate(id);
      }, [deleteMutation]);
      ```

---

## 3단계: 검증 (Verification)

### 3.1. 성능 최적화 확인
- **목표:** `React.memo`와 `useCallback` 적용 후 불필요한 리렌더링이 실제로 방지되었는지 확인합니다.
- **수행 작업:**
    - `React DevTools`의 렌더링 하이라이트 기능을 다시 사용하여 `Dashboard`의 상태가 변경되었을 때, 변경과 관련 없는 `PostCard`들이 더 이상 리렌더링되지 않음을 확인합니다.
    - 특히, 포스트 하나를 삭제하거나 수정했을 때, 다른 포스트 카드들은 리렌더링되지 않아야 합니다.

### 3.2. 기능 테스트
- **목표:** 성능 최적화 작업 이후에도 기존 기능들이 모두 정상적으로 동작하는지 확인합니다.
- **수행 작업:**
    - 포스트 수정 기능이 정상적으로 동작하는지 확인합니다.
    - 포스트 삭제 기능이 정상적으로 동작하는지 확인합니다.
    - 포스트 목록이 올바르게 표시되는지 확인합니다.

### 3.3. 코드 정리
- **목표:** 최종 코드를 정리합니다.
- **수행 작업:**
    - `import` 구문을 정리하여 사용하지 않는 변수나 라이브러리가 없도록 합니다.
    - 코드 포맷터(`Prettier`) 및 린터(`ESLint`)를 실행하여 코드 스타일을 통일합니다.
