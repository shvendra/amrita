const mongoose = require("mongoose");
const docSchema = new mongoose.Schema(
  {
    dname: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    semester: {
        type: String,
        required: true,
      },
      uploadedByName: {
        type: String,
        required: true,
      },
    docstatus: {
        type: String,
        required: false,
        default: "publish",
        enum: [
          "publish",
          "pending",
        ],
      },
    uploadedBy: {
      type: String,
      required: true,
      default: "Teacher",
      enum: [
        "Teacher",
        "Student",
      ],
    },
    uploadData: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model("Document", docSchema);

module.exports = Document;
