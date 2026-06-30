import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import DashboardScreen from "../screens/PetOwner/DashboardScreen";
import ScanQrScreen from "../screens/PetOwner/ScanQrScreen";
import PetProfileScreen from "../screens/PetOwner/PetProfileScreen";
import ProfileScreen from "../screens/PetOwner/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function PetOwnerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Dashboard":
              iconName = focused ? "home" : "home-outline";
              break;

            case "Scan QR":
              iconName = focused ? "qr-code" : "qr-code-outline";
              break;

            case "Pet Profile":
              iconName = focused ? "heart" : "heart-outline";
              break;

            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;

            default:
              iconName = "ellipse";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
      />

      <Tab.Screen
        name="Scan QR"
        component={ScanQrScreen}
      />

      <Tab.Screen
        name="Pet Profile"
        component={PetProfileScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}