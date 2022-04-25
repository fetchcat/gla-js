require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3002;

app.use("/apps/glajs", express.static("public"));

app.get("/", (req, res) => {
  res.send("GLA-JS");
});

app.listen(port, () => {
  console.log(`> GLA-JS frontend listening on port: ${port}`);
});
