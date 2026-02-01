import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// Create new user (for Welcome page)
router.post("/", async (req, res) => {
  try {
    const { email, full_name } = req.body;

    // Validation
    if (!email || !full_name) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Both email and full_name are required",
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT user_id, email, full_name FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rows.length > 0) {
      // User exists, return existing user
      return res.status(200).json({
        message: "User already exists",
        user: existingUser.rows[0],
      });
    }

    // Create new user
    const result = await pool.query(
      `INSERT INTO users (email, full_name, timezone) 
       VALUES ($1, $2, $3) 
       RETURNING user_id, email, full_name, created_at`,
      [email, full_name, "UTC"],
    );

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      error: "Failed to create user",
      message: error.message,
    });
  }
});

// Get user by ID
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      "SELECT user_id, email, full_name, timezone, created_at FROM users WHERE user_id = $1",
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      error: "Failed to fetch user",
      message: error.message,
    });
  }
});

export default router;
