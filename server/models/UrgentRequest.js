import mongoose from "mongoose";

const urgentRequestSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HospitalProfile",
      required: true,
    },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },
    bloodType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["open", "fulfilled"],
      default: "open",
    },
  },
  { timestamps: true }
);

export default mongoose.model("UrgentRequest", urgentRequestSchema);
