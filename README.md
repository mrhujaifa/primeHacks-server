# Prime Hacks Backend

Prime Hacks Backend is the API and authentication service behind the PrimeHacks platform. It powers user onboarding, email verification, role-based access control, organizer applications, hackathon management, project submissions, and premium subscription payments.

## Overview

This service is built with `Express 5`, `TypeScript`, `Prisma`, and `PostgreSQL`. Authentication is handled with `better-auth`, email OTP delivery uses `Resend`, and premium subscription checkout is integrated with `Stripe`. The project is structured for local development and Vercel deployment.

## Core Features

- Email and password registration with OTP-based email verification
- Google social login through `better-auth`
- Cookie-based authentication using Better Auth sessions plus custom JWT access and refresh tokens
- Role-based authorization for `USER`, `ORGANIZER`, and `ADMIN`
- Hackathon category seeding and hackathon CRUD for organizers/admins
- Organizer application workflow for users who want publishing access
- Submission workflow with duplicate-submission and deadline checks
- Stripe checkout session creation, webhook handling, and premium account upgrades
- PostgreSQL persistence through Prisma with generated client output in `prisma/generated/prisma`
- Vercel-ready server entrypoint through `api/index.ts`

## Tech Stack

| Layer | Tools |
| --- | --- |
| Runtime | Node.js `20.x` |
| Language | TypeScript |
| HTTP Server | Express `5` |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | better-auth |
| Payments | Stripe |
| Email | Resend |
| Validation | Zod |
| Build | tsup |
| Package Manager | pnpm `10.24.0` |
| Deployment Target | Vercel |

## Architecture

- `src/app.ts` creates the Express application, mounts middleware, auth, business routes, Stripe webhook handling, and global error handling.
- `src/server.ts` starts the local Node server.
- `api/index.ts` is the Vercel-compatible entrypoint.
- `src/lib/auth.ts` configures Better Auth with Prisma and OTP email delivery.
- `src/lib/prisma.ts` initializes Prisma with the PostgreSQL adapter.
- Business features are split into modules under `src/app/modules`.
- Shared error handling, auth verification, response helpers, and utilities live under `src/app/middlewares`, `src/app/shared`, and `src/app/utils`.

## Authentication Model

Protected routes use the `verifyAuth` middleware.

The middleware checks authentication in this order:

1. Better Auth session cookie: `better-auth.session_token`
2. Custom JWT access token cookie: `accessToken`

Cookies commonly used by the backend:

- `better-auth.session_token`
- `accessToken`
- `refreshToken`

## Roles and Access

| Role | Capabilities |
| --- | --- |
| Guest | Register, login, view public hackathons and categories |
| User | Access profile, submit projects, start payments, apply to become organizer |
| Organizer | All user capabilities plus create, update, delete, and manage own hackathons |
| Admin | All organizer capabilities plus manage user roles and account statuses |

## API Base Paths

- Root health-style route: `/`
- Better Auth routes: `/api/auth/*`
- Main REST API: `/api/v1`
- Stripe webhook endpoint: `/webhook`

## Response Format

Most business endpoints return data in this format:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {},
  "meta": {}
}
```

`meta` is optional and is included only when needed.

## Project Structure

```text
prime-hacks-backend/
|-- api/
|   `-- index.ts
|-- prisma/
|   |-- generated/
|   |-- migrations/
|   `-- schema/
|-- scripts/
|-- src/
|   |-- app/
|   |   |-- errors/
|   |   |-- middlewares/
|   |   |-- modules/
|   |   |   |-- admin/
|   |   |   |-- auth/
|   |   |   |-- hackathon/
|   |   |   |-- organizerApplication/
|   |   |   |-- payment/
|   |   |   `-- submission/
|   |   |-- routes/
|   |   |-- shared/
|   |   |-- types/
|   |   `-- utils/
|   |-- config/
|   |-- lib/
|   |-- scripts/
|   |-- app.ts
|   `-- server.ts
|-- .env.example
|-- package.json
|-- tsconfig.json
|-- tsup.config.ts
`-- vercel.json
```

## Environment Variables

Create a local `.env` file based on `.env.example`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NODE_ENV` | Yes | Runtime mode such as `development` or `production` |
| `PORT` | Yes | Local server port |
| `FRONTEND_URL` | Yes | Frontend origin allowed by CORS and trusted by Better Auth |
| `NEXT_PUBLIC_CLIENT_URL` | Yes | Frontend base URL used for Stripe success/cancel redirects |
| `BETTER_AUTH_SECRET` | Yes | Better Auth secret |
| `BETTER_AUTH_URL` | Yes | Public backend base URL used by Better Auth |
| `ACCESS_TOKEN_SECRET` | Yes | Secret for custom access token generation |
| `ACCESS_TOKEN_EXPIRES_IN` | Yes | Access token lifetime |
| `REFRESH_TOKEN_SECRET` | Yes | Secret for refresh token generation |
| `REFRESH_TOKEN_EXPIRES_IN` | Yes | Refresh token lifetime |
| `GOOGLE_CLIENT_ID` | Required for Google login | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Required for Google login | Google OAuth client secret |
| `RESEND_API_KEY` | Required for OTP emails | Resend API key |
| `EMAIL_FROM` | Recommended | Sender email identity for OTP emails |
| `STRIPE_SECRET` | Required for payments | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Required for payments | Stripe webhook signing secret |
| `STRIPE_MONTHLY_PRICE_ID` | Required for payments | Stripe price ID for the monthly premium plan |
| `STRIPE_YEARLY_PRICE_ID` | Required for payments | Stripe price ID for the yearly premium plan |
| `CORS_ORIGINS` | Optional | Reserved in config/example, not currently used by runtime CORS logic |
| `RUN_PRISMA_MIGRATIONS` | Optional | Reserved for deployment workflows |

## Local Development

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

PowerShell alternative:

```powershell
Copy-Item .env.example .env
```

Fill in all required values before starting the app.

### 3. Generate Prisma client

```bash
pnpm generate
```

### 4. Apply database changes

Use one of the following depending on your workflow:

```bash
pnpm migrate
```

or

```bash
pnpm push
```

### 5. Seed categories

```bash
pnpm seed
```

### 6. Start the development server

```bash
pnpm dev
```

The API will run on `http://localhost:<PORT>`.

## Available Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Run the API in watch mode using `tsx` |
| `pnpm build` | Build the project with `tsup` |
| `pnpm start` | Run the built server from `dist` |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint across `src` |
| `pnpm migrate` | Run Prisma development migrations |
| `pnpm generate` | Generate Prisma client |
| `pnpm studio` | Open Prisma Studio |
| `pnpm push` | Push Prisma schema to database without migration files |
| `pnpm pull` | Pull database schema into Prisma |
| `pnpm deploy` | Apply Prisma migrations in deployment environments |
| `pnpm format` | Format Prisma schema files |
| `pnpm seed` | Seed hackathon categories |
| `pnpm vercel-build` | Generate Prisma client and build for Vercel |
| `pnpm stripe:webhook` | Forward Stripe webhooks to local `/webhook` endpoint |

## Seed Data

`pnpm seed` inserts default hackathon categories including:

- AI / Machine Learning
- Blockchain / Web3
- FinTech
- HealthTech
- EdTech
- Cybersecurity
- Web Development
- Application Development
- Mobile App Development
- SaaS / Productivity
- E-commerce
- Gaming
- IoT / Hardware

## API Reference

### Auth

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Public | Register user and set auth cookies |
| `POST` | `/api/v1/auth/login` | Public | Login user and set auth cookies |
| `GET` | `/api/v1/auth/me` | `USER`, `ORGANIZER`, `ADMIN` | Get current authenticated user |
| `GET` | `/api/v1/auth/logout` | Public | Clear auth cookies and logout |
| `POST` | `/api/v1/auth/verify-email-otp` | Public | Verify email OTP after signup |
| `ALL` | `/api/auth/*` | Public / Better Auth managed | Better Auth internal routes including social auth |

### Hackathons

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/hackathons` | `ORGANIZER`, `ADMIN` | Create a new hackathon |
| `GET` | `/api/v1/hackathons` | Public | Get all hackathons |
| `GET` | `/api/v1/hackathons/my-hackathons` | `ORGANIZER`, `ADMIN` | Get hackathons owned by the authenticated organizer/admin |
| `GET` | `/api/v1/hackathons/category` | Public | Get available hackathon categories |
| `GET` | `/api/v1/hackathons/:id` | `USER`, `ORGANIZER`, `ADMIN` | Get a single hackathon with related data |
| `PATCH` | `/api/v1/hackathons/:id` | `ORGANIZER`, `ADMIN` | Update an owned hackathon |
| `DELETE` | `/api/v1/hackathons/:id` | `ORGANIZER`, `ADMIN` | Delete an owned hackathon |

### Submissions

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/submission/hackathon/:id` | `USER`, `ORGANIZER`, `ADMIN` | Create one submission for a hackathon |
| `GET` | `/api/v1/submission/my-submission` | `USER`, `ORGANIZER`, `ADMIN` | Get current user's submissions |

### Payments

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/payments/create-checkout-session` | `USER`, `ORGANIZER`, `ADMIN` | Create Stripe checkout session for `MONTHLY` or `YEARLY` plan |
| `GET` | `/api/v1/payments/verify-session/:sessionId` | `USER`, `ORGANIZER`, `ADMIN` | Verify Stripe checkout result |
| `POST` | `/webhook` | Stripe | Receive Stripe webhook events |

### Admin

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/v1/admins/users` | `ADMIN` | Get all users |
| `PATCH` | `/api/v1/admins/users/:id/role` | `ADMIN` | Change user role |
| `PATCH` | `/api/v1/admins/users/:id/status` | `ADMIN` | Change user status |

### Organizer Application

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/organizerApplication` | `USER` | Submit organizer application |
| `GET` | `/api/v1/organizerApplication/me` | `USER`, `ORGANIZER`, `ADMIN` | Get current user's organizer application |

## Sample Request Payloads

### Register User

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "StrongPassword123!"
}
```

### Verify Email OTP

```json
{
  "email": "jane@example.com",
  "otp": "123456"
}
```

### Create Hackathon

```json
{
  "title": "Prime Hacks AI Sprint",
  "shortDescription": "A fast-paced AI hackathon.",
  "fullDescription": "Build practical AI products with your team and submit before the deadline.",
  "categoryId": "cm123example",
  "submissionDeadline": "2026-06-30T23:59:59.000Z",
  "registrationFee": 0,
  "currency": "USDT",
  "status": "UPCOMING",
  "isFeatured": true,
  "isPremiumOnly": false
}
```

### Create Submission

```json
{
  "title": "Smart Copilot",
  "shortSummary": "An AI workflow assistant.",
  "description": "End-to-end project description goes here.",
  "techStack": ["Next.js", "Node.js", "PostgreSQL"],
  "repositoryUrl": "https://github.com/example/repo",
  "demoUrl": "https://example.com/demo",
  "videoUrl": "https://example.com/video"
}
```

### Organizer Application

```json
{
  "organizationName": "Prime Labs",
  "websiteUrl": "https://primelabs.example",
  "contactEmail": "team@primelabs.example",
  "previousExperience": "Hosted 3 university hackathons.",
  "reason": "We want to onboard new builders and run community events.",
  "expectedHackathonType": "ONLINE",
  "agreeToGuidelines": true
}
```

### Create Checkout Session

```json
{
  "plan": "MONTHLY"
}
```

## Business Rules Implemented

- A user cannot register with an already-used email address.
- Email/password signups require email verification.
- Suspended or blocked users cannot fully use the platform.
- Only organizers and admins can create hackathons.
- Hackathon updates and deletions are owner-protected.
- Users cannot submit to the same hackathon more than once.
- Users cannot submit after the submission deadline.
- Premium status is updated when Stripe payment verification succeeds.
- Stripe webhook events are de-duplicated through stored Stripe event IDs.

## Database Overview

| Model | Purpose |
| --- | --- |
| `User` | Core account, role, status, premium flags |
| `Session` | Better Auth session persistence |
| `Account` | Social/provider account linkage |
| `Verification` | OTP and verification records |
| `UserProfile` | Optional profile metadata such as bio and portfolio links |
| `Category` | Hackathon categories |
| `Hackathon` | Main hackathon entity |
| `HackathonReward` | Prize and reward details |
| `HackathonWinner` | Winning submission mapping |
| `HackathonBookmark` | Saved hackathons per user |
| `Submission` | Project submissions to hackathons |
| `Payment` | Stripe payment records and status |
| `Subscription` | Subscription plan state |
| `OrganizerApplication` | User requests for organizer access |

## Deployment

### Vercel

This repository is already prepared for Vercel deployment:

- `vercel.json` rewrites all incoming requests to `api/index.ts`
- `api/index.ts` loads environment config and exports the Express app
- `pnpm vercel-build` runs Prisma client generation and the project build

### Deployment Checklist

1. Provision a PostgreSQL database.
2. Add all required environment variables in Vercel.
3. Set `BETTER_AUTH_URL` to the deployed backend URL.
4. Set `FRONTEND_URL` and `NEXT_PUBLIC_CLIENT_URL` to the deployed frontend URL.
5. Configure Stripe webhook delivery to `https://<your-backend-domain>/webhook`.
6. Run Prisma migrations in the deployment environment.

## Important Notes

- `pnpm test` is currently a placeholder and no automated test suite is configured yet.
- The organizer application module has a validation schema, but route-level validation is currently commented out.
- `CORS_ORIGINS` exists in the environment example, but runtime CORS currently uses `FRONTEND_URL` plus a hardcoded Render origin.
- `pnpm stripe:webhook` forwards to `localhost:5000/webhook`; update the script or local `PORT` if your setup differs.

## License

This project is licensed under the `ISC` license.
