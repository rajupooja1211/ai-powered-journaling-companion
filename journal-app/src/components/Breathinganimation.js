"use client";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";

export default function MentalHealthBreathing({
  visible = true,
  duration = 12, // Slow, meditative pace
  intensity = 0.4, // Subtlety is key for focus
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!visible || !mounted) return null;

  const groundingMotion = {
    "0%": {
      transform: "translate(-15%, -50%) scale(1)",
      filter: "blur(100px)",
      opacity: 0.5,
    },
    "50%": {
      transform: "translate(10%, -48%) scale(1.15)",
      filter: "blur(80px)",
      opacity: 0.8,
    },
    "100%": {
      transform: "translate(-15%, -50%) scale(1)",
      filter: "blur(100px)",
      opacity: 0.5,
    },
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        backgroundColor: "#F4F1EA", // Soft parchment/linen color
        pointerEvents: "none",
      }}
    >
      {/* Deep Sage Green - Represents Growth & Tranquility */}
      <Box
        sx={{
          position: "absolute",
          top: "35%",
          left: "20%",
          width: "80vw",
          height: "80vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #2b6e25 0%, rgb(34, 65, 31) 70%)",
          animation: `grounding ${duration}s ease-in-out infinite`,
          mixBlendMode: "multiply",
          "@keyframes grounding": groundingMotion,
        }}
      />

      {/* Muted Copper Orange - Represents Warmth & Emotional Safety */}
      <Box
        sx={{
          position: "absolute",
          top: "55%",
          left: "40%",
          width: "85vw",
          height: "85vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #bf6e4d 0%, rgba(198, 142, 119, 0) 70%)",
          animation: `grounding ${duration * 1.2}s ease-in-out infinite`,
          animationDelay: "-2s",
          mixBlendMode: "multiply",
          "@keyframes grounding": groundingMotion,
        }}
      />

      {/* Earthy Taupe Brown - Represents Stability & Grounding */}
      <Box
        sx={{
          position: "absolute",
          top: "45%",
          left: "60%",
          width: "70vw",
          height: "70vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #A89F91 0%, rgba(168, 159, 145, 0) 70%)",
          animation: `grounding ${duration * 0.9}s ease-in-out infinite`,
          animationDelay: "-5s",
          mixBlendMode: "multiply",
          "@keyframes grounding": groundingMotion,
        }}
      />

      {/* Soft Light Overlay to blend everything */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, transparent 0%, rgba(244, 241, 234, 0.4) 100%)",
        }}
      />
    </Box>
  );
}
