"use client";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import BreathingAnimation from "../Breathinganimation";

const bookStyles = {
  page: {
    position: "relative",
    background: "#fffef0",
    overflow: "auto",
    border: "2px solid #d4c5a9",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.2), inset -20px 0 30px rgba(0,0,0,0.08)",
    borderRadius: "12px",
  },
  margin: {
    position: "absolute",
    top: "5%",
    bottom: "5%",
    left: "50px",
    width: "2px",
    background: "rgba(220,160,160,0.5)",
    pointerEvents: "none",
  },
  shadow: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "60px",
    background: "linear-gradient(to right, rgba(0,0,0,0.15), transparent)",
    pointerEvents: "none",
  },
};

const galleryCards = [
  {
    id: 1,
    title: "Visualization",
    emoji: "📊",
    description: "Emotional heatmap & mood trends",
    route: "/gallery/visualization",
    color: "#8b7355",
  },
  {
    id: 2,
    title: "Personal Wiki",
    emoji: "📚",
    description: "Themes & recurring patterns",
    route: "/gallery/wiki",
    color: "#a89878",
  },
];

export default function GalleryLayout({ userId, userName }) {
  const router = useRouter();

  const handleCardClick = (route) => {
    router.push(`${route}?userId=${userId}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f5f5dc, #e8dcc0)",
        perspective: "1500px",
        position: "relative",
        p: 3,
      }}
    >
      <BreathingAnimation duration={8} intensity={0.6} />

      {/* Single Book Page */}
      <Box
        sx={{
          ...bookStyles.page,
          width: "100%",
          maxWidth: "900px",
          height: "85vh",
          maxHeight: "800px",
          p: 5,
          zIndex: 10,
        }}
      >
        {/* Left Margin Line */}
        <Box sx={bookStyles.margin} />

        {/* Left Shadow */}
        <Box sx={bookStyles.shadow} />

        {/* Content */}
        {/* Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Heading - Top Left */}
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 600,
              color: "#4a4a4a",
              textAlign: "left", // ✅ CHANGED: Left aligned
              mb: 4,
              fontSize: { xs: "2rem", md: "2.5rem" },
              textDecoration: "underline",
              textDecorationColor: "#d4c5a9",
              textUnderlineOffset: "12px",
              ml: 2, // ✅ ADDED: Left margin
            }}
          >
            Pattern Gallery
          </Typography>

          {/* Gallery Grid - Centered */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },
              gap: 3,
              maxWidth: "600px",
              margin: "auto", // ✅ CHANGED: Centers cards vertically and horizontally
            }}
          >
            {galleryCards.map((card) => (
              <Box
                key={card.id}
                onClick={() => handleCardClick(card.route)}
                sx={{
                  position: "relative",
                  aspectRatio: "1/1",
                  borderRadius: "12px",
                  border: `3px solid ${card.color}`,
                  background: `linear-gradient(135deg, ${card.color}15, ${card.color}05)`,
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                  "&:hover": {
                    transform: "scale(1.05) translateY(-5px)",
                    boxShadow: `0 12px 30px ${card.color}40`,
                    border: `3px solid ${card.color}`,
                    background: `linear-gradient(135deg, ${card.color}25, ${card.color}10)`,
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                {/* Emoji Icon */}
                <Typography
                  sx={{
                    fontSize: { xs: "4rem", md: "5rem" },
                    mb: 2,
                  }}
                >
                  {card.emoji}
                </Typography>

                {/* Title */}
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 600,
                    color: card.color,
                    fontSize: { xs: "1.3rem", md: "1.5rem" },
                    mb: 1,
                    textAlign: "center",
                  }}
                >
                  {card.title}
                </Typography>

                {/* Description */}
                <Typography
                  sx={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: { xs: "0.85rem", md: "0.95rem" },
                    color: "#6a6a6a",
                    textAlign: "center",
                    fontStyle: "italic",
                  }}
                >
                  {card.description}
                </Typography>

                {/* Hover Indicator */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 15,
                    right: 15,
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: card.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    ".MuiBox-root:hover &": {
                      opacity: 1,
                    },
                  }}
                >
                  <Typography sx={{ color: "#fff", fontSize: "1.2rem" }}>
                    →
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
