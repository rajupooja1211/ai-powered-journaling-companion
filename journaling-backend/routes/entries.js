import express from "express";
import pool from "../config/database.js";
import { processJournalEntry } from "../services/pipeline.js";

const router = express.Router();

/**
 * Create a new journal entry
 */
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      mode,
      text,
      first_arrow = null,
      second_arrow = null,
      metadata = {},
    } = req.body;

    // Basic validation
    if (!user_id || !mode || !text) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "user_id, mode, and text are required",
      });
    }

    // Step 1: Run AI pipeline
    const processed = await processJournalEntry({
      mode,
      text,
      firstArrow: first_arrow,
      secondArrow: second_arrow,
    });

    const analysis = processed.analysis;
    const embedding = processed.embedding;
    const vectorEmbedding = embedding ? `[${embedding.join(",")}]` : null;

    // Step 2: Map AI output → DB columns
    const sql = `
    INSERT INTO journal_entries (
        user_id,
        mode,
        raw_text,

        first_arrow_facts,
        second_arrow_narrative,
        detected_biases,
        sentiment_score,
        primary_themes,
        keywords_extracted,

        sleep_hours,
        caffeine_intake,
        physical_activity,
        time_of_day,

        embedding,
        is_processed
    )
    VALUES (
        $1, $2, $3,
        $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13,
        $14,
        TRUE
    )
    RETURNING *;
    `;

    const values = [
      user_id, // $1
      mode, // $2
      text, // $3

      analysis.first_arrow_facts || null, // $4
      analysis.second_arrow_narrative || null, // $5
      analysis.detected_biases || null, // $6
      analysis.sentiment_score || null, // $7
      analysis.primary_themes || null, // $8
      analysis.keywords_extracted || null, // $9

      metadata.sleep_hours || null, // $10
      metadata.caffeine_intake || null, // $11
      metadata.physical_activity || null, // $12
      metadata.time_of_day || null, // $13

      vectorEmbedding, // $14
    ];

    const result = await pool.query(sql, values);

    res.status(201).json({
      message: "Journal entry created successfully",
      entry: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error creating journal entry:", error);

    // Save failure case (optional later)
    res.status(500).json({
      error: "Failed to create journal entry",
      message: error.message,
    });
  }
});

export default router;
