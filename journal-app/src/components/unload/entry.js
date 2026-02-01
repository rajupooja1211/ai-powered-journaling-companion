// // EntryScreen.jsx (Main Container)
// "use client";
// import { useState, useEffect, useRef } from "react";
// import { Box, IconButton } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useRouter } from "next/navigation";
// import BreathingAnimation from "../Breathinganimation";
// import PageTransition from "../Pagetransition";
// import LeftPanel from "./LeftPanel";
// import RightPanel from "./RightPanel";

// export default function EntryScreen({ name, setStep }) {
//   const router = useRouter();
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingDuration, setRecordingDuration] = useState(0);
//   const [transcript, setTranscript] = useState("");
//   const [keywords, setKeywords] = useState([]);
//   const [detectedEmotion, setDetectedEmotion] = useState(null);
//   const [cognitiveNudge, setCognitiveNudge] = useState(null);
//   const [showEndOptions, setShowEndOptions] = useState(false);
//   const [loadingAnalysis, setLoadingAnalysis] = useState(false);
//   const [showOptions, setShowOptions] = useState(false);

//   const silenceTimerRef = useRef(null);
//   const lastSpeechTimeRef = useRef(null);
//   const recordingTimerRef = useRef(null);

//   useEffect(() => {
//     if (!isRecording) return;
//     recordingTimerRef.current = setInterval(() => {
//       setRecordingDuration((prev) => prev + 1);
//     }, 1000);
//     return () => clearInterval(recordingTimerRef.current);
//   }, [isRecording]);

//   useEffect(() => {
//     if (!isRecording) return;
//     const phrases = [
//       {
//         text: "The launch was a disaster",
//         delay: 3000,
//         keywords: ["Launch"],
//         emotion: "frustrated",
//       },
//       {
//         text: "Everything went wrong",
//         delay: 6000,
//         keywords: ["Self-Doubt"],
//         emotion: "angry",
//       },
//       {
//         text: "I'm not cut out for this",
//         delay: 9000,
//         keywords: ["Self-Doubt"],
//         emotion: "sad",
//       },
//       {
//         text: "I always mess up when stakes are high",
//         delay: 12000,
//         keywords: [],
//         emotion: "doubtful",
//       },
//       {
//         text: "The client email was a mess",
//         delay: 15000,
//         keywords: ["Client", "Email"],
//         emotion: "frustrated",
//       },
//       {
//         text: "The team didn't communicate well",
//         delay: 18000,
//         keywords: ["Team"],
//         emotion: "disappointed",
//       },
//     ];
//     phrases.forEach(({ text, delay, keywords: newKeywords, emotion }) => {
//       setTimeout(() => {
//         if (!isRecording) return;
//         lastSpeechTimeRef.current = Date.now();
//         if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
//         setTranscript((prev) => prev + " " + text + ".");
//         if (newKeywords.length > 0)
//           setKeywords((prev) => [...new Set([...prev, ...newKeywords])]);
//         if (emotion) setDetectedEmotion(emotion);
//         silenceTimerRef.current = setTimeout(() => {
//           if (isRecording) handleStop(true);
//         }, 120000);
//       }, delay);
//     });
//     return () => clearTimeout(silenceTimerRef.current);
//   }, [isRecording]);

//   const handleStop = (autoStopped = false) => {
//     setIsRecording(false);
//     setLoadingAnalysis(true);
//     setShowEndOptions(false);
//     clearTimeout(silenceTimerRef.current);
//     clearInterval(recordingTimerRef.current);
//     setTimeout(() => {
//       if (transcript.includes("always")) {
//         setCognitiveNudge({
//           suggestion: `I noticed you said "always." Sometimes when we're stressed, one difficult moment can feel permanent. Was this really every time, or just today?`,
//         });
//       } else if (transcript.includes("never")) {
//         setCognitiveNudge({
//           suggestion: `I noticed you said "never." When we're overwhelmed, it's easy to see things as absolute. Could there be exceptions?`,
//         });
//       } else if (transcript.includes("Everything")) {
//         setCognitiveNudge({
//           suggestion: `You mentioned "everything" went wrong. Sometimes our minds paint with a broad brush when we're stressed. What specifically happened?`,
//         });
//       }
//       setShowEndOptions(true);
//       setLoadingAnalysis(false);
//     }, 1000);
//   };

//   const handleContinueTalking = () => {
//     setIsRecording(true);
//     setShowEndOptions(false);
//     setLoadingAnalysis(false);
//     setShowOptions(false);
//     lastSpeechTimeRef.current = Date.now();
//   };

//   const handleShowMenu = () => setShowOptions(true);
//   const handleNewEntry = () => {
//     setShowOptions(false);
//     // Optionally clear transcript/keywords
//     window.location.reload(); // Or reset transcript state
//   };

//   return (
//     <PageTransition>
//       <Box
//         sx={{
//           minHeight: "100vh",
//           background: "linear-gradient(to bottom, #f5f5dc, #e8dcc0)",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           position: "relative",
//           p: 2,
//         }}
//       >
//         <BreathingAnimation duration={7} intensity={0.5} />
//         <IconButton
//           onClick={() => router.back()}
//           sx={{
//             position: "fixed",
//             top: 20,
//             left: 20,
//             zIndex: 20,
//             backgroundColor: "rgba(255, 254, 240, 0.9)",
//             border: "2px solid #d4c5a9",
//             "&:hover": { backgroundColor: "#fffef0" },
//           }}
//         >
//           <ArrowBackIcon sx={{ color: "#8b7355" }} />
//         </IconButton>
//         <Box
//           sx={{
//             display: "flex",
//             width: "100%",
//             maxWidth: "1200px",
//             height: "75vh",
//             maxHeight: "700px",
//             gap: "20px",
//             zIndex: 10,
//           }}
//         >
//           <LeftPanel
//             name={name}
//             isRecording={isRecording}
//             showEndOptions={showEndOptions}
//             loadingAnalysis={loadingAnalysis}
//             recordingDuration={recordingDuration}
//             detectedEmotion={detectedEmotion}
//             handleStop={handleStop}
//             handleContinueTalking={handleContinueTalking}
//           />
//           <RightPanel
//             isRecording={isRecording}
//             showEndOptions={showEndOptions}
//             transcript={transcript}
//             keywords={keywords}
//             cognitiveNudge={cognitiveNudge}
//             handleShowMenu={handleShowMenu}
//             showOptions={showOptions}
//             handleNewEntry={handleNewEntry}
//           />
//         </Box>
//       </Box>
//     </PageTransition>
//   );
// }

"use client";
import { useState, useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import BreathingAnimation from "../Breathinganimation";
import PageTransition from "../Pagetransition";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import { useUser } from "./../../app/UserContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function EntryScreen({ name, setStep }) {
  const router = useRouter();

  // =========================
  // STATE
  // =========================
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [cognitiveNudge, setCognitiveNudge] = useState(null);
  const [showEndOptions, setShowEndOptions] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error"
  });

  const [showOptions, setShowOptions] = useState(false);
  const { user } = useUser();

  // =========================
  // REFS
  // =========================
  const recognitionRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const lastSpeechTimeRef = useRef(null);
  const recordingStartTimeRef = useRef(null);

  // =========================
  // RECORDING TIMER
  // =========================
  useEffect(() => {
    if (!isRecording) return;

    recordingTimerRef.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(recordingTimerRef.current);
  }, [isRecording]);

  // =========================
  // INIT SPEECH RECOGNITION
  // =========================
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

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
    };

    recognitionRef.current = recognition;
  };

  // =========================
  // START RECORDING
  // =========================
  const handleContinueTalking = () => {
    if (!recognitionRef.current) {
      initSpeechRecognition();
    }

    recordingStartTimeRef.current = new Date().toISOString();

    setIsRecording(true);
    setShowEndOptions(false);
    setLoadingAnalysis(false);
    setShowOptions(false);

    recognitionRef.current?.start();
  };

  // =========================
  // STOP RECORDING
  // =========================
  const handleStop = () => {
    setIsRecording(false);
    setLoadingAnalysis(true);
    setShowEndOptions(false);

    recognitionRef.current?.stop();
    clearInterval(recordingTimerRef.current);
    clearTimeout(silenceTimerRef.current);

    setTimeout(() => {
      if (transcript.toLowerCase().includes("always")) {
        setCognitiveNudge({
          suggestion:
            'I noticed you said "always." Sometimes one moment can feel permanent. Was this really every time?',
        });
      } else if (transcript.toLowerCase().includes("never")) {
        setCognitiveNudge({
          suggestion:
            'You mentioned "never." When emotions are strong, things feel absolute. Could there be exceptions?',
        });
      } else if (transcript.toLowerCase().includes("everything")) {
        setCognitiveNudge({
          suggestion:
            'You said "everything" went wrong. What specifically felt hardest?',
        });
      }

      setShowEndOptions(true);
      setLoadingAnalysis(false);
    }, 1000);
  };

  // =========================
  // API CALL
  // =========================
  const createJournalEntry = async (payload) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/entries`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create journal entry");
      }

      const data = await response.json();
      setSnackbar({
        open: true,
        message: "Your entry has been saved successfully 🌱",
        severity: "success",
      });

      return data;
    } catch (error) {
      console.error("❌ Journal entry API error:", error);

      // ❌ ERROR POPUP
      setSnackbar({
        open: true,
        message: "Something went wrong. Internal server error.",
        severity: "error",
      });

      return null;
    }
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // =========================
  // CONTINUE (SAVE ENTRY)
  // =========================

  console.log(user);
  const handleShowMenu = async () => {
    if (!transcript.trim()) {
      setShowOptions(true);
      return;
    }

    const endedAt = new Date().toISOString();

    const payload = {
      user_id: user.user_id,
      mode: "unload",
      text: transcript.trim(),
      started_at: recordingStartTimeRef.current,
      ended_at: endedAt,

      duration_seconds: recordingDuration,
    };

    console.log("📤 Sending journal payload:", payload);

    await createJournalEntry(payload);
    const result = await createJournalEntry(payload);

    if (result) {
      // ✅ Clear transcript only on success
      setTranscript("");
      setKeywords([]);
      setDetectedEmotion(null);
      setCognitiveNudge(null);
    }

    setShowOptions(true);
  };

  const handleNewEntry = () => {
    setShowOptions(false);
    window.location.reload();
  };

  // =========================
  // UI
  // =========================
  return (
    <PageTransition>
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
            name={user?.full_name}
            isRecording={isRecording}
            showEndOptions={showEndOptions}
            loadingAnalysis={loadingAnalysis}
            recordingDuration={recordingDuration}
            detectedEmotion={detectedEmotion}
            handleStop={handleStop}
            handleContinueTalking={handleContinueTalking}
          />

          <RightPanel
            isRecording={isRecording}
            showEndOptions={showEndOptions}
            transcript={transcript}
            keywords={keywords}
            cognitiveNudge={cognitiveNudge}
            handleShowMenu={handleShowMenu}
            showOptions={showOptions}
            handleNewEntry={handleNewEntry}
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
    </PageTransition>
  );
}
