const mongoose = require("mongoose");

const itemAdjustmentSchema = mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Item",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // Assuming you have a User model
  },
  quantityChange: Number,
  description: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ItemAdjustment = mongoose.model("ItemAdjustment", itemAdjustmentSchema);

module.exports = ItemAdjustment;
