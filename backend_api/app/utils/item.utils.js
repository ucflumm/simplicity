const sharp = require("sharp");
const fs = require("fs");

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
}

const processFile = async (req, res, next) => {
  if (req.file) {
    const id = req.params.id || req.body._id; // Adapt based on your ID source
    const tempPath = req.file.path;
    const newFilename = id + path.extname(req.file.originalname);
    const newPath = path.join("uploads/", newFilename);

    try {
      await fs.promises.rename(tempPath, newPath);
      await resizeFile(newPath);
      req.body.imagePath = newPath; // Add the image path to the request body for further processing
    } catch (err) {
      return res.status(500).send({ message: "Error processing file." });
    }
  }
  next();
};

module.exports = { validateParams, resizeFile, processFile };
