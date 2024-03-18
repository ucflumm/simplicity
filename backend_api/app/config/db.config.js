// In your db.config.js or similar, regardless of its location
module.exports = {
  url: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mongodb:27017/sim_db`,
};
