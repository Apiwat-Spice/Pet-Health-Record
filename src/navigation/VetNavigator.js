import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreenVet from '../screens/Vets/DashboardScreenVet';
const Tab = createBottomTabNavigator();

export default function VetNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={DashboardScreenVet} />
    </Tab.Navigator>
  );
}