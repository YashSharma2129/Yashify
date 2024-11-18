const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const replySchema = new Schema({
  content: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blogID: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    replies: [replySchema],
    ratings: [Number],
  },
  { timestamps: true }
);

// Prevent OverwriteModelError by checking if model exists first
const Comment = mongoose.models.Comment || model("Comment", commentSchema);

module.exports = Comment;
