import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze journal entry for Soft Start mode
 * Separates First Arrow (facts) from Second Arrow (interpretations)
 */
export async function analyzeSoftStart(
  rawText,
  firstArrow = null,
  secondArrow = null,
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a CBT-trained journaling AI therapist. Analyze this journal entry from Soft Start mode.

Entry: "${rawText}"
${firstArrow ? `First Arrow (user provided): ${JSON.stringify(firstArrow)}` : ""}
${secondArrow ? `Second Arrow (user provided): ${JSON.stringify(secondArrow)}` : ""}

Return ONLY a valid JSON object (no markdown, no backticks) with this structure:
{
  "first_arrow_facts": ["fact1", "fact2"],
  "second_arrow_narrative": ["interpretation1", "interpretation2"],
  "detected_biases": ["bias1", "bias2"],
  "primary_themes": ["theme1", "theme2"],
  "sentiment_score": -0.8
}

Rules:
- first_arrow_facts: Objective events that happened (no interpretations)
- second_arrow_narrative: User's interpretations, judgments, emotional reactions
- detected_biases: Identify cognitive biases from: Catastrophizing, Overgeneralization, Black-and-White Thinking, Mind Reading, Emotional Reasoning, Should Statements, Personalization, Fortune Telling
- primary_themes: Categories like "work", "relationships", "self-worth", "health", "family", "money"
- sentiment_score: Float from -1.0 (very negative) to 1.0 (very positive)
- If user says "always" or "never", flag as Overgeneralization
- Never give advice, only identify patterns`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const analysis = JSON.parse(cleanText);

    return {
      ...analysis,
      first_arrow_facts: firstArrow || analysis.first_arrow_facts,
      second_arrow_narrative: secondArrow || analysis.second_arrow_narrative,
    };
  } catch (error) {
    console.error("❌ Gemini Soft Start analysis error:", error);
    throw new Error(`Failed to analyze soft start entry: ${error.message}`);
  }
}

/**
 * Analyze journal entry for Pattern Gallery mode
 * Focus on themes, biases, sentiment (no first/second arrow)
 */
export async function analyzePatternGallery(rawText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a CBT-trained journaling AI therapist. Analyze this journal entry from Pattern Gallery mode.

Entry: "${rawText}"

Return ONLY a valid JSON object (no markdown, no backticks) with this structure:
{
  "detected_biases": ["bias1", "bias2"],
  "primary_themes": ["theme1", "theme2"],
  "sentiment_score": -0.5
}

Rules:
- detected_biases: Identify cognitive biases from: Catastrophizing, Overgeneralization, Black-and-White Thinking, Mind Reading, Emotional Reasoning, Should Statements, Personalization, Fortune Telling
- primary_themes: Categories like "work", "relationships", "self-worth", "health", "family", "money"
- sentiment_score: Float from -1.0 (very negative) to 1.0 (very positive)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const analysis = JSON.parse(cleanText);

    return analysis;
  } catch (error) {
    console.error("❌ Gemini Pattern Gallery analysis error:", error);
    throw new Error(
      `Failed to analyze pattern gallery entry: ${error.message}`,
    );
  }
}

/**
 * Analyze journal entry for Unload mode
 * Extract keywords, detect biases, sentiment (no themes, no first/second arrow)
 */
export async function analyzeUnload(rawText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a CBT-trained journaling AI therapist. Analyze this voice transcript from Unload mode.

Transcript: "${rawText}"

Return ONLY a valid JSON object (no markdown, no backticks) with this structure:
{
  "keywords_extracted": ["keyword1", "keyword2", "keyword3"],
  "detected_biases": ["bias1", "bias2"],
  "sentiment_score": -0.7
}

Rules:
- keywords_extracted: 5-8 key words or short phrases that capture the main topics (e.g., "deadline", "boss", "anxiety", "presentation")
- detected_biases: Identify cognitive biases from: Catastrophizing, Overgeneralization, Black-and-White Thinking, Mind Reading, Emotional Reasoning, Should Statements, Personalization, Fortune Telling
- sentiment_score: Float from -1.0 (very negative) to 1.0 (very positive)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const analysis = JSON.parse(cleanText);

    return analysis;
  } catch (error) {
    console.error("❌ Gemini Unload analysis error:", error);
    throw new Error(`Failed to analyze unload entry: ${error.message}`);
  }
}
