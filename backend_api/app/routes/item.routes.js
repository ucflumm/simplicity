 module.exports = app => {
  const item = require("../controllers/item.controller.js");

  var router = require("express").Router();

  // Create a new Item
  router.post("/", item.create);
  // Retrieve all Items
  router.get("/", item.findAll);
  // Retrieve a single Item with id
  router.get("/:id", item.findOneById);
  // Retrieve a single Item with param and value
  router.get("/param/:param/value/:value", item.findbyParams);
  //Find all zero quantity items
  router.get("/zero", item.findAllZeroQuantity);
  // Update a Item with id by using the body of the request.
  router.put("/:id", item.update);
  // Update a Item's quantity with id
  router.put("/:id/quantity/:quantity", item.updateQuantity);
  // Update a Param via id
  router.put("/:id/param/:param/value/:value", item.updateParamById);
  //update quantity via upc
  router.put("/upc/:upc/quantity/:quantity", item.updateQuantityByUPC);


  // Delete a Item with id
  router.delete("/:id", item.delete);

  app.use('/api/item', router);
}
