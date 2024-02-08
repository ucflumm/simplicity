 module.exports = app => {
  const items = require("../controllers/item.controller.js");

  var router = require("express").Router();

  // Create a new Item
  router.post("/", items.create);

  // Retrieve all Items
  router.get("/", items.findAll);

  // Retrieve a single Item with id
  router.get("/:id", items.findOne);

  // Update a Item with id
  router.put("/:id", items.update);
  // Update a Item's quantity with id
  router.put("/:id/quantity/:quantity", items.updateQuantity);

  // Delete a Item with id
  router.delete("/:id", items.delete);

  // Deletes all items 
  router.delete("/", items.deleteAll);

  app.use('/api/items', router);
}
