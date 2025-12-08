import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import donorModel from "./models/Donor.js";
import HospitalProfileModel from "./models/Hospital.js";

const app = express();
app.use(cors());
app.use(express.json());

// --- MongoDB connection string ---
const connectionString =
  "mongodb+srv://admin:admin@btech.mun6zsy.mongodb.net/BDMS?retryWrites=true&w=majority&appName=btech";

// --- Mail transporter ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bdmsbtech@gmail.com",
    pass: "xysfsqeolcziepzw", // app password
  },
});

// ===================== ROUTES ===================== //

// -------- REGISTER (Donor) --------
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

    const existing = await donorModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists..." });
    }

    const hash_password = await bcrypt.hash(password, 10);

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
      from: '"BDMS" <bdmsbtech@gmail.com>',
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
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Register error",
      error: error.message,
    });
  }
});


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

    res.redirect("http://localhost:5173/verified");
  } catch (error) {
    console.error("Verify email error:", error);
    return res.status(500).send("Server error.");
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const donor = await donorModel.findOne({ email });
    if (!donor) {
      return res.status(404).json({ message: "User not found..." });
    }

    if (!donor.isVerified && !donor.isHospital) {
      return res.status(401).json({
        message: "Please verify your email before logging in.",
      });
    }

    const pwd_match = await bcrypt.compare(password, donor.password);
    if (!pwd_match) {
      return res.status(401).json({ message: "Invalid Credentials.." });
    }


    if (donor.isHospital) {
      const hospitalProfile = await HospitalProfileModel.findOne({
        userId: donor._id,
      });

      if (!hospitalProfile) {
        return res.status(403).json({
          message: "Hospital profile not found. Please contact admin.",
        });
      }

      if (hospitalProfile.status !== "approved") {
        return res.status(403).json({
          message: "Your hospital account is pending admin approval.",
        });
      }
    }

    const { password: _pwd, ...safeUser } = donor.toObject();
    res.status(200).json({ user: safeUser, message: "Success" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login error",
      error: error.message,
    });
  }
});


app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await donorModel.findOne({ email });

    // Always respond 200
    if (!user) {
      return res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiry;
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      from: '"BDMS" <bdmsbtech@gmail.com>',
      to: email,
      subject: "BDMS Password Reset",
      html: `
        <h3>Password Reset Request</h3>
        <p>You requested to reset your password for BDMS.</p>
        <p>Click the link below to choose a new password (valid for 1 hour):</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });

    return res.status(200).json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Server error." });
  }
});


app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await donorModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Reset link is invalid or has expired." });
    }

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error." });
  }
});


app.post("/register-hospital", async (req, res) => {
  try {
    const {
      hospitalName,
      city,
      type,
      contactPerson,
      contactEmail,
      contactPhone,
      email, // login email
      password, // login password
    } = req.body;

    const exists = await donorModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await donorModel.create({
      fName: hospitalName,
      email,
      password: hashed,
      phoneNum: contactPhone || 0,
      Age: "N/A",
      gender: "N/A",
      bloodType: "N/A",
      address: city,
      role: "Hospital",
      isHospital: true,
      isVerified: true,
    });

    await HospitalProfileModel.create({
      hospitalName,
      city,
      type,
      contactPerson,
      contactEmail,
      contactPhone,
      userId: user._id,
      status: "pending",
    });

    return res.json({
      message: "Hospital registration submitted and is pending admin approval.",
    });
  } catch (error) {
    console.error("Register hospital error:", error);
    return res.status(500).json({ message: "Server error." });
  }
});

// --- SIMPLE ADMIN MIDDLEWARE (placeholder) ---
const requireAdmin = (req, res, next) => {
  // TODO: hook into real auth later
  next();
};

// -------- HOSPITAL APPROVAL ROUTES --------

// get all pending hospitals
app.get("/hospitals/pending", requireAdmin, async (req, res) => {
  try {
    const pending = await HospitalProfileModel.find({
      status: "pending",
    }).populate("userId", "email fName");
    res.json(pending);
  } catch (err) {
    console.error("Pending hospitals error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// approve hospital
app.patch("/hospitals/:id/approve", requireAdmin, async (req, res) => {
  try {
    const hospital = await HospitalProfileModel.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found." });
    }

    hospital.status = "approved";
    await hospital.save();

    res.json({ message: "Hospital approved successfully." });
  } catch (err) {
    console.error("Approve hospital error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// reject hospital
app.patch("/hospitals/:id/reject", requireAdmin, async (req, res) => {
  try {
    const hospital = await HospitalProfileModel.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found." });
    }

    hospital.status = "rejected";
    await hospital.save();

    res.json({ message: "Hospital rejected." });
  } catch (err) {
    console.error("Reject hospital error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// ===================== DB CONNECT & SERVER START ===================== //
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
