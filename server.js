
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

// เช็คก่อน (debug)
console.log("SUPABASE_URL =", process.env.EXPO_PUBLIC_SUPABASE_URL);

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

app.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")   // <-- เปลี่ยนชื่อ table ถ้ามึงไม่ใช่ users
      .insert({
        firstname,
        lastname,
        email,
        password_hash: hash,
        role: "petowner",
        vet_license: null,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "success",
      user: data,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message,
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port", process.env.PORT || 3000);
});