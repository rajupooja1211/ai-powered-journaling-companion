import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Create embedding vector using Gemini
 * Used for semantic search & memory recall
 */
export async function createEmbedding(text) {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error("Text is empty. Cannot generate embedding.");
    }

    const model = genAI.getGenerativeModel({
      model: "text-embedding-004", // Gemini embedding model
    });

    const result = await model.embedContent({
      content: {
        parts: [{ text }],
      },
    });

    const embedding = result.embedding.values;

    return embedding; // Array of floats
  } catch (error) {
    console.error("❌ Gemini embedding error:", error);
    throw new Error(`Failed to create embedding: ${error.message}`);
  }
}
