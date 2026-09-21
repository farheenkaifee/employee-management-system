const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    documentType: {
      type: String,
      enum: [
        "Aadhar Card",
        "PAN Card",
        "Resume",
        "Education Certificate",
        "Experience Certificate",
        "Joining Letter",
        "Other",
      ],
      required: true,
    },

    documentName: {
      type: String,
      required: true,
      trim: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },

    remarks: {
      type: String,
      trim: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document", documentSchema);