# Project: React & NestJS Authentication App

## Project Overview

This is a full-stack web application featuring user authentication. The project is structured as a monorepo managed by `pnpm`, with a `frontend` workspace built with React (using Vite) and a `backend` workspace built with NestJS.

The primary goal is to provide a secure authentication system where users can sign up, log in, and access protected routes.

### Key Technologies

*   **Frontend:**
    *   Framework: React with Vite
    *   Language: TypeScript
    *   Styling: Tailwind CSS with shadcn/ui
    *   State Management: Zustand for global state, React Query for server state
    *   Routing: React Router
    *   API Communication: Axios

*   **Backend:**
    *   Framework: NestJS
    *   Language: TypeScript
    *   ORM: Prisma
    *   Database: PostgreSQL
    *   Authentication: JWT (JSON Web Tokens) with Passport.js
    *   Security: `bcrypt` for password hashing

*   **Tooling:**
    *   Package Manager: `pnpm` with workspaces
    *   Linting/Formatting: ESLint and Prettier

## Building and Running

### Prerequisites

*   Node.js and pnpm
*   PostgreSQL database running

### Setup

1.  **Install dependencies from the root directory:**
    ```bash
    pnpm install
    ```

2.  **Configure Environment Variables:**
    *   Create a `.env` file in the `backend` directory.
    *   Add the following variables, adjusting the values for your local setup:
        ```env
        DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
        JWT_SECRET="your-super-secret-and-long-key"
        ```

3.  **Run Database Migrations:**
    *   Apply the Prisma schema to your database.
    *   From the root directory, run:
        ```bash
        pnpm --filter backend exec prisma migrate dev
        ```

### Running the Application

The frontend and backend servers must be run in separate terminals.

*   **Start the Backend Server (watch mode):**
    ```bash
    pnpm --filter backend run start:dev
    ```
    The backend will be available at `http://localhost:3000`.

*   **Start the Frontend Server:**
    ```bash
    pnpm --filter frontend run dev
    ```
    The frontend will be available at `http://localhost:5173`.

### Running Tests

*   **Backend Unit Tests:**
    ```bash
    pnpm --filter backend run test
    ```

*   **Backend E2E Tests:**
    ```bash
    pnpm --filter backend run test:e2e
    ```

## Development Conventions

*   **Monorepo Structure:** The project uses `pnpm` workspaces to manage the `frontend` and `backend` packages. All commands should generally be run from the root directory using the `--filter` flag.
*   **API:** The backend exposes a REST API with all endpoints prefixed by `/api`. The frontend uses a proxy during development to forward requests from `/api` to the backend server on port 3000, avoiding CORS issues.
*   **State Management:** Global client-side state (like authentication status) is managed with Zustand. Asynchronous server state (API requests) is handled by React Query.
*   **Authentication Flow:**
    1.  User signs up or logs in via the frontend.
    2.  Backend validates credentials, hashes the password (`bcrypt`), and returns a JWT.
    3.  Frontend stores the JWT (using Zustand `persist` middleware which syncs to `localStorage`).
    4.  For subsequent API calls, an Axios interceptor attaches the JWT to the `Authorization` header.
    5.  Backend uses a `JwtAuthGuard` to protect specific routes, validating the token on incoming requests.
*   **Code Style:** Code formatting is enforced by Prettier, and linting by ESLint. Run `pnpm --filter <workspace> run format` and `pnpm --filter <workspace> run lint` to maintain consistency.
