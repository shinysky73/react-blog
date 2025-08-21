- Task 1: `useReducer`와 `useContext`를 활용한 복잡한 상태 관리
  _ 설명: 현재 Zustand를 사용하고 있지만, 리액트에 내장된 useReducer와 useContext 훅을 함께 사용하면 여러 하위 컴포넌트에 걸친 복잡한 상태 로직을 외부 라이브러리 없이
  관리할 수 있습니다. 특히 여러 상태가 연관되어 변경되거나, 상태 변경 로직이 복잡할 때 유용합니다.
  _ 적용 제안: 블로그 포스트 작성 폼(CreatePost.tsx)처럼 입력 필드가 많고 상태가 복잡한 컴포넌트에 적용하여 폼 상태 로직을 중앙에서 관리해볼 수 있습니다.

  - Task 2: `React.memo`, `useCallback`, `useMemo`를 이용한 렌더링 성능 최적화

    - 설명: 불필요한 리렌더링은 애플리케이션 성능 저하의 주요 원인입니다. React.memo는 컴포넌트의 props가 변경되지 않았을 때 리렌더링을 방지하고, useCallback과 useMemo는
      각각 함수와 값을 메모이제이션하여 렌더링 성능을 최적화합니다.
    - 적용 제안: Dashboard.tsx에서 포스트 목록을 렌더링할 때, 각 PostCard 컴포넌트에 React.memo를 적용하고, 부모 컴포넌트에서 전달하는 함수에 useCallback을 사용하여
      불필요한 렌더링을 줄여볼 수 있습니다.

  - Task 3: `React.lazy`와 `Suspense`를 활용한 코드 분할 (Code Splitting)

    - 설명: 코드 분할은 애플리케이션의 초기 로딩 속도를 개선하는 핵심 기술입니다. React.lazy와 Suspense를 사용하면 라우트(페이지)나 특정 컴포넌트를 사용자가 필요로 하는
      시점에 동적으로 로드할 수 있습니다.
    - 적용 제안: App.tsx의 라우터 설정에서 각 페이지 컴포넌트(Home, Login, Dashboard 등)를 React.lazy로 임포트하고, Suspense 컴포넌트로 감싸 로딩 상태 UI를 보여주는
      방식으로 구현할 수 있습니다.

  - Task 4: `React.forwardRef`와 `useImperativeHandle`을 이용한 DOM 요소 직접 제어

    - 설명: 일반적으로 React에서는 선언적으로 UI를 다루지만, 때로는 자식 컴포넌트의 DOM 노드에 직접 접근해야 할 때가 있습니다 (예: 특정 input에 포커스 주기, 비디오 재생
      제어). forwardRef는 부모 컴포넌트에서 자식 컴포넌트의 DOM 노드로 ref를 전달할 수 있게 해주고, useImperativeHandle은 전달된 ref에 특정 함수들을 노출시켜 캡슐화를
      유지합니다.
    - 적용 제안: 로그인 페이지(Login.tsx)의 Input 컴포넌트를 forwardRef로 감싸고, 페이지가 로드되었을 때 아이디 입력창에 자동으로 포커스가 가도록 구현해볼 수 있습니다.

  - Task 5: `ReactDOM.createPortal`을 활용한 컴포넌트 렌더링 위치 제어
    - 설명: Portal을 사용하면 부모 컴포넌트의 DOM 계층 구조 바깥에 있는 다른 위치로 자식 컴포넌트를 렌더링할 수 있습니다. 이는 모달, 툴팁, 전역 알림 메시지 등 z-index나
      overflow 스타일에 의해 잘리는 문제를 해결할 때 매우 유용합니다.
    - 적용 제안: 전역적으로 사용될 수 있는 모달(Alert Dialog) 컴포넌트를 만들고, createPortal을 사용하여 document.body의 최상단에 렌더링되도록 구현해볼 수 있습니다.
