module.exports = mongoose => {
  const Item = mongoose.model(
    "item",
    mongoose.Schema(
      {

        name: String,
        category: String,
        quantity: Number,
        upc: Number,
        costPrice: Number,
        salePrice: Number,
        location: String,
      },
      { timestamps: true }
    )
  );

  return Item;
}
