// "use client";
// import { Box, Typography } from "@mui/material";
// import { motion } from "framer-motion";

// export default function PromptBubble({
//   text = "What do you see around? Select any 3",
// }) {
//   return (
//     <Box
//       sx={{
//         position: "fixed",
//         top: "50%",
//         left: "50%",
//         transform: "translate(-50%, -50%)",
//         zIndex: 50,
//         pointerEvents: "none",
//       }}
//     >
//       <motion.div
//         initial={{ scale: 0, opacity: 0 }}
//         animate={{ scale: 1.1, opacity: 1 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         style={{
//           backgroundColor: "#fffef0",
//           border: "2px solid #d4c5a9",
//           borderRadius: "24px",
//           padding: "20px 30px",
//           boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
//         }}
//       >
//         <Typography
//           variant="h6"
//           sx={{
//             fontFamily: "'Courier New', monospace",
//             fontWeight: 600,
//             color: "#5a4b3b",
//           }}
//         >
//           {text}
//         </Typography>
//       </motion.div>
//     </Box>
//   );
// }

"use client";
import { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";

export default function PromptBubble({
  text = "What do you see around? Select any 3",
  onSkip = () => {},
}) {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    onSkip();
  };

  const isFirstPrompt = text.includes("What do you see");

  return (
    <AnimatePresence>
      {visible && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 50,
            pointerEvents: "auto",
          }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              backgroundColor: "#fffef0",
              border: "2px solid #d4c5a9",
              borderRadius: "24px",
              padding: "16px 24px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              minWidth: "300px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Courier New', monospace",
                fontWeight: 600,
                color: "#5a4b3b",
                flex: 1,
              }}
            >
              {text}
            </Typography>

            {isFirstPrompt && (
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  backgroundColor: "#fbe2e2",
                  color: "#9f3131",
                  "&:hover": { backgroundColor: "#f5cccc" },
                  width: 32,
                  height: 32,
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
}
