"use client";
import { useState, useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter, useSearchParams } from "next/navigation";
import BreathingAnimation from "../Breathinganimation";

import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function EntryScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [showEndOptions, setShowEndOptions] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [continueClicked, setContinueClicked] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // REFS

  const recognitionRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const lastSpeechTimeRef = useRef(null);
  const recordingStartTimeRef = useRef(null);

  // RECORDING TIMER

  useEffect(() => {
    if (!isRecording) return;
    recordingTimerRef.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(recordingTimerRef.current);
  }, [isRecording]);

  // SPEECH RECOGNITION

  const initSpeechRecognition = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + " ";
        }
      }
      if (finalText) {
        lastSpeechTimeRef.current = Date.now();
        setTranscript((prev) => prev + finalText);
      }
    };

    recognition.onerror = (err) =>
      console.error("Speech recognition error:", err);
    recognitionRef.current = recognition;
  };

  const handleContinueTalking = () => {
    if (!recognitionRef.current) initSpeechRecognition();
    recordingStartTimeRef.current = new Date().toISOString();
    setIsRecording(true);
    setShowEndOptions(false);
    setLoadingAnalysis(false);
    setShowOptions(false);
    setContinueClicked(false);
    setIsProcessingAI(false);
    setAiResults(null);
    recognitionRef.current?.start();
  };

  const handleStop = () => {
    setIsRecording(false);
    setLoadingAnalysis(true);
    setShowEndOptions(false);
    recognitionRef.current?.stop();
    clearInterval(recordingTimerRef.current);
    clearTimeout(silenceTimerRef.current);

    setTimeout(() => {
      setShowEndOptions(true);
      setLoadingAnalysis(false);
    }, 1000);
  };

  // API CALL

  const createJournalEntryWithAI = async (payload) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to create journal entry");
    const data = await response.json();
    return data;
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleShowMenu = async () => {
    setContinueClicked(true);
    if (!transcript.trim()) {
      setShowOptions(true);
      return;
    }

    setIsProcessingAI(true);
    const endedAt = new Date().toISOString();
    const payload = {
      user_id: userId,
      mode: "unload",
      text: transcript.trim(),
      started_at: recordingStartTimeRef.current,
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

        if (entry.keywords && entry.keywords.length > 0) {
          setKeywords(entry.keywords);
        }

        if (entry.tags && entry.tags.length > 0) {
          const emotionMap = {
            sadness: "sad",
            happiness: "happy",
            anger: "angry",
            anxiety: "worried",
            frustration: "frustrated",
            excitement: "excited",
            uncertainty: "doubtful",
            disappointment: "disappointed",
          };

          const detectedTag = entry.tags.find(
            (tag) => emotionMap[tag.toLowerCase()],
          );
          if (detectedTag) {
            setDetectedEmotion(emotionMap[detectedTag.toLowerCase()]);
          }
        }

        setSnackbar({
          open: true,
          message: "Your entry has been saved successfully",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Something went wrong. Internal server error.",
        severity: "error",
      });
    } finally {
      setIsProcessingAI(false);
      setShowOptions(true);
    }
  };

  const handleNewEntry = () => {
    setIsResetting(true);

    setShowOptions(false);
    setContinueClicked(false);
    setIsRecording(false);
    setShowEndOptions(false);
    setIsProcessingAI(false);

    setTranscript("");
    setKeywords([]);
    setDetectedEmotion(null);
    setAiResults(null);
    setRecordingDuration(0);

    requestAnimationFrame(() => {
      setIsResetting(false);
    });
  };

  return (
    <>
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
        <BreathingAnimation duration={7} intensity={0.5} />

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
            display: "flex",
            width: "100%",
            maxWidth: "1200px",
            height: "75vh",
            maxHeight: "700px",
            gap: "20px",
            zIndex: 10,
          }}
        >
          <LeftPanel
            isRecording={isRecording}
            showEndOptions={showEndOptions}
            loadingAnalysis={loadingAnalysis}
            recordingDuration={recordingDuration}
            detectedEmotion={detectedEmotion}
            handleStop={handleStop}
            handleContinueTalking={handleContinueTalking}
            continueClicked={continueClicked}
            isProcessingAI={isProcessingAI}
          />

          <RightPanel
            isRecording={isRecording}
            showEndOptions={showEndOptions}
            transcript={transcript}
            keywords={keywords}
            handleShowMenu={handleShowMenu}
            showOptions={showOptions}
            handleNewEntry={handleNewEntry}
            isProcessingAI={isProcessingAI}
            aiResults={aiResults}
            isResetting={isResetting}
          />
        </Box>
      </Box>

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
    </>
  );
}
