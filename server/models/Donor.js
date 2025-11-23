// Donor.js
import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    fName: { type: String, required: true },
    password: { type: String, required: true },
    phoneNum: { type: Number, required: true },
    Age: { type: String, required: true },          // Age as string, like "23"
    gender: { type: String, required: true },
    bloodType: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String},
    verificationTokenExpires: { type: Date},
  },
  { timestamps: true }
);

// model name, schema, collection
const donorModel = mongoose.model("donor", donorSchema, "donorCol");

export default donorModel;
