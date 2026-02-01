"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Container,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarMonthIcon,
} from "@mui/icons-material";
import ThursdayCalendar from "../calendar/ThursdayCalendar";
import BreathingAnimation from "../Breathinganimation";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";

export default function AdvancedVisualizationDashboard() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [filterRange, setFilterRange] = useState(null);

  const getMoodLabel = (s) => {
    const v = parseFloat(s);
    if (isNaN(v)) return "peace";
    if (v >= 0.6) return "joy";
    if (v >= 0.3) return "gratitude";
    if (v >= 0.1) return "contentment";
    if (v >= -0.1) return "peace";
    if (v >= -0.3) return "overwhelm";
    if (v >= -0.6) return "sadness";
    return "depression";
  };

  const handleApplyFilter = (day, month, year = 2026) => {
    const thursday = new Date(year, month, day);
    const start = new Date(thursday);
    start.setDate(thursday.getDate() - 3);
    const end = new Date(thursday);
    end.setDate(thursday.getDate() + 3);
    setFilterRange({
      startTs: start.setHours(0, 0, 0, 0),
      endTs: end.setHours(23, 59, 59, 999),
      label: `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    });
  };

  useEffect(() => {
    if (!userId) return;
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/analytics/dashboard?userId=${userId}&days=90`,
    )
      .then((res) => res.json())
      .then((data) => {
        setDashboardData(data);
        if (data.weeklyPattern?.length) {
          const latest = new Date(
            data.weeklyPattern[data.weeklyPattern.length - 1].date,
          );
          const target = new Date(latest);
          target.setDate(latest.getDate() + (4 - latest.getDay()));
          handleApplyFilter(target.getDate(), target.getMonth());
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  const displayData = useMemo(() => {
    return (dashboardData?.weeklyPattern || []).filter((item) => {
      const d = new Date(item.date);
      d.setFullYear(2026);
      return (
        d.getTime() >= filterRange?.startTs && d.getTime() <= filterRange?.endTs
      );
    });
  }, [filterRange, dashboardData]);

  const weeklyInsights = useMemo(
    () => ({
      streak: new Set(
        displayData.map((i) => new Date(i.date).toLocaleDateString()),
      ).size,
      range: new Set(displayData.map((i) => getMoodLabel(i.sentiment))).size,
    }),
    [displayData],
  );

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#f5f5dc",
        }}
      >
        <CircularProgress sx={{ color: "#8b7355" }} />
      </Box>
    );

  return (
    <Box sx={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          bgcolor: "#f5f5dc",
        }}
      >
        <BreathingAnimation duration={8} intensity={0.4} />
      </Box>

      <IconButton
        onClick={() => router.back()}
        sx={{
          position: "fixed",
          top: { xs: 20, md: 40 },
          left: { xs: 20, md: 40 },
          zIndex: 100,
          width: 56,
          height: 56,
          bgcolor: "#a08060",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(160, 128, 96, 0.3)",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: "#8b7355",
            transform: "scale(1.05)",
            boxShadow: "0 6px 25px rgba(160, 128, 96, 0.4)",
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Fixed Calendar Button - Matching Style */}
      <IconButton
        onClick={() => setShowCalendar(true)}
        sx={{
          position: "fixed",
          top: { xs: 20, md: 40 },
          right: { xs: 20, md: 40 },
          zIndex: 100,
          width: 56,
          height: 56,
          bgcolor: "#a08060",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(160, 128, 96, 0.3)",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: "#8b7355",
            transform: "scale(1.05)",
            boxShadow: "0 6px 25px rgba(160, 128, 96, 0.4)",
          },
        }}
      >
        <CalendarMonthIcon />
      </IconButton>

      <Container
        maxWidth="md"
        sx={{ py: 4, pt: { xs: 12, md: 14 }, position: "relative" }}
      >
        {showCalendar && (
          <ThursdayCalendar
            userId={userId}
            initialDate={new Date(2026, 0, 1)}
            onClose={() => setShowCalendar(false)}
            onWeekSelect={(d) => {
              handleApplyFilter(d.day, d.month);
              setShowCalendar(false);
            }}
          />
        )}

        {/* Insights Cards */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          {[
            { label: "Streak", val: weeklyInsights.streak },
            { label: "Range of Moods", val: weeklyInsights.range },
          ].map((item, i) => (
            <Card
              key={i}
              sx={{
                flex: 1,
                textAlign: "center",
                borderRadius: 3,
                border: "1px solid #d4c5a9",
                bgcolor: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h5">{item.icon}</Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 700,
                    color: "#5d4037",
                  }}
                >
                  {item.val}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#8b7355",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                  }}
                >
                  {item.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Chip
            label={filterRange?.label || "Finding Data..."}
            sx={{
              bgcolor: "rgba(160, 128, 96, 0.9)",
              color: "#fff",
              fontFamily: "'Courier New', monospace",
              fontWeight: 600,
              px: 2,
              boxShadow: "0 2px 10px rgba(160, 128, 96, 0.3)",
            }}
          />
        </Box>

        {/* Main "Book-Page" Paper */}
        <Paper
          sx={{
            p: 4,
            borderRadius: "16px 40px 40px 16px", // Journal shape
            border: "1px solid rgba(212, 197, 169, 0.6)",
            bgcolor: "rgba(255, 254, 252, 0.9)",
            backdropFilter: "blur(10px)",
            minHeight: 480,
            position: "relative",
            boxShadow: "0 8px 40px rgba(139, 115, 85, 0.1)",
            overflow: "hidden",
            "&::before": {
              // Notebook spiral area
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "24px",
              background:
                "linear-gradient(to right, rgba(160, 128, 96, 0.08), transparent)",
              borderRight: "2px solid rgba(160, 128, 96, 0.1)",
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 800,
              mb: 3,
              ml: 2,
              color: "#5d4037",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Weekly Reflection
          </Typography>

          <Box sx={{ height: 350, position: "relative", ml: 2 }}>
            {displayData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={displayData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#EFEBE9"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      `${new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                    }
                    style={{
                      fontSize: "0.75rem",
                      fontFamily: "'Courier New', monospace",
                      fontWeight: 700,
                      fill: "#8d6e63",
                    }}
                  />
                  <YAxis domain={[-1, 1]} hide />
                  <RechartsTooltip
                    cursor={{ stroke: "#d7ccc8", strokeWidth: 2 }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <Paper
                          sx={{
                            p: 2,
                            bgcolor: "rgba(255, 254, 240, 0.95)",
                            border: "1.5px solid #a08060",
                            borderRadius: 3,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              color: "#8d6e63",
                              fontWeight: 700,
                              mb: 1,
                            }}
                          >
                            {new Date(d.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                            })}
                            , 2026
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 800,
                              color: "#037818",
                              textTransform: "uppercase",
                            }}
                          >
                            {getMoodLabel(d.sentiment)}
                          </Typography>
                        </Paper>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sentiment"
                    fill="#a08060"
                    fillOpacity={0.08}
                    stroke="none"
                  />
                  <Line
                    type="monotone"
                    dataKey="sentiment"
                    stroke="#a08060"
                    strokeWidth={4}
                    animationDuration={2000}
                    dot={{
                      r: 6,
                      fill: "#a08060",
                      stroke: "#FFF",
                      strokeWidth: 3,
                    }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: "#8b7355" }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  p: 4,
                  bgcolor: "rgba(250, 249, 246, 0.8)",
                  borderRadius: 6,
                  border: "2px dashed rgba(160, 128, 96, 0.3)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 800,
                    color: "#5d4037",
                    mb: 1,
                  }}
                >
                  Empty Page
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Courier New', monospace",
                    color: "#8d6e63",
                    maxWidth: 240,
                    lineHeight: 1.6,
                  }}
                >
                  Your thoughts are missing here. Choose a <b>previous week</b>{" "}
                  to look back.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
