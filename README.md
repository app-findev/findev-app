# FinDev (SpentLittle)

> Spend a little, save a lot.

FinDev is a personal finance mobile app built with **Expo** and **React Native**. It walks a new user through a short onboarding flow and then drops them into a home screen where they can track monthly expenses against a spending goal, log new expenses (fixed or in installments), see spending insights by category, and check accounts and cards balances — all in **Portuguese and English**, switchable at any time.

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

Requires **Node.js 20.19+**.

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone, or press `w` to open it in a browser.

## License

MIT © Laura Lacort Zimmermann
