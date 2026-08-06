# Anti Malpractice Frontend

This repository contains the frontend application for the FINDU anti-malpractice education platform. It is built with Next.js and provides role-based dashboards for students, lecturers, vendors, and administrators, along with authentication, verification flows, course materials, payments, and support features.

## Overview

The application is designed to support a modern academic ecosystem where users can:

- sign in or sign up and access role-specific dashboards
- complete identity verification and face-authentication steps
- browse and manage courses, exams, and course materials
- register for exams and review result-related workflows
- interact with admin and vendor management modules
- access support and onboarding experiences

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Redux Toolkit with redux-persist
- NextAuth.js
- Tailwind CSS
- Socket.IO client
- PDF.js and jsPDF for document and report handling
- Framer Motion for UI transitions

## Prerequisites

- Node.js 20+ recommended
- npm
- A running backend service that exposes the APIs configured in the environment variables

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your environment file:

   ```bash
   cp env.sample .env.local
   ```

3. Update the values in `.env.local` to match your local environment. At minimum, configure the backend URL and authentication-related variables.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3001 (or the port configured in your environment) in your browser.

## Available Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — run the production build locally
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript checks
- `npm run test` — run Jest tests
- `npm run prettier:fix` — format the project files

## Project Structure

- `src/app` — route groups and top-level Next.js app pages
- `src/components` — reusable UI components grouped by feature area
- `src/lib` — shared helpers, enums, and utilities
- `src/providers` — auth, Redux, notification, and session providers
- `src/redux` — Redux slices and store configuration
- `public` — static assets and PDF worker files

## Notes

- The app expects backend endpoints to be available through `BACKEND_API_URL` and related auth settings.
- The project includes a standalone build helper in `build-standalone.sh` for container-style deployments.
- Some routes are protected and redirected based on the signed-in user role.
