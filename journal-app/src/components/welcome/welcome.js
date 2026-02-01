"use client";
import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import BreathingAnimation from "../Breathinganimation";

const bookStyles = {
  page: {
    flex: 1,
    position: "relative",
    background: "#fffef0",
    overflow: "hidden",
    border: "2px solid #d4c5a9",
    boxShadow:
      "-5px 5px 15px rgba(0,0,0,0.2), inset -20px 0 30px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease",
  },
  lines: {
    position: "absolute",
    inset: 0,
    background:
      "repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(212,197,169,0.25) 31px, rgba(212,197,169,0.25) 32px)",
    pointerEvents: "none",
  },
  margin: {
    position: "absolute",
    width: "2px",
    background: "rgba(220,160,160,0.5)",
    pointerEvents: "none",
  },
  shadow: {
    position: "absolute",
    top: 0,
    height: "100%",
    width: "60px",
    pointerEvents: "none",
  },
};

export default function Welcome() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleContinue = async () => {
    // Validation
    if (!name.trim()) {
      setErrorMessage("Please enter your name!");
      setShowError(true);
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Please enter your email!");
      setShowError(true);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email!");
      setShowError(true);
      return;
    }

    try {
      // Call backend API to create/get user
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          full_name: name.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const data = await response.json();

      // Navigate with userId instead of name/email
      router.push(`/adaptive?userId=${data.user.user_id}`);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Connection error. Please try again!");
      setShowError(true);
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
        p: 2,
      }}
    >
      <BreathingAnimation duration={6} intensity={0.8} />

      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: "1200px",
          height: "85vh",
          maxHeight: "800px",
          gap: "25px",
          transformStyle: "preserve-3d",
          zIndex: 10,
        }}
      >
        {/* Left Page - Video */}
        <Box
          sx={{
            ...bookStyles.page,
            borderRadius: "10px 0 0 10px",
            borderRight: "none",
            transform: "perspective(1500px) rotateY(2deg)",
            transformOrigin: "right center",
            "&:hover": { transform: "perspective(1500px) rotateY(4deg)" },
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          >
            <source src="/assets/welcome.mp4" type="video/mp4" />
          </video>
          <Box
            sx={{
              ...bookStyles.shadow,
              right: 0,
              background:
                "linear-gradient(to left, rgba(0,0,0,0.2), transparent)",
            }}
          />
        </Box>

        {/* Right Page - Content */}
        <Box
          sx={{
            ...bookStyles.page,
            borderRadius: "0 10px 10px 0",
            borderLeft: "none",
            boxShadow:
              "5px 5px 15px rgba(0,0,0,0.2), inset 20px 0 30px rgba(0,0,0,0.08)",
            transform: "perspective(1500px) rotateY(-3deg)",
            transformOrigin: "left center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 5,
            "&:hover": { transform: "perspective(1500px) rotateY(-5deg)" },
          }}
        >
          <Box sx={bookStyles.lines} />
          <Box
            sx={{ ...bookStyles.margin, top: "8%", left: "50px", bottom: "8%" }}
          />
          <Box
            sx={{
              ...bookStyles.shadow,
              left: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,0.2), transparent)",
            }}
          />

          <Box
            sx={{
              width: "100%",
              maxWidth: 400,
              textAlign: "center",
              zIndex: 1,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Courier New', monospace",
                fontWeight: 400,
                color: "#4a4a4a",
                fontSize: "2.5rem",
                mb: 4,
              }}
            >
              Welcome!
            </Typography>

            <TextField
              fullWidth
              label="Enter your name"
              variant="standard"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={showError && !name.trim()}
              sx={{
                mb: 3,
                "& .MuiInputBase-root": {
                  backgroundColor: "transparent",
                },
                "& .MuiInputBase-input": {
                  fontFamily: "'Courier New', monospace",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  color: "#4a4a4a",
                },
                "& label": {
                  fontFamily: "'Courier New', monospace",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#7a7a7a",
                },
                "& label.Mui-focused": { color: "#4a4a4a" },
                "& label.Mui-error": { color: "#d32f2f" },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#8b7355",
                  borderBottomWidth: "2px",
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "#d4c5a9",
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "#a89878",
                },
                "& .MuiInput-underline.Mui-error:after": {
                  borderBottomColor: "#d32f2f",
                },
              }}
            />

            <TextField
              fullWidth
              label="Enter your email"
              variant="standard"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={
                showError && (!email.trim() || !/\S+@\S+\.\S+/.test(email))
              }
              sx={{
                mb: 4,
                "& .MuiInputBase-root": {
                  backgroundColor: "transparent",
                },
                "& .MuiInputBase-input": {
                  fontFamily: "'Courier New', monospace",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  color: "#4a4a4a",
                },
                "& label": {
                  fontFamily: "'Courier New', monospace",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#7a7a7a",
                },
                "& label.Mui-focused": { color: "#4a4a4a" },
                "& label.Mui-error": { color: "#d32f2f" },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#8b7355",
                  borderBottomWidth: "2px",
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "#d4c5a9",
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "#a89878",
                },
                "& .MuiInput-underline.Mui-error:after": {
                  borderBottomColor: "#d32f2f",
                },
              }}
            />

            <Button
              fullWidth
              variant="outlined"
              onClick={handleContinue}
              sx={{
                fontFamily: "'Courier New', monospace",
                fontSize: "1.2rem",
                fontWeight: 600,
                textTransform: "none",
                color: "#4a4a4a",
                borderColor: "#8b7355",
                borderWidth: "2px",
                borderRadius: "4px",
                p: "14px",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#6b5335",
                  borderWidth: "2px",
                  backgroundColor: "#8b7355",
                  color: "#fff",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(139,115,85,0.3)",
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "0 2px 4px rgba(139,115,85,0.2)",
                },
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="warning"
          variant="filled"
          sx={{
            fontFamily: "'Courier New', monospace",
            fontSize: "1rem",
            fontWeight: 600,
            backgroundColor: "#8b7355",
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
