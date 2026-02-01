import { analyzeEntry } from "./gemini.js";
import { createEmbedding } from "./embeddings.js";

/**
 * Main AI pipeline
 * - Runs Gemini analysis (includes cognitive bias detection)
 * - Creates semantic embedding
 * - Returns flat, final result
 *
 */
export async function processJournalEntry({ mode, text }) {
  if (!text || text.trim().length === 0) {
    throw new Error("Journal entry text is required.");
  }

  try {
    // Step 1: Gemini analysis (NOW includes cognitive_biases)

    const {
      summary,
      keywords,
      tags,
      sentiment_score,
      cognitive_biases, // ← NEW: Array of detected biases
    } = await analyzeEntry({
      mode,
      text,
    });

    // Step 2: Create embedding
    const embedding = await createEmbedding(text);

    // Step 3: Return final object (DB-ready)
    return {
      summary,
      keywords,
      tags,
      sentiment_score,
      cognitive_biases, // ← NEW: Pass biases to route handler
      embedding,
    };
  } catch (error) {
    console.error("AI pipeline error:", error);
    throw new Error(`Failed to process journal entry: ${error.message}`);
  }
}
