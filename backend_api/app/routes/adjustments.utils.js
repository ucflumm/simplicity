// Utils/adjustment.util.js
const ItemAdjustment = require("../models/itemAdjustment.model");

const recordAdjustment = async ({
  itemId,
  upc,
  user,
  quantityChange,
  description,
}) => {
  const adjustment = new ItemAdjustment({
    itemId,
    upc,
    user,
    quantityChange,
    description,
  });

  await adjustment.save();
};
