"use client";
import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import BreathingAnimation from "../Breathinganimation";
import PageTransition from "../Pagetransition";

export default function EntryScreen({ name, setStep }) {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);

  const handleRelease = () => {
    setIsRecording(false);
    setStep("recording");
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
        <BreathingAnimation duration={7} intensity={0.6} />

        <IconButton
          onClick={() => router.back()}
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
            maxWidth: 550,
            width: "90%",
            p: 6,
            textAlign: "center",
            background: "rgba(255, 254, 240, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            border: "2px solid #d4c5a9",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            zIndex: 10,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 600,
              color: "#4a4a4a",
              mb: 2,
            }}
          >
            Unload Your Mind
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Courier New', monospace",
              color: "#6a6a6a",
              fontSize: "1.1rem",
              lineHeight: 1.8,
              mb: 4,
            }}
          >
            Sometimes you just need to let it all out. Press and hold the button
            below, speak for up to 2 minutes, and release when you're done.
          </Typography>

          <Box
            sx={{
              width: "80px",
              height: "2px",
              background: "#d4c5a9",
              margin: "0 auto 40px",
            }}
          />

          <Box
            onMouseDown={() => setIsRecording(true)}
            onMouseUp={handleRelease}
            onTouchStart={() => setIsRecording(true)}
            onTouchEnd={handleRelease}
            sx={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: isRecording
                ? "linear-gradient(135deg, #d4a574, #c49464)"
                : "linear-gradient(135deg, #8b7355, #7a6345)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: isRecording
                ? "0 0 40px rgba(212, 165, 116, 0.6), 0 8px 30px rgba(0,0,0,0.3)"
                : "0 8px 25px rgba(0,0,0,0.25)",
              transform: isRecording ? "scale(1.1)" : "scale(1)",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 10px 35px rgba(0,0,0,0.3)",
              },
            }}
          >
            <MicIcon
              sx={{
                fontSize: "4rem",
                color: "#fff",
                animation: isRecording
                  ? "pulse 1.5s ease-in-out infinite"
                  : "none",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.6 },
                },
              }}
            />
          </Box>

          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Courier New', monospace",
              color: "#8a8a8a",
              fontSize: "0.95rem",
              mt: 3,
              fontStyle: "italic",
            }}
          >
            {isRecording
              ? "Recording... Release when done"
              : "Press & Hold to Speak"}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              fontFamily: "'Courier New', monospace",
              color: "#aaa",
              fontSize: "0.85rem",
              display: "block",
              mt: 1,
            }}
          >
            Maximum 2 minutes
          </Typography>
        </Box>
      </Box>
    </PageTransition>
  );
}
