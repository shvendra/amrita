const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    changesBy: {
      type: String,
      required: true,
    },
    actionType: {
      type: String,
      required: true,
    },

    changes: {
      type: String,
      required: true,
    },
 
    changesIn: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model('History', historySchema);
module.exports = Coupon;
