import RegisterScreen from "./RegisterScreen";

export default function RegisterPetScreen({ navigation }) {
  console.log("PetOwnerNavigator");
  return <RegisterScreen navigation={navigation} role="petowner" />;
}