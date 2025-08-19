1. PRD 생성하기
   frontend : React + vite + typescript, zustand, react query, tailwind css, shadcn/ui, axios, eslint, prettier

backend : nestjs, prisma, postgres (localhost 5173, db: react, user: postgres, password: post1234)

Task: 로그인/회원가입 페이지 기능 구현
로그인 API 연동 (POST 요청)
로그인 성공 시 서버로부터 받은 인증 토큰(JWT) 저장 (로컬 스토리지 또는 쿠키)
email, password 회원가입

Task: 전역 인증 상태 관리
Context API 또는 Zustand 같은 경량 상태관리 라이브러리를 사용하여 로그인 상태 및 사용자 정보 전역으로 관리

Task: Private/Protected Route 구현
로그인이 필요한 페이지에 접근 시, 인증 상태를 확인하여 로그인 페이지로 리디렉션하는 로직 구현

.........

위 기능을 가진 프론트, 백엔드 사이트를 개발할려고 해. PRD 만들어줘.

2. workflow 작성하기
   /sg:workflow @prd.md 파일의 내용으로 task를 나누고 md파일로 만들어줘.

3. task별 개발 시작
   /sg:task @workflow.md 파일에 따라 단계별로 개발을 진행해보자.

pnpm dlx @nestjs/cli new backend --skip-git --package-manager=pnpm

pnpm --filter backend run start:dev
pnpm --filter frontend run dev


블로그 포스트 생성하기 RPD를 만들어줘. 폼 validation 관리는 zod를 사용하고 싶어.