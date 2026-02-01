import { Box, Typography, CircularProgress } from "@mui/material";

export default function ProcessingDialog({ open }) {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 500,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fffef0",
          border: "3px solid #d4c5a9",
          borderRadius: "20px",
          padding: "50px 60px",
          maxWidth: "500px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <CircularProgress
          sx={{ color: "#8b7355", mb: 3 }}
          size={60}
          thickness={4}
        />
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Courier New', monospace",
            fontWeight: 600,
            color: "#4a4a4a",
            mb: 2,
          }}
        >
          ✨ AI is analyzing...
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: "'Courier New', monospace",
            color: "#8a8a8a",
            fontSize: "0.95rem",
            fontStyle: "italic",
            lineHeight: 1.7,
            maxWidth: 320,
          }}
        >
          We're identifying patterns, themes, and insights from your thoughts.
          This helps you understand yourself better.
        </Typography>
      </Box>
    </Box>
  );
}
