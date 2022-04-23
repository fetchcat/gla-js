// Enviroment Variables

require("dotenv").config();

// Express

const express = require("express");
const app = express();
const port = process.env.PORT || 5500;

//const cors = require("cors");

//app.use(cors());

// Mongoose Connect

let mongoose = require("mongoose");
let mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));
app.use(express.json());

// Routes

const itemsRouter = require("./routes/items");
app.use("/items", itemsRouter);

// App Listen

app.listen(port, () => {
  console.log(`GroceryApp Back End listening on port: ${port}`);
});
