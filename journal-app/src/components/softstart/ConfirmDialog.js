import { Box, Typography, Button } from "@mui/material";

export default function ConfirmDialog({ open, onContinue, onFinish }) {
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
            onClick={onContinue}
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
            onClick={onFinish}
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
  );
}
