- Task 3: `React.lazy`와 `Suspense`를 활용한 코드 분할 (Code Splitting)

  - 설명: 코드 분할은 애플리케이션의 초기 로딩 속도를 개선하는 핵심 기술입니다. React.lazy와 Suspense를 사용하면 라우트(페이지)나 특정 컴포넌트를 사용자가 필요로 하는
    시점에 동적으로 로드할 수 있습니다.
  - 적용 제안: App.tsx의 라우터 설정에서 각 페이지 컴포넌트(Home, Login, Dashboard 등)를 React.lazy로 임포트하고, Suspense 컴포넌트로 감싸 로딩 상태 UI를 보여주는
    방식으로 구현할 수 있습니다.
