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
  await sharp(buffer).toFile(outputFilePath).then(
    await fs.promises.unlink(newPath)
  );
}
module.exports = { validateParams, resizeFile };
// Path: backend_api/app/controllers/item.controller.js
