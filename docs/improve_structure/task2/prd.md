Task 2: `React.memo`, `useCallback`, `useMemo`를 이용한 렌더링 성능 최적화

    - 설명: 불필요한 리렌더링은 애플리케이션 성능 저하의 주요 원인입니다. React.memo는 컴포넌트의 props가 변경되지 않았을 때 리렌더링을 방지하고, useCallback과 useMemo는
      각각 함수와 값을 메모이제이션하여 렌더링 성능을 최적화합니다.
    - 적용 제안: Dashboard.tsx에서 포스트 목록을 렌더링할 때, 각 PostCard 컴포넌트에 React.memo를 적용하고, 부모 컴포넌트에서 전달하는 함수에 useCallback을 사용하여
      불필요한 렌더링을 줄여볼 수 있습니다.
