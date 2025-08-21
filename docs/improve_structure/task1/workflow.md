# `CreatePost.tsx` 컴포넌트 상태 관리 리팩터링 개발 계획

## 목표
`CreatePost.tsx` 컴포넌트의 복잡한 폼 상태 관리를 외부 라이브러리 `Zustand` 대신 React 내장 훅인 `useReducer`와 `useContext`를 사용하여 개선합니다. 이를 통해 상태 관리 로직을 중앙화하고 컴포넌트의 가독성과 유지보수성을 높입니다.

---

## 1단계: 분석 및 설계 (Analysis & Design)

### 1.1. 현재 `CreatePost.tsx` 컴포넌트 분석
- **목표:** 현재 컴포넌트의 상태 관리 방식과 로직을 파악합니다.
- **수행 작업:**
    - `useState` 또는 `Zustand`를 통해 관리되고 있는 모든 상태 변수 식별 (예: `title`, `content`, `isLoading`, `error`).
    - 각 상태를 변경하는 이벤트 핸들러 함수 분석 (예: `handleTitleChange`, `handleContentChange`, `handleSubmit`).
    - 폼 제출 시 수행되는 유효성 검사 및 API 호출 로직 파악.

### 1.2. `useReducer`를 위한 상태(State)와 액션(Action) 정의
- **목표:** 리듀서에서 사용할 상태의 구조와 상태를 변경할 액션 타입을 설계합니다.
- **수행 작업:**
    - **State 인터페이스 정의:** 폼과 관련된 모든 상태를 포함하는 단일 객체 타입을 정의합니다.
      ```typescript
      interface FormState {
        title: string;
        content: string;
        isLoading: boolean;
        error: string | null;
      }
      ```
    - **Action 타입 정의:** 상태를 변경할 수 있는 모든 경우에 대한 액션 타입을 정의합니다. (Union Type 활용)
      ```typescript
      type FormAction =
        | { type: 'SET_FIELD'; field: 'title' | 'content'; value: string }
        | { type: 'SUBMIT_START' }
        | { type: 'SUBMIT_SUCCESS' }
        | { type: 'SUBMIT_FAILURE'; error: string }
        | { type: 'RESET' };
      ```

---

## 2단계: 구현 (Implementation)

### 2.1. 리듀서(Reducer) 함수 구현
- **목표:** 정의된 `Action`에 따라 `State`를 변경하는 순수 함수를 작성합니다.
- **수행 작업:**
    - `(state: FormState, action: FormAction) => FormState` 시그니처를 갖는 `formReducer` 함수를 구현합니다.
    - `switch` 문을 사용하여 각 액션 타입에 따른 상태 변경 로직을 작성합니다.

### 2.2. Context 및 Provider 컴포넌트 생성
- **목표:** `useReducer`를 통해 생성된 `state`와 `dispatch` 함수를 하위 컴포넌트에 전달할 `Context`와 `Provider`를 만듭니다.
- **수행 작업:**
    - `React.createContext`를 사용하여 `FormContext`를 생성합니다.
    - `CreatePostProvider` 컴포넌트를 생성하고, 이 컴포넌트 내부에서 `useReducer(formReducer, initialState)`를 호출합니다.
    - `FormContext.Provider`를 통해 `state`와 `dispatch` 함수를 `value`로 전달합니다.

### 2.3. `CreatePost.tsx` 리팩터링
- **목표:** 기존의 상태 관리 로직을 제거하고, `FormContext`를 사용하여 상태를 관리하도록 코드를 수정합니다.
- **수행 작업:**
    - `CreatePost.tsx`를 `CreatePostProvider`로 감싸줍니다.
    - `useContext(FormContext)`를 사용하여 `state`와 `dispatch`를 가져옵니다.
    - 기존 `useState` 또는 `Zustand` 관련 코드를 모두 제거합니다.
    - `input`과 `textarea`의 `value`를 `state`에서 가져오도록 수정합니다.
    - `onChange` 이벤트 핸들러에서 `dispatch` 함수를 호출하여 상태를 업데이트하도록 수정합니다. (예: `dispatch({ type: 'SET_FIELD', field: 'title', value: e.target.value })`)
    - 폼 제출(`handleSubmit`) 로직을 `dispatch`를 사용하도록 리팩터링합니다. (예: `SUBMIT_START`, `SUBMIT_SUCCESS`, `SUBMIT_FAILURE`)

---

## 3단계: 검증 및 정리 (Verification & Cleanup)

### 3.1. 기능 테스트
- **목표:** 리팩터링 이후에도 폼 기능이 정상적으로 동작하는지 확인합니다.
- **수행 작업:**
    - 제목과 내용을 입력했을 때 상태가 올바르게 업데이트되는지 확인합니다.
    - '글 작성' 버튼 클릭 시 로딩 상태가 올바르게 표시되는지 확인합니다.
    - 글 작성 성공 시 폼이 초기화되거나 페이지가 이동하는 등 기존 로직이 잘 동작하는지 확인합니다.
    - API 호출 실패 시 에러 메시지가 사용자에게 올바르게 표시되는지 확인합니다.

### 3.2. 코드 정리
- **목표:** 불필요한 코드를 제거하고 최종 코드를 정리합니다.
- **수행 작업:**
    - 기존에 사용했던 `useState`, `Zustand` 관련 코드가 남아있지 않은지 확인하고 모두 삭제합니다.
    - `import` 구문을 정리하여 사용하지 않는 라이브러리나 변수가 없도록 합니다.
    - 코드 포맷터(`Prettier`) 및 린터(`ESLint`)를 실행하여 코드 스타일을 통일합니다.
