import { GoogleGenerativeAI } from "@google/generative-ai";
import { ALL_TAGS, PREDEFINED_TAGS } from "../config/predefinedTags.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeEntry({ mode, text }) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a compassionate AI therapist analyzing a journal entry.

JOURNAL ENTRY:
"""
${text}
"""

Provide a JSON response with:

1. **summary**: Write a 2-3 sentence summary using FIRST-PERSON ("I", "Me", "My"). 
   - CRITICAL: Start the summary by referencing the primary Life Domain detected.
   - Example: "Regarding my work, I felt a great sense of accomplishment today..." 
   - Example: "In the context of my relationships, I had a difficult conversation but I feel proud of my boundaries."
2. **keywords**: Array of 5-10 important keywords/phrases from the entry
3. **tags**: Select 3-8 tags from this list ONLY: ${ALL_TAGS.join(", ")}. 
   - You MUST include at least one tag from DOMAINS: ${PREDEFINED_TAGS.DOMAINS.join(", ")}.


4. **sentiment_score**: Float from -1.0 to +1.0
   - -1.0 = Severe distress/despair/crisis
   - -0.5 = Moderate negativity/sadness
   - 0.0 = Neutral/balanced
   - +0.5 = Moderate positivity/gratitude
   - +1.0 = High joy/breakthrough/excitement
   
5. **cognitive_biases**: Array of detected cognitive distortions. Each object:
   {
     "type": "catastrophizing" | "all-or-nothing-thinking" | "overgeneralization" | "should-statements" | "personalization" | "negative-prediction" | "mental-filter" | "labeling",
     "quote": "Exact phrase from the entry that shows this bias",
     "mirror": "A gentle, curious reframe question (non-judgmental)",
     "severity": "mild" | "moderate" | "severe"
   }

COGNITIVE BIAS DETECTION PATTERNS:

**Catastrophizing**: "This is the worst", "I can't handle this", "Everything is ruined", "It's a disaster"
→ Mirror: "You're predicting a catastrophe. What's one way this could be manageable?"

**All-or-nothing**: "I always fail", "I never get it right", "Everyone hates me", "Nothing works", "Everything is..."
→ Mirror: "You used 'always/never/everyone'. Can you think of one exception?"

**Overgeneralization**: One event → "This always happens", "I'm always like this"
→ Mirror: "You're taking one situation and making it a pattern. Is this really always true?"

**Should statements**: "I should be better", "I must do this", "I have to...", "I ought to..."
→ Mirror: "You're putting pressure with 'should'. What if you said 'I want to' or 'I could'?"

**Personalization**: "It's all my fault", "I'm the reason this failed", "I ruined everything"
→ Mirror: "You're taking full responsibility. What other factors contributed to this?"

**Negative prediction**: "I'll never succeed", "This will definitely fail", "I know it won't work", "There's no hope"
→ Mirror: "You're predicting the future. What evidence suggests it could go differently?"

**Mental filter**: Only focusing on negatives, ignoring positives
→ Mirror: "You're focusing on what went wrong. What went right, even if small?"

**Labeling**: "I'm a failure", "I'm worthless", "I'm broken", "I'm stupid"
→ Mirror: "You're labeling yourself. Can you separate what you did from who you are?"

RULES:
- Use "I" statements. Never say "The user" or "The author".
- Only flag biases with CLEAR evidence (direct quotes)
- Mirrors should be gentle and curious, never accusatory
- Severity: mild (minor distortion), moderate (impacts mood), severe (harmful belief)
- If no biases detected, return empty array
- Return ONLY valid JSON, no markdown, no extra text
- The summary must be generated directly from the transcript provided.
- Focus heavily on the "Domain" so the Wiki component can group these entries logically.


Example output:
{
  "summary: "I’ve been feeling overwhelmed with deadlines — I’m not sure I can keep up.",

  "keywords": ["overwhelmed", "work stress", "deadlines", "self-doubt", "anxiety"],
 "tags": ["work", "creativity", "breakthrough", "anxiety", "progress"],
  "sentiment_score": -0.45,
  "cognitive_biases": [
    {
      "type": "catastrophizing",
      "quote": "I'll never finish this project and I'll definitely get fired",
      "mirror": "You're predicting a catastrophe. What's one small step you could take right now?",
      "severity": "moderate"
    },
    {
      "type": "all-or-nothing-thinking",
      "quote": "I always mess everything up",
      "mirror": "You used 'always'. Can you recall one time when you handled something well?",
      "severity": "mild"
    }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean markdown code blocks if present
    const cleanJson = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed = JSON.parse(cleanJson);

    // Validate response structure
    if (!parsed.summary || !parsed.tags || !Array.isArray(parsed.tags)) {
      throw new Error("Invalid response structure from Gemini");
    }

    return {
      summary: parsed.summary,
      keywords: parsed.keywords || [],
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      sentiment_score: parsed.sentiment_score ?? 0,
      cognitive_biases: parsed.cognitive_biases || [],
    };
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw new Error(`Gemini analysis failed: ${error.message}`);
  }
}
