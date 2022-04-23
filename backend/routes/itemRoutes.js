// Express Router

const express = require("express");
const router = express.Router();

const {
  getItems,
  postItem,
  deleteItem,
} = require("../controllers/itemController");

router.route("/").get(getItems).post(postItem).delete(deleteItem);

module.exports = router;
