# Technical Specification Validator — Frontend

React 19 + Vite frontend for the AI-powered ТЗ validator. Pure presentation — all AI logic lives in
the [validator backend](../TechnicalSpecificationValidatorBackend/README.md). Authentication is
handled by the [ChalyshAuth](../../ChalyshAuth/README.md) service (Telegram + Google).

## Stack

- Node.js 24 (via NVM)
- React 19, React DOM 19
- Vite 8 + `@vitejs/plugin-react`
- TypeScript 5 (strict, project references)
- Tailwind CSS 4 (`@tailwindcss/vite` plugin) + `@tailwindcss/typography`
- TanStack Query 5 — server state / mutations
- Axios — HTTP client (Bearer-token interceptor + auto-refresh on 401)
- React Hook Form + Zod — form validation
- `react-markdown` + `remark-gfm` — rendering the Markdown report
- `@react-oauth/google` — Google Sign-In button
- Telegram Login Widget (vanilla script) for Telegram auth
- ESLint 9 + Prettier

## Folder layout (Feature-Sliced Design)

```
src/
  app/                        # composition root
    main.tsx                  # React 19 entrypoint
    App.tsx                   # QueryProvider + GoogleOAuthProvider + AuthProvider + AppRouter
    providers/QueryProvider.tsx
    styles/index.css          # Tailwind v4 entry
  pages/
    login/                    # LoginPage — Telegram + Google buttons
    validator/                # ValidatorPage — main app
  widgets/
    header/                   # logo + user info + quota badge + logout
    spec-input-panel/         # left column: textarea + actions
    validation-result-panel/  # right column: loading / empty / error / markdown
  features/
    validate-spec/            # POST /api/validate
    auth/
      telegram-login/         # TelegramLoginButton (embeds widget)
      google-login/           # GoogleLoginButton (@react-oauth/google)
      logout/                 # LogoutButton
    quota/                    # GET /api/usage + useQuota hook + QuotaBadge
  entities/
    validation-report/        # types + MarkdownReport
  shared/
    api/                      # axios client + 401 refresh interceptor + error extractor
    auth/                     # AuthContext, useAuth, tokenStorage, auth API calls
    config/                   # env (api + auth URLs, OAuth ids)
    lib/cn.ts                 # className combiner
    ui/                       # Button, Textarea, Card, Spinner
```

## Auth flow

```
                ┌────────────────────┐
                │     LoginPage      │
                │ ┌────────────────┐ │   Telegram widget user object
                │ │ Telegram btn   │─┼──────────────────────────────┐
                │ └────────────────┘ │                               │
                │ ┌────────────────┐ │   Google id_token             │
                │ │ Google btn     │─┼──────┐                        │
                │ └────────────────┘ │      │                        │
                └────────────────────┘      ▼                        ▼
                                    POST /auth/api/auth/google   POST /auth/api/auth/telegram
                                            │                        │
                                            └────────────┬───────────┘
                                                         ▼
                                          { accessToken, refreshToken, user }
                                                         │
                                  tokenStorage.write() + AuthContext.setSession()
                                                         │
                                                         ▼
                                                  ValidatorPage
                                                         │
                                  apiClient → Authorization: Bearer <access>
                                                         │
                                          POST http://localhost:3001/api/validate
                                                         │
                                  401 → automatic refresh via /auth/api/auth/refresh
                                  fail → tokenStorage.clear() → kicked back to LoginPage
```

## Getting started

```bash
nvm install 24
nvm use

npm install

cp .env.example .env
# Fill in:
#   VITE_API_BASE_URL         (validator backend)
#   VITE_AUTH_API_BASE_URL    (ChalyshAuth base)
#   VITE_TELEGRAM_BOT_USERNAME
#   VITE_GOOGLE_CLIENT_ID

npm run dev        # http://localhost:5173
```

Both ChalyshAuth (default `http://localhost:3000`) and the validator backend (default
`http://localhost:3001`) must be running; their CORS settings must allow the frontend origin.

## Environment variables

| Variable                      | Required | Description                                                                  |
| ----------------------------- | -------- | ---------------------------------------------------------------------------- |
| `VITE_API_BASE_URL`           | yes      | URL of the validator backend                                                 |
| `VITE_AUTH_API_BASE_URL`      | yes      | URL of ChalyshAuth (e.g. `http://localhost:3000/auth/api`)                   |
| `VITE_TELEGRAM_BOT_USERNAME`  | no\*     | Bot username for Telegram Login Widget. Without it, the Telegram button hides |
| `VITE_GOOGLE_CLIENT_ID`       | no\*     | Google OAuth web client id. Without it, the Google button hides              |

\* You need at least one of `VITE_TELEGRAM_BOT_USERNAME` / `VITE_GOOGLE_CLIENT_ID` for users to sign in.

## Scripts

| Script        | What it does                          |
| ------------- | ------------------------------------- |
| `dev`         | Vite dev server on port 5173          |
| `build`       | `tsc -b && vite build`                |
| `preview`     | Preview built bundle (port 4173)      |
| `typecheck`   | `tsc -b --noEmit`                     |
| `lint`        | ESLint over `src/`                    |
| `format`      | Prettier write                        |
