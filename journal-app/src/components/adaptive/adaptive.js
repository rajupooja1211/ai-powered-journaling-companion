"use client";
import { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter, useSearchParams } from "next/navigation";
import BreathingAnimation from "../Breathinganimation";

const cardData = [
  {
    title: "Pattern Gallery",
    color: "#8b7355",
    description:
      "Explore calming and reflective visual patterns to guide your thoughts.",
    mood: "Reflective",
    route: "/gallery",
  },
  {
    title: "Soft Start",
    color: "#a89878",
    description:
      "Gently ease into your day with breathing, gratitude, and self-kindness.",
    mood: "Overwhelmed",
    route: "/softstart",
  },
  {
    title: "Unload My Mind",
    color: "#d4a574",
    description:
      "Let go of mental clutter with voice-to-text and journaling prompts.",
    mood: "High Stress",
    route: "/unload",
  },
];

const bookStyles = {
  page: {
    flex: 1,
    position: "relative",
    background: "#fffef0",
    overflow: "hidden",
    border: "2px solid #d4c5a9",
    boxShadow:
      "-8px 8px 25px rgba(0,0,0,0.2), inset -30px 0 40px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease",
    p: "60px 50px",
  },
  lines: {
    position: "absolute",
    inset: 0,
    background:
      "repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(212,197,169,0.3) 31px, rgba(212,197,169,0.3) 32px)",
    pointerEvents: "none",
  },
  margin: {
    position: "absolute",
    top: "8%",
    bottom: "8%",
    width: "3px",
    background: "rgba(220,160,160,0.4)",
    pointerEvents: "none",
  },
  shadow: {
    position: "absolute",
    top: 0,
    height: "100%",
    width: "80px",
    pointerEvents: "none",
  },
};

export default function AdaptiveCards() {
  const searchParams = useSearchParams();
  const router = useRouter(); // ✅ ADD THIS
  const userId = searchParams.get("userId");

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [userName, setUserName] = useState(""); // ✅ ADD THIS

  // ✅ ADD THIS: Fetch user details when component loads
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:3001/api/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUserName(data.user.full_name);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          setUserName("Guest"); // Fallback
        });
    }
  }, [userId]);

  const handleNext = () => {
    if (selectedIndex === null) return;
    router.push(`${cardData[selectedIndex].route}?userId=${userId}`);
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #f5f5dc, #e8dcc0)",
          perspective: "1500px",
          position: "relative",
          p: 2,
        }}
      >
        <BreathingAnimation duration={7} intensity={0.7} />

        <Box
          sx={{
            display: "flex",
            width: "100%",
            maxWidth: "1200px",
            height: "85vh",
            maxHeight: "800px",
            gap: "25px",
            transformStyle: "preserve-3d",
            zIndex: 10,
          }}
        >
          {/* Left Page */}
          <Box
            sx={{
              ...bookStyles.page,
              borderRadius: "12px 0 0 12px",
              borderRight: "1px solid #d4c5a9",
              transform: "perspective(1500px) rotateY(3deg)",
              transformOrigin: "right center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              "&:hover": { transform: "perspective(1500px) rotateY(5deg)" },
            }}
          >
            <Box sx={bookStyles.lines} />
            <Box sx={{ ...bookStyles.margin, left: "50px" }} />
            <Box
              sx={{
                ...bookStyles.shadow,
                right: 0,
                background:
                  "linear-gradient(to left, rgba(0,0,0,0.25), transparent)",
              }}
            />

            <Box sx={{ zIndex: 1, textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "'Courier New', monospace",
                  fontWeight: 400,
                  color: "#4a4a4a",
                  fontSize: "2.8rem",
                  letterSpacing: "1px",
                  mb: 3,
                }}
              >
                Hello, {userName || "Guest"}!
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Courier New', monospace",
                  color: "#6a6a6a",
                  fontSize: "1.3rem",
                  lineHeight: 1.8,
                  mb: 5,
                }}
              >
                I hope you're well.
              </Typography>

              <Box
                sx={{
                  width: "80px",
                  height: "3px",
                  background: "#d4c5a9",
                  m: "30px auto",
                }}
              />

              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Courier New', monospace",
                  color: "#7a7a7a",
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  lineHeight: 1.8,
                }}
              >
                "Take a moment, breathe,
                <br />
                and choose your path
                <br />
                for today's reflection."
              </Typography>
            </Box>
          </Box>

          {/* Right Page */}
          <Box
            sx={{
              ...bookStyles.page,
              borderRadius: "0 12px 12px 0",
              borderLeft: "1px solid #d4c5a9",
              boxShadow:
                "8px 8px 25px rgba(0,0,0,0.2), inset 30px 0 40px rgba(0,0,0,0.08)",
              transform: "perspective(1500px) rotateY(-3deg)",
              transformOrigin: "left center",
              "&:hover": { transform: "perspective(1500px) rotateY(-5deg)" },
            }}
          >
            <Box sx={bookStyles.lines} />
            <Box sx={{ ...bookStyles.margin, right: "50px" }} />
            <Box
              sx={{
                ...bookStyles.shadow,
                left: 0,
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.25), transparent)",
              }}
            />

            <Box sx={{ zIndex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "'Courier New', monospace",
                  fontWeight: 600,
                  color: "#4a4a4a",
                  fontSize: "2rem",
                  textAlign: "center",
                  textDecoration: "underline",
                  textDecorationColor: "#d4c5a9",
                  textUnderlineOffset: "8px",
                  mb: 4,
                }}
              >
                Choose Your Path
              </Typography>

              <Box sx={{ mt: 5 }}>
                {cardData.map((card, index) => (
                  <Box
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    sx={{
                      mb: 4,
                      p: "20px",
                      borderRadius: "8px",
                      border:
                        selectedIndex === index
                          ? `3px solid ${card.color}`
                          : "2px solid transparent",
                      background:
                        selectedIndex === index
                          ? `${card.color}10`
                          : "transparent",
                      cursor: "pointer",
                      position: "relative",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: `${card.color}15`,
                        border: `2px solid ${card.color}`,
                        transform: "translateX(10px)",
                        boxShadow: `0 4px 15px ${card.color}30`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        left: "-15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        background:
                          selectedIndex === index ? card.color : "#d4c5a9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Courier New', monospace",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        transition: "background 0.3s ease",
                      }}
                    >
                      {index + 1}
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Courier New', monospace",
                        fontWeight: 600,
                        color: card.color,
                        fontSize: "1.4rem",
                        mb: 1,
                      }}
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Courier New', monospace",
                        color: "#7a7a7a",
                        fontSize: "0.95rem",
                        fontStyle: "italic",
                        mb: 1,
                      }}
                    >
                      For when you're feeling: {card.mood}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Courier New', monospace",
                        color: "#6a6a6a",
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {card.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        <IconButton
          onClick={handleNext}
          disabled={selectedIndex === null}
          sx={{
            position: "fixed",
            bottom: 40,
            right: 40,
            zIndex: 20,
            width: 70,
            height: 70,
            backgroundColor: selectedIndex !== null ? "#8b7355" : "#ccc",
            color: "#fff",
            transition: "all 0.4s ease",
            boxShadow:
              selectedIndex !== null
                ? "0 6px 25px rgba(139,115,85,0.4)"
                : "none",
            "&:hover": {
              backgroundColor: selectedIndex !== null ? "#6b5335" : "#ccc",
              transform:
                selectedIndex !== null
                  ? "scale(1.15) translateY(-3px)"
                  : "none",
              boxShadow:
                selectedIndex !== null
                  ? "0 8px 35px rgba(139,115,85,0.6)"
                  : "none",
            },
            "&:active": {
              transform: selectedIndex !== null ? "scale(1.05)" : "none",
            },
            "&:disabled": {
              backgroundColor: "#ccc",
              color: "#999",
            },
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: "1.8rem" }} />
        </IconButton>
      </Box>
    </div>
  );
}
