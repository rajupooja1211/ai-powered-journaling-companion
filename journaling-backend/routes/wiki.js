import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// Domain tags to filter by (Life Domains only)
const DOMAIN_TAGS = [
  "work",
  "relationships",
  "family",
  "friendships",
  "romance",
  "health",
  "sleep",
  "exercise",
  "finances",
  "creativity",
  "self-care",
  "social-life",
];

router.get("/all", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Fetch all entries with relevant fields
    const result = await pool.query(
      `SELECT 
        created_at,
        summary,
        tags,
        sentiment_score
      FROM journal_entries 
      WHERE user_id = $1 
      ORDER BY created_at DESC`,
      [userId],
    );

    const entries = result.rows;

    // Count domain tags only
    const counts = {};
    entries.forEach((entry) => {
      const tags = entry.tags || [];
      tags.forEach((tag) => {
        const normalizedTag = tag.toLowerCase();
        if (DOMAIN_TAGS.includes(normalizedTag)) {
          counts[normalizedTag] = (counts[normalizedTag] || 0) + 1;
        }
      });
    });

    // Convert to sorted array (highest count first)
    const domains = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    res.json({
      domains,
      entries,
    });
  } catch (error) {
    console.error("❌ Wiki fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch wiki data",
      message: error.message,
    });
  }
});

router.get("/domains", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const result = await pool.query(
      `SELECT tags FROM journal_entries WHERE user_id = $1`,
      [userId],
    );

    // Count domain tags
    const counts = {};
    result.rows.forEach((row) => {
      const tags = row.tags || [];
      tags.forEach((tag) => {
        const normalizedTag = tag.toLowerCase();
        if (DOMAIN_TAGS.includes(normalizedTag)) {
          counts[normalizedTag] = (counts[normalizedTag] || 0) + 1;
        }
      });
    });

    const domains = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    res.json({ domains });
  } catch (error) {
    console.error("Wiki domains error:", error);
    res.status(500).json({
      error: "Failed to fetch domains",
      message: error.message,
    });
  }
});

router.get("/entries/:tag", async (req, res) => {
  try {
    const { tag } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Fetch entries that contain this tag (case-insensitive)
    const result = await pool.query(
      `SELECT 
        created_at,
        summary,
        tags,
        sentiment_score
      FROM journal_entries 
      WHERE user_id = $1 
        AND EXISTS (
          SELECT 1 FROM unnest(tags) AS t 
          WHERE LOWER(t) = LOWER($2)
        )
      ORDER BY created_at DESC`,
      [userId, tag],
    );

    res.json({ entries: result.rows });
  } catch (error) {
    console.error(" Wiki entries error:", error);
    res.status(500).json({
      error: "Failed to fetch entries",
      message: error.message,
    });
  }
});

export default router;
