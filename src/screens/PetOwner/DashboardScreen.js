import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function DashboardScreenPet() {
  return (
    <View style={styles.container}>
      <Text>DashboardScreenPet2222</Text>
      <Text>DashboardScreenPet2222</Text>
      <Text>DashboardScreenPet2222</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff6767',
    alignItems: 'center',
    justifyContent: 'center',
  },
});