const mongoose = require("mongoose");
const express = require("express");
const app = express();

const itemRoutes = require("./routes/itemRoutes");

// --- ENV --- //

require("dotenv").config();

const port = process.env.PORT || 8080;
const server = process.env.SERVER;
const database = process.env.DB;

// --- JSON Parsing --- //

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes --- //

app.use("/api", itemRoutes);

const startBackend = async () => {
  try {
    await mongoose.connect(`${server}/${database}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`> Connected to database`);
    app.listen(port, () => {
      console.log(`> GLA-JS listening on port: ${port}`);
    });
  } catch (error) {
    console.error("> Error connecting to DB", error);
  }
};

startBackend();

app.get("/", (req, res) => {
  res.status(200).send("GLA App Backend").end();
});

module.exports = app;
