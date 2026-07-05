import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LanguageProvider } from './src/i18n/LanguageContext';
import { ExpensesProvider } from './src/context/ExpensesContext';
import Welcome from './src/screens/Welcome';
import CreateAccount from './src/screens/CreateAccount';
import YourName from './src/screens/YourName';
import Goals from './src/screens/Goals';
import Budget from './src/screens/Budget';
import Login from './src/screens/Login';
import MainTabs from './src/navigation/MainTabs';
import AddExpense from './src/screens/AddExpense';
import EditExpense from './src/screens/EditExpense';
import type { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <LanguageProvider>
      <ExpensesProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Welcome" component={Welcome} />
              <Stack.Screen name="CreateAccount" component={CreateAccount} />
              <Stack.Screen name="YourName" component={YourName} />
              <Stack.Screen name="Goals" component={Goals} />
              <Stack.Screen name="Budget" component={Budget} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen
                name="AddExpense"
                component={AddExpense}
                options={{ presentation: 'modal' }}
              />
              <Stack.Screen name="EditExpense" component={EditExpense} />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="dark" />
        </SafeAreaProvider>
      </ExpensesProvider>
    </LanguageProvider>
  );
}
