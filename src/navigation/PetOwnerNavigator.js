import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DashboardScreenPet from '../screens/PetOwner/DashboardScreenPet';
const Tab = createBottomTabNavigator();

export default function PetOwnerNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={DashboardScreenPet} />
    </Tab.Navigator>
  );
}