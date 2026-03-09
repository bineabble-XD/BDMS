process.env.TZ = "Asia/Muscat";
import "dotenv/config";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

import donorModel from "./models/Donor.js";
import HospitalProfileModel from "./models/Hospital.js";
import Booking from "./models/Booking.js";
import BloodBank from "./models/bloodBank.js";
import UrgentRequest from "./models/UrgentRequest.js";
import Feedback from "./models/Feedback.js";
import CommunityPost from "./models/CommunityPost.js";
import CommunityReply from "./models/CommunityReply.js";
import { extractFromText, analyzeSentiment } from "./utils/nlp.js";

const app = express();
app.use(cors());
app.use(express.json());

const connectionString =
  "mongodb+srv://admin:admin@btech.mun6zsy.mongodb.net/BDMS?retryWrites=true&w=majority&appName=btech";

// ✅ UPDATED: use .env if available, fallback to your current values
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "bdmsbtech@gmail.com",
    pass: process.env.EMAIL_PASS || "xysfsqeolcziepzw",
  },
});

// ✅ helper: date/time in Oman
const formatDateTimeOman = (date) => {
  try {
    return new Date(date).toLocaleString("en-GB", {
      timeZone: "Asia/Muscat",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(date);
  }
};

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
      email,
      password,
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

const requireAdmin = (req, res, next) => {
  next();
};

app.get("/hospitals/approved", async (req, res) => {
  try {
    const hospitals = await HospitalProfileModel.find({ status: "approved" })
      .select("_id hospitalName city")
      .sort({ hospitalName: 1 });
    res.json(hospitals);
  } catch (err) {
    console.error("Approved hospitals error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

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

app.get("/hospitals/profile/:userId", async (req, res) => {
  try {
    const profile = await HospitalProfileModel.findOne({
      userId: req.params.userId,
    });

    if (!profile) {
      return res.status(404).json({ message: "Hospital profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/blood-bank", async (req, res) => {
  try {
    const { bloodType, availability, expiryDate, donationDate, hospitalId } =
      req.body;

    if (!bloodType || !availability || !expiryDate || !hospitalId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (donationDate) {
      const dt = new Date(donationDate);
      const now = new Date();
      if (dt > now) {
        return res
          .status(400)
          .json({ message: "Donation date and time cannot be in the future." });
      }
      const twoWeeksAgo = new Date(now);
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      if (dt < twoWeeksAgo) {
        return res
          .status(400)
          .json({ message: "Donation date must be within the last 2 weeks." });
      }
    }

    const recordData = { bloodType, availability, expiryDate, hospitalId };
    if (donationDate) recordData.donationDate = new Date(donationDate);

    const newBloodBankRecord = new BloodBank(recordData);
    await newBloodBankRecord.save();

    return res
      .status(201)
      .json({ message: "Blood bank record added successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.put("/blood-bank/:id", async (req, res) => {
  try {
    const { bloodType, availability, expiryDate, donationDate } = req.body;
    const bloodBankRecord = await BloodBank.findById(req.params.id);

    if (!bloodBankRecord) {
      return res
        .status(404)
        .json({ message: "Blood Bank Record not found" });
    }

    bloodBankRecord.bloodType = bloodType || bloodBankRecord.bloodType;
    bloodBankRecord.availability =
      availability || bloodBankRecord.availability;
    bloodBankRecord.expiryDate = expiryDate || bloodBankRecord.expiryDate;
    if (donationDate !== undefined)
      bloodBankRecord.donationDate = donationDate ? new Date(donationDate) : null;

    await bloodBankRecord.save();
    return res
      .status(200)
      .json({ message: "Blood bank record updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/blood-bank/all", async (req, res) => {
  try {
    const records = await BloodBank.find({}).populate(
      "hospitalId",
      "hospitalName"
    );
    return res.status(200).json(records);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Blood stock report - aggregated by blood type + detailed records (all hospitals or by hospitalId)
app.get("/api/blood-stock-report", async (req, res) => {
  try {
    const { hospitalId } = req.query;
    let match = {};
    if (hospitalId) {
      const profileByUser = await HospitalProfileModel.findOne({
        userId: hospitalId,
      });
      const profileById = await HospitalProfileModel.findById(hospitalId);
      const profile = profileByUser || profileById;
      if (profile) {
        match.hospitalId = profile._id;
      } else {
        match.hospitalId = hospitalId;
      }
    }

    const [aggregated, records] = await Promise.all([
      BloodBank.aggregate([
        { $match: match },
        { $group: { _id: "$bloodType", total: { $sum: "$availability" } } },
        { $sort: { _id: 1 } },
      ]),
      BloodBank.find(match)
        .populate("hospitalId", "hospitalName city")
        .sort({ bloodType: 1, createdAt: -1 })
        .lean(),
    ]);

    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const data = bloodTypes.map((type) => {
      const found = aggregated.find((a) => a._id === type);
      return { type, total: found ? found.total : 0 };
    });

    const recordsWithDetails = records.map((r) => ({
      bloodType: r.bloodType,
      units: r.availability,
      date: r.donationDate || r.createdAt,
      location: r.hospitalId
        ? `${r.hospitalId.hospitalName || ""}${
            r.hospitalId.city ? `, ${r.hospitalId.city}` : ""
          }`.trim()
        : "—",
    }));

    res.json({ data, records: recordsWithDetails, generatedAt: new Date().toISOString() });
  } catch (err) {
    console.error("Blood stock report error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/blood-bank/:hospitalId", async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const profile = await HospitalProfileModel.findOne({ userId: hospitalId });
    if (profile) {
      const records = await BloodBank.find({ hospitalId: profile._id });
      return res.status(200).json({ records, profileId: profile._id });
    }
    const records = await BloodBank.find({ hospitalId });
    return res.status(200).json({ records: records || [], profileId: hospitalId });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.delete("/blood-bank/:id", async (req, res) => {
  try {
    const bloodBankRecord = await BloodBank.findById(req.params.id);

    if (!bloodBankRecord) {
      return res.status(404).json({ message: "Blood Bank Record not found" });
    }

    await bloodBankRecord.remove();
    return res
      .status(200)
      .json({ message: "Blood bank record deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

//new codes 02/3/2026
app.post("/bookings", async (req, res) => {
  try {
    const { donorId, hospitalId, appointmentDate, bloodType, eligibility } =
      req.body;

    if (!donorId || !hospitalId || !appointmentDate || !bloodType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const appointmentDateObj = new Date(appointmentDate);
    if (isNaN(appointmentDateObj.getTime()) || appointmentDateObj <= new Date()) {
      return res
        .status(400)
        .json({ message: "Appointment date must be in the future" });
    }
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 14);
    if (appointmentDateObj > maxDate) {
      return res
        .status(400)
        .json({ message: "Appointment date cannot be more than 2 weeks from today" });
    }
    const hours = appointmentDateObj.getHours();
    const minutes = appointmentDateObj.getMinutes();
    if (hours < 9 || hours > 22 || (hours === 22 && minutes > 0)) {
      return res
        .status(400)
        .json({ message: "Appointment time must be between 9:00 AM and 10:00 PM" });
    }
    if (minutes % 15 !== 0) {
      return res.status(400).json({ message: "Time must be in 15-minute intervals" });
    }

    const booking = await Booking.create({
      donor: donorId,
      hospital: hospitalId,
      appointmentDate: appointmentDateObj,
      bloodType,
      eligibility, // ✅ FULL OBJECT SAVED
    });

    res.status(201).json({
      message: "Booking request sent successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
});

app.get("/api/bookings/slots", async (req, res) => {
  try {
    const { hospitalId, date, excludeBookingId } = req.query;
    if (!hospitalId || !date) {
      return res.status(400).json({ message: "hospitalId and date are required" });
    }
    const start = new Date(`${date}T00:00:00`);
    const end = new Date(`${date}T23:59:59.999`);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ message: "Invalid date format (use YYYY-MM-DD)" });
    }
    const match = {
      hospital: hospitalId,
      status: { $in: ["pending", "approved"] },
      appointmentDate: { $gte: start, $lte: end },
    };
    if (excludeBookingId) {
      match._id = { $ne: excludeBookingId };
    }
    const bookings = await Booking.find(match).select("appointmentDate");

    const bookedSlots = bookings.map((b) => {
      const d = new Date(b.appointmentDate);
      const h = d.getHours();
      const m = Math.floor(d.getMinutes() / 15) * 15;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    });

    res.json({ bookedSlots: [...new Set(bookedSlots)] });
  } catch (err) {
    console.error("Bookings slots error:", err);
    res.status(500).json({ message: "Failed to fetch slots" });
  }
});

app.get("/bookings/all", async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("donor", "fName email phoneNum bloodType")
      .populate("hospital", "hospitalName city")
      .sort({ appointmentDate: -1 });

    const pending = bookings.filter((b) => b.status === "pending");
    const appointments = bookings.filter(
      (b) => b.status === "approved" && new Date(b.appointmentDate) >= new Date()
    );
    const completed = bookings.filter((b) => b.status === "completed");
    res.json({ bookings, pending, appointments, completed });
  } catch (error) {
    console.error("Bookings all error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// Get bookings for a hospital (by userId - looks up HospitalProfile)
app.get("/bookings/hospital/:userId", async (req, res) => {
  try {
    let profile = null;
    try {
      profile = await HospitalProfileModel.findOne({
        userId: new mongoose.Types.ObjectId(req.params.userId),
      });
    } catch {
      profile = await HospitalProfileModel.findOne({ userId: req.params.userId });
    }
    if (!profile) {
      return res.status(404).json({ message: "Hospital profile not found" });
    }

    const bookings = await Booking.find({ hospital: profile._id })
      .populate("donor", "fName email phoneNum")
      .populate("hospital", "hospitalName city")
      .sort({ appointmentDate: -1 });

    const donations = bookings.filter(
      (b) => b.status === "approved" || b.status === "completed"
    );
    const pending = bookings.filter((b) => b.status === "pending");
    const appointments = bookings.filter(
      (b) => b.status === "approved" && new Date(b.appointmentDate) >= new Date()
    );
    const completed = bookings.filter((b) => b.status === "completed");

    res.json({ bookings, donations, pending, appointments, completed, profile });
  } catch (error) {
    console.error("Bookings fetch error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

app.patch("/bookings/:id/status", async (req, res) => {
  try {
    const { status, userId } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Authentication required (userId)" });
    }

    let profile = null;
    try {
      profile = await HospitalProfileModel.findOne({
        userId: new mongoose.Types.ObjectId(userId),
      });
    } catch {
      profile = await HospitalProfileModel.findOne({ userId });
    }

    if (!profile) {
      return res.status(403).json({ message: "Hospital profile not found" });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("donor", "email fName")
      .populate("hospital", "hospitalName city contactPhone contactPerson");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const bhId = booking.hospital?._id ?? booking.hospital;
    const bhp = await HospitalProfileModel.findById(bhId);

    if (
      !bhp ||
      String(bhp.hospitalName || "").toLowerCase() !==
        String(profile.hospitalName || "").toLowerCase()
    ) {
      return res.status(403).json({
        message: "You can only approve/reject bookings for your own hospital",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Booking already processed" });
    }

    booking.status = status;
    await booking.save();

    if (status === "approved") {
      try {
        const donorEmail = booking?.donor?.email;
        const donorName = booking?.donor?.fName || "Donor";
        const hospitalName = bhp?.hospitalName || profile?.hospitalName || "Hospital";
        const hospitalCity = bhp?.city || "";
        const hospitalPhone = bhp?.contactPhone || "";
        const contactPerson = bhp?.contactPerson || "";
        const dateStr = formatDateTimeOman(booking.appointmentDate);

        if (donorEmail) {
          await transporter.sendMail({
            from: `"BDMS" <${process.env.EMAIL_USER || "bdmsbtech@gmail.com"}>`,
            to: donorEmail,
            subject: "Your Blood Donation Appointment Has Been Approved",
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 520px">
                <h2 style="color: #c0392b;">Your Appointment Has Been Approved</h2>
                <p>Hello <b>${donorName}</b>,</p>
                <p>Great news! <b>${hospitalName}</b> has approved your blood donation appointment.</p>
                <p style="background: #f8f9fa; padding: 12px; border-radius: 6px;">
                  <b>Date & Time:</b> ${dateStr}<br/>
                  <b>Blood Type:</b> ${booking.bloodType || "—"}<br/>
                  <b>Hospital:</b> ${hospitalName}${hospitalCity ? `, ${hospitalCity}` : ""}
                </p>
                ${contactPerson || hospitalPhone ? `
                <p><b>Contact:</b> ${contactPerson || "—"}${hospitalPhone ? ` | Phone: ${hospitalPhone}` : ""}</p>
                ` : ""}
                <hr style="border: none; border-top: 1px solid #eee"/>
                <p>Please arrive on time. Thank you for donating and saving lives!<br/><b>BDMS</b></p>
              </div>
            `,
          });
        }
      } catch (emailErr) {
        console.error("Email send error on approval:", emailErr?.message || emailErr);
      }
    }

    res.json({ message: `Booking ${status} successfully`, booking });
  } catch (error) {
    console.error("Booking status error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.patch("/bookings/:id/complete", async (req, res) => {
  try {
    const { userId, isAdmin } = req.body || {};
    if (!userId)
      return res.status(401).json({ message: "Authentication required (userId)" });

    const booking = await Booking.findById(req.params.id).populate("hospital", "_id");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const bhId = booking.hospital?._id ?? booking.hospital;
    if (!isAdmin) {
      let profile = null;
      try {
        profile = await HospitalProfileModel.findOne({
          userId: new mongoose.Types.ObjectId(userId),
        });
      } catch {
        profile = await HospitalProfileModel.findOne({ userId });
      }
      if (!profile)
        return res.status(403).json({ message: "Hospital profile not found" });

      const bhp = await HospitalProfileModel.findById(bhId);
      if (!bhp || String(bhp._id) !== String(profile._id)) {
        return res.status(403).json({
          message: "You can only complete donations for your own hospital",
        });
      }
    }

    if (booking.status !== "approved") {
      return res.status(400).json({
        message: "Only approved appointments can be marked as completed",
      });
    }

    const now = new Date();
    const appointmentDate = new Date(booking.appointmentDate);
    if (now < appointmentDate) {
      return res.status(400).json({
        message:
          "Cannot confirm yet. The appointment date and time has not been reached. Please confirm only when the donor has completed their donation on the scheduled day.",
      });
    }

    booking.status = "completed";
    await booking.save();

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 42);

    await BloodBank.create({
      bloodType: booking.bloodType,
      availability: 1,
      expiryDate,
      donationDate: new Date(),
      hospitalId: bhId,
    });

    res.json({ message: "Donation confirmed and blood added to stock", booking });
  } catch (error) {
    console.error("Booking complete error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.delete("/bookings/:id", async (req, res) => {
  try {
    const userId = req.query.userId || req.body?.userId;
    if (!userId)
      return res.status(401).json({ message: "Authentication required (userId)" });

    let profile = null;
    try {
      profile = await HospitalProfileModel.findOne({
        userId: new mongoose.Types.ObjectId(userId),
      });
    } catch {
      profile = await HospitalProfileModel.findOne({ userId });
    }
    if (!profile)
      return res.status(403).json({ message: "Hospital profile not found" });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const bhId = booking.hospital?._id ?? booking.hospital;
    const bhp = await HospitalProfileModel.findById(bhId);

    if (
      !bhp ||
      String(bhp.hospitalName || "").toLowerCase() !==
        String(profile.hospitalName || "").toLowerCase()
    ) {
      return res.status(403).json({
        message: "You can only cancel bookings for your own hospital",
      });
    }

    booking.status = "rejected";
    await booking.save();

    res.json({ message: "Appointment cancelled", booking });
  } catch (error) {
    console.error("Booking cancel error:", error);
    res.status(500).json({ message: error.message });
  }
});

const deleteUrgentRequest = async (req, res) => {
  try {
    const userId = req.query.userId ?? req.body?.userId;
    if (!userId)
      return res.status(401).json({ message: "Authentication required (userId)" });

    let profile = null;
    try {
      profile = await HospitalProfileModel.findOne({
        userId: new mongoose.Types.ObjectId(userId),
      });
    } catch {
      profile = await HospitalProfileModel.findOne({ userId });
    }
    if (!profile)
      return res.status(403).json({ message: "Hospital profile not found" });

    const ur = await UrgentRequest.findById(req.params.id);
    if (!ur) return res.status(404).json({ message: "Urgent request not found" });

    const urHospitalStr = String(ur.hospital?._id ?? ur.hospital);
    const profileStr = String(profile._id);
    if (urHospitalStr !== profileStr) {
      return res.status(403).json({ message: "You can only remove your own urgent requests" });
    }

    await UrgentRequest.findByIdAndDelete(req.params.id);
    res.json({ message: "Urgent request removed" });
  } catch (error) {
    console.error("Unpost error:", error);
    res.status(500).json({ message: error.message });
  }
};

app.delete("/urgent-requests/:id", deleteUrgentRequest);
app.patch("/urgent-requests/:id/unpost", deleteUrgentRequest);

// Urgent requests - GET all open (for donors/public)
app.get("/urgent-requests", async (req, res) => {
  try {
    const requests = await UrgentRequest.find({ status: "open" })
      .populate("hospital", "hospitalName city contactPerson contactPhone contactEmail")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error("Urgent requests fetch error:", error);
    res.status(500).json({ message: "Failed to fetch urgent requests" });
  }
});

// Urgent requests - POST (hospital creates urgent blood supply request)
app.post("/urgent-requests", async (req, res) => {
  try {
    const { userId, bloodType, quantity, message } = req.body;

    if (!userId || !bloodType)
      return res.status(400).json({ message: "userId and bloodType are required" });

    const profile = await HospitalProfileModel.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Hospital profile not found" });

    const request = await UrgentRequest.create({
      hospital: profile._id,
      bloodType,
      quantity: quantity || 1,
      message: message || "",
    });

    const populated = await UrgentRequest.findById(request._id).populate(
      "hospital",
      "hospitalName city contactPerson contactPhone contactEmail"
    );

    // Notify donors with matching blood type (email + in-app)
    const normalizedReq = (bloodType || "").trim();
    const escapedBt = normalizedReq.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matchingDonors = await donorModel.find({
      bloodType: { $regex: new RegExp(`^${escapedBt}$`, "i") },
      isHospital: { $ne: true },
      isAdmin: { $ne: true },
      email: { $exists: true, $ne: "" },
    });

    const hospitalName = profile?.hospitalName || populated?.hospital?.hospitalName || "A hospital";
    const hospitalCity = profile?.city || populated?.hospital?.city || "";

    for (const donor of matchingDonors) {
      try {
        if (donor.email) {
          await transporter.sendMail({
            from: `"BDMS" <${process.env.EMAIL_USER || "bdmsbtech@gmail.com"}>`,
            to: donor.email,
            subject: `Urgent: ${hospitalName} needs your blood type (${bloodType})`,
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 520px">
                <h2 style="color: #c0392b;">Urgent Blood Request Matching Your Type</h2>
                <p>Hello <b>${donor.fName || "Donor"}</b>,</p>
                <p><b>${hospitalName}</b>${hospitalCity ? ` (${hospitalCity})` : ""} has posted an urgent request for <b>${bloodType}</b> blood.</p>
                <p>Your blood type matches — you can help save a life! Log in to BDMS to view details and book an appointment.</p>
                <p style="background: #f8f9fa; padding: 12px; border-radius: 6px;">
                  <b>Blood type needed:</b> ${bloodType}<br/>
                  <b>Quantity:</b> ${quantity || 1} unit(s)<br/>
                  ${message ? `<b>Message:</b> ${message}` : ""}
                </p>
                <hr style="border: none; border-top: 1px solid #eee"/>
                <p>Thank you for being a donor!<br/><b>BDMS</b></p>
              </div>
            `,
          });
        }
      } catch (emailErr) {
        console.error("Urgent request email error for", donor.email, ":", emailErr?.message || emailErr);
      }
    }

    res.status(201).json(populated);
  } catch (error) {
    console.error("Urgent request create error:", error);
    res.status(500).json({ message: "Failed to create urgent request" });
  }
});

// Urgent requests matching donor's blood type (for notification bell)
app.get("/urgent-requests/matching/:donorId", async (req, res) => {
  try {
    const donor = await donorModel.findById(req.params.donorId).select("bloodType");
    if (!donor || !donor.bloodType)
      return res.json({ requests: [] });

    const escapedBt = (donor.bloodType || "").trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const requests = await UrgentRequest.find({
      status: "open",
      bloodType: { $regex: new RegExp(`^${escapedBt}$`, "i") },
    })
      .populate("hospital", "hospitalName city contactPerson contactPhone contactEmail")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ requests });
  } catch (err) {
    console.error("Urgent requests matching error:", err);
    res.status(500).json({ message: "Failed to fetch matching urgent requests" });
  }
});

// Urgent requests by hospital (for dashboard)
app.get("/urgent-requests/hospital/:userId", async (req, res) => {
  try {
    let profile = null;
    try {
      profile = await HospitalProfileModel.findOne({
        userId: new mongoose.Types.ObjectId(req.params.userId),
      });
    } catch {
      profile = await HospitalProfileModel.findOne({ userId: req.params.userId });
    }
    if (!profile) return res.status(404).json({ message: "Hospital profile not found" });

    const requests = await UrgentRequest.find({
      hospital: profile._id,
      status: "open",
    })
      .populate("hospital", "hospitalName city contactPerson contactPhone contactEmail")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Urgent requests fetch error:", error);
    res.status(500).json({ message: "Failed to fetch urgent requests" });
  }
});

// ✅ Get bookings for a DONOR
app.get("/bookings/donor/:donorId", async (req, res) => {
  try {
    const { donorId } = req.params;

    const bookings = await Booking.find({ donor: donorId })
      .populate("hospital", "hospitalName city contactPerson contactPhone contactEmail")
      .sort({ appointmentDate: 1 });

    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch donor bookings" });
  }
});

// ✅ Donor reschedule appointment
app.patch("/bookings/:id/reschedule", async (req, res) => {
  try {
    const { donorId, appointmentDate } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (String(booking.donor) !== String(donorId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const newDate = new Date(appointmentDate);
    if (isNaN(newDate.getTime()) || newDate <= new Date()) {
      return res.status(400).json({ message: "Please choose a valid future date/time" });
    }
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 14);
    if (newDate > maxDate) {
      return res.status(400).json({ message: "Appointment date cannot be more than 2 weeks from today" });
    }
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    if (hours < 9 || hours > 22 || (hours === 22 && minutes > 0)) {
      return res.status(400).json({ message: "Appointment time must be between 9:00 AM and 10:00 PM" });
    }
    if (minutes % 15 !== 0) {
      return res.status(400).json({ message: "Time must be in 15-minute intervals" });
    }

    booking.appointmentDate = newDate;
    booking.status = "pending";
    await booking.save();

    res.json({
      message: "Appointment rescheduled. Hospital approval required for the new date.",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reschedule" });
  }
});

// ✅ Donor cancel appointment
app.patch("/bookings/:id/cancel", async (req, res) => {
  try {
    const { donorId } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (String(booking.donor) !== String(donorId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "You can only cancel pending bookings" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Appointment cancelled", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel" });
  }
});

// -------------------------
// Profile update (Donor/Hospital user)
// -------------------------
app.patch("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, updates } = req.body || {};

    if (!userId || String(userId) !== String(id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const allowed = ["fName", "email", "phoneNum", "Age", "gender", "bloodType", "address"];
    const safeUpdates = {};
    for (const key of allowed) {
      if (updates && Object.prototype.hasOwnProperty.call(updates, key)) {
        safeUpdates[key] = updates[key];
      }
    }

    if (safeUpdates.email) {
      const existing = await donorModel.findOne({ email: safeUpdates.email });
      if (existing && String(existing._id) !== String(id)) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updated = await donorModel.findByIdAndUpdate(id, safeUpdates, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "User not found" });

    const { password: _pwd, ...safeUser } = updated.toObject();
    return res.json({ message: "Profile updated", user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// -------------------------
// NLP API
// -------------------------
app.post("/api/nlp/analyze", (req, res) => {
  try {
    const { text } = req.body || {};
    const result = extractFromText(text);
    res.json(result);
  } catch (err) {
    console.error("NLP analyze error:", err);
    res.status(500).json({ message: "NLP analysis failed" });
  }
});

app.post("/api/nlp/sentiment", (req, res) => {
  try {
    const { text } = req.body || {};
    const result = analyzeSentiment(text);
    res.json(result);
  } catch (err) {
    console.error("NLP sentiment error:", err);
    res.status(500).json({ message: "Sentiment analysis failed" });
  }
});

// -------------------------
// Feedback (with sentiment analysis)
// -------------------------
app.post("/feedback", async (req, res) => {
  try {
    const { rating, text, userId } = req.body || {};

    if (rating == null || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const sentiment = text
      ? analyzeSentiment(text)
      : { sentiment: "neutral", score: 0, label: "Neutral" };

    const feedback = await Feedback.create({
      rating: Number(rating),
      text: text || "",
      userId: userId || null,
      sentiment: sentiment.sentiment,
      sentimentScore: sentiment.score,
    });

    res.status(201).json({
      message: "Thank you for your feedback!",
      feedback: {
        id: feedback._id,
        rating: feedback.rating,
        sentiment: feedback.sentiment,
      },
    });
  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

// -------------------------
// Community
// -------------------------
app.get("/api/community/posts", async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .sort({ createdAt: -1 })
      .populate("authorId", "fName role")
      .lean();

    const postIds = posts.map((p) => p._id);

    const replies = await CommunityReply.find({ postId: { $in: postIds } })
      .sort({ createdAt: 1 })
      .populate("authorId", "fName role")
      .lean();

    const repliesByPost = {};
    replies.forEach((r) => {
      const key = String(r.postId);
      if (!repliesByPost[key]) repliesByPost[key] = [];
      repliesByPost[key].push(r);
    });

    const result = posts.map((p) => ({
      ...p,
      replies: repliesByPost[String(p._id)] || [],
    }));

    res.json(result);
  } catch (err) {
    console.error("Community posts error:", err);
    res.status(500).json({ message: "Failed to fetch community posts" });
  }
});

app.post("/api/community/posts", async (req, res) => {
  try {
    const { userId, title, body, role } = req.body || {};
    if (!userId || !title || !body || !role) {
      return res.status(400).json({ message: "userId, title, body and role are required" });
    }
    const validRoles = ["Hospital", "Blood Bank"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "role must be Hospital or Blood Bank" });
    }
    const post = await CommunityPost.create({
      authorId: userId,
      title: title.trim(),
      body: body.trim(),
      role,
    });
    const populated = await CommunityPost.findById(post._id)
      .populate("authorId", "fName role")
      .lean();
    res.status(201).json({ ...populated, replies: [] });
  } catch (err) {
    console.error("Community post create error:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
});

app.post("/api/community/posts/:id/reply", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, body } = req.body || {};
    if (!userId || !body || !body.trim()) {
      return res.status(400).json({ message: "userId and body are required" });
    }
    const post = await CommunityPost.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const reply = await CommunityReply.create({
      postId: id,
      authorId: userId,
      body: body.trim(),
    });
    const populated = await CommunityReply.findById(reply._id)
      .populate("authorId", "fName role")
      .lean();
    res.status(201).json(populated);
  } catch (err) {
    console.error("Community reply error:", err);
    res.status(500).json({ message: "Failed to add reply" });
  }
});

app.post("/api/community/posts/:id/acknowledge", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ message: "userId is required" });
    const post = await CommunityPost.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const uid = new mongoose.Types.ObjectId(userId);
    const idx = post.acknowledgedBy.findIndex((a) => a.toString() === uid.toString());
    if (idx >= 0) {
      post.acknowledgedBy.splice(idx, 1);
    } else {
      post.acknowledgedBy.push(uid);
    }
    await post.save();
    res.json({ acknowledgedBy: post.acknowledgedBy });
  } catch (err) {
    console.error("Community acknowledge error:", err);
    res.status(500).json({ message: "Failed to acknowledge" });
  }
});

app.delete("/api/community/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, isAdmin } = req.body || {};
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const post = await CommunityPost.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isAuthor = String(post.authorId) === String(userId);
    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await CommunityReply.deleteMany({ postId: id });
    await CommunityPost.findByIdAndDelete(id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Community delete error:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

// -------------------------
// AUTO COMPLETE APPOINTMENTS
// -------------------------

const autoCompleteAppointments = async () => {
  try {
    const now = new Date();

    const bookings = await Booking.find({
      status: "approved",
    });

    for (const booking of bookings) {
      const appointmentDate = new Date(booking.appointmentDate);

      if (now >= appointmentDate) {
        booking.status = "completed";
        await booking.save();

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 35);

        await BloodBank.create({
          bloodType: booking.bloodType,
          availability: 1,
          expiryDate,
          donationDate: new Date(),
          hospitalId: booking.hospital,
        });

        console.log("Auto completed booking:", booking._id);
      }
    }
  } catch (err) {
    console.error("Auto complete error:", err);
  }
};

setInterval(autoCompleteAppointments, 60000);

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