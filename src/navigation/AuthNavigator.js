import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/LoginScreen";
import RigisterScreen from "../screens/auth/RegisterScreen.js";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import OTPScreen from "../screens/auth/OTPScreen.js"
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen.js"

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SignUp"
                component={RigisterScreen}
            />
            <Stack.Screen
                name="OTP"
                component={OTPScreen}
            />
            <Stack.Screen
                name="ResetPassword"
                component={ResetPasswordScreen}
            />
        </Stack.Navigator>
    );
}