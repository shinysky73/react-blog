# DOM 요소 직접 제어 구현 계획 (`forwardRef`, `useImperativeHandle`)

## 목표
`Login.tsx` 페이지가 로드되었을 때 이메일(아이디) `Input` 컴포넌트에 자동으로 포커스가 가도록 구현합니다. 이를 위해 `React.forwardRef`를 사용하여 부모 컴포넌트(`Login.tsx`)에서 자식 컴포넌트(`Input.tsx`)의 DOM 노드에 접근하고, `useImperativeHandle`을 통해 제어할 함수를 노출시킵니다.

---

## 1단계: 분석 및 설계 (Analysis & Design)

### 1.1. 현재 컴포넌트 구조 분석
- **목표:** `Login.tsx`와 `components/ui/input.tsx`의 현재 구조와 관계를 파악합니다.
- **수행 작업:**
    - `Login.tsx`에서 `Input` 컴포넌트가 어떻게 사용되고 있는지 확인합니다.
    - `components/ui/input.tsx`가 현재 `ref`를 받고 있지 않은 함수형 컴포넌트임을 확인합니다. (shadcn/ui의 기본 `Input` 컴포넌트 구조 분석)

### 1.2. 구현 전략 설계
- **목표:** `ref`를 전달하고 DOM 포커스를 제어하기 위한 구체적인 방법을 설계합니다.
- **수행 작업:**
    - **`Input.tsx` 수정 계획:**
        - `React.forwardRef`를 사용하여 컴포넌트를 감싸 `ref`를 받을 수 있도록 수정합니다.
        - `useImperativeHandle`을 사용하여 부모에게 노출할 함수(예: `focus`)를 정의합니다. 이를 통해 캡슐화를 유지하고 부모가 자식의 DOM에 직접 접근하는 것을 최소화합니다.
    - **`Login.tsx` 수정 계획:**
        - `useRef`를 사용하여 `Input` 컴포넌트에 전달할 `ref` 객체를 생성합니다.
        - `useEffect`를 사용하여 컴포넌트가 마운트되었을 때(`[]` 의존성 배열), 생성한 `ref`의 `focus` 함수를 호출하여 자동으로 포커스를 줍니다.

---

## 2단계: 구현 (Implementation)

### 2.1. `Input.tsx` 리팩터링
- **목표:** `Input` 컴포넌트가 `ref`를 받아 DOM 포커스 제어 함수를 노출하도록 수정합니다.
- **수행 작업:**
    - `components/ui/input.tsx` 파일을 엽니다.
    - `React.forwardRef`로 컴포넌트를 감싸도록 수정합니다.
    - 컴포넌트 내부에서 `input` 요소에 대한 로컬 `ref`(예: `const inputRef = React.useRef<HTMLInputElement>(null)`)를 생성하고 실제 `<input>` 태그에 연결합니다.
    - `useImperativeHandle`을 사용하여 부모로부터 받은 `ref`(예: `forwardedRef`)에 `focus` 메서드를 노출시킵니다.
      ```typescript
      // components/ui/input.tsx 예시
      import * as React from 'react';
      import { useImperativeHandle } from 'react';

      // ... cn utility import

      export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

      const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
        const localRef = React.useRef<HTMLInputElement>(null);

        useImperativeHandle(ref, () => ({
          focus: () => {
            localRef.current?.focus();
          },
        }));

        return (
          <input
            type={type}
            className={cn(...)}
            ref={localRef}
            {...props}
          />
        );
      });
      Input.displayName = 'Input';

      export { Input };
      ```
      **참고:** shadcn/ui의 `Input`은 이미 `forwardRef`로 구현되어 있을 수 있습니다. 그럴 경우 `useImperativeHandle`을 추가하는 작업만 필요하거나, 혹은 바로 `ref`를 `input` 태그에 전달하는 것만으로도 충분할 수 있습니다. 실제 코드를 보고 가장 적합한 방식으로 수정합니다.

### 2.2. `Login.tsx`에 자동 포커스 기능 추가
- **목표:** 페이지 로드 시 이메일 `Input`에 자동으로 포커스가 가도록 구현합니다.
- **수행 작업:**
    - `frontend/src/pages/Login.tsx` 파일을 엽니다.
    - `useRef` 훅을 사용하여 `emailInputRef`를 생성합니다.
    - `useEffect` 훅을 사용하여 컴포넌트가 처음 렌더링될 때 `emailInputRef.current?.focus()`를 호출합니다.
    - 이메일 `Input` 컴포넌트에 `ref={emailInputRef}` prop을 전달합니다.
      ```typescript
      // pages/Login.tsx 예시
      import React, { useRef, useEffect } from 'react';
      import { Input } from '@/components/ui/input';
      // ... other imports

      export default function LoginPage() {
        const emailInputRef = useRef<{ focus: () => void }>(null);

        useEffect(() => {
          emailInputRef.current?.focus();
        }, []);

        // ...
        return (
          // ...
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            ref={emailInputRef} // ref 전달
          />
          // ...
        );
      }
      ```

---

## 3단계: 검증 (Verification)

### 3.1. 기능 테스트
- **목표:** 자동 포커스 기능이 정상적으로 동작하는지 확인합니다.
- **수행 작업:**
    - 애플리케이션을 실행하고 로그인 페이지(`/login`)로 이동합니다.
    - 페이지가 로드되자마자 이메일 입력 필드에 커서가 활성화(포커스)되어 있는지 확인합니다.
    - 다른 페이지에 갔다가 다시 로그인 페이지로 돌아왔을 때도 동일하게 동작하는지 확인합니다.
    - 기존의 로그인 기능(타이핑, 제출 등)이 문제없이 동작하는지 확인합니다.

### 3.2. 코드 정리
- **목표:** 최종 코드를 정리합니다.
- **수행 작업:**
    - `import` 구문을 정리하여 사용하지 않는 변수나 라이브러리가 없도록 합니다.
    - 코드 포맷터(`Prettier`) 및 린터(`ESLint`)를 실행하여 코드 스타일을 통일합니다.
