export type RootStackParamList = {
  Welcome: undefined;
  CreateAccount: undefined;
  YourName: undefined;
  Goals: undefined;
  Budget: undefined;
  Login: undefined;
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
