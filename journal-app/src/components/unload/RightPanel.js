"use client";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import FloatingActionPanel from "./FloatingActionPanel";

export default function RightPanel({
  isRecording,
  showEndOptions,
  transcript,
  handleShowMenu,
  showOptions,
  handleNewEntry,
  isProcessingAI,
  aiResults,
  isResetting,
}) {
  if (isResetting) {
    return (
      <Box
        sx={{
          flex: 1,
          background: "rgba(255, 254, 240, 0.95)",
          borderRadius: "20px",
          border: "2px solid #d4c5a9",
        }}
      />
    );
  }

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
      {isProcessingAI ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
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
            Processing your thoughts...
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Courier New', monospace",
              color: "#8a8a8a",
              fontSize: "1rem",
              fontStyle: "italic",
              maxWidth: 400,
              lineHeight: 1.7,
            }}
          >
            Our AI is analyzing your journal entry to identify themes, patterns,
            and cognitive biases.
          </Typography>
        </Box>
      ) : !isRecording && !showEndOptions ? (
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
        </>
      ) : showOptions && aiResults ? (
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            pr: 1,
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "#d4c5a9",
              borderRadius: "3px",
            },
          }}
        >
          {aiResults.cognitive_biases?.length > 0 && (
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
                variant="caption"
                sx={{
                  fontFamily: "'Courier New', monospace",
                  color: "#8a8a8a",
                  fontSize: "0.75rem",
                  mb: 2,
                  display: "block",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Cognitive Patterns
              </Typography>
              {aiResults.cognitive_biases.map((bias, idx) => (
                <Box
                  key={idx}
                  sx={{
                    mb: idx < aiResults.cognitive_biases.length - 1 ? 2 : 0,
                    p: 2,
                    background: "rgba(255, 255, 255, 0.5)",
                    borderRadius: "8px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      color: "#484747",
                      fontStyle: "italic",
                      fontWeight: 500,
                    }}
                  >
                    {bias.mirror}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
          {aiResults.summary && (
            <Box
              sx={{
                mb: 3,
                p: 3,
                background: "rgba(139, 115, 85, 0.08)",
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
                  mb: 1.5,
                  display: "block",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Summary
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  color: "#4a4a4a",
                  fontWeight: 500,
                }}
              >
                {aiResults.summary}
              </Typography>
            </Box>
          )}

          {aiResults.themes?.length > 0 && (
            <Box
              sx={{
                mb: 3,
                p: 3,
                background: "rgba(255, 255, 255, 0.5)",
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
                  fontWeight: 600,
                }}
              >
                Key Words
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {aiResults.themes.map((theme, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      px: 2,
                      py: 0.5,
                      background: "#8b7355",
                      color: "#fff",
                      borderRadius: "20px",
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    {theme}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {aiResults.tags?.length > 0 && (
            <Box
              sx={{
                mb: 3,
                p: 2.5,
                background: "rgba(139, 115, 85, 0.05)",
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
                  fontWeight: 600,
                }}
              >
                Tags
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {aiResults.tags.map((tag, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      px: 2,
                      py: 0.5,
                      background: "#d4c5a9",
                      color: "#4a4a4a",
                      borderRadius: "20px",
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        <>
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
          <Button
            fullWidth
            variant="contained"
            onClick={handleShowMenu}
            disabled={!transcript.trim()}
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
              "&:disabled": { backgroundColor: "#d4c5a9", color: "#fff" },
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
