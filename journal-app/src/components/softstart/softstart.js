"use client";
import { Box, Typography, TextField, IconButton, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import BreathingAnimation from "@/components/Breathinganimation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter, useSearchParams } from "next/navigation";
import FloatingBubble from "../FloatingBubbles/FloatingBubble";
import PromptBubble from "../FloatingBubbles/PromptBubble";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const bookStyles = {
  page: {
    flex: 1,
    position: "relative",
    background: "#fffef0",
    overflow: "hidden",
    border: "2px solid #d4c5a9",
    boxShadow:
      "-8px 8px 25px rgba(0,0,0,0.2), inset -30px 0 40px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease",
    p: "60px 50px",
    borderRadius: "16px",
  },
  lines: {
    position: "absolute",
    inset: 0,
    background:
      "repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(212,197,169,0.3) 31px, rgba(212,197,169,0.3) 32px)",
    pointerEvents: "none",
  },
  margin: {
    position: "absolute",
    top: "8%",
    bottom: "8%",
    left: "50px",
    width: "3px",
    background: "rgba(220,160,160,0.4)",
    pointerEvents: "none",
  },
  shadow: {
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    width: "80px",
    background: "linear-gradient(to left, rgba(0,0,0,0.25), transparent)",
    pointerEvents: "none",
  },
};

const generalObjects = [
  "Laptop",
  "Mug",
  "Notebook",
  "Pen",
  "Phone",
  "Plant",
  "Chair",
  "Table",
  "Backpack",
  "Shoes",
  "Lamp",
  "Water Bottle",
  "Mirror",
  "Socks",
  "Pillow",
  "Clock",
  "Window",
  "Book",
  "Cushion",
  "Curtain",
  "Tree",
  "Bird",
  "Car",
  "Cloud",
  "Grass",
  "Sky",
  "Bicycle",
  "Dog",
  "Cat",
  "Sunlight",
  "Person",
  "Bus",
  "Building",
  "Road",
  "Lamp Post",
  "Traffic Light",
  "Sun",
  "Bag",
  "Bench",
  "Flower",
  "Signboard",
];

export default function SoftStart() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [journalText, setJournalText] = useState("");
  const [showPromptBubble, setShowPromptBubble] = useState(false);
  const [showBubbles, setShowBubbles] = useState(false);
  const [clickedBubbles, setClickedBubbles] = useState([]);
  const [hideBubbles, setHideBubbles] = useState(false);
  const [freezeAllBubbles, setFreezeAllBubbles] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showFinalDialog, setShowFinalDialog] = useState(false);
  const [skipClicked, setSkipClicked] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [started_at, setStarted_at] = useState();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const inactivityTimer = useRef(null);
  const promptTimer = useRef(null);

  // Inactivity timer - shows bubbles after 30 seconds of no activity
  useEffect(() => {
    // Don't start timer if skip was clicked, 3+ bubbles clicked, or user has started typing
    if (skipClicked || clickedBubbles.length >= 3 || hasStartedTyping) {
      return;
    }

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer.current);

      // Start fresh 30 second timer
      inactivityTimer.current = setTimeout(() => {
        setShowBubbles(true);
      }, 8000); // 8 seconds
    };

    const handleActivity = (e) => {
      // Don't hide bubbles if clicking on a bubble
      if (e.target.closest("[data-bubble]")) {
        return;
      }

      // Hide bubbles on any activity (typing or clicking)
      setShowBubbles(false);

      // Reset the timer
      resetInactivityTimer();
    };

    window.addEventListener("keydown", handleActivity);
    window.addEventListener("mousedown", handleActivity);

    // Start initial timer
    resetInactivityTimer();

    return () => {
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      clearTimeout(inactivityTimer.current);
    };
  }, [skipClicked, clickedBubbles.length, hasStartedTyping]);

  // Prompt bubble timer - shows after 10 seconds if no text
  useEffect(() => {
    // Don't show prompt if skip was clicked
    if (skipClicked) {
      setShowPromptBubble(false);
      return;
    }

    clearTimeout(promptTimer.current);

    if (journalText.trim().length === 0) {
      promptTimer.current = setTimeout(() => {
        setShowPromptBubble(true);
      }, 10000); // 10 seconds
    } else {
      setShowPromptBubble(false);
    }

    return () => clearTimeout(promptTimer.current);
  }, [journalText, skipClicked]);

  const saveJournalEntry = async () => {
    if (!journalText.trim() || !userId) return;
    const endedAt = new Date().toISOString();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          mode: "soft_start",
          text: journalText,
          started_at,
          ended_at: endedAt,
        }),
      });

      if (!res.ok) throw new Error("Failed to save journal entry");
      await res.json();
      setSnackbar({
        open: true,
        message: "Your entry has been saved successfully",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Something went wrong. Internal server error.",
        severity: "error",
      });
    }
  };

  const handleBubbleClick = (text) => {
    // Prevent clicking the same bubble twice
    if (clickedBubbles.includes(text)) return;

    const updated = [...clickedBubbles, text];
    setClickedBubbles(updated);

    // After 3 bubbles are clicked, freeze ALL bubbles for 2 seconds
    if (updated.length >= 3) {
      // Freeze all bubbles immediately
      setFreezeAllBubbles(true);

      setTimeout(() => {
        // Hide all bubbles after 2 seconds
        setHideBubbles(true);
        setShowBubbles(false);
        // Show the prompt bubble after bubbles disappear
        setTimeout(() => {
          if (!skipClicked) {
            setShowPromptBubble(true);
          }
        }, 500);
      }, 2000); // 2 seconds delay
    }
  };

  const handleDoneWriting = () => {
    setShowConfirmDialog(true);
  };

  const handleContinueWriting = () => {
    setShowConfirmDialog(false);
  };

  const handleFinishWriting = async () => {
    setShowConfirmDialog(false);
    await saveJournalEntry();
    setShowFinalDialog(true);
  };

  const handleNewEntry = () => {
    // Reset everything for a new entry
    setJournalText("");
    setClickedBubbles([]);
    setHideBubbles(false);
    setFreezeAllBubbles(false);
    setShowPromptBubble(false);
    setShowFinalDialog(false);
    setShowBubbles(false);
    setSkipClicked(false); // Reset skip state for new entry
    setHasStartedTyping(false); // Reset typing state for new entry
    setStarted_at(undefined);
  };

  const handleGoToDashboard = () => {
    router.push("/gallery");
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSkipPrompt = () => {
    setSkipClicked(true);
    setShowPromptBubble(false);
    setShowBubbles(false);
    setHideBubbles(true);
  };

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
      <BreathingAnimation duration={7} intensity={0.7} />

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

      {/* Show bubbles only if not skipped and conditions are met */}
      {showBubbles &&
        !hideBubbles &&
        !skipClicked &&
        generalObjects.map((item, idx) => {
          // After 3 bubbles clicked, only show the clicked ones
          if (freezeAllBubbles && !clickedBubbles.includes(item)) {
            return null;
          }

          return (
            <FloatingBubble
              key={idx}
              text={item}
              onClick={() => handleBubbleClick(item)}
              isFrozen={freezeAllBubbles || clickedBubbles.includes(item)}
            />
          );
        })}

      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: "900px",
          height: "85vh",
          maxHeight: "800px",
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            ...bookStyles.page,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box sx={bookStyles.lines} />
          <Box sx={bookStyles.margin} />
          <Box sx={bookStyles.shadow} />

          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 600,
              color: "#4a4a4a",
              zIndex: 1,
            }}
          >
            Start Your Journal
          </Typography>

          <TextField
            multiline
            fullWidth
            placeholder="Write your thoughts here..."
            variant="standard"
            value={journalText}
            onChange={(e) => {
              const newValue = e.target.value;
              setJournalText(newValue);

              // Mark that user has started typing
              if (newValue.trim().length > 0 && !hasStartedTyping) {
                setHasStartedTyping(true);
              }

              if (!started_at) {
                setStarted_at(new Date().toISOString());
              }
            }}
            InputProps={{
              disableUnderline: true,
              sx: {
                fontFamily: "'Courier New', monospace",
                fontSize: "1.2rem",
                lineHeight: "32px",
                color: "#6a6a6a",
                backgroundColor: "transparent",
                zIndex: 1,
                padding: "0 10px",
              },
            }}
            sx={{
              width: "100%",
              maxWidth: "100%",
              height: "100%",
              zIndex: 1,
              overflowY: "auto",
            }}
          />

          {/* Done Writing Button */}
          {journalText.trim().length > 0 && (
            <Button
              variant="contained"
              onClick={handleDoneWriting}
              sx={{
                fontFamily: "'Courier New', monospace",
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                backgroundColor: "#8b7355",
                color: "#fff",
                padding: "12px 30px",
                borderRadius: "12px",
                zIndex: 1,
                alignSelf: "flex-end",
                "&:hover": {
                  backgroundColor: "#6b5335",
                },
              }}
            >
              I'm Done Writing
            </Button>
          )}
        </Box>
      </Box>

      {/* First Confirmation Dialog - Are you sure? */}
      {showConfirmDialog && (
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
              padding: "40px 50px",
              maxWidth: "500px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Courier New', monospace",
                fontWeight: 600,
                color: "#4a4a4a",
                mb: 2,
                textAlign: "center",
              }}
            >
              Are you sure?
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Courier New', monospace",
                color: "#6a6a6a",
                mb: 4,
                textAlign: "center",
              }}
            >
              Do you want to add anything else to your journal?
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Button
                variant="outlined"
                onClick={handleContinueWriting}
                sx={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderColor: "#8b7355",
                  color: "#8b7355",
                  padding: "12px 30px",
                  borderRadius: "12px",
                  "&:hover": {
                    borderColor: "#6b5335",
                    backgroundColor: "rgba(139, 115, 85, 0.1)",
                  },
                }}
              >
                Keep Sharing
              </Button>
              <Button
                variant="contained"
                onClick={handleFinishWriting}
                sx={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  backgroundColor: "#8b7355",
                  color: "#fff",
                  padding: "12px 30px",
                  borderRadius: "12px",
                  "&:hover": {
                    backgroundColor: "#6b5335",
                  },
                }}
              >
                I'm Done
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Final Dialog - New Entry or Dashboard */}
      {showFinalDialog && (
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
              padding: "40px 50px",
              maxWidth: "500px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Courier New', monospace",
                fontWeight: 600,
                color: "#4a4a4a",
                mb: 4,
                textAlign: "center",
              }}
            >
              What would you like to do next?
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Button
                variant="outlined"
                onClick={handleNewEntry}
                sx={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderColor: "#8b7355",
                  color: "#8b7355",
                  padding: "12px 30px",
                  borderRadius: "12px",
                  "&:hover": {
                    borderColor: "#6b5335",
                    backgroundColor: "rgba(139, 115, 85, 0.1)",
                  },
                }}
              >
                Make a New Entry
              </Button>
              <Button
                variant="contained"
                onClick={handleGoToDashboard}
                sx={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  backgroundColor: "#8b7355",
                  color: "#fff",
                  padding: "12px 30px",
                  borderRadius: "12px",
                  "&:hover": {
                    backgroundColor: "#6b5335",
                  },
                }}
              >
                Go to Gallery
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Prompt bubbles - only show if not skipped */}
      {!skipClicked && showPromptBubble && clickedBubbles.length >= 3 && (
        <PromptBubble
          text="How was your day?
Start with a thought, a moment, or even just a feeling — let your words flow."
          onSkip={handleSkipPrompt}
        />
      )}
      {!skipClicked && showPromptBubble && clickedBubbles.length < 3 && (
        <PromptBubble onSkip={handleSkipPrompt} />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
