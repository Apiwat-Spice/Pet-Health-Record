
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import DashboardScreenPet from './src/screens/PetOwner/DashboardScreenPet';
import OtpScreen from './src/screens/auth/OTPScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="DashboardScreenPet" component={DashboardScreenPet} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// import { AuthProvider } from "./src/context/AuthContext";
// import RootNavigator from "./src/navigation/RootNavigator";

// export default function App() {
//   return (
//     <AuthProvider>
//       <RootNavigator />
//     </AuthProvider>
//   );
// }