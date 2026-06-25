import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import RegisterPetScreen from "./RegisterPetScreen";
import RegisterVetScreen from "./RegisterVetScreen";

const Tab = createMaterialTopTabNavigator();

export default function RegisterTopTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="PetOwnerRegister"
        component={RegisterPetScreen}
        options={{ title: "Pet Owner" }}
      />

      <Tab.Screen
        name="VetRegister"
        component={RegisterVetScreen}
        options={{ title: "Veterinarian" }}
      />
    </Tab.Navigator>
  );
}