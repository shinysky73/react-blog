- Task 5: `ReactDOM.createPortal`을 활용한 컴포넌트 렌더링 위치 제어
  - 설명: Portal을 사용하면 부모 컴포넌트의 DOM 계층 구조 바깥에 있는 다른 위치로 자식 컴포넌트를 렌더링할 수 있습니다. 이는 모달, 툴팁, 전역 알림 메시지 등 z-index나
    overflow 스타일에 의해 잘리는 문제를 해결할 때 매우 유용합니다.
  - 적용 제안: 전역적으로 사용될 수 있는 모달(Alert Dialog) 컴포넌트를 만들고, createPortal을 사용하여 document.body의 최상단에 렌더링되도록 구현해볼 수 있습니다.
