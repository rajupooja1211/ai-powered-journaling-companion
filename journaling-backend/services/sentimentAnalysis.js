// services/sentimentAnalysis.js

/**
 * SENTIMENT SCORE EXPLANATION:
 *
 * Range: -1.0 to +1.0
 *
 * -1.0 to -0.6  = Severely negative (crisis, despair, hopelessness)
 * -0.6 to -0.3  = Moderately negative (sadness, frustration, stress)
 * -0.3 to -0.1  = Mildly negative (slight worry, disappointment)
 * -0.1 to +0.1  = Neutral (factual, balanced, neither positive nor negative)
 * +0.1 to +0.3  = Mildly positive (calm, okay, stable)
 * +0.3 to +0.6  = Moderately positive (happy, grateful, hopeful)
 * +0.6 to +1.0  = Highly positive (joy, excitement, breakthrough)
 *
 * HOW IT'S CALCULATED:
 * Gemini analyzes:
 * 1. Word choice (negative words like "never", "always", "hopeless" vs positive like "grateful", "proud")
 * 2. Tone (desperate, calm, excited)
 * 3. Context (situation described)
 * 4. Emotional intensity
 * 5. Overall message
 *
 * It's NOT just positive/negative word count - it understands nuance.
 * Example: "I'm struggling but I'm trying" = -0.2 (slightly negative but resilient)
 * Example: "I'm completely broken and there's no hope" = -0.9 (severe)
 */

export function interpretSentiment(score) {
  if (score >= 0.6)
    return { label: "Highly Positive", emoji: "😊", color: "#4caf50" };
  if (score >= 0.3)
    return { label: "Moderately Positive", emoji: "🙂", color: "#8bc34a" };
  if (score >= 0.1)
    return { label: "Mildly Positive", emoji: "😌", color: "#cddc39" };
  if (score >= -0.1) return { label: "Neutral", emoji: "😐", color: "#9e9e9e" };
  if (score >= -0.3)
    return { label: "Mildly Negative", emoji: "😕", color: "#ff9800" };
  if (score >= -0.6)
    return { label: "Moderately Negative", emoji: "😟", color: "#ff5722" };
  return { label: "Severely Negative", emoji: "😢", color: "#f44336" };
}
