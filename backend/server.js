const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");

const itemRoutes = require("./routes/itemRoutes");

// --- ENV --- //

require("dotenv").config();

const port = process.env.PORT || 8080;
const server = process.env.SERVER;
const database = process.env.DB;

// --- Connect to MongoDB, then start Express --- //

app.use(
  cors({
    origin: "https://frontend-dot-test-gla.uw.r.appspot.com",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

// --- JSON Parsing --- //

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes --- //

app.use("/api", itemRoutes);

// --- Serve frontend static files in production --- //

// if (env === "production") {
//   app.use(express.static(path.resolve(__dirname, "build")));

//   app.get("*"),
//     function (req, res) {
//       res.sendFile(path.resolve(__dirname, "build", "index.html"));
//     };
// }

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
  res.status(200).send("GLA App").end();
});

module.exports = app;
