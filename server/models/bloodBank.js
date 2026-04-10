import mongoose from "mongoose";

const bloodBankSchema = new mongoose.Schema(
  {
    bloodType: { type: String, required: true },
    availability: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    donationDate: { type: Date, default: null },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "HospitalProfile", required: true },
    /** Set when donation is linked to a registered donor (appointments) or entered manually */
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "donor",
      default: null,
    },
    /** Snapshot or manual entry; shown on reports when donor is not linked */
    donorName: { type: String, default: "" },
  },
  { timestamps: true }
);

const BloodBank = mongoose.model("BloodBank", bloodBankSchema);
export default BloodBank;
