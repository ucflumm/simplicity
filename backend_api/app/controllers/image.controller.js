const db = require("../models");
const Item = db.items;
const path = require("path");
const fs = require("fs");
const defaultPrice = 0;
const { validateParams, resizeFile } = require("../utils/item.utils");

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

    // Generate a random UPC if not provided
    if (!req.body.upc) {
      req.body.upc = Math.floor(Math.random() * 1000000000);
    }

    console.log("passed validation");

    // Check for existing UPC
    const data = await Item.findOne({ upc: req.body.upc });
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

exports.update = async (req, res) => {
  try {
    if (!req.body && !req.file) {
      return res
        .status(400)
        .send({ message: "Data to update cannot be empty!" });
    }

    const id = req.params.id;
    let updateData = req.body;

    // If a file is uploaded, add its path to the update data
    if (req.file) {
      console.log("uploading file", req.file);
      // Process the uploaded file
      const tempPath = req.file.path;
      const newFilename = id + path.extname(req.file.originalname);
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

    const data = await Item.findByIdAndUpdate(id, updateData, {
      new: true,
      useFindAndModify: false,
    });
    if (!data) {
      res.status(404).send({
        message: `Cannot update item with id ${id}. Item not found!`,
      });
    } else {
      res.send(data);
    }
  } catch (err) {
    res
      .status(500)
      .send({ message: "An error occurred while updating the item." });
  }
};
