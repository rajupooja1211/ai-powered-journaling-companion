"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ThursdayCalendar from "../calendar/ThursdayCalendar";
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

export default function VisualizationView() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const router = useRouter();

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);

  const handleWeekSelect = (weekData) => {
    setSelectedWeek(weekData);
    setShowCalendar(false);
  };

  // Get current week by default
  const getCurrentWeek = () => {
    const now = new Date();
    return {
      weekNumber: Math.ceil(now.getDate() / 7),
      startDate: "Jan 25",
      endDate: "Jan 31",
      totalEntries: 5,
      avgMood: 0.6,
      topThemes: ["Work", "Self-Worth"],
    };
  };

  const weekData = selectedWeek || getCurrentWeek();

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

      {/* Back Button */}
      <IconButton
        onClick={() => router.push(`/gallery?userId=${userId}`)}
        sx={{
          position: "fixed",
          top: 30,
          left: 30,
          zIndex: 100,
          width: 50,
          height: 50,
          backgroundColor: "#8b7355",
          color: "#fff",
          "&:hover": { backgroundColor: "#6b5335" },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Calendar Icon - Top Right */}
      <Tooltip title="View Calendar">
        <IconButton
          onClick={() => setShowCalendar(!showCalendar)}
          sx={{
            position: "fixed",
            top: 30,
            right: 30,
            zIndex: 100,
            width: 50,
            height: 50,
            backgroundColor: "#8b7355",
            color: "#fff",
            "&:hover": { backgroundColor: "#6b5335" },
          }}
        >
          <CalendarTodayIcon />
        </IconButton>
      </Tooltip>

      {/* Main Content Page */}
      <Box
        sx={{
          ...bookStyles.page,
          width: "100%",
          maxWidth: "900px",
          minHeight: "85vh",
          p: 5,
          zIndex: 10,
        }}
      >
        <Box sx={bookStyles.margin} />
        <Box sx={bookStyles.shadow} />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 600,
              color: "#4a4a4a",
              mb: 1,
              textAlign: "left",
              ml: 2,
            }}
          >
            📊 Emotional Visualization
          </Typography>

          <Typography
            sx={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.9rem",
              color: "#8b7355",
              mb: 4,
              ml: 2,
            }}
          >
            Week of {weekData.startDate} - {weekData.endDate}
          </Typography>

          {/* Weekly Content */}
          <Box
            sx={{
              p: 3,
              borderRadius: "12px",
              border: "2px solid #d4c5a9",
              background: "#fff",
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Courier New', monospace",
                fontWeight: 600,
                color: "#8b7355",
                mb: 3,
              }}
            >
              📈 This Week's Overview
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: "8px",
                  background: "#f5f5f5",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.95rem",
                    color: "#4a4a4a",
                  }}
                >
                  <strong>Total Entries:</strong> {weekData.totalEntries}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: "8px",
                  background: "#f5f5f5",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.95rem",
                    color: "#4a4a4a",
                  }}
                >
                  <strong>Average Mood:</strong>{" "}
                  {weekData.avgMood > 0.3
                    ? "🟢 Positive"
                    : weekData.avgMood < -0.3
                      ? "🔴 Negative"
                      : "🟠 Neutral"}{" "}
                  ({weekData.avgMood.toFixed(1)})
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: "8px",
                  background: "#f5f5f5",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.95rem",
                    color: "#4a4a4a",
                  }}
                >
                  <strong>Top Themes:</strong> {weekData.topThemes.join(", ")}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Mood Trends Chart Placeholder */}
          <Box
            sx={{
              p: 4,
              borderRadius: "12px",
              border: "2px dashed #d4c5a9",
              background: "#fafafa",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Courier New', monospace",
                fontSize: "1.1rem",
                color: "#6a6a6a",
                fontStyle: "italic",
              }}
            >
              📊 Mood Trend Chart
              <br />
              <span style={{ fontSize: "0.85rem" }}>
                (Daily sentiment visualization will appear here)
              </span>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Calendar Popup */}
      {showCalendar && (
        <ThursdayCalendar
          userId={userId}
          onClose={() => setShowCalendar(false)}
          onWeekSelect={handleWeekSelect}
        />
      )}
    </Box>
  );
}
