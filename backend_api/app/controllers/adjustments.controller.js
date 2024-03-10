const ItemAdjustment = require("../models/itemAdjustment.model");

exports.getAllAdjustments = async (req, res) => {
  try {
    const adjustments = await ItemAdjustment.find();
    res.send(adjustments);
  } catch (error) {
    console.error("Error fetching adjustments:", error);
    res.status(500).send({ message: "Error fetching adjustments." });
  }
};

exports.getAdjustmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const adjustment = await ItemAdjustment.findById(id)
      .populate("itemId", "name") // Assuming 'itemId' is the reference in ItemAdjustment schema
      .exec();

    if (!adjustment) {
      return res.status(404).send({ message: "Adjustment not found." });
    }

    // Send the adjustment along with the item name
    // Note: adjustment.itemId.name will contain the item name due to .populate()
    res.send({
      ...adjustment.toJSON(),
      itemName: adjustment.itemId.name, // Add the item name explicitly
    });
  } catch (error) {
    console.error("Error fetching adjustment:", error);
    res.status(500).send({ message: "Error fetching adjustment details." });
  }
};

exports.getAllAdjustmentsByItemId = async (req, res) => {
  const { id } = req.params;
  console.log("Querying adjustments for item Id:", id);
  try {
    const adjustments = await ItemAdjustment.find({ itemId: id }).sort({
      timestamp: -1,
    });
    if (!adjustments.length) {
      return res
        .status(404)
        .send({ message: "No adjustments found for the item." });
    }
    res.send(
      adjustments.map((adjustment) => ({
        ...adjustment.toJSON(),
        itemName: adjustment.id.name, // Add the item name explicitly
        itemUPC: adjustment.id.upc, // Add the item UPC explicitly
      }))
    );
  } catch (error) {
    console.error("Error fetching adjustments:", error);
    res.status(500).send({ message: "Error fetching adjustments." });
  }
};
