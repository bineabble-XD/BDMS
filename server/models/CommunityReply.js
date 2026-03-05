import mongoose from "mongoose";

const communityReplySchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "CommunityPost", required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "donor", required: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("CommunityReply", communityReplySchema, "communityReplies");
