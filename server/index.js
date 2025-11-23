import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import donorModel from "./models/Donor.js";

const app = express();
app.use(cors());
app.use(express.json());

// --- MongoDB connection ---
const connectionString =
  "mongodb+srv://admin:admin@btech.mun6zsy.mongodb.net/BDMS?retryWrites=true&w=majority&appName=btech";

// ✅ connect to Mongo, THEN start server
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Database Connected..");

    app.listen(5050, () => {
      console.log("Server connected at port number 5050..");
    });
  })
  .catch((error) => {
    console.log("Database connection error: " + error);
  });

// ✅ configure mail transporter (put your real Gmail + app password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bdmsbtech@gmail.com",        // TODO: change this
    pass: "xysfsqeolcziepzw",     // TODO: 16-digit app password
  },
});

// ===================== ROUTES ===================== //

// -------- REGISTER --------
app.post("/register", async (req, res) => {
  try {
    const {
      fName,
      password,
      phoneNum,
      Age,
      gender,
      bloodType,
      role,
      email,
      address,
    } = req.body;

    if (
      !fName ||
      !password ||
      !phoneNum ||
      !Age ||
      !gender ||
      !bloodType ||
      !role ||
      !email ||
      !address
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if email exists
    const existing = await donorModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists..." });
    }

    const hash_password = await bcrypt.hash(password, 10);

    // create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    const new_donor = new donorModel({
      fName,
      password: hash_password,
      phoneNum,
      Age,
      gender,
      bloodType,
      role,
      email,
      address,
      isVerified: false,
      verificationToken,
      verificationTokenExpires: tokenExpiry,
    });

    await new_donor.save();

    const verifyUrl = `http://localhost:5050/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
      from: '"BDMS" <youremail@gmail.com>',
      to: email,
      subject: "Verify your BDMS account",
      html: `
        <h3>Welcome to BDMS</h3>
        <p>Please click the link below to verify your email:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    return res.status(201).json({
      message:
        "Registered successfully! Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Register error",
      error: error.message,
    });
  }
});

// -------- VERIFY EMAIL --------
app.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send("Invalid verification link.");
    }

    const user = await donorModel.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .send("Verification link is invalid or has expired.");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // you can redirect to frontend instead of plain text
    // res.redirect("http://localhost:5173/login");
  res.redirect("http://localhost:5173/verified");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error.");
  }
});

// -------- LOGIN --------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const donor = await donorModel.findOne({ email });
    if (!donor) {
      return res.status(404).json({ message: "User not found..." });
    }

    if (!donor.isVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in.",
      });
    }

    const pwd_match = await bcrypt.compare(password, donor.password);
    if (!pwd_match) {
      return res.status(401).json({ message: "Invalid Credentials.." });
    }

    const { password: _pwd, ...safeUser } = donor.toObject();
    res.status(200).json({ user: safeUser, message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Login error",
      error: error.message,
    });
  }
});
