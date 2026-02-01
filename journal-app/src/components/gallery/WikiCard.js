"use client";
import { Box, Typography, Chip } from "@mui/material";

export default function WikiCard({ userId }) {
  // Placeholder themes - will fetch from API later
  const placeholderThemes = [
    {
      name: "Work",
      count: 12,
      color: "#8b7355",
      summary: "Recurring stress about deadlines and presentations",
    },
    {
      name: "Relationships",
      count: 8,
      color: "#a89878",
      summary: "Communication patterns with friends and family",
    },
    {
      name: "Self-Worth",
      count: 15,
      color: "#d4a574",
      summary: "Imposter syndrome and self-criticism themes",
    },
  ];

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflowY: "auto",
        pr: 2,
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#d4c5a9",
          borderRadius: "4px",
        },
      }}
    >
      {placeholderThemes.map((theme, index) => (
        <Box
          key={index}
          sx={{
            p: 3,
            borderRadius: "10px",
            border: `2px solid ${theme.color}30`,
            background: `${theme.color}10`,
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateX(10px)",
              boxShadow: `0 4px 15px ${theme.color}40`,
              border: `2px solid ${theme.color}`,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Courier New', monospace",
                fontWeight: 600,
                color: theme.color,
                fontSize: "1.3rem",
              }}
            >
              {theme.name}
            </Typography>
            <Chip
              label={`${theme.count} entries`}
              size="small"
              sx={{
                fontFamily: "'Courier New', monospace",
                backgroundColor: theme.color,
                color: "#fff",
                fontWeight: 600,
              }}
            />
          </Box>

          <Typography
            sx={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.9rem",
              color: "#6a6a6a",
              lineHeight: 1.6,
            }}
          >
            {theme.summary}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
