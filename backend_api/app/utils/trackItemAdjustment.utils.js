// utils/trackItemAdjustment.js
const ItemAdjustment = require("../models/itemAdjustment.model");
const Item = require("../models/item.model");

const trackQuantityMiddleware = async (req, res, next) => {
  console.log("Tracking item quantity change...");
  if (req.body.quantity !== undefined) {
    // Proceed only if quantity is being updated
    console.log("Tracking item quantity change...");
    try {
      const currentItem = await Item.findById(req.params.id);
      if (!currentItem) {
        return res.status(404).send({ message: "Item not found." });
      }

      const oldQuantity = currentItem.quantity;
      const newQuantity = req.body.quantity;

      // Attach data to req for later use, avoiding another DB fetch
      req.itemQuantityChange = {
        oldQuantity,
        newQuantity,
        itemId: req.params.id,
        user: req.body.user, // Assuming this is how you identify the user
      };
    } catch (error) {
      console.error("Error preparing item quantity change tracking:", error);
      return res
        .status(500)
        .send({ message: "Error preparing item quantity change tracking." });
    }
  }
  next(); // Proceed to the actual request handler
};

module.exports = trackQuantityMiddleware;
