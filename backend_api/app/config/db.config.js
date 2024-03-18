// In your db.config.js or similar, regardless of its location
module.exports = {
  url: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@mongodb:27017/${process.env.DB_NAME}?authSource=admin`,
};
