"use client";
import { motion } from "framer-motion";

const COLORS = [
  "#4299e1",
  "#ed8936",
  "#48bb78",
  "#f56565",
  "#ecc94b",
  "#38b2ac",
  "#e53e3e",
];

const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export default function FloatingBubble({ text, onClick, isFrozen }) {
  const size = randomBetween(80, 180);
  const duration = randomBetween(12, 20); // Float duration
  const delay = randomBetween(0, 8); // Random delay in seconds
  const left = randomBetween(5, 90);
  const color = COLORS[randomBetween(0, COLORS.length - 1)];

  return (
    <motion.div
      initial={{ y: `100vh`, opacity: 0 }}
      animate={isFrozen ? {} : { y: `-120vh`, opacity: 1 }}
      transition={{
        duration,
        delay,
        ease: [0.2, 0.0, 0.4, 1],
      }}
      onClick={onClick}
      data-bubble="true"
      style={{
        position: "fixed",
        bottom: 0,
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Atkinson Hyperlegible', sans-serif",
        fontSize: "0.95rem",
        fontWeight: "600",
        color: "#fff",
        boxShadow: isFrozen
          ? "0 8px 30px rgba(0, 0, 0, 0.3)"
          : "0 6px 20px rgba(0, 0, 0, 0.15)",
        pointerEvents: isFrozen ? "none" : "auto",
        cursor: isFrozen ? "default" : "pointer",
        zIndex: isFrozen ? 200 : 100,
        transform: isFrozen ? "scale(1.1)" : "scale(1)",
        transition: isFrozen
          ? "transform 0.3s ease, box-shadow 0.3s ease"
          : "none",
        border: isFrozen ? "3px solid #fff" : "none",
      }}
    >
      {text}
    </motion.div>
  );
}
