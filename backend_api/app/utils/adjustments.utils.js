// Utils/adjustment.util.js
const ItemAdjustment = require("../models/itemAdjustment.model");

const recordAdjustment = async ({
  itemId,
  upc,
  user,
  name,
  quantityChange,
  description,
}) => {
  const adjustment = new ItemAdjustment({
    itemId,
    upc,
    user,
    name,
    quantityChange,
    description,
  });

  await adjustment.save();
};

module.exports = { recordAdjustment, ItemAdjustment };
