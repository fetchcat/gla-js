const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");

const itemRoutes = require("./routes/itemRoutes");

// --- ENV --- //

require("dotenv").config();

const port = process.env.PORT || 5000;
const server = process.env.SERVER;
const database = process.env.DB;
const env = process.env.NODE_ENV;

// --- Connect to MongoDB, then start Express --- //

const startBackend = async () => {
  try {
    await mongoose.connect(`${server}/${database}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`> Connected to database`);
    app.listen(port, () => {
      console.log(`> GLA-JS backend listening on port: ${port}`);
    });
  } catch (error) {
    console.error("> Error connecting to DB", error);
  }
};

// --- JSON Parsing --- //

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Serve frontend static files in production --- //

if (env === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/public")));

  app.get("*"),
    function (req, res) {
      res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
    };
}

// --- Routes --- //

app.use("/api/items", itemRoutes);

// --- Initialize --- //

startBackend();
