// LeftPanel.jsx
import { Box, Typography, Button } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";

export default function LeftPanel({
  name,
  isRecording,
  showEndOptions,
  loadingAnalysis,
  recordingDuration,
  detectedEmotion,
  handleStop,
  handleContinueTalking,
}) {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDurationText = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} second${secs !== 1 ? "s" : ""}`;
    if (secs === 0) return `${mins} minute${mins !== 1 ? "s" : ""}`;
    return `${mins} minute${mins !== 1 ? "s" : ""} and ${secs} second${
      secs !== 1 ? "s" : ""
    }`;
  };

  const getEmotionDisplay = () => {
    const emotions = {
      angry: "angrily",
      sad: "sadly",
      frustrated: "in a frustrated way",
      doubtful: "with doubt",
      disappointed: "with disappointment",
      happy: "happily",
      excited: "excitedly",
      worried: "worriedly",
      neutral: "calmly",
    };
    return emotions[detectedEmotion] || "thoughtfully";
  };

  const getEmotionEmoji = () => {
    const emojis = {
      angry: "😤",
      sad: "😔",
      frustrated: "😣",
      doubtful: "🤔",
      disappointed: "😞",
      happy: "😊",
      excited: "😃",
      worried: "😟",
      neutral: "😌",
    };
    return emojis[detectedEmotion] || "💭";
  };

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
        justifyContent: "center",
        alignItems: "center",
        p: 5,
        textAlign: "center",
      }}
    >
      {!isRecording && !showEndOptions && !loadingAnalysis ? (
        // Initial State
        <>
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
              fontSize: "1rem",
              lineHeight: 1.8,
              mb: 4,
              maxWidth: 350,
            }}
          >
            Take as long as you need. Press the button and speak freely. I'll
            listen until you're done or until there's silence for a while.
          </Typography>
          <Box
            sx={{
              width: "60px",
              height: "2px",
              background: "#d4c5a9",
              margin: "0 auto 40px",
            }}
          />
          <Box
            onClick={handleContinueTalking}
            sx={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8b7355, #7a6345)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 10px 35px rgba(0,0,0,0.3)",
              },
            }}
          >
            <MicIcon sx={{ fontSize: "3.5rem", color: "#fff" }} />
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Courier New', monospace",
              color: "#8a8a8a",
              fontSize: "0.9rem",
              mt: 3,
            }}
          >
            Tap to Start
          </Typography>
        </>
      ) : loadingAnalysis ? (
        // Loading State
        <>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 600,
              color: "#4a4a4a",
              mb: 2,
            }}
          >
            Analyzing your thoughts...
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Courier New', monospace",
              color: "#8a8a8a",
              fontSize: "0.9rem",
              fontStyle: "italic",
            }}
          >
            Sit tight, we’re summarizing what you shared.
          </Typography>
        </>
      ) : isRecording ? (
        // Recording State
        <>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 600,
              color: "#4a4a4a",
              mb: 1,
            }}
          >
            Listening...
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 700,
              color: "#8b7355",
              mb: 2,
              mt: 4,
            }}
          >
            {formatDuration(recordingDuration)}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "'Courier New', monospace",
              color: "#8a8a8a",
              fontSize: "0.85rem",
              mb: 4,
              fontStyle: "italic",
            }}
          >
            Take your time...
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 5 }}
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
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleStop(false)}
            startIcon={<StopIcon />}
            sx={{
              fontFamily: "'Courier New', monospace",
              fontSize: "1.1rem",
              fontWeight: 600,
              textTransform: "none",
              backgroundColor: "#8b7355",
              color: "#fff",
              p: "14px",
              borderRadius: "12px",
              maxWidth: 250,
              "&:hover": { backgroundColor: "#6b5335" },
            }}
          >
            Stop Recording
          </Button>
        </>
      ) : (
        // Completed Summary
        <>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 600,
              color: "#4a4a4a",
              mb: 2,
            }}
          >
            {getEmotionEmoji()}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 600,
              color: "#4a4a4a",
              mb: 3,
            }}
          >
            Thanks, {name}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Courier New', monospace",
              color: "#6a6a6a",
              fontSize: "1rem",
              lineHeight: 1.8,
              mb: 2,
              maxWidth: 350,
            }}
          >
            You spoke for{" "}
            <strong>{formatDurationText(recordingDuration)}</strong>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Courier New', monospace",
              color: "#6a6a6a",
              fontSize: "1rem",
              lineHeight: 1.8,
              mb: 3,
              maxWidth: 350,
              fontStyle: "italic",
            }}
          >
            You were talking <strong>{getEmotionDisplay()}</strong>
          </Typography>
          <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleContinueTalking}
              sx={{
                fontFamily: "'Courier New', monospace",
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                borderColor: "#8b7355",
                color: "#8b7355",
                px: 3,
                py: 1.2,
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: "#f3ece1",
                  borderColor: "#6b5335",
                },
              }}
            >
              Keep Sharing
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
