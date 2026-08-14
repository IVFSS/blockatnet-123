# AGENTS.md - blockatnet

## Package Manager
- Use **yarn** for all commands. The repo uses `yarn install --frozen-lockfile` and all scripts are defined with `yarn`.

## Available Scripts (from package.json)
- `yarn dev` - starts Next.js dev server (`next dev`)
- `yarn build` - builds Next.js app (`next build`)
- `yarn start` - starts Next.js production server (`next start`)
- `yarn lint` - runs ESLint (`next lint`); `continue-on-error: true` in CI
- `yarn format` - auto-format with Prettier
- `yarn format:check` - check formatting only (fails if not formatted)
- `yarn test:cypress` - runs Cypress e2e tests headless
- `yarn test:e2e` - starts dev server then runs Cypress

## Environment
- Copy `.env.local` and fill in values. Key vars:
  - `MORALIS_API_KEY` - required for Web3 APIs
  - `NEXTAUTH_SECRET` - random string (see `.env.local` example)
  - `NEXTAUTH_URL` - e.g. `http://localhost:3000`
  - `TOKENINSIGHT_API_KEY` - for token data
- Never commit `.env.local` (it's gitignored).

## Lint & Typecheck
- CI runs: `yarn lint:ci` then `yarn format:check` then `yarn build`
- ESLint extends `@moralisweb3`, `plugin:@next/next/recommended`, `plugin:cypress/recommended`
- `no-console` rule is **off** in `.eslintrc.js`
- TypeScript targets ES5; `strict: true`, `noEmit: true`

## Testing
- Cypress tests run in Chrome headless by default (`cypress.config.ts`)
- `yarn test:cypress` runs `cypress run --browser chrome --headless`
- E2E: `yarn test:e2e` starts dev server then runs Cypress
- Tests require dev server running at `http://localhost:3000`
- Cypress videos are disabled (`video: false`)

## CI Workflow (`.github/workflows/main.yml`)
- PR/push to `main` or `beta` triggers CI
- Steps: install deps → ESLint → Prettier check → Build → Cypress tests
- Lint annotations posted as comment on PR
- **Order matters**: lint → format:check → build → test

## Branches
- `main` and `beta` are the protected branches
- PRs target `main`

## Code Style (from `CODING_STYLE.md`)
- Match existing code style as closely as possible
- Follow ESLint rules for styling, Prettier for formatting