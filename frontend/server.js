const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as view engine so HTML files with templates render properly
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);
app.set("views", path.join(__dirname, "views"));

// Home route proxying to Flask backend or rendering local form
app.get("/", async (req, res) => {
  res.render("index", { error: null });
});

// Forward form submission to Flask backend
app.post("/submit", async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/submit`, {
      method: "POST",
      body: new URLSearchParams(req.body),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      redirect: "manual",
    });
    if (response.status === 302 || response.status === 303) {
      return res.redirect("/success");
    }
    const html = await response.text();
    res.send(html);
  } catch (err) {
    res.render("index", { error: `Backend Connection Error: ${err.message}` });
  }
});

app.get("/success", (req, res) => {
  res.render("success");
});

app.get("/api", async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend running on port ${PORT}`);
});
app.get("/todo_item", (req, res) => {
  res.render("todo", { error: null });
});
app.post("/submittodoitem", async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/submittodoitem`, {
      method: "POST",
      body: new URLSearchParams(req.body),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      redirect: "manual",
    });
    if (response.status === 302 || response.status === 303) {
      return res.redirect("/success");
    }
    const html = await response.text();
    res.send(html);
  } catch (err) {
    res.render("todo", { error: `Backend Connection Error: ${err.message}` });
  }
});
