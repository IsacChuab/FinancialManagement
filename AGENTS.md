# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository.

## Project overview

Financial Management is a personal finance app (English-language UI) for tracking bills
(debit/credit/recurring), reordering them via drag-and-drop, and closing out months. It's a
pnpm/Turborepo monorepo with an end-to-end typed API via tRPC.

```
apps/
  api/        Backend — Node.js, Express, tRPC, MongoDB/Mongoose
  front/      Frontend — React 19, TypeScript, Vite, Tailwind v4, Ant Design v6
packages/
  shared/     Zod schemas + types shared by api and front (@isac-chuab/financial-shared)
```

`apps/front` and `apps/api` both depend on `packages/shared` via `workspace:*`. When you change
a Zod schema or type in `packages/shared/src`, rebuild it (`pnpm --filter @isac-chuab/financial-shared build`)
or run the root `pnpm build` so consumers pick up the new `dist/`.

## Commands

Run from the repo root unless noted. Turbo fans these out to each workspace.

```bash
pnpm install          # install all workspaces
pnpm dev               # turbo run dev --parallel (api + front together)
pnpm build             # turbo run build (builds shared first, then api/front)
pnpm lint              # turbo run lint
pnpm start             # turbo run start (runs built api)
```

Per-workspace (useful when you only touched one app):

```bash
pnpm --filter front dev      # vite dev server, http://localhost:5173
pnpm --filter front build    # tsc -b && vite build
pnpm --filter front lint     # eslint .

pnpm --filter api dev        # tsx watch src/index.ts, http://localhost:3000
pnpm --filter api build      # tsc -p tsconfig.json
pnpm --filter api lint       # eslint src/**/*.{ts,tsx} --fix
```

There is currently **no automated test suite** (no `*.test.ts`/`*.spec.ts` files, no test runner
configured) despite `turbo.json` defining a `test` task. Don't assume tests exist — verify
changes by running `tsc --noEmit`/`build` and, for frontend changes, actually running the app
(see "Verifying frontend changes" below).

## Environment variables

- `apps/api/.env` (see `apps/api/.env.example`): `PORT`, `MONGO_URL`, `JWT_SECRET`,
  `FRONTEND_ORIGIN`, `RESEND_API_KEY`, `MAIL_FROM`.
- `apps/front/.env` / `.env.development.local`: `VITE_API_ENDPOINT` (points at the API origin).

Never commit real secrets; `.env.example` is the template to update when adding a new var.

## Backend architecture (`apps/api`)

- `src/index.ts` / `src/server.ts` — Express app bootstrap.
- `src/trpc/` — tRPC setup (`index.ts` init, `context.ts` per-request context, `router.ts`
  combines sub-routers into `trpcRouter`, exported as `TrpcRouter` type for the frontend).
- `src/user/` — auth (`authRouter.ts`, `userService.ts`, `repositories/`). JWT-based auth with
  httpOnly cookies; see `src/middlewares/auth.ts` and `src/utils/token.ts`.
- `src/billings/` — bill domain (`billRouter.ts`, `billService.ts`, `repositories/`).
- `src/lib/EmailSender.ts` — Resend-based email (used by the forgot-password flow).
- `src/utils/` — `actionsBill.ts`, `order.ts` (drag-and-drop ordering), `summary.ts`.
- MongoDB via Mongoose (`src/db.ts`).

Add new domain logic as `<domain>Router.ts` + `<domain>Service.ts` + `repositories/`, following
the `billings`/`user` pattern, and register the router in `src/trpc/router.ts`.

## Frontend architecture (`apps/front`)

- `src/pages/` — route-level components (`login/`, `financial/`); routes are declared in
  `src/pages/index.tsx`. `/` is the standalone Login page; everything else sits behind
  `AuthRequired` + the shared `Layout` (`src/theme/Layout.tsx`, header with logo + user menu).
- `src/components/` — reusable UI (modals like `CreateAccount`, `ForgotPassword`,
  `ChangePassword`, `BillActionsModals/`, table pieces like `SortableRow.tsx`).
- `src/hooks/` — `useSortables.ts` / `useTableSortableRow.ts` / `useMobileReorder.ts` (drag &
  drop reordering, built on `@atlaskit/pragmatic-drag-and-drop`), `theme.ts` (zustand store),
  `useOnlineStatus.ts`, `useBillActions.ts`.
- `src/providers/` — `ThemeProvider` (Ant Design `ConfigProvider`), `OfflineProvider` (network
  status + manual "network failed" flag consumed by `useOffline()`), `NotificationProvider`.
- `src/infrastructure/` — offline-first data layer: `db/database.ts` (Dexie/IndexedDB) and
  `repositories/billRepository.ts`. `src/infrastructure/sync/` exists but is currently empty —
  don't assume sync logic lives there yet.
- `src/utils/trpc.ts` — tRPC React Query client, typed against `TrpcRouter` from the API.
- `src/theme/colorsTokens.ts` — Ant Design token overrides (`colorPrimary` etc. per light/dark).

### Theming gotcha

Dark mode is **not** Tailwind's `dark:` variant (no `darkMode` config, no `dark:` classes used
anywhere in the codebase). It's driven manually:
- `useTheme` (zustand, `src/hooks/theme.ts`) toggles a `light`/`dark` class on `document.body`
  and persists to `localStorage`.
- `src/index.css` defines `--background-color`/`--text-color` for `:root` vs `body.dark`.
- `ThemeProvider` swaps Ant Design's `defaultAlgorithm`/`darkAlgorithm` based on the same store.

The Login page (`src/pages/login/index.tsx`) intentionally has its own fixed light/branded look
and is not wired into this dark-mode system.

### Tailwind v4

This project uses Tailwind v4 syntax — e.g. `bg-linear-to-br` (not the v3 `bg-gradient-to-br`).
Prefer arbitrary-value/utility classes already used nearby over introducing new patterns.

## Conventions

- **No comments in code.** Never add `//` or `/* */` comments (including JSX `{/* */}`) —
  write self-explanatory code (clear names, small functions) instead of explaining it.
- **Early return, no `else`.** Guard clauses that return/continue early instead of wrapping the
  rest of the function body in an `else`/`else if`. Applies to both `apps/api` and `apps/front`.
- Prettier: 2-space via defaults, semicolons on, single quotes, trailing commas, 100 print width
  (`.prettierrc`), with `prettier-plugin-tailwindcss` for class sorting — run through your
  editor's format-on-save or `pnpm prettier --write` rather than hand-sorting classes.
- ESLint configs are per-app (`apps/front/eslint.config.js`, similar for api) — always lint the
  specific workspace you touched.
- UI copy is in English; keep new user-facing strings consistent with existing tone (informal
  but tidy, e.g. "Enter your password", "Create an account").
- Bills have three types — debit (one-off), credit (installments), recurring (fixed
  due date) — and a status (paid/pending/late) plus soft delete (`deletedAt`); see
  `apps/front/src/pages/financial/billEnums.tsx` and `packages/shared/src/bill/`.

## Verifying frontend changes

For UI changes, don't just typecheck — run the app and look at it:

```bash
pnpm --filter front dev
```

Then check the affected page in a browser at `http://localhost:5173`. If no interactive browser
is available, a headless screenshot (e.g. `google-chrome --headless --screenshot=...` or the
`chromium-cli`/Playwright pattern from the `run` skill) is an acceptable substitute — but
actually look at the rendered output before calling a UI task done.
