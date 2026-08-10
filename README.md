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
