// routes/dashboard.js
import express from "express";
import pool from "../config/database.js";

const router = express.Router();

/**
 * GET /api/dashboard/:user_id
 * Fetches entries for visualization (sentiment, tags, timestamp)
 */
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { range = "month" } = req.query; // week, month, all

    // Calculate date filter based on range
    let dateFilter = "";
    if (range === "week") {
      dateFilter = "AND created_at >= NOW() - INTERVAL '7 days'";
    } else if (range === "month") {
      dateFilter = "AND created_at >= NOW() - INTERVAL '30 days'";
    }
    // 'all' = no filter

    const sql = `
      SELECT 
        id,
        sentiment_score,
        tags,
        summary,
        created_at,
        cognitive_biases
      FROM journal_entries
      WHERE user_id = $1
      ${dateFilter}
      ORDER BY created_at ASC
    `;

    const result = await pool.query(sql, [user_id]);

    res.json({
      success: true,
      entries: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("❌ Dashboard data error:", error);
    res.status(500).json({
      error: "Failed to fetch dashboard data",
      message: error.message,
    });
  }
});

export default router;
