const db = require("../models");
const Item = db.items;
const defaultPrice = 0;

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({ message: "Name cannot be empty!" });
    return;
  }
  const item = new Item({
    name: req.body.name,
    category: req.body.category ? req.body.category : "Misc", 
    quantity: req.body.quantity ? req.body.quantity : 0,
    upc: req.body.upc ? req.body.upc : 0,
    costPrice: req.body.costPrice ? req.body.costPrice : 0,
    salePrice: req.body.salePrice ? req.body.salePrice : defaultPrice
  });
  item
    .save(item)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "An error occurred while creating the item." });
    });
}

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
}

exports.findOne = (req, res) => {
  const id = req.params.id;
  Item.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Item not found with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving item with id " + id });
    });
}

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update cannot be empty!" });
  }
  const id = req.params.id;
  Item.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot update item with id ${id}. Item not found!` });
      } else res.send({ message: "Item updated successfully." });
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating item with id " + id });
    });
}

// this is technically a double up of update
exports.updateQuantity = (req, res) => {
  const id = req.params.id;
  const quantity = req.params.quantity;
  Item.findByIdAndUpdate(id, { quantity: quantity }, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot update item with id ${id}. Item not found!` });
      } else res.send({ message: "Item updated successfully." });
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating item with id " + id });
    });
}

exports.delete = (req, res) => {
  const id = req.params.id;
  Item.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot delete item with id ${id}. Item not found!` });
      } else res.send({ message: "Item deleted successfully." });
    }
    )
    .catch(err => {
      res.status(500).send({ message: "Could not delete item with id " + id });
    });
}

exports.deleteAll = (req, res) => {
  Item.deleteMany({})
    .then(data => {
      res.send({ message: `${data.deletedCount} items were deleted successfully.` });
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "An error occurred while deleting items." });
    });
}

exports.findAllZeroQuantity = (req, res) => {
  Item.find({ quantity: 0 })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "An error occurred while retrieving items." });
    });
}