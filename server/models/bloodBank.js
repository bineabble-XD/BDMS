import mongoose from "mongoose";

const bloodBankSchema = new mongoose.Schema(
  {
    bloodType: { type: String, required: true },
    availability: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    donationDate: { type: Date, default: null },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "HospitalProfile", required: true },
  },
  { timestamps: true }
);

const BloodBank = mongoose.model("BloodBank", bloodBankSchema);
export default BloodBank;
