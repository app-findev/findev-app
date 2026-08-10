export type RootStackParamList = {
  Welcome: undefined;
  CreateAccount: undefined;
  YourName: undefined;
  Goals: undefined;
  Budget: undefined;
  Login: undefined;
  MainTabs: undefined;
  AddExpense: undefined;
  EditExpense: { expenseId: string };
  Paywall: undefined;
};

export type MainTabsParamList = {
  HomeTab: undefined;
  InsightsTab: undefined;
  WalletTab: undefined;
  ProfileTab: undefined;
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
