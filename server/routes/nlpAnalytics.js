import express from "express";
import UrgentRequest from "../models/UrgentRequest.js";

const router = express.Router();

router.get("/analytics", async (req, res) => {
  try {
const requests = await UrgentRequest.find()
  .populate("hospital", "hospitalName");
    // Blood type analytics
    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const bloodTypeData = bloodTypes.map((type) => ({
      name: type,
      value: requests.filter((r) => r.bloodType === type).length,
    }));

    // Location analytics
    const hospitalMap = {};

requests.forEach((r) => {
  const hospitalName =
  r.location || r.hospital?.hospitalName || "Unknown";

  hospitalMap[hospitalName] =
    (hospitalMap[hospitalName] || 0) + 1;
});

const locationData = Object.entries(hospitalMap).map(
  ([name, value]) => ({
    name,
    value,
  })
);

    // Urgency analytics
    const urgencyLevels = ["High", "Medium", "Low"];

    const urgencyData = urgencyLevels.map((level) => ({
      name: level,
      value: requests.filter((r) => r.urgency === level).length,
    }));

    // Sentiment analytics
    const sentimentLevels = ["positive", "neutral", "negative"];

    const sentimentData = sentimentLevels.map((level) => ({
      name: level,
      value: requests.filter(
        (r) => r.sentiment?.sentiment?.toLowerCase() === level
      ).length,
    }));

    res.json({
      bloodTypeData,
      locationData,
      urgencyData,
      sentimentData,
      totalRequests: requests.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to load analytics" });
  }
});

export default router;