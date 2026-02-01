import express from "express";
import pool from "../config/database.js";
import { processJournalEntry } from "../services/pipeline.js";

const router = express.Router();

/**
 * Create a new journal entry
 */
// routes/journal.js
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      mode,
      text,
      started_at = null,
      ended_at = null,
    } = req.body;

    if (!user_id || !mode || !text) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "user_id, mode, and text are required",
      });
    }

    let duration_seconds = null;
    if (started_at && ended_at) {
      duration_seconds = Math.floor(
        (new Date(ended_at) - new Date(started_at)) / 1000,
      );
    }

    // Run AI pipeline WITH cognitive bias detection
    const {
      summary,
      keywords,
      tags,
      sentiment_score,
      cognitive_biases,
      embedding,
    } = await processJournalEntry({ mode, text });

    const vectorEmbedding = embedding ? `[${embedding.join(",")}]` : null;

    const sql = `
      INSERT INTO journal_entries (
        user_id,
        mode,
        raw_text,
        summary,
        keywords,
        tags,
        sentiment_score,
        cognitive_biases,
        embedding,
        started_at,
        ended_at,
        duration_seconds
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      )
      RETURNING *;
    `;

    const values = [
      user_id,
      mode,
      text,
      summary,
      keywords,
      tags,
      sentiment_score,
      JSON.stringify(cognitive_biases), // Store as JSONB
      vectorEmbedding,
      started_at,
      ended_at,
      duration_seconds,
    ];

    const result = await pool.query(sql, values);

    res.status(201).json({
      message: "Journal entry created successfully",
      entry: result.rows[0],
      // Return biases to frontend for immediate display
      mirrors: cognitive_biases.map((b) => ({
        type: b.type,
        mirror: b.mirror,
        severity: b.severity,
      })),
    });
  } catch (error) {
    console.error("❌ Error creating journal entry:", error);
    res.status(500).json({
      error: "Failed to create journal entry",
      message: error.message,
    });
  }
});

export default router;
