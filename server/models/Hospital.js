// models/HospitalProfile.js
import mongoose from "mongoose";

const hospitalProfileSchema = new mongoose.Schema(
  {
    hospitalName: { type: String, required: true },
    city: { type: String, required: true },
    type: { type: String }, // Government, Private, etc. (optional)
    contactPerson: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    

    // this hospital belongs to a user account
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "donor", required: true },

    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const HospitalProfileModel = mongoose.model(
  "HospitalProfile",
  hospitalProfileSchema,
  "hospitalProfiles"
);

export default HospitalProfileModel;
