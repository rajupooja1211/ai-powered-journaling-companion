import {
  analyzeSoftStart,
  analyzePatternGallery,
  analyzeUnload,
} from "./gemini.js";

import { createEmbedding } from "./embeddings.js";

/**
 * Main AI pipeline
 * Orchestrates analysis + embeddings
 */
export async function processJournalEntry({
  mode,
  text,
  firstArrow = null,
  secondArrow = null,
}) {
  if (!text || text.trim().length === 0) {
    throw new Error("Journal entry text is required.");
  }

  let analysisResult;

  try {
    // Step 1: Run Gemini analysis based on mode
    if (mode === "soft_start") {
      analysisResult = await analyzeSoftStart(text, firstArrow, secondArrow);
    } else if (mode === "pattern_gallery") {
      analysisResult = await analyzePatternGallery(text);
    } else if (mode === "unload") {
      analysisResult = await analyzeUnload(text);
    } else {
      throw new Error(`Unsupported mode: ${mode}`);
    }

    // Step 2: Create embedding (semantic memory)
    const embedding = await createEmbedding(text);

    // Step 3: Return final processed object
    return {
      mode,
      raw_text: text,
      analysis: analysisResult,
      embedding,
      created_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("AI pipeline error:", error);
    throw new Error(`Failed to process journal entry: ${error.message}`);
  }
}
