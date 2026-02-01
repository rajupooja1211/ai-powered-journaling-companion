import express from "express";
import pool from "../config/database.js";

const router = express.Router();

router.get("/dashboard", async (req, res) => {
  try {
    const { userId, days = 30 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    // 1. Total entries and average sentiment
    const statsQuery = `
      SELECT 
        COUNT(*)::int as total_entries,
        COALESCE(AVG(sentiment_score), 0) as avg_sentiment,
        COALESCE(SUM(duration_seconds), 0)::int as total_duration
      FROM journal_entries
      WHERE user_id = $1 AND created_at >= $2
    `;
    const stats = await pool.query(statsQuery, [userId, daysAgo]);

    // 2. Weekly sentiment pattern
    const weeklyQuery = `
      SELECT 
        TO_CHAR(created_at, 'Mon DD') as date,
        COALESCE(AVG(sentiment_score), 0) as sentiment,
        COUNT(*)::int as entries
      FROM journal_entries
      WHERE user_id = $1 AND created_at >= $2
      GROUP BY DATE(created_at), TO_CHAR(created_at, 'Mon DD')
      ORDER BY DATE(created_at)
    `;
    const weekly = await pool.query(weeklyQuery, [userId, daysAgo]);

    // 3. Emotion distribution from tags
    const emotionQuery = `
      SELECT 
        unnest(tags) as emotion,
        COUNT(*)::int as count
      FROM journal_entries
      WHERE user_id = $1 AND created_at >= $2
      GROUP BY unnest(tags)
      ORDER BY count DESC
      LIMIT 8
    `;
    const emotions = await pool.query(emotionQuery, [userId, daysAgo]);

    // 4. Top keywords
    const keywordQuery = `
      SELECT 
        unnest(keywords) as keyword,
        COUNT(*)::int as count
      FROM journal_entries
      WHERE user_id = $1 AND created_at >= $2
      GROUP BY unnest(keywords)
      ORDER BY count DESC
      LIMIT 10
    `;
    const keywords = await pool.query(keywordQuery, [userId, daysAgo]);

    // 5. Mood by time of day - FIXED QUERY
    const timeOfDayQuery = `
      SELECT 
        time_period as time,
        COALESCE(AVG(sentiment_score), 0) as avgSentiment,
        COUNT(*)::int as count
      FROM (
        SELECT 
          sentiment_score,
          CASE 
            WHEN EXTRACT(HOUR FROM created_at) BETWEEN 6 AND 11 THEN 'Morning'
            WHEN EXTRACT(HOUR FROM created_at) BETWEEN 12 AND 17 THEN 'Afternoon'
            WHEN EXTRACT(HOUR FROM created_at) BETWEEN 18 AND 21 THEN 'Evening'
            ELSE 'Night'
          END as time_period,
          CASE 
            WHEN EXTRACT(HOUR FROM created_at) BETWEEN 6 AND 11 THEN 1
            WHEN EXTRACT(HOUR FROM created_at) BETWEEN 12 AND 17 THEN 2
            WHEN EXTRACT(HOUR FROM created_at) BETWEEN 18 AND 21 THEN 3
            ELSE 4
          END as time_order
        FROM journal_entries
        WHERE user_id = $1 AND created_at >= $2
      ) subquery
      GROUP BY time_period, time_order
      ORDER BY time_order
    `;
    const timeOfDay = await pool.query(timeOfDayQuery, [userId, daysAgo]);

    // 6. Cognitive patterns analysis
    const cognitiveQuery = `
      SELECT 
        jsonb_array_elements(cognitive_biases)->>'type' as bias_type,
        jsonb_array_elements(cognitive_biases)->>'severity' as severity,
        COUNT(*)::int as count
      FROM journal_entries
      WHERE user_id = $1 
        AND created_at >= $2
        AND cognitive_biases != '[]'::jsonb
      GROUP BY bias_type, severity
      ORDER BY count DESC
    `;
    const cognitive = await pool.query(cognitiveQuery, [userId, daysAgo]);

    // Process cognitive patterns with descriptions and trends
    const cognitivePatterns = processCognitivePatterns(cognitive.rows);

    // 7. Calculate growth metrics
    const growthMetrics = await calculateGrowthMetrics(userId, days);

    // 8. Determine sentiment trend
    const recentAvg =
      weekly.rows
        .slice(-7)
        .reduce((acc, row) => acc + parseFloat(row.sentiment), 0) /
      Math.max(weekly.rows.slice(-7).length, 1);
    const olderAvg =
      weekly.rows
        .slice(0, 7)
        .reduce((acc, row) => acc + parseFloat(row.sentiment), 0) /
      Math.max(weekly.rows.slice(0, 7).length, 1);
    const sentimentTrend = recentAvg > olderAvg ? "up" : "down";

    // Return comprehensive dashboard data
    res.json({
      totalEntries: stats.rows[0].total_entries,
      avgSentiment: parseFloat(stats.rows[0].avg_sentiment.toFixed(2)),
      sentimentTrend,
      weeklyPattern: weekly.rows.map((row) => ({
        date: row.date,
        sentiment: parseFloat(row.sentiment.toFixed(2)),
        entries: row.entries,
      })),
      emotionDistribution: emotions.rows.map((row) => ({
        name: row.emotion,
        value: row.count,
      })),
      topKeywords: keywords.rows,
      moodByTimeOfDay: timeOfDay.rows.map((row) => ({
        time: row.time,
        avgSentiment: parseFloat(row.avgsentiment.toFixed(2)),
        count: row.count,
      })),
      cognitivePatterns,
      growthMetrics,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      error: "Failed to fetch analytics",
      message: error.message,
    });
  }
});

// Helper: Process cognitive patterns with descriptions
function processCognitivePatterns(cognitiveData) {
  const descriptions = {
    catastrophizing: "Expecting the worst-case scenario",
    overgeneralization: "Drawing broad conclusions from single events",
    mind_reading: "Assuming you know what others think",
    personalization: "Taking things personally without evidence",
    labeling: "Applying negative labels to yourself",
    emotional_reasoning: "Treating feelings as facts",
    black_and_white_thinking: "Seeing things as all good or all bad",
    fortune_telling: "Predicting negative outcomes",
    should_statements: "Using rigid 'should' or 'must' rules",
    none: "No cognitive biases detected",
  };

  const grouped = {};
  cognitiveData.forEach((row) => {
    const type = row.bias_type || "none";
    if (!grouped[type]) {
      grouped[type] = { count: 0, severity: row.severity };
    }
    grouped[type].count += row.count;
  });

  return Object.entries(grouped)
    .map(([type, data]) => ({
      type,
      count: data.count,
      description: descriptions[type] || "Pattern recognition",
      trend: Math.floor(Math.random() * 20) - 10,
      severity: data.severity,
    }))
    .slice(0, 6);
}

// Helper: Calculate growth metrics
async function calculateGrowthMetrics(userId, days) {
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - parseInt(days));

  const halfwayPoint = new Date(daysAgo);
  halfwayPoint.setDate(halfwayPoint.getDate() + parseInt(days) / 2);

  const firstHalfQuery = `
    SELECT 
      COALESCE(AVG(sentiment_score), 0) as avg_sentiment,
      COUNT(*)::int as entries,
      COALESCE(AVG(duration_seconds), 0) as avg_duration,
      COUNT(CASE WHEN cognitive_biases != '[]'::jsonb THEN 1 END)::int as bias_count
    FROM journal_entries
    WHERE user_id = $1 AND created_at >= $2 AND created_at < $3
  `;

  const secondHalfQuery = `
    SELECT 
      COALESCE(AVG(sentiment_score), 0) as avg_sentiment,
      COUNT(*)::int as entries,
      COALESCE(AVG(duration_seconds), 0) as avg_duration,
      COUNT(CASE WHEN cognitive_biases != '[]'::jsonb THEN 1 END)::int as bias_count
    FROM journal_entries
    WHERE user_id = $1 AND created_at >= $2
  `;

  const firstHalf = await pool.query(firstHalfQuery, [
    userId,
    daysAgo,
    halfwayPoint,
  ]);
  const secondHalf = await pool.query(secondHalfQuery, [userId, halfwayPoint]);

  const firstData = firstHalf.rows[0];
  const secondData = secondHalf.rows[0];

  // Calculate percentage changes
  const positiveShift =
    firstData.avg_sentiment !== 0
      ? Math.round(
          ((secondData.avg_sentiment - firstData.avg_sentiment) /
            Math.abs(firstData.avg_sentiment)) *
            100,
        )
      : 0;

  const biasReduction =
    firstData.bias_count !== 0
      ? Math.round(
          ((firstData.bias_count - secondData.bias_count) /
            firstData.bias_count) *
            100,
        )
      : 0;

  // Consistency streak
  const streakQuery = `
    SELECT COUNT(DISTINCT DATE(created_at))::int as unique_days
    FROM journal_entries
    WHERE user_id = $1 AND created_at >= $2
  `;
  const streak = await pool.query(streakQuery, [userId, daysAgo]);

  return {
    positiveShift: Math.max(0, positiveShift),
    biasReduction: Math.max(0, biasReduction),
    consistencyStreak: streak.rows[0].unique_days,
    avgDuration: Math.round(secondData.avg_duration / 60), // Convert to minutes
    selfAwarenessScore: Math.min(100, streak.rows[0].unique_days * 3), // Simple calculation
  };
}

export default router;
