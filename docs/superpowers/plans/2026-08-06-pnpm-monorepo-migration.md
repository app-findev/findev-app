# pnpm Monorepo Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the FinDev repo into a pnpm workspace monorepo, moving the existing Expo/React Native app into `apps/mobile` with zero behavior change, and reserving space for a future backend package.

**Architecture:** A single pnpm workspace (`apps/*` + `packages/*`) with a thin root package (`findev`) that holds only shared tooling (Prettier) and scripts that proxy into the workspace, plus one workspace member (`@findev/mobile`) holding all of today's app code and its own toolchain (TypeScript, ESLint, Jest, Babel).

**Tech Stack:** pnpm 10 workspaces, Expo SDK 57 (`expo/metro-config` automatic monorepo detection), TypeScript ~6.0, ESLint 9 flat config, Jest via jest-expo, Prettier 3.

**Spec:** `docs/superpowers/specs/2026-08-06-pnpm-monorepo-design.md` — read it first for the full rationale behind each decision below.

## Global Constraints

- Node.js `>=20.19.0` (existing `engines` requirement, carried over unchanged).
- Package manager: pnpm, pinned via `"packageManager": "pnpm@10.26.1"` at the workspace root.
- Every workspace package must expose `typecheck`, `lint`, `lint:fix`, `test` scripts under those exact names — root `pnpm -r run ...` commands depend on this contract.
- No backend code, no `packages/*` contents, no CI, no Turborepo/Nx in this plan (see spec's Non-goals). Do not add any of these while executing.
- All work happens on branch `chore/pnpm-monorepo` (already created from `main`, currently 2 commits ahead: `2c6bfbd` ESM fix, `91ec4b8` design spec). Nothing merges to `main` as part of this plan.
- Commit messages: English (repo convention), each ending with `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.

---

### Task 1: Scaffold the workspace skeleton

**Files:**
- Create: `pnpm-workspace.yaml`
- Move (git mv, content unchanged): `App.tsx`, `index.ts`, `app.json`, `assets/`, `src/`, `tsconfig.json`, `eslint.config.js`, `package.json` → `apps/mobile/`
- Modify: `.prettierignore`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: `apps/mobile/` containing every current app file. `apps/mobile/package.json` still has the *pre-migration* root content at the end of this task — Task 2 rewrites it. Nothing in this task should invoke `pnpm install` or any `pnpm` command (there is no root `package.json` yet).

- [ ] **Step 1: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

- [ ] **Step 2: Create `apps/mobile` and move the app files into it**

Run:
```bash
mkdir -p apps/mobile
git mv App.tsx index.ts app.json assets src tsconfig.json eslint.config.js package.json apps/mobile/
```

- [ ] **Step 3: Remove the stale Expo cache at the old location**

Run: `rm -rf .expo`

This directory is gitignored (plain filesystem cleanup, not a git change). It regenerates under `apps/mobile/.expo` the next time Expo runs there.

- [ ] **Step 4: Update `.prettierignore`**

Current content:
```
node_modules
dist
.expo
package-lock.json
assets
```

Replace the now-nonexistent `package-lock.json` line with `pnpm-lock.yaml` (the repo already switched lockfiles in commit `2c6bfbd`):

```
node_modules
dist
.expo
pnpm-lock.yaml
assets
```

- [ ] **Step 5: Verify the move**

Run: `git status --short`

Expected: every moved path shows as a rename (`R  <old-path> -> apps/mobile/<new-path>`), `pnpm-workspace.yaml` appears untracked (`??`), `.prettierignore` shows modified (`M`).

Run: `ls App.tsx app.json tsconfig.json eslint.config.js src assets package.json 2>&1`
Expected: `No such file or directory` for every one of them (nothing left at repo root).

Run: `ls apps/mobile`
Expected: `App.tsx  app.json  assets  eslint.config.js  index.ts  package.json  src  tsconfig.json`

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: move app into apps/mobile, add pnpm workspace file

Relocates all Expo/React Native app files into apps/mobile/ ahead of
splitting package.json in the next commit. package.json itself moves
here unmodified — its content is rewritten in Task 2.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Split package.json into workspace root + `@findev/mobile`

**Files:**
- Modify: `apps/mobile/package.json` (currently holds the pre-migration root content, verbatim, from Task 1)
- Create: `package.json` (workspace root)

**Interfaces:**
- Consumes: `apps/mobile/package.json` as left by Task 1 (full original `dependencies`/`devDependencies` list).
- Produces: root `package.json` named `findev`, with proxy scripts and `packageManager` pin. `apps/mobile/package.json` named `@findev/mobile`, exposing `typecheck`/`lint`/`lint:fix`/`test` — every later task and the root's `pnpm -r run ...` scripts rely on these exact names.

- [ ] **Step 1: Rewrite `apps/mobile/package.json`**

Full file content:
```json
{
  "name": "@findev/mobile",
  "version": "1.0.0",
  "private": true,
  "main": "index.ts",
  "type": "module",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "typecheck": "tsc --noEmit",
    "lint": "expo lint",
    "lint:fix": "expo lint -- --fix",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch",
    "doctor": "npx expo-doctor",
    "deps:check": "expo install --check",
    "deps:fix": "expo install --fix"
  },
  "dependencies": {
    "@expo/metro-runtime": "~57.0.3",
    "@react-native-community/slider": "5.2.0",
    "@react-navigation/native": "^7.3.7",
    "@react-navigation/native-stack": "^7.17.9",
    "expo": "^57.0.2",
    "expo-asset": "~57.0.3",
    "expo-splash-screen": "~57.0.2",
    "expo-status-bar": "~57.0.0",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-native": "0.86.0",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.25.2",
    "react-native-svg": "15.15.4",
    "react-native-web": "^0.21.2"
  },
  "devDependencies": {
    "@babel/core": "^7.29.7",
    "@types/react": "~19.2.17",
    "eslint": "^9.39.4",
    "eslint-config-expo": "~57.0.0",
    "jest": "~29.7.0",
    "jest-expo": "~57.0.1",
    "typescript": "~6.0.3"
  },
  "engines": {
    "node": ">=20.19.0"
  },
  "jest": {
    "preset": "jest-expo"
  },
  "expo": {
    "doctor": {
      "reactNativeDirectoryCheck": {
        "listUnknownPackages": false
      }
    }
  }
}
```

Note what changed vs. the pre-migration file: `name` → `@findev/mobile`; dropped the `format`, `format:check`, `check` scripts (now root-only); `test` gained `--passWithNoTests` (previously that flag only appeared inside the root `check` script); `prettier` removed from `devDependencies` (moves to root); everything else (`dependencies`, `jest` block, `expo` block, remaining scripts) is unchanged.

- [ ] **Step 2: Create the workspace root `package.json`**

Full file content:
```json
{
  "name": "findev",
  "private": true,
  "engines": {
    "node": ">=20.19.0"
  },
  "packageManager": "pnpm@10.26.1",
  "scripts": {
    "start": "pnpm --filter @findev/mobile start",
    "android": "pnpm --filter @findev/mobile android",
    "ios": "pnpm --filter @findev/mobile ios",
    "web": "pnpm --filter @findev/mobile web",
    "typecheck": "pnpm -r run typecheck",
    "lint": "pnpm -r run lint",
    "lint:fix": "pnpm -r run lint:fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "pnpm -r run test",
    "check": "pnpm run typecheck && pnpm run lint && pnpm run format:check && pnpm run test"
  },
  "devDependencies": {
    "prettier": "^3.9.4"
  }
}
```

- [ ] **Step 3: Enable Corepack (one-time local setup, not a repo change)**

Run: `corepack enable`

Lets `pnpm` resolve to the exact version pinned in `packageManager` for anyone using Corepack. Safe to run even if already enabled.

- [ ] **Step 4: Install from the workspace root**

Run: `pnpm install`

Expected: completes without error. `pnpm-lock.yaml` at the root is rewritten in workspace format (large diff is expected — it's converting from a single-package lockfile to a workspace one, not adding new dependencies). `apps/mobile/node_modules` is created, symlinked from the pnpm store.

- [ ] **Step 5: Verify the workspace recognizes the package**

Run: `pnpm list -r --depth -1`

Expected output includes `@findev/mobile` at path `apps/mobile`, alongside the root `findev` package.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: split package.json into workspace root + @findev/mobile

Root package.json now only holds shared tooling (prettier) and scripts
that proxy into the workspace via `pnpm --filter`/`pnpm -r`.
apps/mobile/package.json keeps the app's own dependencies and toolchain
(babel, eslint, jest, typescript) — pnpm doesn't hoist devDependency
binaries across packages, so each package declares what it runs.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Add `apps/mobile/metro.config.js`

**Files:**
- Create: `apps/mobile/metro.config.js`

**Interfaces:**
- Consumes: `apps/mobile/package.json` with `expo` installed (Task 2).
- Produces: nothing later tasks import — but Task 4's bundling-related checks assume this file is present.

- [ ] **Step 1: Create the file**

```js
import { getDefaultConfig } from 'expo/metro-config.js';

export default getDefaultConfig(import.meta.dirname);
```

The `expo/metro-config.js` subpath (with the `.js` extension) is required: this package has no `exports` map, so Node's ESM resolution needs the exact file path, not just the directory.

- [ ] **Step 2: Verify bundling still works (smoke test)**

Run:
```bash
pnpm --filter @findev/mobile exec expo export --platform ios --output-dir /tmp/findev-export-check
```

Expected: output includes a line like `iOS Bundled <time>ms index.ts (967 modules)` and the command exits 0 — no resolver/module errors.

- [ ] **Step 3: Clean up the smoke-test output**

Run: `rm -rf /tmp/findev-export-check` (not part of the repo, just a local export target)

- [ ] **Step 4: Commit**

```bash
git add apps/mobile/metro.config.js
git commit -m "$(cat <<'EOF'
chore(mobile): add explicit metro.config.js

expo/metro-config already auto-detects the pnpm workspace (Expo SDK
>=52 configures this inside getDefaultConfig), so this isn't strictly
required for monorepo support — but it makes the behavior explicit and
gives a place to hang future Metro customization.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Full verification pass across the workspace

**Files:**
- Modify (Prettier formatting only, no logic change): `apps/mobile/src/components/LanguageToggle.tsx`, `apps/mobile/src/i18n/LanguageContext.tsx`, `apps/mobile/src/i18n/translations.ts`, `apps/mobile/src/screens/CreateAccount.tsx`, `apps/mobile/src/screens/Goals.tsx`, `apps/mobile/src/screens/Welcome.tsx`

**Interfaces:**
- Consumes: everything from Tasks 1–3 (full workspace wired up).
- Produces: a green `pnpm run check` at the workspace root — the acceptance bar for the whole migration.

- [ ] **Step 1: Typecheck**

Run: `pnpm run typecheck`
Expected: PASS, no errors (same result as before the migration — only paths changed).

- [ ] **Step 2: Lint**

Run: `pnpm run lint`
Expected: PASS, no errors (`eslint.config.js` moved unchanged, same rules apply).

- [ ] **Step 3: Fix pre-existing Prettier drift**

These 6 files were already out of Prettier's style before this migration (left over from the i18n feature work) — unrelated to the monorepo restructuring, but `format:check` needs to pass cleanly, so fix them here.

Run: `pnpm run format`
Expected: rewrites exactly the 6 files listed in **Files** above (formatting only — quotes/whitespace/line-wrap). Review the diff to confirm no logic changed. If it reports no changes (e.g. already fixed upstream), skip straight to Step 5 and don't create an empty commit.

- [ ] **Step 4: Confirm format:check now passes**

Run: `pnpm run format:check`
Expected: PASS — `All matched files use Prettier code style!`

- [ ] **Step 5: Tests**

Run: `pnpm run test`
Expected: PASS — `jest --passWithNoTests` exits 0 reporting "No tests found" (no test files exist yet in this repo).

- [ ] **Step 6: expo-doctor**

Run: `pnpm --filter @findev/mobile run doctor`
Expected: no errors related to workspace/monorepo structure (duplicate React/React Native versions, workspace-root detection). If it reports something new tied specifically to the monorepo layout, that's a real finding — investigate and resolve it before moving on; don't skip past it.

- [ ] **Step 7: Commit the Prettier fixes**

```bash
git add apps/mobile/src
git commit -m "$(cat <<'EOF'
style(mobile): fix pre-existing Prettier drift

Unrelated to the monorepo migration — these files were already out of
style from the i18n feature work. Fixing them here so `format:check`
passes cleanly across the workspace. Formatting only, no logic change.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

(If Step 3 made no changes, skip this commit.)

---

### Task 5: Split the README

**Files:**
- Modify: `README.md` (root — rewritten to a monorepo overview)
- Create: `apps/mobile/README.md` (detailed app docs, moved from the pre-migration root README)

**Interfaces:** none (docs only).

- [ ] **Step 1: Rewrite the root `README.md`**

```markdown
# FinDev (SpentLittle)

> Spend a little, save a lot.

FinDev is a personal finance app. This repository is a **pnpm monorepo**:
today it holds the mobile app, with a TypeScript backend planned as a
second package down the line.

## Structure

```
apps/
  mobile/   Expo + React Native app (see apps/mobile/README.md)
packages/    (reserved for code shared between apps — empty for now)
```

## Getting started

Requires **Node.js 20.19+** and **pnpm** ([Corepack](https://nodejs.org/api/corepack.html) is recommended: run `corepack enable` once).

```bash
pnpm install
pnpm start
```

This proxies to the mobile app (`apps/mobile`). See
[`apps/mobile/README.md`](apps/mobile/README.md) for app-specific details
(features, tech stack, running on a specific platform).

## License

MIT © Laura Lacort Zimmermann
```

- [ ] **Step 2: Create `apps/mobile/README.md`**

```markdown
# FinDev (SpentLittle) — mobile

> Spend a little, save a lot.

FinDev is a personal finance mobile app built with **Expo** and **React Native**. It walks a new user through a short onboarding flow and then drops them into a home screen where they can track monthly expenses against a spending goal, log new expenses (fixed or in installments), see spending insights by category, and check accounts and cards balances — all in **Portuguese and English**, switchable at any time.

This package lives inside the FinDev pnpm monorepo — see the [repo root README](../../README.md) for workspace-wide setup.

## About

FinDev (in-app brand name: **SpentLittle**) is a personal finance app that helps you spend a little and save a lot. It tracks your monthly expenses against a spending goal, lets you log new expenses (fixed or in installments), shows spending insights by category, and brings your accounts and cards together in one wallet view.

## Features

- **4-step onboarding**: account creation, name, financial goals, and monthly budget setup
- **Login** with email and password
- **Home**: monthly goal card with progress bar, an alert when pending bills would exceed the goal, filters (All / Fixed / Installments), and the expense list
- **Add expense / Edit expense**: amount, description, due date (native picker), type (fixed or installment), and delete
- **Insights**: total spent this month, comparison with the previous month, a 4-month bar chart, and a category breakdown (Housing, Subscriptions, Transport, Leisure, Other)
- **Wallet**: total net worth, accounts (checking/savings), and credit cards with current invoice and limit
- **Profile**: user info, current plan, language switcher (PT/EN), and logout
- **Bilingual**: the entire app works in Portuguese and English, with a language toggle available on every screen

## Tech stack

- [Expo](https://expo.dev/) (SDK 57) + React Native
- TypeScript
- [React Navigation](https://reactnavigation.org/) (native stack + bottom tabs)
- Context API for shared state (language, expenses)
- `react-native-svg`, `@react-native-community/datetimepicker`, `@react-native-community/slider`

## Getting started

From the repo root: `pnpm install` once, then run any of the following
from the root or with `pnpm --filter @findev/mobile <script>`:

```bash
pnpm start          # or: pnpm --filter @findev/mobile start
pnpm android
pnpm ios
pnpm web
```

Scan the QR code with the **Expo Go** app on your phone, or press `w` to open it in a browser.

## License

MIT © Laura Lacort Zimmermann
```

- [ ] **Step 3: Verify**

Run: `test -f apps/mobile/README.md && echo OK`
Expected: `OK`

Run: `pnpm run format:check`
Expected: still PASS (both README files should already match Prettier's default markdown formatting; if not, run `pnpm run format` and re-check).

- [ ] **Step 4: Commit**

```bash
git add README.md apps/mobile/README.md
git commit -m "$(cat <<'EOF'
docs: split README into workspace overview + app-specific docs

Root README.md becomes a short monorepo overview (structure, workspace
setup). apps/mobile/README.md keeps the full app description (features,
tech stack) that used to live at the repo root, with getting-started
instructions updated for the pnpm workspace.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Manual Follow-up (not a task — do this yourself)

Automated checks in Task 4 cover typecheck/lint/format/tests/bundling/doctor, but nothing exercises the actual running app. Once Task 5 is done, sanity-check it by hand:

```bash
pnpm --filter @findev/mobile start
```

Open it in Expo Go, a simulator, or the browser (`w`) and confirm the app still boots to the Welcome screen and navigates normally, same as before the migration. This is the final human sign-off — it can't be meaningfully delegated to an agent.

## Known pre-existing issue not fixed by this plan

`apps/mobile/README.md`'s Tech Stack section (carried over verbatim from the current README) mentions `@react-native-community/datetimepicker`, which is not actually in `package.json`'s dependencies — this mismatch predates the migration. Out of scope here since the task is to relocate the README's content, not audit its accuracy; worth a quick look separately.
