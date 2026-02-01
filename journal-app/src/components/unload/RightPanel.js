// RightPanel.jsx
import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import FloatingActionPanel from "./FloatingActionPanel";

export default function RightPanel({
  isRecording,
  showEndOptions,
  transcript,
  keywords,
  cognitiveNudge,
  handleShowMenu,
  showOptions,
  handleNewEntry,
}) {
  return (
    <Box
      sx={{
        flex: 1,
        background: "rgba(255, 254, 240, 0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
        border: "2px solid #d4c5a9",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        p: 4,
      }}
    >
      {!isRecording && !showEndOptions ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Courier New', monospace",
              color: "#8a8a8a",
              fontSize: "1rem",
              lineHeight: 1.8,
              fontStyle: "italic",
            }}
          >
            "Sometimes you just need to let it all out. No judgment, no
            filter—just you and your thoughts."
          </Typography>
        </Box>
      ) : isRecording ? (
        <>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 600,
              color: "#4a4a4a",
              mb: 3,
            }}
          >
            Live Transcript
          </Typography>
          <Box
            sx={{
              flex: 1,
              p: 3,
              background: "rgba(255, 255, 255, 0.5)",
              borderRadius: "12px",
              border: "1px solid #d4c5a9",
              overflowY: "auto",
              mb: 3,
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
                fontSize: "1rem",
                lineHeight: 2,
                color: "#4a4a4a",
              }}
            >
              {transcript || (
                <span style={{ color: "#aaa", fontStyle: "italic" }}>
                  Listening...
                </span>
              )}
            </Typography>
          </Box>
          {keywords.length > 0 && (
            <Box
              sx={{
                p: 2,
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
                  mb: 1,
                  display: "block",
                  textTransform: "uppercase",
                }}
              >
                Key Themes
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {keywords.map((keyword, index) => (
                  <Box
                    key={index}
                    sx={{
                      px: 2,
                      py: 0.5,
                      background: "#8b7355",
                      color: "#fff",
                      borderRadius: "20px",
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    #{keyword}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </>
      ) : (
        <>
          {cognitiveNudge && (
            <Box
              sx={{
                mb: 3,
                p: 3,
                background: "rgba(212, 165, 116, 0.08)",
                borderRadius: "12px",
                border: "1px solid #d4a574",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.95rem",
                  color: "#6a6a6a",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                }}
              >
                💭 {cognitiveNudge.suggestion}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              flex: 1,
              mb: 3,
              p: 3,
              background: "rgba(255, 255, 255, 0.5)",
              borderRadius: "12px",
              border: "1px solid #d4c5a9",
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": {
                background: "#d4c5a9",
                borderRadius: "3px",
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'Courier New', monospace",
                color: "#8a8a8a",
                fontSize: "0.75rem",
                mb: 2,
                display: "block",
              }}
            >
              YOUR THOUGHTS:
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.95rem",
                lineHeight: 1.8,
                color: "#4a4a4a",
              }}
            >
              {transcript}
            </Typography>
          </Box>
          {keywords.length > 0 && (
            <Box
              sx={{
                mb: 3,
                p: 2.5,
                background: "rgba(212, 165, 116, 0.08)",
                borderRadius: "12px",
                border: "2px solid #d4c5a9",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "'Courier New', monospace",
                  color: "#8a8a8a",
                  fontSize: "0.75rem",
                  mb: 1,
                  display: "block",
                  textTransform: "uppercase",
                }}
              >
                Key Themes
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {keywords.map((keyword, index) => (
                  <Box
                    key={index}
                    sx={{
                      px: 2,
                      py: 0.5,
                      background: "#8b7355",
                      color: "#fff",
                      borderRadius: "20px",
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    #{keyword}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          <Button
            fullWidth
            variant="contained"
            onClick={handleShowMenu}
            sx={{
              fontFamily: "'Courier New', monospace",
              fontSize: "1.1rem",
              fontWeight: 600,
              textTransform: "none",
              backgroundColor: "#8b7355",
              color: "#fff",
              p: "14px",
              borderRadius: "12px",
              "&:hover": { backgroundColor: "#6b5335" },
            }}
          >
            Continue
          </Button>
        </>
      )}
      {showOptions && <FloatingActionPanel onNewEntry={handleNewEntry} />}
    </Box>
  );
}
