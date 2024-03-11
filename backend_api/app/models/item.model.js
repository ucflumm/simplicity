const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    quantity: Number,
    upc: Number,
    costPrice: Number,
    salePrice: Number,
    location: String,
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
