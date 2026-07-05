# FinDev (SpentLittle)

> Spend a little, save a lot. / Gaste pouco, economize muito.

FinDev is a personal finance mobile app built with **Expo** and **React Native**. It walks a new user through a short onboarding flow and then drops them into a home screen where they can track monthly expenses against a spending goal, log new expenses (fixed or in installments), see spending insights by category, and check accounts and cards balances — all in **Portuguese and English**, switchable at any time.

🇧🇷 [Português](#-português) · 🇺🇸 [English](#-english)

---

## 🇧🇷 Português

### Sobre

O FinDev (nome de marca no app: **SpentLittle**) é um aplicativo de finanças pessoais para ajudar você a gastar menos e guardar mais. Ele acompanha suas despesas do mês contra uma meta de gastos, permite registrar novas despesas (fixas ou parceladas), mostra insights de gastos por categoria, e reúne contas e cartões numa carteira única.

### Funcionalidades

- **Onboarding em 4 passos**: criação de conta, nome, metas financeiras e definição do orçamento mensal
- **Login** com e-mail e senha
- **Início**: card de meta mensal com barra de progresso, alerta de contas pendentes que ultrapassam a meta, filtros (Todas / Fixas / Parceladas) e lista de despesas
- **Nova despesa / Editar despesa**: valor, descrição, data de vencimento (com seletor nativo), tipo (fixo ou parcelado) e exclusão
- **Insights**: total gasto no mês, comparação com o mês anterior, gráfico dos últimos 4 meses e detalhamento por categoria (Moradia, Assinaturas, Transporte, Lazer, Outros)
- **Carteira**: patrimônio total, contas (corrente/poupança) e cartões de crédito com fatura atual e limite
- **Perfil**: dados do usuário, plano atual, seletor de idioma (PT/EN) e logout
- **Bilíngue**: todo o app funciona em português e inglês, com um botão de troca de idioma disponível em cada tela

### Tecnologias

- [Expo](https://expo.dev/) (SDK 57) + React Native
- TypeScript
- [React Navigation](https://reactnavigation.org/) (native stack + bottom tabs)
- Context API para estado compartilhado (idioma, despesas)
- `react-native-svg`, `@react-native-community/datetimepicker`, `@react-native-community/slider`

### Como rodar

Requer **Node.js 20.19+**.

```bash
npm install
npx expo start
```

Escaneie o QR code com o app **Expo Go** no seu celular, ou pressione `w` para abrir no navegador.

---

## 🇺🇸 English

### About

FinDev (in-app brand name: **SpentLittle**) is a personal finance app that helps you spend a little and save a lot. It tracks your monthly expenses against a spending goal, lets you log new expenses (fixed or in installments), shows spending insights by category, and brings your accounts and cards together in one wallet view.

### Features

- **4-step onboarding**: account creation, name, financial goals, and monthly budget setup
- **Login** with email and password
- **Home**: monthly goal card with progress bar, an alert when pending bills would exceed the goal, filters (All / Fixed / Installments), and the expense list
- **Add expense / Edit expense**: amount, description, due date (native picker), type (fixed or installment), and delete
- **Insights**: total spent this month, comparison with the previous month, a 4-month bar chart, and a category breakdown (Housing, Subscriptions, Transport, Leisure, Other)
- **Wallet**: total net worth, accounts (checking/savings), and credit cards with current invoice and limit
- **Profile**: user info, current plan, language switcher (PT/EN), and logout
- **Bilingual**: the entire app works in Portuguese and English, with a language toggle available on every screen

### Tech stack

- [Expo](https://expo.dev/) (SDK 57) + React Native
- TypeScript
- [React Navigation](https://reactnavigation.org/) (native stack + bottom tabs)
- Context API for shared state (language, expenses)
- `react-native-svg`, `@react-native-community/datetimepicker`, `@react-native-community/slider`

### Getting started

Requires **Node.js 20.19+**.

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone, or press `w` to open it in a browser.

---

## License

MIT © Laura Lacort Zimmermann
