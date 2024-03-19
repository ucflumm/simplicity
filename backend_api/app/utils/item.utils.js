const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

function validateParams(param, value) {
  if (value === undefined || value === null) {
    return null;
  }
  if (param === "quantity") {
    if (isNaN(value) || value < 0) {
      return { message: "Quantity must be equal or greater than zero!" };
    }
  }

  if (param === "salePrice" || param === "costPrice") {
    if (isNaN(value) || value < 0) {
      return { message: "Price must be equal or greater than zero!" };
    }
  }

  if (param === "upc") {
    if (isNaN(value) || value < 0) {
      return { message: "UPC must be a positive number!" };
    }
  }

  if (param === "name" || param === "category" || param === "location") {
    if (value === "") {
      return { message: "Name, category, and location cannot be empty!" };
    }
  }
  return null;
}

async function resizeFile(newPath) {
  const outputFilePath = newPath.replace(/\.[^/.]+$/, "") + ".jpg";
  let buffer = await sharp(newPath)
    .resize({
      width: 300,
      height: 300,
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy,
    })
    .toFormat("jpg", { quality: 90 })
    .toBuffer();
  await sharp(buffer)
    .toFile(outputFilePath)
    .then(await fs.promises.unlink(newPath));
  console.log("After resize, File resized and saved to:", outputFilePath);
}

const processFile = async (req, res, next) => {
  if (req.file) {
    const id = req.params.id || req.body._id; // Adapt based on your ID source
    const tempPath = req.file.path;
    const newFilename = id + path.extname(req.file.originalname);
    const newPath = path.join("uploads/", newFilename);
    console.log(
      "Process File: ",
      tempPath,
      newPath,
      id,
      req.body._id,
      req.params.id
    );

    try {
      await fs.promises.rename(tempPath, newPath);
      console.log("File successfully moved to: ", newPath);
      await resizeFile(newPath);
      req.body.imagePath = newPath; // Add the image path to the request body for further processing
    } catch (err) {
      console.error("Error processing file: ", err);
      return res.status(500).send({ message: "Error processing file." });
    }
  }
  next();
};

const validateRequestBody = (req, res, next) => {
  const validations = {
    upc: req.body.upc,
    quantity: req.body.quantity,
    costPrice: req.body.costPrice,
    salePrice: req.body.salePrice,
    location: req.body.location,
    category: req.body.category,
  };

  if (!req.body.name) {
    return res.status(400).send({ message: "Name cannot be empty!" });
  }

  for (let [key, value] of Object.entries(validations)) {
    const validationMessage = validateParams(key, value);
    if (validationMessage) {
      return res.status(400).send(validationMessage);
    }
  }

  if (!req.body.upc) {
    req.body.upc = Math.floor(Math.random() * 1000000000);
  }

  next();
};

module.exports = {
  validateParams,
  resizeFile,
  processFile,
  validateRequestBody,
};
