const Item = require("../models/item.model");

const trackQuantityMiddleware = async (req, res, next) => {
  console.log("Tracking item quantity change...");
  console.log("req.body", req.body);
  if (req.body.quantity && req.params.quantity === undefined) {
    // Proceed only if quantity is being updated
    const quantity = parseInt(req.body.quantity, 10);
    if (isNaN(quantity) || quantity < 0) {
      console.log("Tracking item quantity change...");
      req.body.quantity = quantity;
    }
    try {
      const currentItem = await Item.findById(req.params.id);
      if (!currentItem) {
        return res.status(404).send({ message: "Item not found." });
      }
      console.log("currentItem past await :", currentItem);
      console.log("currentItem.quantity :", currentItem.quantity);
      console.log("req.body.quantity :", req.body.quantity);
      const oldQuantity = currentItem.quantity;
      const newQuantity = req.body.quantity;
      console.log("req.params.id :", req.params.id);
      console.log(req.body.user);

      // Attach data to req for later use, avoiding another DB fetch
      req.itemQuantityChange = {
        oldQuantity,
        newQuantity,
<<<<<<< HEAD
=======
        name: currentItem.name,
>>>>>>> ed2385b51620e5297d7e89e2894a5ded1ceffb7b
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
