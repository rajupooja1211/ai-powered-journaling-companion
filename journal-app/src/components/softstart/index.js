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

import ConfirmDialog from "./ConfirmDialog";
import ProcessingDialog from "./ProcessingDialog";
import FinalDialog from "./FinalDialog";
import { bookStyles, generalObjects } from "./constants";

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
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const inactivityTimer = useRef(null);
  const promptTimer = useRef(null);

  // Inactivity timer - shows bubbles after 8 seconds of no activity
  useEffect(() => {
    if (skipClicked || clickedBubbles.length >= 3 || hasStartedTyping) {
      return;
    }

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => {
        setShowBubbles(true);
      }, 8000);
    };

    const handleActivity = (e) => {
      if (e.target.closest("[data-bubble]")) {
        return;
      }
      setShowBubbles(false);
      resetInactivityTimer();
    };

    window.addEventListener("keydown", handleActivity);
    window.addEventListener("mousedown", handleActivity);
    resetInactivityTimer();

    return () => {
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      clearTimeout(inactivityTimer.current);
    };
  }, [skipClicked, clickedBubbles.length, hasStartedTyping]);

  // Prompt bubble timer
  useEffect(() => {
    if (skipClicked) {
      setShowPromptBubble(false);
      return;
    }

    clearTimeout(promptTimer.current);

    if (journalText.trim().length === 0) {
      promptTimer.current = setTimeout(() => {
        setShowPromptBubble(true);
      }, 10000);
    } else {
      setShowPromptBubble(false);
    }

    return () => clearTimeout(promptTimer.current);
  }, [journalText, skipClicked]);

  const createJournalEntryWithAI = async (payload) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to create journal entry");
    return await response.json();
  };

  const handleBubbleClick = (text) => {
    if (clickedBubbles.includes(text)) return;

    const updated = [...clickedBubbles, text];
    setClickedBubbles(updated);

    if (updated.length >= 3) {
      setFreezeAllBubbles(true);

      setTimeout(() => {
        setHideBubbles(true);
        setShowBubbles(false);

        setTimeout(() => {
          if (!skipClicked) {
            setShowPromptBubble(true);
          }
        }, 500);
      }, 2000);
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

    if (!journalText.trim() || !userId) return;

    setIsProcessingAI(true);
    const endedAt = new Date().toISOString();

    const payload = {
      user_id: userId,
      mode: "soft_start",
      text: journalText.trim(),
      started_at,
      ended_at: endedAt,
    };

    try {
      const result = await createJournalEntryWithAI(payload);

      if (result && result.entry) {
        const entry = result.entry;

        setAiResults({
          themes: entry.keywords || [],
          cognitive_biases: result.mirrors || [],
          summary: entry.summary || "",
          tags: entry.tags || [],
          sentiment_score: entry.sentiment_score || 0,
        });

        setSnackbar({
          open: true,
          message: "Your entry has been saved successfully",
          severity: "success",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Something went wrong. Internal server error.",
        severity: "error",
      });
    } finally {
      setIsProcessingAI(false);
      setShowFinalDialog(true);
    }
  };

  const handleNewEntry = () => {
    setJournalText("");
    setClickedBubbles([]);
    setHideBubbles(false);
    setFreezeAllBubbles(false);
    setShowPromptBubble(false);
    setShowFinalDialog(false);
    setShowBubbles(false);
    setSkipClicked(false);
    setHasStartedTyping(false);
    setStarted_at(undefined);
    setAiResults(null);
  };

  const handleGoToDashboard = () => {
    router.push("/gallery/?userId=" + userId);
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

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setJournalText(newValue);

    if (newValue.trim().length > 0 && !hasStartedTyping) {
      setHasStartedTyping(true);
    }

    if (!started_at) {
      setStarted_at(new Date().toISOString());
    }
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

      {/* Floating Bubbles */}
      {showBubbles &&
        !hideBubbles &&
        !skipClicked &&
        generalObjects.map((item, idx) => {
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

      {/* Journal Page */}
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
            onChange={handleTextChange}
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

      {/* Dialogs */}
      <ConfirmDialog
        open={showConfirmDialog}
        onContinue={handleContinueWriting}
        onFinish={handleFinishWriting}
      />

      <ProcessingDialog open={isProcessingAI} />

      <FinalDialog
        open={showFinalDialog}
        onNewEntry={handleNewEntry}
        onGoToDashboard={handleGoToDashboard}
      />

      {/* Prompt Bubbles */}
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

      {/* Snackbar */}
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
