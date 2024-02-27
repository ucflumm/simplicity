const validateParams = require("../utils/item.utils");
const db = require("../models");
const Item = db.items;
const path = require("path");
const fs = require("fs");
const defaultPrice = 0;

exports.create = (req, res) => {
  // Your existing validations
  const validations = {
    upc: req.body.upc,
    quantity: req.body.quantity,
    costPrice: req.body.costPrice,
    salePrice: req.body.salePrice,
    location: req.body.location,
    category: req.body.category,
  };

  // Check if name is empty
  if (!req.body.name) {
    res.status(400).send({ message: "Name cannot be empty!" });
    return;
  }
  console.log("passed req name");

  // Validate other parameters
  for (let [key, value] of Object.entries(validations)) {
    const validationMessage = validateParams(key, value);
    if (validationMessage) {
      res.status(400).send(validationMessage);
      return;
    }
  }

  // Generate a random UPC if not provided
  if (!req.body.upc) {
    req.body.upc = Math.floor(Math.random() * 1000000000);
  }

  console.log("passed validation");
  // Check for existing UPC
  Item.findOne({ upc: req.body.upc })
    .then((data) => {
      if (data) {
        res.status(400).send({ message: "UPC already exists!" });
        return;
      }
      console.log("passed upc check");

      // Create a new item
      const item = new Item({
        name: req.body.name,
        category: req.body.category || "Misc",
        quantity: req.body.quantity || 0,
        upc: req.body.upc,
        costPrice: req.body.costPrice || 0,
        salePrice: req.body.salePrice || defaultPrice, // Ensure defaultPrice is defined
        location: req.body.location || "Unknown",
        // imagePath will be added after saving the item
      });

      console.log("passed item creation");

      item
        .save()
        .then((item) => {
          if (req.file) {
            console.log("uploading file", req.file);
            // Process the uploaded file
            const tempPath = req.file.path;
            const newFilename = item._id + path.extname(req.file.originalname);
            const newPath = path.join("uploads/", newFilename);
            console.log("oldPath: ", tempPath);
            console.log("newPath: ", newPath);

            fs.rename(tempPath, newPath, (err) => {
              if (err) {
                console.error("File rename error: ", err);
                res.status(500).send({
                  message: "Error occurred while processing the image.",
                });
                return;
              }
              // Optionally, update item with new image path
              // This step requires additional logic to update the item in the database
            });
            console.log("passed file rename");
          }
          res.send(item);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "An error occurred while creating the item.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while creating the item.",
      });
    });
};
