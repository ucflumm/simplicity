//itenAdjustment.model.js
const mongoose = require("mongoose");

const itemAdjustmentSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  },
  upc: {
    type: String,
  },
  user: {
    type: String,
  },
  name: {
    type: String,
  },
  quantityChange: Number,
  description: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Custom validation to ensure either itemId or upc is provided
itemAdjustmentSchema.pre("validate", function (next) {
  if (!this.itemId && !this.upc) {
    this.invalidate("itemId", "Either an itemId or a UPC must be provided.");
  }
  next();
});

const ItemAdjustment = mongoose.model("ItemAdjustment", itemAdjustmentSchema);

module.exports = ItemAdjustment;
