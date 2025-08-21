- Task 4: `React.forwardRef`와 `useImperativeHandle`을 이용한 DOM 요소 직접 제어

  - 설명: 일반적으로 React에서는 선언적으로 UI를 다루지만, 때로는 자식 컴포넌트의 DOM 노드에 직접 접근해야 할 때가 있습니다 (예: 특정 input에 포커스 주기, 비디오 재생
    제어). forwardRef는 부모 컴포넌트에서 자식 컴포넌트의 DOM 노드로 ref를 전달할 수 있게 해주고, useImperativeHandle은 전달된 ref에 특정 함수들을 노출시켜 캡슐화를
    유지합니다.
  - 적용 제안: 로그인 페이지(Login.tsx)의 Input 컴포넌트를 forwardRef로 감싸고, 페이지가 로드되었을 때 아이디 입력창에 자동으로 포커스가 가도록 구현해볼 수 있습니다.
