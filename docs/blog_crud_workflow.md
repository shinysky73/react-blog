# 워크플로우: 블로그 게시물 전체 기능 (CRUD) 구현

`prd.md` 문서와 추가 요구사항(리스트, 수정, 삭제)을 분석하여 다음과 같은 체계적인 전체 기능 구현 워크플로우를 도출했습니다.

## 1단계: 요구사항 분석 및 아키텍처 확장 설계

### 1.1. 핵심 요구사항 분석
- **생성(Create):** 인증된 사용자가 새 게시물을 작성합니다. (완료)
- **읽기(Read):**
    - **리스트:** 사용자가 작성한 모든 게시물을 카드 형태의 목록으로 조회합니다.
    - **상세:** (수정을 위해) 특정 게시물의 상세 내용을 불러옵니다.
- **수정(Update):** 사용자가 자신이 작성한 게시물의 제목과 내용을 수정합니다.
- **삭제(Delete):** 사용자가 자신이 작성한 게시물을 삭제합니다.
- **권한:** 게시물의 수정 및 삭제는 해당 게시물을 작성한 사용자만 가능해야 합니다.

### 1.2. 아키텍처 확장 설계

#### Backend (NestJS)
- **API 엔드포인트 확장 (`PostsController`):**
    - `GET /api/posts`: 현재 로그인한 사용자의 모든 게시물을 반환합니다.
    - `GET /api/posts/:id`: 특정 ID의 게시물 정보를 반환합니다.
    - `PATCH /api/posts/:id`: 특정 게시물을 수정합니다. (소유권 검증 필요)
    - `DELETE /api/posts/:id`: 특정 게시물을 삭제합니다. (소유권 검증 필요)
- **비즈니스 로직 확장 (`PostsService`):**
    - `findAllForUser(userId)`: 특정 사용자의 모든 게시물을 조회하는 로직을 구현합니다.
    - `findOne(id, userId)`: 특정 게시물을 조회하되, 소유권 검증 로직을 포함합니다.
    - `update(id, dto, userId)`: 게시물 수정 로직에 소유권 검증을 추가합니다.
    - `remove(id, userId)`: 게시물 삭제 로직에 소유권 검증을 추가합니다.
- **DTO 추가:**
    - `UpdatePostDto`: 게시물 수정을 위한 DTO를 생성합니다. `title`과 `content`는 모두 선택적 필드입니다.

#### Frontend (React)
- **UI 컴포넌트:**
    - `PostCard.tsx`: 단일 게시물을 카드 형태로 표시하는 재사용 가능한 컴포넌트를 생성합니다. 카드에는 수정/삭제 버튼이 포함됩니다.
- **페이지 확장 및 신규 생성:**
    - `DashboardPage.tsx`: `useQuery`를 사용해 게시물 목록을 불러와 `PostCard` 컴포넌트들을 렌더링합니다.
    - `EditPostPage.tsx`: 게시물 수정을 위한 새로운 페이지를 생성합니다. 기존 게시물 데이터를 불러와 폼을 채웁니다.
- **API 연동:**
    - `lib/api.ts`: `getPosts`, `getPostById`, `updatePost`, `deletePost` 함수를 추가합니다.
- **라우팅:**
    - `App.tsx`: 게시물 수정을 위한 동적 경로(e.g., `/edit-post/:postId`)를 추가합니다.
- **상태 관리:**
    - 생성, 수정, 삭제 작업 성공 시 `useQuery`의 `queryClient`를 사용하여 게시물 목록 캐시를 무효화(invalidate)하고 데이터를 자동으로 새로고침합니다.

## 2단계: 구현 작업 목록 (상세)

### Phase 1: 백엔드 확장

-   **Posts 모듈 로직 확장 (`posts.service.ts`)**
    -   [ ] `findAllForUser` 메서드 구현: `this.prisma.post.findMany({ where: { authorId: userId } })`
    -   [ ] `update` 및 `remove` 메서드에 소유권 검증 로직 추가: 수정/삭제 전, 해당 `postId`의 `authorId`가 요청한 `userId`와 일치하는지 확인. 불일치 시 `ForbiddenException` 발생.
    -   [ ] `findOne` 메서드 구현.

-   **API 엔드포인트 추가 (`posts.controller.ts`)**
    -   [ ] `GET /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`에 해당하는 컨트롤러 메서드 추가.
    -   [ ] 각 메서드가 `PostsService`의 해당 로직을 호출하도록 연결.

-   **DTO 생성 (`dto/update-post.dto.ts`)**
    -   [ ] `CreatePostDto`와 유사하게 `UpdatePostDto`를 생성하되, `@IsOptional()` 데코레이터를 사용하여 필드를 선택적으로 만듭니다.

### Phase 2: 프런트엔드 구현

-   **API 클라이언트 확장 (`lib/api.ts`)**
    -   [ ] `getPosts`, `updatePost(postId, data)`, `deletePost(postId)` 함수 구현.

-   **게시물 카드 컴포넌트 생성 (`components/PostCard.tsx`)**
    -   [ ] `Card` 컴포넌트(shadcn/ui)를 기반으로 게시물의 `title`, `content`를 표시.
    -   [ ] 카드 내에 "수정" (`Link` to `/edit-post/:id`)과 "삭제" (`Button`) 버튼 추가.
    -   [ ] 삭제 버튼 클릭 시 `useMutation`을 사용하여 `deletePost` API를 호출하고, 성공 시 목록을 새로고침하도록 구현.

-   **대시보드 페이지 수정 (`pages/Dashboard.tsx`)**
    -   [ ] `useQuery({ queryKey: ['posts'], queryFn: getPosts })`를 사용하여 게시물 목록을 가져옵니다.
    -   [ ] 로딩 및 오류 상태를 처리합니다.
    -   [ ] 조회된 데이터를 `map`을 통해 `PostCard` 컴포포넌트 목록으로 렌더링합니다.

-   **게시물 수정 페이지 생성 (`pages/EditPostPage.tsx`)**
    -   [ ] `CreatePostPage`를 기반으로 수정 페이지를 생성합니다.
    -   [ ] URL 파라미터에서 `postId`를 가져와 `useQuery`로 기존 게시물 데이터를 불러옵니다.
    -   [ ] `react-hook-form`의 `reset` 또는 `defaultValues`를 사용하여 폼을 기존 데이터로 채웁니다.
    -   [ ] `useMutation`을 사용하여 `updatePost` API를 호출하고, 성공 시 대시보드로 이동 및 목록 새로고침.

### Phase 3: 통합 및 최종화

-   **라우팅 설정 (`App.tsx`)**
    -   [ ] `ProtectedRoute` 내에 `/edit-post/:postId` 동적 경로 추가.

-   **쿼리 캐시 관리**
    -   [ ] 게시물 생성, 수정, 삭제 성공 시 `queryClient.invalidateQueries({ queryKey: ['posts'] })`를 호출하여 대시보드의 게시물 목록이 자동으로 업데이트되도록 설정.

-   **최종 테스트**
    -   [ ] 게시물 생성 -> 목록에 표시 -> 수정 -> 삭제로 이어지는 전체 사용자 시나리오를 테스트합니다.
    -   [ ] 다른 사용자의 게시물을 수정/삭제하려고 할 때 API에서 적절히 차단되는지 확인합니다.
