"use client";
import { useState, useEffect, useRef } from "react";
import { Box, Typography, IconButton, Switch, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StopIcon from "@mui/icons-material/Stop";
import BreathingAnimation from "../Breathinganimation";
import PageTransition from "../Pagetransition";

export default function RecordingScreen({ name, setStep }) {
  const [timeLeft, setTimeLeft] = useState(120);
  const [transcript, setTranscript] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [actionPlanMode, setActionPlanMode] = useState(false);
  const [detectedMode, setDetectedMode] = useState("Listening");
  const [cognitiveNudge, setCognitiveNudge] = useState(null);
  const [showActionToggle, setShowActionToggle] = useState(false);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleStop();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Simulated transcription with real-time effects
  useEffect(() => {
    const phrases = [
      { text: "The launch was a disaster", delay: 3000, keywords: ["Launch"] },
      {
        text: "Everything went wrong",
        delay: 6000,
        keywords: ["Self-Doubt"],
        hasCognitive: true,
      },
      {
        text: "I'm not cut out for this",
        delay: 9000,
        keywords: ["Self-Doubt"],
      },
      {
        text: "I always mess up when stakes are high",
        delay: 12000,
        keywords: [],
        hasCognitive: true,
      },
      {
        text: "The client email was a mess",
        delay: 15000,
        keywords: ["Client", "Email"],
        showToggle: true,
      },
      {
        text: "The team didn't communicate well",
        delay: 18000,
        keywords: ["Team"],
      },
    ];

    phrases.forEach(
      ({ text, delay, keywords: newKeywords, hasCognitive, showToggle }) => {
        setTimeout(() => {
          setTranscript((prev) => prev + " " + text + ".");

          // Add keywords
          if (newKeywords.length > 0) {
            setKeywords((prev) => [...new Set([...prev, ...newKeywords])]);
          }

          // Show cognitive nudge
          if (hasCognitive) {
            if (text.includes("always")) {
              setCognitiveNudge({
                type: "Catastrophizing",
                suggestion: `${name}, you used "always." Is this really true every time, or was today just particularly tough?`,
              });
              setTimeout(() => setCognitiveNudge(null), 8000); // Hide after 8s
            } else if (text.includes("Everything")) {
              setCognitiveNudge({
                type: "All-or-Nothing Thinking",
                suggestion: `${name}, "everything" is a strong word. What specifically went wrong?`,
              });
              setTimeout(() => setCognitiveNudge(null), 8000);
            }
          }

          // Show action toggle
          if (showToggle) {
            setShowActionToggle(true);
          }

          // Detect venting mode
          if (text.includes("disaster") || text.includes("mess")) {
            setDetectedMode("Venting");
          }
        }, delay);
      },
    );
  }, [name]);

  const handleStop = () => {
    setStep("echo");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <PageTransition>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #f5f5dc, #e8dcc0)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          p: 2,
        }}
      >
        <BreathingAnimation duration={7} intensity={0.4} />

        <IconButton
          onClick={() => setStep("entry")}
          sx={{
            position: "fixed",
            top: 20,
            left: 20,
            zIndex: 20,
            backgroundColor: "rgba(255, 254, 240, 0.9)",
            border: "2px solid #d4c5a9",
            "&:hover": { backgroundColor: "#fffef0" },
          }}
        >
          <ArrowBackIcon sx={{ color: "#8b7355" }} />
        </IconButton>

        <Box
          sx={{
            maxWidth: 800,
            width: "90%",
            minHeight: "75vh",
            p: 5,
            background: "rgba(255, 254, 240, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            border: "2px solid #d4c5a9",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Courier New', monospace",
                  fontWeight: 600,
                  color: "#4a4a4a",
                  mb: 0.5,
                }}
              >
                {detectedMode}...
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "'Courier New', monospace",
                  color: "#8a8a8a",
                  fontSize: "0.9rem",
                }}
              >
                {detectedMode === "Venting"
                  ? "Emotional Release Mode"
                  : "Active Listening"}
              </Typography>
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Courier New', monospace",
                fontWeight: 700,
                color: timeLeft <= 30 ? "#d4a574" : "#8b7355",
              }}
            >
              {formatTime(timeLeft)}
            </Typography>
          </Box>

          {/* Simple Audio Indicator */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            {[...Array(5)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 8,
                  height: 40 + i * 10,
                  background: "#8b7355",
                  borderRadius: "4px",
                  animation: `wave 1.2s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                  "@keyframes wave": {
                    "0%, 100%": { height: `${40 + i * 10}px`, opacity: 0.5 },
                    "50%": { height: `${60 + i * 15}px`, opacity: 1 },
                  },
                }}
              />
            ))}
          </Box>

          {/* Live Transcript */}
          <Box
            sx={{
              flex: 1,
              mb: 3,
              p: 4,
              background: "rgba(255, 255, 255, 0.5)",
              borderRadius: "16px",
              border: "1px solid #d4c5a9",
              overflowY: "auto",
              minHeight: 200,
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": {
                background: "#d4c5a9",
                borderRadius: "3px",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Courier New', monospace",
                fontSize: "1.1rem",
                lineHeight: 2,
                color: "#4a4a4a",
              }}
            >
              {transcript ? (
                transcript.split(" ").map((word, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor:
                        word.toLowerCase().includes("always") ||
                        word.toLowerCase().includes("never") ||
                        word.toLowerCase().includes("everything")
                          ? "rgba(212, 165, 116, 0.4)"
                          : "transparent",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {word}{" "}
                  </span>
                ))
              ) : (
                <span style={{ color: "#aaa", fontStyle: "italic" }}>
                  Start speaking...
                </span>
              )}
            </Typography>
          </Box>

          {/* Cognitive Nudge (appears dynamically) */}
          {cognitiveNudge && (
            <Box
              sx={{
                mb: 3,
                p: 3,
                background: "rgba(212, 165, 116, 0.12)",
                borderRadius: "12px",
                border: "2px solid #d4a574",
                animation: "fadeSlideIn 0.5s ease-out",
                "@keyframes fadeSlideIn": {
                  from: { opacity: 0, transform: "translateY(15px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.8rem",
                  color: "#d4a574",
                  fontWeight: 700,
                  mb: 1,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                💡 {cognitiveNudge.type}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "1rem",
                  color: "#4a4a4a",
                  lineHeight: 1.7,
                }}
              >
                {cognitiveNudge.suggestion}
              </Typography>
            </Box>
          )}

          {/* Keywords (appears as detected) */}
          {keywords.length > 0 && (
            <Box
              sx={{
                mb: 3,
                p: 2.5,
                background: "rgba(255, 255, 255, 0.4)",
                borderRadius: "12px",
                border: "1px solid #d4c5a9",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "'Courier New', monospace",
                  color: "#8a8a8a",
                  fontSize: "0.75rem",
                  mb: 1.5,
                  display: "block",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Key Themes
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {keywords.map((keyword, index) => (
                  <Box
                    key={index}
                    sx={{
                      px: 2.5,
                      py: 0.7,
                      background: "#8b7355",
                      color: "#fff",
                      borderRadius: "20px",
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      animation: "popIn 0.4s ease-out",
                      "@keyframes popIn": {
                        from: { opacity: 0, transform: "scale(0.7)" },
                        to: { opacity: 1, transform: "scale(1)" },
                      },
                    }}
                  >
                    #{keyword}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Action Toggle (appears after keywords detected) */}
          {showActionToggle && (
            <Box
              sx={{
                mb: 3,
                p: 2.5,
                background: "rgba(212, 165, 116, 0.08)",
                borderRadius: "12px",
                border: "2px solid #d4c5a9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                animation: "fadeSlideIn 0.5s ease-out",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 600,
                    color: "#4a4a4a",
                    fontSize: "1rem",
                    mb: 0.5,
                  }}
                >
                  Convert to Action Plan?
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Courier New', monospace",
                    color: "#6a6a6a",
                    fontSize: "0.85rem",
                  }}
                >
                  Generate decision grid after recording
                </Typography>
              </Box>

              <Switch
                checked={actionPlanMode}
                onChange={(e) => setActionPlanMode(e.target.checked)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#8b7355" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#8b7355",
                  },
                }}
              />
            </Box>
          )}

          {/* Stop Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleStop}
            startIcon={<StopIcon />}
            sx={{
              fontFamily: "'Courier New', monospace",
              fontSize: "1.1rem",
              fontWeight: 600,
              textTransform: "none",
              backgroundColor: "#8b7355",
              color: "#fff",
              p: "16px",
              borderRadius: "12px",
              "&:hover": { backgroundColor: "#6b5335" },
            }}
          >
            Stop & Continue
          </Button>
        </Box>
      </Box>
    </PageTransition>
  );
}
