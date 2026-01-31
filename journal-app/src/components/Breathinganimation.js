"use client";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";

export default function BreathingAnimation({
  visible = true,
  duration = 6,
  intensity = 0.8,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!visible || !mounted) return null;

  const maxOpacity = intensity;
  const minOpacity = intensity * 0.625;

  return (
    <>
      {/* Primary Breathing Circle */}
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "1200px",
          height: "1200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 182, 193, 0.6) 0%, rgba(255, 218, 185, 0.4) 30%, transparent 70%)",
          animation: `breathe ${duration}s ease-in-out infinite`,
          zIndex: 0,
          pointerEvents: "none",
          "@keyframes breathe": {
            "0%, 100%": {
              transform: "translate(-50%, -50%) scale(0.8)",
              opacity: minOpacity,
            },
            "50%": {
              transform: "translate(-50%, -50%) scale(1.2)",
              opacity: maxOpacity,
            },
          },
        }}
      />

      {/* Secondary Breathing Circle */}
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(221, 160, 221, 0.5) 0%, rgba(216, 191, 216, 0.3) 40%, transparent 70%)",
          animation: `breathe-secondary ${duration}s ease-in-out infinite`,
          animationDelay: "1s",
          zIndex: 0,
          pointerEvents: "none",
          "@keyframes breathe-secondary": {
            "0%, 100%": {
              transform: "translate(-50%, -50%) scale(0.9)",
              opacity: minOpacity * 0.8,
            },
            "50%": {
              transform: "translate(-50%, -50%) scale(1.3)",
              opacity: maxOpacity * 0.875,
            },
          },
        }}
      />

      {/* Inner Glow Circle */}
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 228, 196, 0.7) 0%, rgba(250, 235, 215, 0.4) 50%, transparent 80%)",
          animation: `breathe-glow ${duration}s ease-in-out infinite`,
          animationDelay: "2s",
          zIndex: 0,
          pointerEvents: "none",
          "@keyframes breathe-glow": {
            "0%, 100%": {
              transform: "translate(-50%, -50%) scale(0.7)",
              opacity: minOpacity * 1.2,
            },
            "50%": {
              transform: "translate(-50%, -50%) scale(1.4)",
              opacity: maxOpacity * 1.125,
            },
          },
        }}
      />
    </>
  );
}
