const db = require("../models");
const Item = db.items;
const defaultPrice = 0;
const { validateParams } = require("../utils/item.utils");
const { trackQuantityChange } = require("../utils/trackItemAdjustment.utils");
const { ItemAdjustment } = require("../utils/adjustments.utils");
const { recordAdjustment } = require("../utils/adjustments.utils");
/*
 * Crud operations for items, including create, retrieve, update, and delete.
 * We also have one huge function findByParams
 */

exports.create = (req, res) => {
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
      location: req.body.location || "Unknown",
    });

    item
      .save()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "An error occurred while creating the item.",
        });
      });
  };

  if (!req.body.upc) {
    req.body.upc = Math.floor(Math.random() * 1000000000);
  }

  // double check this
  Item.findOne({ upc: req.body.upc })
    .then((data) => {
      if (data) {
        res.status(400).send({ message: "UPC already exists!" });
      } else {
        createNewItem();
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while creating the item.",
      });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};
  Item.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving items.",
      });
    });
};

exports.findbyParams = (req, res) => {
  const param = req.params.param;
  const value = req.params.value;
  const query = {};
  query[param] = value;

  Item.find(query)
    .then((data) => {
      if (!data || data.length === 0) {
        res
          .status(404)
          .send({ message: `Cannot find items with ${param} ${value}.` });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving items.",
      });
    });
};

// Updates item by body of request
exports.update = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Fetch the current item state
    const currentItem = await Item.findById(id);
    if (!currentItem) {
      return res.status(404).send({ message: `Item with id ${id} not found.` });
    }

    // Apply the update to the item
    const updatedItem = await Item.findByIdAndUpdate(id, updateData, {
      new: true,
      useFindAndModify: false,
    });

    // Assuming quantity is what we're interested in tracking
    if (
      "quantity" in updateData &&
      currentItem.quantity !== updatedItem.quantity
    ) {
      // Calculate the change in quantity
      const quantityChange = updatedItem.quantity - currentItem.quantity;

      // Record the adjustment
      console.log("User ID:", req.body.userId);
      await recordAdjustment({
        itemId: updatedItem._id,
        user: req.body.userId || "defaultUser", // Default user if not provided
        quantityChange,
        description: `Quantity changed from ${currentItem.quantity} to ${updatedItem.quantity} for item "${currentItem.name}" by user ${req.body.user}`,
      });
    }

    res.send(updatedItem);
  } catch (error) {
    res.status(500).send({ message: "Error updating item: " + error.message });
  }
};

// this is technically a double up of update
exports.updateQuantity = (req, res) => {
  const id = req.params.id;
  const quantity = req.params.quantity;
  Item.findByIdAndUpdate(
    id,
    { quantity: quantity },
    { new: true, useFindAndModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update item with id ${id}. Item not found!`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error updating item with id " + id });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Item.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete item with id ${id}. Item not found!`,
        });
      } else {
        res.send({ message: "Item deleted successfully." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: err || "Could not delete item with id " + id });
    });
};

// This needs some testing when there are no items and items are added all have positive quantities
exports.findAllZeroQuantity = (req, res) => {
  Item.find({ quantity: 0 })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving items.",
      });
    });
};

exports.updateQuantityByUPC = async (req, res) => {
  const { upc } = req.params;
  const newQuantity = parseInt(req.params.quantity, 10);
  let { user } = req.body; // Attempt to get user from the request body

  // Default the user to "mobile" if not provided
  user = user || "mobile";

  if (isNaN(newQuantity) || newQuantity < 0) {
    return res
      .status(400)
      .send({ message: "Quantity must be equal or greater than zero!" });
  }

  try {
    // Fetch the current item by UPC to compare quantities
    const currentItem = await Item.findOne({ upc: upc });
    if (!currentItem) {
      return res
        .status(404)
        .send({ message: "Item not found with UPC " + upc });
    }

    const oldQuantity = currentItem.quantity;
    const itemName = currentItem.name;
    // Update the item's quantity
    currentItem.quantity = newQuantity;
    await currentItem.save();

    // Record the quantity change, if any
    if (oldQuantity !== newQuantity) {
      await recordAdjustment({
        itemId: currentItem._id, // Now you have the item ID for tracking
        upc,
        user,
        quantityChange: newQuantity - oldQuantity,
        description: `Quantity updated from ${oldQuantity} to ${newQuantity} for "${itemName}" (UPC: ${upc}) by ${user}`,
      });
    }

    res.send({ message: `Quantity for UPC ${upc} updated successfully.` });
  } catch (error) {
    console.error("Error updating item quantity:", error);
    res
      .status(500)
      .send({ message: "Error updating item quantity: " + error.message });
  }
};

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

  Item.findByIdAndUpdate({ _id: id }, query, {
    new: true,
    useFindAndModify: false,
  })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update item with id ${id}. Item not found!`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error updating item with id " + id });
    });
};

exports.findOneById = (req, res) => {
  const id = req.params.id;
  Item.findById(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: `Cannot find item with id ${id}.` });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving item with id " + id });
    });
};

// Todo update specific error
exports.findOneByUPC = (req, res) => {
  const upc = req.params.upc;
  Item.findOne({ upc: upc })
    .then((data) => {
      if (!data || upc === NaN || upc < 0) {
        res.status(404).send({ message: `Cannot find item with upc ${upc}.` });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving items.",
      });
    });
};

exports.findByNameContains = (req, res) => {
  const name = req.params.search;
  const regex = new RegExp(name, "i");
  // remove these console logs
  console.log(regex);
  const query = { name: { $regex: regex } };
  console.log(query);

  Item.find(query)
    .then((data) => {
      if (!data || data.length === 0) {
        res
          .status(404)
          .send({ message: `Cannot find items with name containing ${name}.` });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving items.",
      });
    });
};
