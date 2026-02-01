import { Box, Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function FloatingActionPanel({ onNewEntry, userId }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const effectiveUserId = userId || searchParams.get("userId");

  const buttons = [
    {
      label: "New Entry",
      onClick: onNewEntry,
    },
    {
      label: "Gallery",
      onClick: () => {
        if (effectiveUserId) {
          router.push(`/gallery?userId=${effectiveUserId}`);
        } else {
          console.error("No userId available");
        }
      },
    },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        right: "-110px",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
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
            // fullWidth
            variant="filled"
            sx={{
              fontFamily: "'Courier New', monospace",
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              backgroundColor: "#8b7355",
              color: "#fff",
              borderColor: "#8b7355",
              borderWidth: "2px",
              borderStyle: "solid",
              borderRadius: "12px",
              px: 3,
              py: 1.5,
              width: "10rem",

              "&:hover": {
                backgroundColor: "rgba(139, 115, 85, 0.08)",
                borderColor: "#6b5335",
                color: "#6b5335",
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
