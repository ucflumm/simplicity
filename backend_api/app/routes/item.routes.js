module.exports = (app) => {
  const item = require("../controllers/item.controller.js");
  const trackQuantityMiddleware = require("../utils/trackItemAdjustment.utils.js");
  const adjustments = require("../controllers/adjustments.controller.js");

  var router = require("express").Router();

  // Create a new Item
  router.post("/", item.create);
  // router.post("/create-with-image", upload.single('file'), item.createWithImage);
  // Retrieve all Items
  router.get("/", item.findAll);
  // Retrieve tracking details
  router.get("/query", adjustments.getAllAdjustments);
<<<<<<< HEAD
  // Retrieve adjustments by id
  router.get("/query/id/:id", adjustments.getAllAdjustmentsByItemId);
=======
>>>>>>> 6fac0c6249591508601b8f79f30c62099cf1d4b7
  // Retrieve a single Item with id
  router.get("/id/:id", item.findOneById);
  // Retrieve a single Item with upc
  router.get("/upc/:upc", item.findOneByUPC);
  // Search for regex match partial name or upc
  router.get("/search/:search", item.findByNameContains);
  // Retrieve a single Item with param and value
  router.get("/param/:param/value/:value", item.findbyParams);
  //Find all zero quantity items
  router.get("/zero", item.findAllZeroQuantity);
  // Update a Item with id by using the body of the request.
  router.put("/id/:id", trackQuantityMiddleware, item.update);
  // Update a Item's quantity with id
  router.put("/id/:id/quantity/:quantity", item.updateQuantity);
  // Update a Param via id
  router.put("/id/:id/param/:param/value/:value", item.updateParamById);
  //update quantity via upc
  router.put(
    "/upc/:upc/quantity/:quantity",
    trackQuantityMiddleware,
    item.updateQuantityByUPC
  );

  // Delete a Item with id
  router.delete("/id/:id", item.delete);

  app.use("/api/item", router);
};
