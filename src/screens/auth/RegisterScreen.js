import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity
} from "react-native";
import { useState } from "react";
import Checkbox from "expo-checkbox";

const API_URL = "http://10.0.2.2:3000";

export default function RegisterScreen({ navigation, role = "petowner" }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [vetLicense, setVetLicense] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstname || !lastname || !email || !password || !passwordConfirm) {
      Alert.alert("กรอกข้อมูลไม่ครบ", "กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert("รหัสผ่านไม่ตรงกัน", "กรุณากรอกรหัสผ่านอีกครั้ง");
      return;
    }

    if (!isChecked) {
      Alert.alert("ยังไม่ได้ยอมรับเงื่อนไข", "กรุณาติ๊ก checkbox ก่อนสมัคร");
      return;
    }
    if (role === "vet" && !vetLicense.trim()) {
      Alert.alert("กรอกข้อมูลไม่ครบ", "กรุณากรอกเลขใบอนุญาตสัตวแพทย์");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          email: email.trim(),
          password,
          role,
          vetLicense: role === "vet" ? vetLicense.trim() : null,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "สมัครไม่สำเร็จ");
      }
      console.log("register success:", result);
      navigation.navigate("Otp", {
        email: email.trim(),
      });
    } catch (error) {
      Alert.alert("สมัครไม่สำเร็จ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <Text>Firstname</Text>
      <TextInput
        style={styles.input}
        value={firstname}
        onChangeText={setFirstname}
        placeholder="ชื่อ"
      />

      <Text>Lastname</Text>
      <TextInput
        style={styles.input}
        value={lastname}
        onChangeText={setLastname}
        placeholder="นามสกุล"
      />

      <Text>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="email@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="รหัสผ่าน"
        secureTextEntry
      />

      <Text>Confirm Password</Text>
      <TextInput
        style={styles.input}
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        placeholder="ยืนยันรหัสผ่าน"
        secureTextEntry
      />
      {role === "vet" && (
        <>
          <Text>Vet License</Text>
          <TextInput
            style={styles.input}
            value={vetLicense}
            onChangeText={setVetLicense}
            placeholder="เลขใบอนุญาตสัตวแพทย์"
          />
        </>
      )}
      <View style={styles.checkRow}>
        <Checkbox value={isChecked} onValueChange={setChecked} />
        <Text style={styles.checkText}>ยอมรับเงื่อนไขการใช้งาน</Text>
      </View>

      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {loading ? "กำลังสมัคร..." : "Register"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>navigation.navigate("Login")}>
        <Text style={styles.loginText}>มีบัญชีแล้ว? <Text style={{color:"#74A1C0"}}>Login</Text></Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 6,
    marginBottom: 12,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  checkText: {
    marginLeft: 8,
  },
  button: {
    borderRadius: 10,
    padding:20,
    backgroundColor:'#96B9D7'
  },  
  buttonText: {
    textAlign:'center',
    color:'#ffff',
    fontWeight:'bold'
  },loginText:{
    textAlign : 'center',
    padding:20,
    color:'#A6A6A6'
  }
});