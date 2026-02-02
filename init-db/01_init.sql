-- ============================================
-- Enable UUID generation
-- ============================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  timezone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- JOURNAL ENTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS journal_entries (
  entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  mode VARCHAR(20),
  raw_text TEXT,
  summary TEXT,
  keywords TEXT[],
  tags TEXT[],
  sentiment_score FLOAT,
  embedding VECTOR,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  duration_seconds INT,
  cognitive_biases JSONB,
  email VARCHAR(225),
  full_name VARCHAR(255)
);

-- ============================================
-- INSERT SINGLE DEMO USER (FIXED UUID)
-- ============================================
INSERT INTO users (
  user_id,
  email,
  full_name,
  timezone
)
VALUES (
  'd3186485-7984-43e2-be29-633995d75b23',
  'alex.johnson@example.com',
  'Alex Johnson',
  'UTC'
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- INSERT JOURNAL ENTRIES (ALL DEMO DATA)
-- ============================================

INSERT INTO journal_entries (
  user_id, email, full_name, created_at, mode, raw_text, 
  summary, keywords, tags, sentiment_score, started_at, 
  ended_at, duration_seconds, cognitive_biases
) VALUES

-- Week 4: Jan 25 - Jan 31
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-31 20:00:00', 'unload', 
  'Painted for three hours today. I felt so in the zone.',
  'Regarding my creativity, I spent the evening painting and I felt completely in the flow. It brought me so much joy and mental peace.',
  ARRAY['painting', 'flow state', 'creativity'], ARRAY['creativity', 'joy', 'peace'], 0.95, 
  '2026-01-31 19:50:00', '2026-01-31 20:10:00', 1200, '[]'::jsonb
),
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-30 09:00:00', 'soft_start', 
  'Woke up early for a run. Feeling strong.',
  'Regarding my health and exercise, I hit a new personal best on my morning run. I feel energized and motivated to maintain this rhythm.',
  ARRAY['running', 'stamina', 'health'], ARRAY['health', 'exercise', 'progress', 'joy'], 0.88, 
  '2026-01-30 08:55:00', '2026-01-30 09:05:00', 600, '[]'::jsonb
),
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-29 15:30:00', 'unload', 
  'Too many emails. I feel like I am drowning in work.',
  'In the context of my work, I am feeling significantly overwhelmed by my inbox. I feel like I will never be able to respond to everyone.',
  ARRAY['emails', 'workload', 'stress'], ARRAY['work', 'overwhelm', 'anxiety'], -0.50, 
  '2026-01-29 15:25:00', '2026-01-29 15:35:00', 600, '[{"type": "catastrophizing", "mirror": "I am imagining an endless pile. What are the top three?", "severity": "medium"}]'::jsonb
),
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-28 10:00:00', 'unload', 
  'Finished the project! My boss loved it.',
  'Regarding my work and achievement, I successfully delivered the big project today. I feel a massive sense of relief and pride in my performance.',
  ARRAY['success', 'project', 'validation'], ARRAY['work', 'achievement', 'pride', 'joy'], 0.92, 
  '2026-01-28 09:55:00', '2026-01-28 10:05:00', 600, '[]'::jsonb
),
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-27 22:00:00', 'soft_start', 
  'Stressed about the mortgage payment coming up.',
  'In the context of my finances, I am worried about meeting my upcoming payments. I feel like I am always struggling with money lately.',
  ARRAY['mortgage', 'bills', 'finance'], ARRAY['finances', 'anxiety', 'fear', 'stress'], -0.55, 
  '2026-01-27 21:55:00', '2026-01-27 22:05:00', 600, '[{"type": "overgeneralization", "mirror": "I used the word always. Was there a month where I felt secure?", "severity": "mild"}]'::jsonb
),

-- Week 3: Jan 18 - Jan 24
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-24 18:00:00', 'unload', 
  'Great hike with friends.',
  'Regarding my social life and health, I had a wonderful day hiking with close friends. I feel deeply connected and refreshed by nature.',
  ARRAY['hiking', 'friends', 'nature'], ARRAY['friendships', 'health', 'gratitude', 'peace'], 0.85, 
  '2026-01-24 17:50:00', '2026-01-24 18:10:00', 1200, '[]'::jsonb
),
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-22 14:00:00', 'unload', 
  'Argued with my brother again.',
  'In the context of my family relationships, I had a frustrating argument with my brother. I feel sad that we cannot seem to agree on simple things.',
  ARRAY['family', 'conflict', 'argument'], ARRAY['family', 'sadness', 'frustration'], -0.45, 
  '2026-01-22 13:50:00', '2026-01-22 14:10:00', 1200, '[{"type": "mind_reading", "mirror": "I am assuming I know why he is angry. Have I asked him?", "severity": "medium"}]'::jsonb
),
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-21 07:30:00', 'soft_start', 
  'Meditated for 15 mins. Felt calm.',
  'Regarding my self-care and mental health, I started my day with a long meditation. I feel much more centered and ready for work.',
  ARRAY['meditation', 'calm', 'morning'], ARRAY['meditation', 'self-care', 'peace', 'contentment'], 0.75, 
  '2026-01-21 07:25:00', '2026-01-21 07:35:00', 600, '[]'::jsonb
),
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-20 11:00:00', 'unload', 
  'I feel like I am failing at my new diet.',
  'In the context of my health goals, I am feeling discouraged about my eating habits today. I feel like a total failure because I ate fast food.',
  ARRAY['diet', 'failure', 'health'], ARRAY['health', 'sadness', 'all-or-nothing-thinking', 'self-criticism'], -0.65, 
  '2026-01-20 10:50:00', '2026-01-20 11:10:00', 1200, '[{"type": "all-or-nothing-thinking", "mirror": "One meal doesn''t define my health. Can I be kind to myself?", "severity": "high"}]'::jsonb
),
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-19 16:30:00', 'unload', 
  'Client was very rude to me.',
  'Regarding my work interactions, I had a very difficult conversation with a client today. I feel drained and I am doubting my professional skills.',
  ARRAY['client', 'conflict', 'work'], ARRAY['work', 'frustration', 'sadness', 'doubt'], -0.50, 
  '2026-01-19 16:20:00', '2026-01-19 16:40:00', 1200, '[]'::jsonb
),

-- Week 2: Jan 11 - Jan 17
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-17 19:00:00', 'soft_start', 
  'Dinner with partner was lovely.',
  'In the context of my romantic relationship, I had a wonderful date night. I feel a deep sense of gratitude for the support and love in my life.',
  ARRAY['date', 'romance', 'love'], ARRAY['romance', 'gratitude', 'joy', 'peace'], 0.90, 
  '2026-01-17 18:55:00', '2026-01-17 19:05:00', 600, '[]'::jsonb
),
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-15 08:00:00', 'unload', 
  'I am so tired. Didn''t sleep well.',
  'Regarding my health and sleep, I am feeling very exhausted today after a poor night of rest. I feel like everything today will be a struggle.',
  ARRAY['sleep', 'exhaustion', 'tired'], ARRAY['sleep', 'health', 'sadness', 'overwhelm'], -0.40, 
  '2026-01-15 07:50:00', '2026-01-15 08:10:00', 1200, '[]'::jsonb
),
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-14 13:00:00', 'soft_start', 
  'Therapy went well today.',
  'In the context of my growth and mental health, I had a productive therapy session. I am learning better ways to handle my anxiety about the future.',
  ARRAY['therapy', 'mental health', 'anxiety'], ARRAY['therapy', 'growth', 'hope', 'learning'], 0.65, 
  '2026-01-14 12:55:00', '2026-01-14 13:05:00', 600, '[]'::jsonb
),
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-13 10:00:00', 'unload', 
  'Work is just boring lately.',
  'Regarding my work satisfaction, I am feeling quite uninspired and bored with my current tasks. I feel like I need a new challenge to stay motivated.',
  ARRAY['boredom', 'work', 'motivation'], ARRAY['work', 'apathy', 'sadness'], -0.20, 
  '2026-01-13 09:50:00', '2026-01-13 10:10:00', 1200, '[]'::jsonb
),
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-11 20:00:00', 'unload', 
  'I forgot to pay the water bill. I am so stupid.',
  'In the context of my adult responsibilities and finances, I am feeling very frustrated with myself for forgetting a bill. I am labeling myself harshly for a simple mistake.',
  ARRAY['bills', 'mistake', 'finances'], ARRAY['finances', 'self-criticism', 'labeling', 'frustration'], -0.50, 
  '2026-01-11 19:50:00', '2026-01-11 20:10:00', 1200, '[{"type": "labeling", "mirror": "I am calling myself stupid for a mistake. Is that fair to me?", "severity": "medium"}]'::jsonb
),

-- Week 1: Jan 1 - Jan 10
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-08 15:00:00', 'unload', 
  'Thinking about my career path.',
  'Regarding my career growth, I am spending time reflecting on where I want to be in five years. I feel a mix of excitement and fear about making changes.',
  ARRAY['career', 'future', 'reflection'], ARRAY['work', 'hope', 'fear', 'learning'], 0.40, 
  '2026-01-08 14:50:00', '2026-01-08 15:10:00', 1200, '[]'::jsonb
),
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-05 21:00:00', 'unload', 
  'Loneliness is hitting hard tonight.',
  'In the context of my social life, I am feeling quite lonely this evening. I feel like everyone else is busy and I am the only one alone.',
  ARRAY['loneliness', 'solitude', 'social'], ARRAY['loneliness', 'sadness', 'personalization'], -0.60, 
  '2026-01-05 20:50:00', '2026-01-05 21:10:00', 1200, '[{"type": "personalization", "mirror": "I am assuming their plans are about me. Is it possible they are just busy?", "severity": "medium"}]'::jsonb
),
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-04 09:00:00', 'soft_start', 
  'Trying a new healthy recipe.',
  'Regarding my health and creativity, I tried cooking a new meal today. I feel proud of myself for taking small steps toward a better lifestyle.',
  ARRAY['cooking', 'health', 'self-care'], ARRAY['health', 'creativity', 'self-care', 'pride'], 0.70, 
  '2026-01-04 08:55:00', '2026-01-04 09:05:00', 600, '[]'::jsonb
),
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-02 18:00:00', 'unload', 
  'Writing down my New Year resolutions.',
  'In the context of my growth and progress, I am setting intentions for 2026. I feel determined and hopeful about the person I am becoming.',
  ARRAY['resolutions', 'new year', 'goals'], ARRAY['progress', 'hope', 'learning', 'achievement'], 0.75, 
  '2026-01-02 17:50:00', '2026-01-02 18:10:00', 1200, '[]'::jsonb
),
(
  'd3186485-7984-43e2-be29-633995d75b23', 'alex.johnson@example.com', 'Alex Johnson', '2026-01-01 12:00:00', 'soft_start', 
  'Quiet start to the year.',
  'Regarding my overall wellbeing, I am having a very peaceful start to 2026. I feel a lot of gratitude for the rest I am getting.',
  ARRAY['new year', 'peace', 'rest'], ARRAY['peace', 'gratitude', 'contentment', 'self-care'], 0.80, 
  '2026-01-01 11:55:00', '2026-01-01 12:05:00', 600, '[]'::jsonb
);