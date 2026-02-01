// config/predefinedTags.js
export const PREDEFINED_TAGS = {
  // Core Emotions
  EMOTIONS: [
    "anxiety",
    "depression",
    "joy",
    "gratitude",
    "anger",
    "fear",
    "sadness",
    "hope",
    "loneliness",
    "overwhelm",
    "peace",
    "contentment",
  ],

  // Life Domains (What affects wellbeing)
  DOMAINS: [
    "work",
    "relationships",
    "family",
    "friendships",
    "romance",
    "health",
    "sleep",
    "exercise",
    "finances",
    "creativity",
    "self-care",
    "social-life",
  ],

  // Cognitive Patterns (For bias detection)
  COGNITIVE_PATTERNS: [
    "catastrophizing",
    "all-or-nothing-thinking",
    "overgeneralization",
    "rumination",
    "self-criticism",
    "negative-prediction",
    "personalization",
    "should-statements",
  ],

  // Coping & Growth
  COPING: [
    "therapy",
    "meditation",
    "journaling",
    "boundaries",
    "self-compassion",
    "achievement",
    "learning",
    "breakthrough",
    "setback",
    "progress",
  ],

  // Triggers (Important to track)
  TRIGGERS: [
    "conflict",
    "rejection",
    "failure",
    "comparison",
    "uncertainty",
    "change",
    "loss",
  ],
};

// Flatten all tags for Gemini prompt
export const ALL_TAGS = Object.values(PREDEFINED_TAGS).flat();
