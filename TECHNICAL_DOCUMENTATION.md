# Technical Documentation

## 1. Application Purpose

This frontend application powers the FINDU anti-malpractice platform for education management. Its main purpose is to provide a secure, role-aware web interface where users can authenticate, verify identity, manage academic workflows, and interact with platform services.

## 2. Architecture Overview

The application uses the Next.js App Router architecture with TypeScript and a component-based UI structure.

### Core architectural layers

- Presentation layer: React components located under `src/components`
- Routing layer: Next.js route groups and pages under `src/app`
- State and session layer: Redux Toolkit, redux-persist, and NextAuth providers
- Shared logic layer: helpers and utilities under `src/lib`
- Integration layer: API calls and backend communication through environment-configured endpoints

## 3. Framework and Runtime Choices

### Frontend framework

- Next.js 16 for server-rendered and app-router-based UI
- React 19 for component rendering and hooks

### State management

- Redux Toolkit for predictable global state
- `redux-persist` to preserve selected state across reloads
- `next-auth/react` for authentication session integration

### Styling and UI

- Tailwind CSS via PostCSS
- Framer Motion for animations
- React Toastify for notifications

## 4. Main Feature Areas

### Authentication and routing

Authentication is handled through a provider stack in `src/providers`, and protected routes are managed through the proxy layer in `src/proxy.ts`. The proxy applies redirect logic based on the presence of tokens and user role.

### Dashboard experience

The dashboard is organized into role-specific sections for:

- students
- lecturers
- vendors
- admins

The routes are defined through the `ProtectedRouteEnum` constants in `src/lib/enums.ts`.

### Verification and identity workflows

The platform includes identity verification steps such as:

- selfie / document capture flows
- KYC-style verification options
- face-authentication setup support

### Academic and exam workflows

The UI includes functionality related to:

- courses and course materials
- exam registration and result review
- department-based management screens
- lecturer/student operations

## 5. Project Structure

```text
src/
  app/                # Next.js App Router pages and route groups
  components/         # Feature-based UI components
  lib/                # Shared enums, helpers, server helpers, utilities
  providers/          # Auth, notification, session, and provider wrappers
  redux/              # Store setup and slices
  types/              # Global TypeScript types
```

## 6. Important Configuration Files

- `package.json` — scripts, dependencies, and project metadata
- `next.config.ts` — Next.js configuration, including standalone output
- `env.sample` — environment variable template
- `build-standalone.sh` — build and run script for standalone deployment

## 7. Environment Variables

The application relies on environment values such as:

- `BACKEND_API_URL` — primary backend API base URL
- `NEXT_PUBLIC_WS_URL` — WebSocket endpoint for real-time features
- `NEXTAUTH_SECRET` and related auth values — NextAuth configuration
- `NEXT_PUBLIC_URL` and `NEXT_PUBLIC_NEXTAUTH_URL` — public app URLs
- `FLUTTERWAVE_SECRET_KEY` — payment integration secret (if enabled in the backend flow)

The repository includes an example file at `env.sample` for reference.

## 8. Data and API Integration

The frontend communicates with a backend service using environment-driven API URLs. In practice:

- protected routes depend on auth cookies and JWT-based state
- the app uses fetch-based requests for API interactions
- real-time features may use the Socket.IO endpoint configured via `NEXT_PUBLIC_WS_URL`

## 9. Build and Run Flow

### Development

```bash
npm install
cp env.sample .env.local
npm run dev
```

### Production build

```bash
npm run build
```

### Standalone deployment

A convenience script is provided:

```bash
./build-standalone.sh
```

This script builds the Next.js app, copies static assets into the standalone output, and starts the production server.

## 10. Extension and Maintenance Notes

When extending this project, keep the following in mind:

- follow the existing feature-based component organization
- keep auth and route-guard logic centralized in the providers/proxy layer
- prefer shared helpers and enums over duplicate logic
- ensure new environment variables are documented in `env.sample`
- verify role-based routing behavior whenever adding new protected routes

## 11. Suggested Development Workflow

1. Create or update feature components under the relevant folder in `src/components`
2. Add or update route pages under `src/app`
3. Share logic through `src/lib` where appropriate
4. Update state through Redux slices when global state is needed
5. Validate the work with linting, type checks, and build verification
