# 상세 개발 계획서: 차세대 사내 블로그 시스템

---

## Phase 1: 파운데이션 및 콘텐츠 강화 (Foundation & Content Enhancement)

### Epic 1: 강화된 콘텐츠 작성 및 관리

#### **Task 1.1: 부서(Department) 모델 도입**
-   **DB (Prisma):**
    -   [ ] `Department` 모델 정의 (`id`, `name`).
    -   [ ] `User` 모델에 `departmentId` 필드 및 `Department` 모델과의 `N:1` 관계 설정.
    -   [ ] Prisma 마이그레이션 실행 (`pnpm --filter backend exec prisma migrate dev --name add_department_model`).
-   **Backend (NestJS):**
    -   [ ] `departments` 모듈, 컨트롤러, 서비스 생성.
    -   [ ] 부서 생성/조회/수정/삭제 API 구현 (관리자용).
    -   [ ] 회원가입(`auth.service`) 시 부서 ID를 받도록 로직 수정.
    -   [ ] 사용자 프로필 조회(`users.service`) 시 부서 정보를 함께 반환하도록 수정.
-   **Frontend (React):**
    -   [ ] 회원가입 페이지에 부서 선택 드롭다운 UI 추가.
    -   [ ] 게시물 조회 시 작성자 정보 옆에 부서 이름 표시.

#### **Task 1.2: 콘텐츠 분류 (카테고리 & 태그) 모델 도입**
-   **DB (Prisma):**
    -   [ ] `Category` 모델 정의 (`id`, `name`).
    -   [ ] `Tag` 모델 정의 (`id`, `name`).
    -   [ ] `Post` 모델과 `Category`, `Tag` 모델 간의 다대다(Many-to-Many) 관계 설정 (`CategoriesOnPosts`, `TagsOnPosts` 조인 테이블 자동 생성).
    -   [ ] Prisma 마이그레이션 실행.
-   **Backend (NestJS):**
    -   [ ] `categories`, `tags` 모듈, 컨트롤러, 서비스 생성.
    -   [ ] 카테고리/태그 CRUD API 구현.
    -   [ ] 게시물 생성/수정(`posts.service`) 시 카테고리 ID와 태그 이름을 받아 관계를 설정하는 로직 추가.
    -   [ ] 게시물 조회 시 연결된 카테고리 및 태그 정보를 함께 반환하도록 수정.

#### **Task 1.3: 게시물 상태 및 공개 범위 관리 기능 추가**
-   **DB (Prisma):**
    -   [ ] `Post` 모델에 `Status` Enum (`DRAFT`, `PUBLISHED`) 추가 및 `status` 필드 정의.
    -   [ ] `Post` 모델에 `Visibility` Enum (`PUBLIC`, `PRIVATE`) 추가 및 `visibility` 필드 정의.
    -   [ ] Prisma 마이그레이션 실행.
-   **Backend (NestJS):**
    -   [ ] `posts.controller` 및 `posts.service`의 게시물 생성/수정 DTO에 `status`, `visibility` 필드 추가.
    -   [ ] 게시물 목록 조회 API는 기본적으로 `PUBLISHED` 상태와 `PUBLIC` 상태인 게시물만 반환하도록 로직 수정.
    -   [ ] 내 글 목록 조회 API는 `DRAFT` 상태의 글도 볼 수 있도록 구현.
    -   [ ] `PRIVATE` 게시물은 작성자 또는 특정 권한 보유자만 볼 수 있도록 접근 제어 로직 추가.

#### **Task 1.4: 위지윅(WYSIWYG) 에디터 도입**
-   **Frontend (React):**
    -   [ ] `shadcn-editor` 또는 `novel-editor` 등 마크다운 기반 에디터 라이브러리 설치 및 설정.
    -   [ ] `CreatePostPage`, `EditPostPage`의 `Textarea`를 새로운 에디터 컴포넌트로 교체.
    -   [ ] 에디터의 `onChange` 이벤트 발생 시 `content` 상태를 업데이트하도록 구현.
-   **Backend (NestJS):**
    -   [ ] `uploads` 모듈 생성.
    -   [ ] `multer`를 사용하여 이미지 업로드를 처리하는 API 엔드포인트(`POST /uploads/image`) 구현.
    -   [ ] 업로드된 이미지의 URL을 클라이언트에 반환하는 로직 구현.
-   **Frontend (React) - Cont'd:**
    -   [ ] 에디터에 이미지 업로드 버튼 추가 및 백엔드 API 연동.

---

## Phase 2: 콘텐츠 발견 및 커뮤니티 기능 구현

#### **Task 2.1: 메인 피드 및 검색/필터링 기능 구현**
-   **Backend (NestJS):**
    -   [ ] `GET /posts` API 로직 수정:
        -   [ ] `page`, `limit` 쿼리 파라미터를 이용한 페이지네이션 구현.
        -   [ ] `categoryId` 쿼리 파라미터를 이용한 카테고리 필터링 기능 추가.
        -   [ ] `keyword` 쿼리 파라미터를 이용한 제목/내용 검색 기능 추가 (`Prisma`의 `contains` 또는 `search` 사용).
-   **Frontend (React):**
    -   [ ] `HomePage.tsx` 컴포넌트 구현:
        -   [ ] `react-query`의 `useInfiniteQuery`를 사용하여 무한 스크롤 또는 페이지네이션 구현.
        -   [ ] 카테고리 목록을 표시하고 선택 시 해당 카테고리의 글만 필터링하여 보여주는 UI 구현.
        -   [ ] 검색창 UI 구현 및 검색어 입력 시 API를 호출하여 결과를 렌더링하는 기능 구현.

#### **Task 2.2: 댓글 및 좋아요 기능 구현**
-   **DB (Prisma):**
    -   [ ] `Comment` 모델 정의 (`id`, `content`, `createdAt`, `updatedAt`, `userId`, `postId`, `parentId` - 대댓글용 자기 참조).
    -   [ ] `Like` 모델 정의 (`userId`, `postId` - 복합 기본 키).
    -   [ ] Prisma 마이그레이션 실행.
-   **Backend (NestJS):**
    -   [ ] `comments` 모듈 생성 및 특정 게시물의 댓글 CRUD API 구현.
    -   [ ] `likes` 모듈 생성 및 게시물 좋아요/좋아요 취소 API 구현.
    -   [ ] 게시물 상세 조회 시 댓글 목록과 좋아요 개수, 현재 사용자의 좋아요 여부를 함께 반환.
-   **Frontend (React):**
    -   [ ] `PostDetailPage.tsx` 컴포넌트 하단에 댓글 영역 구현:
        -   [ ] 댓글 목록 (대댓글 포함) 렌더링.
        -   [ ] 댓글 작성 폼 구현.
    -   [ ] `PostCard.tsx` 및 `PostDetailPage.tsx`에 좋아요 버튼 및 카운트 표시.

#### **Task 2.3: 사용자 프로필 페이지 구현**
-   **Backend (NestJS):**
    -   [ ] `users.controller`에 `GET /users/:id` 엔드포인트 추가하여 특정 사용자 정보(부서 포함) 조회 기능 구현.
    -   [ ] `posts.controller`에 `GET /users/:id/posts` 엔드포인트 추가하여 특정 사용자가 작성한 글 목록 조회 기능 구현.
-   **Frontend (React):**
    -   [ ] `/profile/:userId` 동적 라우트 추가.
    -   [ ] `ProfilePage.tsx` 컴포넌트 생성:
        -   [ ] 사용자 프로필 정보(이름, 이메일, 부서) 표시.
        -   [ ] 해당 사용자가 작성한 글 목록을 `PostCard`를 재사용하여 렌더링.

---

## Phase 3: 사내 시스템 특화 기능 및 고도화

#### **Task 3.1: 공지사항 기능 구현**
-   **DB (Prisma):**
    -   [ ] `Post` 모델에 `isAnnouncement` (Boolean, default: `false`) 필드 추가.
    -   [ ] Prisma 마이그레이션 실행.
-   **Backend (NestJS):**
    -   [ ] 게시물 생성/수정 DTO에 `isAnnouncement` 필드 추가 (관리자 권한 필요).
    -   [ ] `GET /posts` API 로직 수정: `isAnnouncement`가 `true`인 게시물을 항상 최상단에 정렬하여 반환.
-   **Frontend (React):**
    -   [ ] `PostCard.tsx`에 공지사항 게시물임을 나타내는 뱃지(Badge) 또는 아이콘 추가.
    -   [ ] 관리자용 글 작성/수정 페이지에 '공지사항으로 지정' 체크박스 UI 추가.

#### **Task 3.2: 작성자 대시보드 통계 기능 구현**
-   **DB (Prisma):**
    -   [ ] `Post` 모델에 `viewCount` (Int, default: 0) 필드 추가.
    -   [ ] Prisma 마이그레이션 실행.
-   **Backend (NestJS):**
    -   [ ] `GET /posts/:id` (게시물 상세 조회) 서비스 로직에 `viewCount`를 1 증가시키는 로직 추가.
    -   [ ] `GET /users/me/stats` 와 같은 API를 구현하여 로그인한 사용자의 게시물별 조회수, 좋아요 수, 댓글 수를 집계하여 반환.
-   **Frontend (React):**
    -   [ ] `DashboardPage.tsx` 컴포넌트 수정:
        -   [ ] 기존의 글 목록 옆에 각 글의 조회수, 좋아요 수, 댓글 수를 표시.

#### **Task 3.3: 알림 시스템 구현**
-   **DB (Prisma):**
    -   [ ] `Notification` 모델 정의 (`id`, `type` (enum: `NEW_COMMENT`, `NEW_LIKE`), `read` (Boolean), `recipientId`, `senderId`, `postId`).
    -   [ ] Prisma 마이그레이션 실행.
-   **Backend (NestJS):**
    -   [ ] `notifications` 모듈 생성.
    -   [ ] 댓글/좋아요 생성 시 `Notification` 데이터를 생성하는 로직을 `comments.service`, `likes.service`에 추가.
    -   [ ] 로그인한 사용자의 알림 목록 조회 API (`GET /notifications`), 알림 읽음 처리 API (`PATCH /notifications/:id/read`) 구현.
-   **Frontend (React):**
    -   [ ] `Layout.tsx` (헤더)에 알림 아이콘 및 드롭다운 메뉴 추가.
    -   [ ] 주기적으로 알림 API를 호출(`useQuery`의 `refetchInterval` 사용)하여 새로운 알림을 표시.
    -   [ ] 알림 클릭 시 해당 게시물로 이동하고 읽음 처리되도록 구현.
