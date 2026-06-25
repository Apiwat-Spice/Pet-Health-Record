require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { createClient } = require("@supabase/supabase-js");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());


const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(email, otp) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "รหัส OTP สำหรับยืนยันบัญชี",
    text: `รหัส OTP ของคุณคือ ${otp} และจะหมดอายุใน 10 นาที`,
  });
}

app.post("/register", async (req, res) => {
  const { firstname, lastname, email, password, role, vetLicense } = req.body;

  try {
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        message: "กรุณากรอกข้อมูลให้ครบ",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const { data: oldUser, error: findError } = await supabase
      .from("users")
      .select("id")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (findError) throw findError;

    if (oldUser) {
      return res.status(400).json({
        message: "อีเมลนี้ถูกใช้งานแล้ว",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data: newUser, error: insertUserError } = await supabase
      .from("users")
      .insert({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: cleanEmail,
        password_hash: passwordHash,
        role: role || "petowner",
        vet_license: vetLicense || null,
        is_verified: false,
      })
      .select()
      .single();

    if (insertUserError) throw insertUserError;

    const otp = generateOtp();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();


    const { error: insertOtpError } = await supabase
      .from("otp_codes")
      .insert({
        user_id: newUser.id,
        otp: otp,
        expires_at: expiresAt,
        used: false,
      });

    if (insertOtpError) throw insertOtpError;

    await sendOtpEmail(cleanEmail, otp);

    return res.status(201).json({
      message: "สมัครสำเร็จ กรุณาตรวจสอบ OTP ในอีเมล",
      email: newUser.email,
    });
  } catch (error) {
    console.log("Register server error:", error);

    return res.status(500).json({
      message: error.message || "เกิดข้อผิดพลาดตอนสมัครสมาชิก",
    });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({
        message: "กรุณาส่ง email และ OTP",
      });
    }

    const cleanEmail = email.trim().toLowerCase();


    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, is_verified")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (userError) throw userError;

    if (!user) {
      return res.status(404).json({
        message: "ไม่พบผู้ใช้นี้",
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        message: "บัญชีนี้ยืนยันแล้ว",
      });
    }

    const { data: otpData, error: otpError } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("user_id", user.id)
      .eq("otp", otp.trim())
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (otpError) throw otpError;

    if (!otpData) {
      return res.status(400).json({
        message: "OTP ไม่ถูกต้อง หรือหมดอายุแล้ว",
      });
    }


    const { error: verifyUserError } = await supabase
      .from("users")
      .update({
        is_verified: true,
      })
      .eq("id", user.id);

    if (verifyUserError) throw verifyUserError;


    const { error: useOtpError } = await supabase
      .from("otp_codes")
      .update({
        used: true,
      })
      .eq("id", otpData.id);

    if (useOtpError) throw useOtpError;

    return res.status(200).json({
      message: "ยืนยัน OTP สำเร็จ",
    });
  } catch (error) {
    console.log("Verify OTP error:", error);

    return res.status(500).json({
      message: error.message || "เกิดข้อผิดพลาดในการยืนยัน OTP",
    });
  }
});


app.post("/resend-otp", async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        message: "กรุณาส่ง email",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, is_verified")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (userError) throw userError;

    if (!user) {
      return res.status(404).json({
        message: "ไม่พบผู้ใช้นี้",
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        message: "บัญชีนี้ยืนยันแล้ว",
      });
    }

    await supabase
      .from("otp_codes")
      .update({ used: true })
      .eq("user_id", user.id)
      .eq("used", false);

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: otpError } = await supabase
      .from("otp_codes")
      .insert({
        user_id: user.id,
        otp,
        expires_at: expiresAt,
        used: false,
      });

    if (otpError) throw otpError;

    await sendOtpEmail(cleanEmail, otp);

    return res.status(200).json({
      message: "ส่ง OTP ใหม่เรียบร้อยแล้ว",
    });
  } catch (error) {
    console.log("Resend OTP error:", error);

    return res.status(500).json({
      message: error.message || "ส่ง OTP ใหม่ไม่สำเร็จ",
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "กรุณากรอกอีเมลและรหัสผ่านให้ครบ",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const { data: user, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (findError) throw findError;

    if (!user) {
      return res.status(401).json({
        message: "ไม่พบอีเมลนี้ในระบบ",
      });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "รหัสผ่านไม่ถูกต้อง",
      });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        message: "กรุณายืนยัน OTP ก่อนเข้าสู่ระบบ",
        goToOtp: true,
        email: user.email,
      });
    }

    return res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token: "test-token",
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Login server error:", error);

    return res.status(500).json({
      message: error.message || "เกิดข้อผิดพลาดใน server",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});