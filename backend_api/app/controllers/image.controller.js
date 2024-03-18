const db = require("../models");
const Item = db.items;
const { recordAdjustment } = require("../utils/adjustments.utils");
const path = require("path");
const fs = require("fs");
const defaultPrice = 0;
const {
  validateParams,
  resizeFile,
  processFile,
  validateRequestBody,
} = require("../utils/item.utils");

exports.create = async (req, res) => {
  try {
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

    if (req.body.upc) {
      const upcCheck = await Item.findOne({ upc: req.body.upc });
      if (upcCheck) {
        res.status(400).send({ message: "UPC already exists!" });
        return;
      }
    }
    // Generate a random UPC if not provided made sure its 13 digits
    // Also make sure the UPC is unique and it will rerandom if it is not unique but it stops at 3 times.
    if (!req.body.upc) {
      let randomAttempts = 0;
      let randomUpc = Math.floor(Math.random() * 10000000000000);
      while (randomAttempts < 3) {
        const data = await Item.findOne({ upc: randomUpc });
        if (!data) {
          req.body.upc = randomUpc;
          console.log("passed UPC random validation");
          break;
        }
        randomUpc = Math.floor(Math.random() * 10000000000000);
        randomAttempts++;
      }
      if (randomAttempts === 3) {
        res.status(400).send({ message: "Failed to generate a unique UPC!" });
        return;
      }
      console.log("passed upc check");
    }

    // Create a new item
    const item = new Item({
      name: req.body.name,
      category: req.body.category || "Misc",
      quantity: req.body.quantity || 0,
      upc: req.body.upc,
      costPrice: req.body.costPrice || 0,
      salePrice: req.body.salePrice || defaultPrice,
      location: req.body.location || "Unknown",
    });

    console.log("passed item creation");

    await item.save();

    if (req.file) {
      console.log("uploading file", req.file);
      // Process the uploaded file
      const tempPath = req.file.path;
      const newFilename = item._id + path.extname(req.file.originalname);
      const newPath = path.join("uploads/", newFilename);
      console.log("oldPath: ", tempPath);
      console.log("newPath: ", newPath);

      await fs.promises.rename(tempPath, newPath);

      console.log("passed file rename");

      try {
        await resizeFile(newPath);
      } catch (err) {
        console.log("Error resizing file: ", err);
        res.status(500).send({ message: "Error resizing file!" });
      }
    }
    // if there is no file, send the item
    res.send(item);
  } catch (err) {
    res.status(500).send({
      message: err.message || "An error occurred while creating the item.",
    });
  }
};

exports.findImgById = async (req, res) => {
  const id = req.params.id;
  if (!id || id === "") {
    return res.status(400).send({ message: "ID cannot be empty!" });
  }

  // Check if ID is a valid MongoDB ObjectId
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).send({ message: "Invalid ID format!" });
  }

  try {
    const item = await Item.findOne({ _id: id });
    if (!item) {
      return res.status(404).send({ message: "Not found Item with id " + id });
    }

    const imagePath = path.join("uploads", `${id}.jpg`);
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.log("Image not found!", imagePath);
        const defaultImagePath = path.resolve(
          "public",
          "images",
          "default.jpg"
        );
        return res.sendFile(defaultImagePath);
      } else {
        console.log("Image found!");
        return res.sendFile(path.resolve(imagePath));
      }
    });
  } catch (error) {
    console.error("Error retrieving Item with id=" + id, error);
    return res
      .status(500)
      .send({ message: "Error retrieving Item with id=" + id });
  }
};

exports.update = [
  validateRequestBody,
  processFile,
  async (req, res) => {
    const { id } = req.params;
    try {
      // Fetch current item state before update
      const currentItem = await Item.findById(id);
      if (!currentItem) {
        return res.status(404).send({
          message: `Cannot update item with id ${id}. Item not found!`,
        });
      }
      console.log("old item: ", currentItem);
      console.log("old item quantity: ", currentItem.quantity);
      console.log("new item: ", req.body);
      console.log("new item quantity: ", req.body.quantity);
      const oldQuantity = currentItem.quantity;
      const newQuantity = Number(req.body.quantity);
      if (oldQuantity === newQuantity) {
        console.log("Quantity did not change. No update necessary.");
        return res.status(400).send({
          message: "Quantity did not change. No update necessary.",
        });
      }
      const itemName = currentItem.name;

      // Update the item with the new data
      const updatedItem = await Item.findByIdAndUpdate(id, req.body, {
        new: true,
        useFindAndModify: false,
      });

      // If there's a change in quantity, use recordAdjustment to record it
      if (newQuantity !== undefined && oldQuantity !== newQuantity) {
        const user = req.body.user || "Default User"; // Default to "defaultUser" if no user is specified
        await recordAdjustment({
          itemId: updatedItem._id,
          user: user,
          upc: updatedItem.upc,
          name: updatedItem.name,
          quantityChange: newQuantity - oldQuantity,
          description: `Quantity changed from ${oldQuantity} to ${newQuantity} for item ${itemName} by ${user}`,
        });
      }

      res.send(updatedItem);
    } catch (err) {
      console.error("Update error:", err);
      res
        .status(500)
        .send({ message: "An error occurred while updating the item." });
    }
  },
];
