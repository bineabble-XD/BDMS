import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "donor", required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    role: { type: String, required: true, enum: ["Hospital", "Blood Bank"] },
    acknowledgedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "donor" }],
  },
  { timestamps: true }
);

export default mongoose.model("CommunityPost", communityPostSchema, "communityPosts");
