const mongoose = require("mongoose");

<<<<<<< HEAD
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
=======
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
>>>>>>> ead07afcc6ca0fd2ccb0f57c9baa354e8079396f
  },
  quantityChange: Number,
  description: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

<<<<<<< HEAD
// Custom validation to ensure either itemId or upc is provided
itemAdjustmentSchema.pre("validate", function (next) {
  if (!this.itemId && !this.upc) {
    this.invalidate("itemId", "Either an itemId or a UPC must be provided.");
  }
  next();
});

=======
>>>>>>> ead07afcc6ca0fd2ccb0f57c9baa354e8079396f
const ItemAdjustment = mongoose.model("ItemAdjustment", itemAdjustmentSchema);

module.exports = ItemAdjustment;
