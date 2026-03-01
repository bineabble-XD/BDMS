import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
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
      lastDonationMonth: String,
      donatedBefore: Boolean,
      sickPast3Months: Boolean,
      medsRecently: String,
      hasColdFluFever: String,
      medicalRestriction: String,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);