// authController.js

var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const db = require("../db/db");

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    await db.query(
      `INSERT INTO users (username, email, phone_number, password) 
       VALUES ($1, $2, $3, $4)`,
      [req.body.username, req.body.email, req.body.phone_number, hashedPassword]
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      req.body.email,
    ]);
    if (
      user.rows.length === 0 ||
      !(await bcrypt.compare(req.body.password, user.rows[0].password))
    ) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await db.query(
      "SELECT id, username, email, phone_number FROM users WHERE id = $1",
      [req.user.id]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: user.rows[0] });
  } catch (error) {
    console.error("Error fetching user info:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.validateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = { id: decoded.id };
    next();
  });
};
