module.exports = (app) => {
  const upload = require("../controllers/upload.controller.js");
  const image = require("../controllers/image.controller.js");

  var router = require("express").Router();

  // Create a new Image
  router.post("/", upload.single("file"), image.create);
  // Retrieve all Images
  //router.get("/", image.findAll);
  // Retrieve a single Image with id
  router.get("/id/:id", image.findImgById);
  // Retrieve a single Image with param and value
  //router.get("/param/:param/value/:value", image.findbyParams);
  // Update a Image with id by using the body of the request.
  //router.put("/id/:id", image.update);
  // Delete a Image with id
  //router.delete("/id/:id", image.delete);

  app.use("/api/image", router);
};
