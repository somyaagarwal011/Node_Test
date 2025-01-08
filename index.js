const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;
const FILE_PATH = path.join(__dirname, "form.json");

//Middleware
app.use(bodyParser.json());

//POST
app.post("/form", (req, res) => {
  const form = req.body;
  // Validate the form structure
  if (!form.id || !form.fields || !Array.isArray(form.fields)) {
    return res.status(400).json({ error: "Invalid form structure" });
  }
});
fs.writeFile(FILE_PATH, JSON.stringify(form, null, 2), (err) => {
  if (err) {
    return res.status(500).json({ error: "Not saved form" });
  }
  res.status(200).json({ message: "Form saved successfully" });
});
app.get("/form", (req, res) => {
  if (!fs.existsSync(FILE_PATH)) {
    return res.status(404).json({ error: "Form not found" });
  }
  fs.readFile(FILE_PATH, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read form" });
    }
    res.status(200).json(JSON.parse(data));
  });
});
app.listen(port, () => {
  crossOriginIsolated.log("Server running at port", `${port}`);
});
