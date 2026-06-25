import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "./src/screens/auth/WelcomeScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterTopTab from "./src/screens/auth/RegisterTopTab";
import DashboardScreenPet from "./src/screens/PetOwner/DashboardScreenPet";
import DashboardScreenVet from "./src/screens/Vets/DashboardScreenVet";
import OtpScreen from "./src/screens/auth/OTPScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterTopTab} />
        <Stack.Screen name="Otp" component={OtpScreen} />

        <Stack.Screen
          name="DashboardScreenPet"
          component={DashboardScreenPet}
        />

        <Stack.Screen
          name="DashboardScreenVet"
          component={DashboardScreenVet}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}