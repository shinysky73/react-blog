# `createPortal`을 활용한 전역 모달 구현 계획

## 목표
`ReactDOM.createPortal`을 사용하여 부모 컴포넌트의 DOM 계층 구조에 구애받지 않는 전역 모달(Alert Dialog) 컴포넌트를 구현합니다. 이를 통해 `z-index` 충돌이나 `overflow` 스타일에 의해 UI가 잘리는 문제를 원천적으로 해결합니다.

---

## 1단계: 분석 및 설계 (Analysis & Design)

### 1.1. 현재 모달(Alert Dialog) 컴포넌트 분석
- **목표:** 현재 프로젝트에서 사용 중인 `AlertDialog` 컴포넌트의 구조와 렌더링 방식을 파악합니다.
- **수행 작업:**
    - `components/ui/alert-dialog.tsx` 파일과 `PostCard.tsx` 등에서 `AlertDialog`가 어떻게 사용되고 있는지 분석합니다.
    - 현재 `AlertDialog`는 사용하는 컴포넌트의 DOM 내부에 직접 렌더링되고 있음을 확인합니다. 이로 인해 부모 요소의 스타일에 영향을 받을 수 있는 잠재적 문제가 있음을 인지합니다.

### 1.2. Portal을 위한 DOM 컨테이너 준비
- **목표:** Portal로 렌더링할 컴포넌트가 마운트될 DOM 노드를 준비합니다.
- **수행 작업:**
    - `frontend/index.html` 파일에 리액트 앱이 마운트되는 `<div id="root"></div>` 외에, 모달 전용 컨테이너 역할을 할 별도의 `div`를 추가합니다.
      ```html
      <!-- public/index.html -->
      <body>
        <div id="root"></div>
        <div id="modal-root"></div> <!-- Portal을 위한 컨테이너 -->
      </body>
      ```

### 1.3. Portal 컴포넌트 설계
- **목표:** `createPortal`을 사용하여 자식 컴포넌트를 외부 DOM 노드에 렌더링하는 재사용 가능한 `Portal` 컴포넌트를 설계합니다.
- **수행 작업:**
    - `children`을 `props`로 받아 `#modal-root`에 렌더링하는 `Portal` 컴포넌트를 구상합니다.
    - 서버 사이드 렌더링(SSR) 환경을 고려하여, 컴포넌트가 마운트된 이후에만 `document.getElementById('modal-root')`에 접근하도록 설계합니다.

---

## 2단계: 구현 (Implementation)

### 2.1. `Portal` 컴포넌트 생성
- **목표:** 설계에 따라 실제 `Portal` 컴포넌트를 구현합니다.
- **수행 작업:**
    - `frontend/src/components/Portal.tsx` 파일을 생성합니다.
    - `useState`와 `useEffect`를 사용하여 클라이언트 사이드에서만 DOM 노드를 참조하도록 구현합니다.
    - `ReactDOM.createPortal`을 사용하여 `children`을 `#modal-root` 엘리먼트에 렌더링합니다.
      ```typescript
      // components/Portal.tsx
      import { useEffect, useState, ReactNode } from 'react';
      import { createPortal } from 'react-dom';

      interface PortalProps {
        children: ReactNode;
      }

      const Portal = ({ children }: PortalProps) => {
        const [mounted, setMounted] = useState(false);

        useEffect(() => {
          setMounted(true);
          return () => setMounted(false);
        }, []);

        if (!mounted) {
          return null;
        }

        const modalRoot = document.getElementById('modal-root');
        return modalRoot ? createPortal(children, modalRoot) : null;
      };

      export default Portal;
      ```

### 2.2. 기존 `AlertDialog` 컴포넌트 리팩터링
- **목표:** `AlertDialog`의 컨텐츠가 새로 만든 `Portal` 컴포넌트를 통해 렌더링되도록 수정합니다.
- **수행 작업:**
    - `components/ui/alert-dialog.tsx` 파일을 엽니다.
    - `AlertDialogPortal` 컴포넌트 내부에서 `Radix UI`의 `AlertDialog.Portal` 대신 직접 만든 `Portal` 컴포넌트를 사용하도록 수정하거나, `AlertDialog.Portal`의 `container` prop을 지정하여 렌더링 위치를 변경합니다. (Radix UI 문서 확인 필요)
    - Radix UI가 `container` prop을 지원하는 경우, 해당 prop에 `#modal-root` 엘리먼트를 전달하는 것이 더 간단하고 안정적일 수 있습니다.
      ```typescript
      // components/ui/alert-dialog.tsx (Radix UI가 container prop을 지원할 경우)
      const AlertDialogPortal = ({
        className,
        ...props
      }: AlertDialogPortalProps) => (
        <AlertDialogPrimitive.Portal
          container={document.getElementById('modal-root')}
          className={cn(className)}
          {...props}
        />
      )
      ```
      *만약 `container` prop을 지원하지 않는다면, `AlertDialogContent`를 `Portal` 컴포넌트로 감싸는 방식으로 수정합니다.*

---

## 3단계: 검증 (Verification)

### 3.1. 기능 테스트
- **목표:** Portal 적용 이후에도 `AlertDialog`가 모든 상황에서 정상적으로 동작하는지 확인합니다.
- **수행 작업:**
    - `PostCard.tsx`의 삭제 버튼을 클릭하여 `AlertDialog`가 올바르게 나타나는지 확인합니다.
    - 모달의 'Cancel'과 'Continue' 버튼이 정상적으로 동작하는지 확인합니다.
    - 모달이 열렸을 때 키보드 포커스나 스크린 리더 동작 등 접근성이 유지되는지 확인합니다.

### 3.2. DOM 구조 확인
- **목표:** `AlertDialog`가 실제로 `#modal-root` 내부에 렌더링되는지 확인합니다.
- **수행 작업:**
    - 브라우저 개발자 도구(F12)의 **Elements** 탭을 엽니다.
    - `AlertDialog`를 열었을 때, `<body>` 태그의 직계 자식으로 있는 `<div id="modal-root">` 내부에 모달 관련 DOM이 생성되는 것을 확인합니다.
    - `<div id="root">` 내부에는 모달 DOM이 존재하지 않음을 확인합니다.

### 3.3. 코드 정리
- **목표:** 최종 코드를 정리합니다.
- **수행 작업:**
    - `import` 구문을 정리하여 사용하지 않는 변수나 라이브러리가 없도록 합니다.
    - 코드 포맷터(`Prettier`) 및 린터(`ESLint`)를 실행하여 코드 스타일을 통일합니다.
