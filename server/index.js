// index.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import donorModel from './models/Donor.js';       // ⬅️ import the model (from Donor.js)

const app = express();
app.use(cors());
app.use(express.json());

// --- MongoDB connection ---
const connectionString =
  "mongodb+srv://admin:admin@btech.mun6zsy.mongodb.net/BDMS?retryWrites=true&w=majority&appName=btech";

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Database Connected..");
  })
  .catch((error) => {
    console.log("Database connection error.." + error);
  });

// ===================== ROUTES ===================== //

// -------- REGISTER --------
app.post("/register", async (req, res) => {
  try {
    // req.body should contain: fullName, password, phoneNumber, age, gender, bloodType, role, email, address
   const donor = new donorModel(req.body);
    await donor.save();

    // check if email already exists
    const existing = await donorModel.findOne({ email });
    if (existing) {
      return res.status(500).json({ message: "User already exists..." });
    }

    // hash password
    const hash_password = await bcrypt.hash(password, 10);

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
    });

    await new_donor.save();
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Register error", error: error.message });
  }
});

// -------- LOGIN (for later) --------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const donor = await donorModel.findOne({ email });
    if (!donor) {
      return res.status(500).json({ message: "User not found..." });
    }

    const pwd_match = await bcrypt.compare(password, donor.password);
    if (!pwd_match) {
      return res.status(200).json({ message: "Invalid Credentials.." });
    }

    const { password: _pwd, ...safeUser } = donor.toObject();
    res.status(200).json({ user: safeUser, message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login error", error: error.message });
  }
});

// --- Start server ---
app.listen(5050, () => {
  console.log("Server connected at port number 5050..");
});
