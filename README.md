# Technical Specification Validator — Frontend

React 19 + Vite frontend for the AI-powered ТЗ validator. Pure presentation — all AI logic lives in the [backend](../TechnicalSpecificationValidatorBackend/README.md). Communication is plain REST.

## Stack

- Node.js 24 (via NVM)
- React 19, React DOM 19
- Vite 8 + `@vitejs/plugin-react`
- TypeScript 5 (strict, project references)
- Tailwind CSS 4 (`@tailwindcss/vite` plugin) + `@tailwindcss/typography`
- TanStack Query 5 — server state / mutations
- Axios — HTTP client
- React Hook Form + Zod — form validation
- `react-markdown` + `remark-gfm` — rendering the Markdown report
- ESLint 9 + Prettier

## Folder layout (Feature-Sliced Design)

```
src/
  app/                        # composition root
    main.tsx                  # React 19 entrypoint
    App.tsx                   # provider composition
    providers/QueryProvider.tsx
    styles/index.css          # Tailwind v4 entry (+ @plugin typography)
  pages/
    validator/                # ValidatorPage
  widgets/
    spec-input-panel/         # left column: textarea + actions
    validation-result-panel/  # right column: loading/empty/error/markdown
  features/
    validate-spec/            # API + useMutation hooks
  entities/
    validation-report/        # type + MarkdownReport
  shared/
    api/                      # axios client + error extractor
    config/                   # env access (VITE_API_BASE_URL)
    lib/cn.ts                 # className combiner
    ui/                       # Button, Textarea, Card, Spinner
```

## Getting started

```bash
# Pick Node 24 via NVM
nvm install 24
nvm use            # reads .nvmrc -> 24

# Install
npm install

# Configure environment
cp .env.example .env
# .env contents:
# VITE_API_BASE_URL=http://localhost:3001

# Dev
npm run dev        # http://localhost:5173

# Production build
npm run build
npm run preview
```

## Environment variables

| Variable             | Required | Default                  | Description                  |
| -------------------- | -------- | ------------------------ | ---------------------------- |
| `VITE_API_BASE_URL`  | yes      | —                        | URL of the backend server    |

## Scripts

| Script        | What it does                          |
| ------------- | ------------------------------------- |
| `dev`         | Vite dev server on port 5173          |
| `build`       | `tsc -b && vite build`                |
| `preview`     | Preview built bundle (port 4173)      |
| `typecheck`   | `tsc -b --noEmit`                     |
| `lint`        | ESLint over `src/`                    |
| `format`      | Prettier write                        |

## Wiring with the backend

The backend must be running and reachable at `VITE_API_BASE_URL` before you can submit ТЗ. From the backend folder:

```bash
nvm use && npm install
cp .env.example .env  # paste GEMINI_API_KEY
npm run dev           # http://localhost:3001
```

Backend's `CORS_ORIGIN` must include the frontend origin (default `http://localhost:5173`).
