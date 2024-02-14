const db = require("../models");
const Item = db.items;
const defaultPrice = 0;

/*
* Crud operations for items, including create, retrieve, update, and delete.
* We also have one huge function findByParams
*/

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
    salePrice: req.body.salePrice ? req.body.salePrice : defaultPrice,
    location: req.body.location ? req.body.location : "Unknown"
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

// exports.findOne = (req, res) => {
//   const id = req.params.id;
//   Item.findById(id)
//     .then(data => {
//       if (!data)
//         res.status(404).send({ message: "Item not found with id " + id });
//       else res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({ message: "Error retrieving item with id " + id });
//     });
// }

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

exports.deleteAll = (req, res) => {
  Item.deleteMany({})
    .then(data => {
      res.send({ message: `${data.deletedCount} items were deleted successfully.` });
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "An error occurred while deleting items." });
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
