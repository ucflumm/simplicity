 module.exports = app => {
  const item = require("../controllers/item.controller.js");

  var router = require("express").Router();

  // Create a new Item
  router.post("/", item.create);

  // Retrieve all Items
  router.get("/", item.findAll);

  // Retrieve a single Item with id
  router.get("/:id", item.findOne);

  // Retrieve a single Item with param and value
  router.get("/:param/:value", item.findbyParams);

  // Update a Item with id
  router.put("/:id", item.update);
  // Update a Item's quantity with id
  router.put("/:id/quantity/:quantity", item.updateQuantity);

  //update quantity via upc
  router.put("/upc/:upc/quantity/:quantity", item.updateQuantityByUPC);

  // Delete a Item with id
  router.delete("/:id", item.delete);

  // Deletes all items 
  router.delete("/", item.deleteAll);

  app.use('/api/item', router);
}
