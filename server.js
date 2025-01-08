const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();
const port = 5000;
const TASKS_FILE = path.join(__dirname, "tasks.json");
app.use(express.json()); // Middleware

// GET
app.get("/tasks/stats", (req, res) => {
  try {
    const tasks = JSON.parse(fs.readFileSync(TASKS_FILE, "utf-8"));

    // Aggregate data
    const totalTasks = tasks.length;
    const tasksByStatus = {};
    const tasksByUser = {};

    tasks.forEach((task) => {
      tasksByStatus[task.status] = (tasksByStatus[task.status] || 0) + 1;
      tasksByUser[task.userId] = (tasksByUser[task.userId] || 0) + 1;
    });
    res.status(200).json({
      totalTasks,
      tasksByStatus,
      tasksByUser,
    });
  } catch (err) {
    res.status(500).json("Failed to process tasks");
  }
});
app.listen(port, () => {
  console.log("server running at port", `${port}`);
});
