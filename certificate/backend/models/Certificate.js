const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      required: true,
    },
    recipientName: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    verificationCode: {
      type: String,
      required: true,
      unique: true,
    },
    templateUsed: {
      type: String,
      required: true,
    },
    background: {
      type: String,
      required: true,
      default: "bg1",
    },
    photo: {
      type: String,
      required: false,
    },
    appreciationText: {
      type: String,
      required: false,
      maxlength: 200,
    },
    fontStyle: {
      type: String,
      required: true,
      default: "helvetica",
      enum: ["helvetica", "times", "georgia", "calibri", "palatino"],
    },
    status: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Certificate", certificateSchema);
