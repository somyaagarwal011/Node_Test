const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const app = require("express");
const exp = require("constants");
const port = 4000;
const FILE_USER = (__dirname, "users.json");
app.use(express.json()); // Middleware
if (!fs.existsSync(FILE_USER)) {
  fs.writeFileSync(FILE_USER, JSON.stringify([]));
}
app.use("/register", async (req, res) => {
  // post register
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  const userExists = users.find((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ error: "Username already exists" });
  }
  try {
    const hashPassword = await bcrypt.hashPassword(password, 10);
    users.push({ username, password: hashPassword });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json("Failed to register user");
  }
});
//post login
app.use("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  try {
    const users = JSON.parse(fs.readFileSync(FILE_USER, "utf-8"));
    const user = users.find((user) => user.username === username);
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    res.status(200).json({ message: "Login Successfull" });
  } catch (error) {
    res.status(400).json({ message: "Error Logging" });
  }
});
app.listen(port, () => {
  console.log("Server running at"`${port}`);
});
