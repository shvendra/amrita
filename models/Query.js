const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: false,
      default: "Pending",
      enum: ["Resolved", "Pending"],
    },
    email: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Query = mongoose.model('Query', querySchema);
module.exports = Query;
