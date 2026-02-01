"use client";
import { Box, Typography } from "@mui/material";

export default function VisualizationCard({ userId, userName }) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Emotional Heatmap Placeholder */}
      <Box
        sx={{
          flex: 1,
          borderRadius: "12px",
          border: "2px dashed #d4c5a9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(212,197,169,0.1)",
          p: 3,
          transition: "all 0.3s ease",
          "&:hover": {
            border: "2px solid #8b7355",
            background: "rgba(139,115,85,0.1)",
            transform: "scale(1.02)",
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Courier New', monospace",
            fontSize: "1.2rem",
            color: "#7a7a7a",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          📊 Emotional Heatmap
          <br />
          <span style={{ fontSize: "0.9rem" }}>
            (Charts showing mood trends over time)
          </span>
        </Typography>
      </Box>

      {/* Mood & Activity Map Placeholder */}
      <Box
        sx={{
          flex: 1,
          borderRadius: "12px",
          border: "2px dashed #d4c5a9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(212,197,169,0.1)",
          p: 3,
          transition: "all 0.3s ease",
          "&:hover": {
            border: "2px solid #a89878",
            background: "rgba(168,152,120,0.1)",
            transform: "scale(1.02)",
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Courier New', monospace",
            fontSize: "1.2rem",
            color: "#7a7a7a",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          📈 Mood & Activity Correlations
          <br />
          <span style={{ fontSize: "0.9rem" }}>
            ("Anxiety peaks 2 hours after caffeine")
          </span>
        </Typography>
      </Box>
    </Box>
  );
}
