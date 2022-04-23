const Item = require("../models/itemModel");

const getItems = async (req, res) => {
  try {
    const Items = await Item.find();
    res.json(Items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postItem = async (req, res) => {
  const item = new Item({
    name: req.body.body.name,
  });
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findOne({
      _id: req.body._id,
    });
    await Item.deleteOne({ _id: deletedItem._id });
    res.status(201).json(deletedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getItems,
  postItem,
  deleteItem,
};
