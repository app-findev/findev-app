import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "./src/screens/Welcome";
import CreateAccount from "./src/screens/CreateAccount";
import YourName from "./src/screens/YourName";
import Goals from "./src/screens/Goals";
import Budget from "./src/screens/Budget";
import Login from "./src/screens/Login";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="YourName" component={YourName} />
        <Stack.Screen name="Goals" component={Goals} />
        <Stack.Screen name="Budget" component={Budget} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
