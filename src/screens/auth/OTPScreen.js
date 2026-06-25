import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { useState } from "react";
const API_URL = "http://10.0.2.2:3000";
export default function OtpScreen({ navigation, route }) {
  const { email } = route.params;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResendOtp = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ส่ง OTP ใหม่ไม่สำเร็จ");
      }

      Alert.alert("ส่งสำเร็จ", "ส่ง OTP ใหม่ไปที่อีเมลแล้ว");
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert("OTP ไม่ครบ", "กรุณากรอกรหัส OTP 6 หลัก");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ยืนยัน OTP ไม่สำเร็จ");
      }

      Alert.alert("สำเร็จ", "ยืนยันบัญชีเรียบร้อยแล้ว");

      navigation.replace("Login");
    } catch (error) {
      console.log("Verify OTP error:", error);
      Alert.alert("ยืนยันไม่สำเร็จ", error.message);
    } finally {
      setLoading(false);
    }
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
      

      <View style={{ marginTop: 12 }}>
        <Button
          title={loading ? "กำลังตรวจสอบ..." : "Verify OTP"}
          onPress={handleVerify}
          disabled={loading}
        />
        <View style={{ marginTop: 12 }}>
          <Button
            title="ส่ง OTP ใหม่"
            onPress={handleResendOtp}
            disabled={loading}
          />
        </View>
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