import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";
import UserNavigator from "./UserNavigator";
import AdminNavigator from "./AdminNavigator";

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : user.role === "admin" ? (
        <AdminNavigator />
      ) : (
        <UserNavigator />
      )}
    </NavigationContainer>
  );
}