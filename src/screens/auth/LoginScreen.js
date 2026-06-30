import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import Checkbox from "expo-checkbox";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  Button,
} from "react-native";

const API_URL = "http://10.0.2.2:3000";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      Alert.alert("กรอกข้อมูลไม่ครบ", "กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          password,
        }),
      });
      const text = await response.text();
      let result;

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error("Server ส่งข้อมูลไม่ใช่ JSON");
      }


      if (response.status === 403 && result.goToOtp) {
        Alert.alert("ยังไม่ได้ยืนยัน OTP", result.message);

        navigation.replace("Otp", {
          email: result.email,
        });

        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }

      Alert.alert(
        "เข้าสู่ระบบสำเร็จ",
        `ยินดีต้อนรับ ${result.user?.firstname || ""}`
      );
      const role = result.user?.role?.toLowerCase();

      console.log("LOGIN ROLE =", role);

      if (role === "vet") {
        navigation.replace("Vet");
      } else if (role === "petowner") {
        navigation.replace("PetOwner");
      } else {
        Alert.alert("Role ไม่ถูกต้อง");
      }
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("เข้าสู่ระบบไม่สำเร็จ", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>เข้าสู่ระบบ</Text>

      <TextInput
        style={styles.input}
        placeholder="อีเมล"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="รหัสผ่าน"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.checkRow}>
        <Checkbox value={isChecked} onValueChange={setChecked} />
        <Text style={styles.checkText}>Remember me</Text>
      </View>

      <Button
        title={loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkText: {
    marginLeft: 8,
    fontSize: 16,
  },
});