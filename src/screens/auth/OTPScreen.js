import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { useState } from "react";

export default function OtpScreen({ navigation, route }) {
  const { email } = route.params;
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    if (otp.length !== 6) {
      Alert.alert("OTP ไม่ครบ", "กรุณากรอกรหัส OTP 6 หลัก");
      return;
    }

    // MOCKUP:
    // ตอนนี้ยังไม่ได้เช็ก OTP กับ Supabase จริง
    navigation.replace("DashboardScreenPet");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ยืนยัน OTP</Text>

      <Text style={styles.description}>
        เราส่งรหัส OTP ไปที่
      </Text>

      <Text style={styles.email}>{email}</Text>

      <TextInput
        style={styles.otpInput}
        value={otp}
        onChangeText={setOtp}
        placeholder="123456"
        keyboardType="number-pad"
        maxLength={6}
      />

      <Button title="Verify OTP" onPress={handleVerify} />

      <View style={{ marginTop: 12 }}>
        <Button
          title="กลับไป Register"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    textAlign: "center",
  },
  email: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 24,
  },
  otpInput: {
    height: 56,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 24,
    letterSpacing: 10,
    marginBottom: 16,
  },
});