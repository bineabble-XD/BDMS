import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "donor",
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HospitalProfile",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    bloodType: {
      type: String,
      required: true,
    },

    // 🔒 ALL eligibility fields from Appointment.jsx
    eligibility: {
      screening: { type: mongoose.Schema.Types.Mixed },

      lastDonationMonth: String,
      donatedBefore: Boolean,

      medsRecently: String,
      hasColdFluFever: String,
      medicalRestriction: String,

      highBloodPressure: String,
      diabetes: String,
      tattoo: String,

      travel: String,
      travelCountry: String,

      recentDonation: String,
      vaccination: String,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);