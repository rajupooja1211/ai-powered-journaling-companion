"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Fade,
  ClickAwayListener,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function ThursdayCalendar({
  userId,
  onClose,
  onWeekSelect,
  initialDate,
}) {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());

  const isThursday = (year, month, day) => {
    return new Date(year, month, day).getDay() === 4;
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let day = 1; day <= totalDays; day++) {
      days.push({ day, isThursday: isThursday(year, month, day) });
    }
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const handleThursdayClick = (day) => {
    onWeekSelect({
      day: day,
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
    });
  };

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Fade in={true}>
        <Paper
          sx={{
            position: "fixed",
            top: 90,
            right: 30,
            width: 220,
            background: "transparent",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "20px",
            border: "2px solid rgba(255, 255, 255, 0.3)",

            zIndex: 1300,
          }}
        >
          <Box sx={{ p: 2.5 }}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                pb: 1.5,
                borderBottom: "2px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <IconButton
                onClick={goToPreviousMonth}
                size="small"
                sx={{
                  color: "#fff",
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "6px",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.3)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <ChevronLeftIcon sx={{ fontSize: "1.2rem" }} />
              </IconButton>

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 700,
                    color: "#fff",
                    fontSize: "1.1rem",
                    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </Typography>
              </Box>

              <IconButton
                onClick={goToNextMonth}
                size="small"
                sx={{
                  color: "#fff",
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "6px",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.3)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <ChevronRightIcon sx={{ fontSize: "1.2rem" }} />
              </IconButton>
            </Box>

            {/* Day Headers */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 0.5,
                mb: 1,
              }}
            >
              {DAYS.map((d, i) => (
                <Typography
                  key={i}
                  sx={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#fff",
                    textAlign: "center",
                    opacity: 0.9,
                  }}
                >
                  {d}
                </Typography>
              ))}
            </Box>

            {/* Calendar Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 0.5,
              }}
            >
              {getDaysInMonth().map((item, i) => {
                if (!item) return <Box key={i} />;
                const { day, isThursday: isThurs } = item;

                return (
                  <Box
                    key={i}
                    onClick={() => isThurs && handleThursdayClick(day)}
                    sx={{
                      aspectRatio: "1/1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                      background: isThurs
                        ? "#673d04"
                        : "rgba(255, 255, 255, 0.25)",
                      color: isThurs ? "#f7eded" : "rgba(0, 0, 0, 0.6)",
                      border: "none",
                      cursor: isThurs ? "pointer" : "default",
                      fontFamily: "'Courier New', monospace",
                      fontWeight: isThurs ? 700 : 500,
                      fontSize: "0.8rem",
                      transition: "all 0.3s ease",
                      boxShadow: isThurs
                        ? "0 2px 8px rgba(187, 151, 102, 0.4)"
                        : "none",
                      "&:hover": isThurs
                        ? {
                            background: "#ffcf99",
                            transform: "scale(1.15)",
                            boxShadow: "0 4px 16px rgba(175, 137, 76, 0.6)",
                          }
                        : {},
                    }}
                  >
                    {day}
                  </Box>
                );
              })}
            </Box>

            {/* Legend */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                mt: 2,
                pt: 1.5,
                borderTop: "2px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#3c1c03",
                  boxShadow: "0 2px 6px rgb(187, 151, 102)",
                }}
              />
              <Typography
                sx={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.7rem",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                Thursday
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </ClickAwayListener>
  );
}
