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
      },
      { timestamps: true }
    )
  );

  return Item;
}
