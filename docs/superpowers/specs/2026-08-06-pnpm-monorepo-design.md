# pnpm Monorepo Migration — Design

- Status: Approved
- Branch: `chore/pnpm-monorepo`
- Date: 2026-08-06

## Contexto

FinDev é um app de finanças pessoais em Expo/React Native (SDK 57), hoje um
único pacote na raiz do repo. Um backend em TypeScript (stack ainda não
decidida) vai entrar no mesmo repositório. Este spec cobre **só** a
conversão do repo para um monorepo pnpm — criar a estrutura, os workspaces e
as configs compartilhadas necessárias para que o app atual continue
funcionando exatamente como hoje, e para que um pacote de backend possa ser
adicionado depois sem precisar reestruturar nada de novo.

## Objetivo

Mover o app Expo/RN atual para `apps/mobile` dentro de um workspace pnpm,
sem alterar seu comportamento, e deixar o repo pronto (workspace glob,
convenção de scripts, nomeação de pacotes) para receber um segundo pacote
(`apps/api`) em um ciclo futuro.

## Não-objetivos (fora de escopo deste spec)

- Criar `apps/api` ou qualquer código de backend.
- Criar pacotes em `packages/*` (types/schemas/utils compartilhados) — só
  faz sentido quando existir um segundo consumidor real.
- Adotar Turborepo/Nx — reavaliar apenas se `pnpm -r run ...` ficar lento ou
  repetitivo o suficiente para justificar.
- CI (GitHub Actions) — o repo não tem CI hoje; não faz parte desta
  migração.
- Tuning de `.npmrc` (ex. `node-linker=hoisted`) — só se surgir um problema
  real de resolução de dependência nativa.

## Estrutura de pastas resultante

```
FinDev/                          ← raiz do workspace pnpm
├── apps/
│   └── mobile/                  ← app Expo/RN atual, movido via git mv
│       ├── App.tsx
│       ├── index.ts
│       ├── app.json
│       ├── metro.config.js      ← novo
│       ├── tsconfig.json
│       ├── eslint.config.js
│       ├── assets/
│       ├── src/
│       ├── package.json         ← novo (split do package.json atual)
│       └── README.md            ← recebe o conteúdo detalhado do README atual
├── packages/                    ← vazio; reservado no workspace glob
├── pnpm-workspace.yaml          ← novo
├── package.json                 ← raiz, vira o "maestro" do workspace
├── pnpm-lock.yaml               ← já existe na raiz, permanece
├── .prettierrc / .prettierignore
├── .gitignore
├── README.md                    ← vira overview do monorepo
└── LICENSE
```

`packages/*` entra no glob do workspace mesmo vazio — um diretório
inexistente não quebra o `pnpm install`, e evita editar
`pnpm-workspace.yaml` de novo quando um pacote compartilhado for criado.

## Decisões de ferramental

- **pnpm workspaces puro**, sem Turborepo/Nx (ver Não-objetivos).
- **Nomes de pacote com escopo** (`@findev/mobile`, e futuramente
  `@findev/api`) — custo zero agora, evita rename quando o segundo pacote
  chegar.
- **Convenção de scripts**: todo pacote do workspace deve expor os scripts
  `typecheck`, `lint`, `lint:fix` e `test` com esses nomes exatos. É isso
  que permite os comandos `pnpm -r run ...` da raiz funcionarem para
  qualquer pacote presente, sem precisar tocar nos scripts da raiz quando
  `apps/api` for criado.

## Configs

### `pnpm-workspace.yaml` (novo)

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### `package.json` raiz

```json
{
  "name": "findev",
  "private": true,
  "engines": { "node": ">=20.19.0" },
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

Perde `version`, `main` e `"type": "module"` — não fazem sentido para um
root sem código próprio (esses campos continuam existindo em
`apps/mobile/package.json`).

### `apps/mobile/package.json`

Base: o `package.json` atual, com as seguintes mudanças:

- `"name": "@findev/mobile"`.
- Remove os scripts `format`, `format:check` e `check` — passam a ser
  responsabilidade só da raiz, rodando sobre o repo inteiro.
- `"test"` passa a ser `"jest --passWithNoTests"` (a flag que hoje só
  aparece dentro do `check` da raiz migra para o script, assim
  `pnpm -r run test` funciona sem precisar repassar argumentos extras).
- `dependencies`, o bloco `"jest": { "preset": "jest-expo" }` e o bloco
  `"expo": { "doctor": {...} }` continuam idênticos ao atual.
- **Todo o `devDependencies` atual continua aqui, exceto `prettier`**
  (`@babel/core`, `@types/react`, `eslint`, `eslint-config-expo`, `jest`,
  `jest-expo`, `typescript`). Isso não é opcional: pnpm não faz hoisting
  implícito como o npm — um pacote só enxerga os binários (`tsc`, `eslint`)
  das dependências que ele mesmo declara. Declarar `typescript` aqui e não
  ter isso duplicado em disco: pnpm dedup via content-addressable store.

### `apps/mobile/metro.config.js` (novo)

Validado manualmente que funciona como ESM neste projeto:

```js
import { getDefaultConfig } from 'expo/metro-config.js';

export default getDefaultConfig(import.meta.dirname);
```

O subpath `expo/metro-config.js` (com extensão) é necessário pela mesma
razão do `eslint-config-expo/flat.js`: sem `exports` map no `package.json`
do pacote, resolução ESM do Node exige o caminho completo.

Não é estritamente necessário para o Metro detectar o monorepo (o Expo
SDK ≥ 52 já configura isso automaticamente dentro de `getDefaultConfig`
quando encontra um workspace acima do projeto), mas deixa o comportamento
explícito e dá um lugar para customizações futuras.

### `tsconfig.json` e `eslint.config.js`

Migram para dentro de `apps/mobile/` sem mudança de conteúdo. Não criamos
`tsconfig.json`/eslint config na raiz agora — com um único pacote TS, seria
uma base compartilhada sem quem compartilhar. Reavaliar quando `apps/api`
existir.

### `.prettierrc` / `.prettierignore`

Ficam na raiz, formatando o repo inteiro (prettier é o único devDependency
que faz sentido compartilhado, porque roda como um comando único sobre toda
a árvore). Adicionar `pnpm-lock.yaml` ao `.prettierignore` (pendência já
identificada antes desta migração).

### `.npmrc`

Não criado nesta migração (ver Não-objetivos).

## Passos de migração

Trabalho realizado na branch `chore/pnpm-monorepo` (já criada a partir da
`main`); nenhuma alteração vai direto para `main`.

1. ~~Commit em separado do fix pendente de ESM do `eslint.config.js`~~ —
   feito (commit `2c6bfbd` nesta branch).
2. `mkdir -p apps/mobile`
3. `git mv App.tsx index.ts app.json assets src tsconfig.json eslint.config.js apps/mobile/`
4. `rm -rf .expo` (cache antigo na raiz; regenera dentro de `apps/mobile`)
5. Criar `apps/mobile/package.json` (split descrito acima)
6. Reescrever `package.json` raiz
7. Criar `pnpm-workspace.yaml`
8. Criar `apps/mobile/metro.config.js`
9. Adicionar `pnpm-lock.yaml` ao `.prettierignore`
10. Split do README: raiz vira overview do monorepo + link para
    `apps/mobile`; `apps/mobile/README.md` recebe o conteúdo atual
    (features, tech stack, getting started)
11. `corepack enable` (uma vez, local) para honrar o `packageManager`
    fixado
12. `pnpm install` na raiz — regenera `pnpm-lock.yaml` em modo workspace

## Verificação

Critério de "migração concluída sem quebrar nada":

- `pnpm -r run typecheck`
- `pnpm -r run lint`
- `pnpm run format:check`
- `pnpm -r run test`
- `pnpm --filter @findev/mobile exec expo export --platform ios` — smoke
  test de bundling (já validado que o Metro resolve corretamente; repetir
  dentro da nova estrutura)
- `pnpm --filter @findev/mobile run doctor` — `expo-doctor` costuma
  sinalizar pegadinhas específicas de monorepo
- `pnpm --filter @findev/mobile start` — abrir manualmente uma vez (Expo Go
  ou simulador)

## Riscos

Risco geral baixo: o app é managed workflow (sem pastas `ios`/`android`
nativas no repo), então os problemas clássicos de pnpm + CocoaPods /
autolinking nativo em monorepo não se aplicam aqui.

## Fora de escopo / próximos passos (ciclos futuros, specs separados)

- `apps/api` (o backend em si — stack ainda não decidida).
- `packages/*` com código compartilhado entre `mobile` e `api`.
- Turborepo/Nx, se `pnpm -r` ficar lento.
- CI (GitHub Actions).
- `.npmrc` tuning, se necessário.
