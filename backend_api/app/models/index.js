// models/index.js
const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {
  mongoose: mongoose,
  url: dbConfig.url,
  items: require("./item.model.js"), // Adjusted to require directly
  itemAdjustments: require("./itemAdjustment.model.js"),
};

module.exports = db;
