import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const buttonVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.4,
      type: "spring",
      stiffness: 100,
    },
  }),
};

export default function FloatingActionPanel({ onNewEntry }) {
  const router = useRouter();

  const buttons = [
    {
      label: "New Entry",
      onClick: onNewEntry,
      variant: "contained",
    },
    {
      label: "View Past Entries",
      onClick: () => router.push("/entries"),
      variant: "contained",
    },
    {
      label: "Weekly Insights",
      onClick: () => router.push("/dashboard"),
      variant: "contained",
    },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        right: "-60px", // pushes the panel out of the container
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        zIndex: 1300,
        pointerEvents: "auto",
      }}
    >
      {buttons.map((btn, i) => (
        <motion.div
          key={btn.label}
          initial="hidden"
          animate="visible"
          custom={i}
          variants={buttonVariants}
        >
          <Button
            fullWidth
            variant={btn.variant}
            sx={{
              fontFamily: "'Courier New', monospace",
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              backgroundColor:
                btn.variant === "contained" ? "#8b7355" : undefined,
              color: btn.variant === "contained" ? "#fff" : "#8b7355",
              borderColor: "#8b7355",
              borderWidth: "2px",
              borderStyle: "solid",
              borderRadius: "12px",
              px: 2,
              py: 1.5,
              minWidth: "220px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor:
                  btn.variant === "contained" ? "#6b5335" : "#f3ece1",
                borderColor: "#6b5335",
                color: btn.variant === "contained" ? "#fff" : "#6b5335",
              },
            }}
            onClick={btn.onClick}
          >
            {btn.label}
          </Button>
        </motion.div>
      ))}
    </Box>
  );
}
