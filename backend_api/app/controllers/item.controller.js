const db = require("../models");
const Item = db.items;
const defaultPrice = 0;
const path = require('path');
const fs = require('fs');

/*
* Crud operations for items, including create, retrieve, update, and delete.
* We also have one huge function findByParams
*/
exports.createWithImage = (req, res) => {
  // Your existing validations
  const validations = {
      upc: req.body.upc,
      quantity: req.body.quantity,
      costPrice: req.body.costPrice,
      salePrice: req.body.salePrice,
      location: req.body.location,
      category: req.body.category
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
      .then(data => {
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
              location: req.body.location || "Unknown"
              // imagePath will be added after saving the item
          });
          console.log("passed item creation");

          item.save()
              .then(item => {
                  if (req.file) {
                    console.log("uploading file", req.file);
                      // Process the uploaded file
                      const tempPath = req.file.path;
                      const newFilename = item._id + path.extname(req.file.originalname);
                      const newPath = path.join('uploads/', newFilename);
                      console.log("newPath: ", newPath);

                      fs.rename(tempPath, newPath, err => {
                          if (err) {
                              console.error("File rename error: ", err);
                              res.status(500).send({ message: "Error occurred while processing the image." });
                              return;
                          }
                          // Optionally, update item with new image path
                          // This step requires additional logic to update the item in the database
                      });
                      console.log("passed file rename");

                  }
                  res.send(item);
              })
              .catch(err => {
                  res.status(500).send({ message: err.message || "An error occurred while creating the item." });
              });
      })
      .catch(err => {
          res.status(500).send({ message: err.message || "An error occurred while creating the item." });
      });
};

exports.create = (req, res) => {
  const validations = {
    upc: req.body.upc,
    quantity: req.body.quantity,
    costPrice: req.body.costPrice,
    salePrice: req.body.salePrice,
    location: req.body.location,
    category: req.body.category
  };

  // Check if name is empty
  if (!req.body.name) {
    res.status(400).send({ message: "Name cannot be empty!" });
    return;
  }

  // Validate other parameters
  for (let [key, value] of Object.entries(validations)) {
    const validationMessage = validateParams(key, value);
    if (validationMessage) {
      res.status(400).send(validationMessage);
      return;
    }
  }
  const createNewItem = () => {
    const item = new Item({
      name: req.body.name,
      category: req.body.category || "Misc",
      quantity: req.body.quantity || 0,
      upc: req.body.upc || 0,
      costPrice: req.body.costPrice || 0,
      salePrice: req.body.salePrice || defaultPrice, // Make sure defaultPrice is defined
      location: req.body.location || "Unknown"
    });

    item.save()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({ message: err.message || "An error occurred while creating the item." });
      });
  };

  if (!req.body.upc) { 
    req.body.upc = Math.floor(Math.random() * 1000000000);
  }

  Item.findOne({ upc: req.body.upc })
    .then(data => {
      if (data) {
        res.status(400).send({ message: "UPC already exists!" });
      } else {
        createNewItem();
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "An error occurred while creating the item." });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
  Item.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "An error occurred while retrieving items." });
    });
};

exports.findbyParams = (req, res) => {
  const param = req.params.param;
  const value = req.params.value;
  const query = {};
  query[param] = value;

  Item.find(query)
    .then(data => {
      if (!data || data.length === 0) {
        res.status(404).send({ message: `Cannot find items with ${param} ${value}.` });
      } else {
      res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "An error occurred while retrieving items." });
    });
}

// Updates item by body of request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update cannot be empty!" });
  }
  const id = req.params.id;
  Item.findByIdAndUpdate(id, req.body, { new: true, useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot update item with id ${id}. Item not found!` });
      } else res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating item with id " + id });
    });
}

// this is technically a double up of update
exports.updateQuantity = (req, res) => {
  const id = req.params.id;
  const quantity = req.params.quantity;
  Item.findByIdAndUpdate(id, { quantity: quantity }, { new: true, useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot update item with id ${id}. Item not found!` });
      } else { 
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating item with id " + id });
    });
}

exports.delete = (req, res) => {
  const id = req.params.id;
  Item.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot delete item with id ${id}. Item not found!` });
      } else res.send({ message: "Item deleted successfully." });
    }
    )
    .catch(err => {
      res.status(500).send({ message: err || "Could not delete item with id " + id });
    });
}

// This needs some testing when there are no items and items are added all have positive quantities
exports.findAllZeroQuantity = (req, res) => {
  Item.find({ quantity: 0 })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "An error occurred while retrieving items." });
    });
}

exports.updateQuantityByUPC = (req, res) => {
  const upc = req.params.upc;
  const quantity = req.params.quantity;

  if (isNaN(quantity) || quantity < 0) {
    res.status(400).send({ message: "Quantity must be equal or greater than zero!" });
    return;
  }

  Item.findOneAndUpdate({ upc: upc }, { quantity: quantity }, { new: true, useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot update item with upc ${upc}. Item not found!` });
      } else { 
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating item with upc " + upc });
    });
}

exports.updateParamById = (req, res) => {
  const id = req.params.id;
  const param = req.params.param;
  const value = req.params.value;
  const query = {};
  query[param] = value;

  const validationError = validateParams(param, value);
  if (validationError) {
    res.status(400).send(validationError);
    return;
  }

  Item.findByIdAndUpdate({ _id: id }, query, { new: true, useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot update item with id ${id}. Item not found!` });
      } else { 
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating item with id " + id });
    });
}

exports.findOneById = (req, res) => {
  const id = req.params.id;
  Item.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot find item with id ${id}.` });
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving item with id " + id });
    });
}

// Todo update specific error
exports.findOneByUPC = (req, res) => {
  const upc = req.params.upc;
  Item.findOne({ upc: upc })
    .then(data => {
      if (!data || upc === NaN || upc < 0) {
        res.status(404).send({ message: `Cannot find item with upc ${upc}.` });
      }
      else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "An error occurred while retrieving items." });
    });
}

function validateParams(param, value) {
  if (value === undefined || value === null) {
    return  null;
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

exports.findByNameContains = (req, res) => {
  const name = req.params.search;
  const regex = new RegExp(name, "i");
  // remove these console logs
  console.log(regex);
  const query = { name: { $regex: regex } };
  console.log(query);

  Item.find(query)
    .then(data => {
      if (!data || data.length === 0) {
        res.status(404).send({ message: `Cannot find items with name containing ${name}.` });
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "An error occurred while retrieving items." });
    });
}