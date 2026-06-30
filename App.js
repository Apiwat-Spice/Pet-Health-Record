import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "./src/screens/auth/WelcomeScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterTopTab from "./src/screens/auth/RegisterTopTab";
import OtpScreen from "./src/screens/auth/OTPScreen";

import PetOwnerNavigator from "./src/navigation/PetOwnerNavigator";
import VetNavigator from "./src/navigation/VetNavigator";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Register"
          component={RegisterTopTab}
        />

        <Stack.Screen
          name="Otp"
          component={OtpScreen}
        />

        {/* Pet Owner */}
        <Stack.Screen
          name="PetOwner"
          component={PetOwnerNavigator}
        />

        {/* Vet */}
        <Stack.Screen
          name="Vet"
          component={VetNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}