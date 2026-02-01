import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Create embedding vector using Gemini
 * Used for semantic search & pattern analysis
 */
export async function createEmbedding(text) {
  if (!text || text.trim().length === 0) {
    throw new Error("Text is empty. Cannot generate embedding.");
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "text-embedding-004",
    });

    const result = await model.embedContent(text);

    return result.embedding.values; // number[]
  } catch (error) {
    console.error("❌ Gemini embedding error:", error);
    throw new Error(`Failed to create embedding: ${error.message}`);
  }
}
