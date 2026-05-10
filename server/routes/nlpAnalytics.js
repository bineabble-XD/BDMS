import express from "express";
import { getNlpAnalytics } from "../utils/nlpAnalyticsStore.js";

const router = express.Router();

router.get("/analytics", (req, res) => {
  try {
    res.json(getNlpAnalytics());
  } catch (err) {
    console.error("NLP analytics error:", err);
    res.status(500).json({ message: "Failed to load analytics" });
  }
});

export default router;
