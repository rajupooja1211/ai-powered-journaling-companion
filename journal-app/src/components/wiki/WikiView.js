"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Fade,
  CircularProgress,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import BreathingAnimation from "../Breathinganimation";

// Domain tags for filtering
const DOMAIN_TAGS = [
  "work",
  "relationships",
  "family",
  "friendships",
  "romance",
  "health",
  "sleep",
  "exercise",
  "finances",
  "creativity",
  "self-care",
  "social-life",
];

export default function NaturalWikiView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId");

  const [activeTag, setActiveTag] = useState(null);
  const [domains, setDomains] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadWikiData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/wiki/all?userId=${userId}`,
        );
        const data = await res.json();

        setDomains(data.domains || []);
        setEntries(data.entries || []);
      } catch (error) {
        console.error("Wiki fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWikiData();
  }, [userId]);

  // Filter entries for the selected domain tag
  const activeEntries = useMemo(() => {
    if (!activeTag) return [];

    return entries.filter((entry) => {
      const entryTags = entry.tags || [];
      return entryTags.some((t) => t.toLowerCase() === activeTag.toLowerCase());
    });
  }, [activeTag, entries]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle back navigation
  const handleBack = () => {
    if (activeTag) {
      setActiveTag(null);
    } else {
      router.back();
    }
  };

  if (loading) {
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
  }

  if (!userId) {
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
        <Typography sx={{ color: "#666", fontFamily: "'Georgia', serif" }}>
          Please provide a userId parameter
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
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
        onClick={handleBack}
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
        <ArrowBack />
      </IconButton>

      {/* Main Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          p: { xs: 2, md: 6 },
          pt: { xs: 10, md: 12 },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "800px",
            minHeight: "80vh",
            p: { xs: 4, md: 8 },
            bgcolor: "rgba(255, 254, 252, 0.85)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(232, 228, 217, 0.6)",
            borderRadius: "24px",
            position: "relative",
            boxShadow: "0 8px 40px rgba(0, 0, 0, 0.04)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: { xs: "20px", md: "40px" },
              top: "40px",
              bottom: "40px",
              width: "2px",
              bgcolor: "rgba(160, 128, 96, 0.15)",
              borderRadius: "1px",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1, pl: { xs: 4, md: 6 } }}>
            {/* Header */}
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="overline"
                sx={{
                  color: "#a08060",
                  letterSpacing: "3px",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                }}
              >
                {activeTag ? "Domain Details" : "(Personal Wiki)"}
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontFamily: "'Georgia', serif",
                  fontWeight: 400,
                  color: "#3a3a3a",
                  mt: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {activeTag ? (
                  <>
                    <Box
                      component="span"
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#a08060",
                        display: "inline-block",
                      }}
                    />
                    {activeTag.charAt(0).toUpperCase() + activeTag.slice(1)}
                  </>
                ) : (
                  "Journal Index"
                )}
              </Typography>

              {activeTag && (
                <Typography
                  sx={{
                    color: "#888",
                    fontSize: "0.95rem",
                    mt: 1,
                    fontFamily: "'Georgia', serif",
                    fontStyle: "italic",
                  }}
                >
                  {activeEntries.length}{" "}
                  {activeEntries.length === 1 ? "entry" : "entries"} found
                </Typography>
              )}
            </Box>

            {!activeTag ? (
              /* --- DOMAIN INDEX VIEW --- */
              <Fade in timeout={800}>
                <Box>
                  {domains.length === 0 ? (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 8,
                        color: "#888",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "'Georgia', serif",
                          fontStyle: "italic",
                        }}
                      >
                        No life domains found in your journal entries yet.
                      </Typography>
                      <Typography
                        sx={{ fontSize: "0.85rem", mt: 1, color: "#aaa" }}
                      >
                        Start journaling to see patterns emerge.
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      {domains.map(({ name, count }, index) => (
                        <Fade in timeout={400 + index * 100} key={name}>
                          <Chip
                            label={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <span>#{name}</span>
                                <Box
                                  component="span"
                                  sx={{
                                    bgcolor: "rgba(160, 128, 96, 0.15)",
                                    color: "#8b7355",
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: "10px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  {count}
                                </Box>
                              </Box>
                            }
                            onClick={() => setActiveTag(name)}
                            sx={{
                              cursor: "pointer",
                              fontFamily: "'SF Mono', 'Courier New', monospace",
                              fontSize: "0.9rem",
                              bgcolor: "rgba(255, 255, 255, 0.7)",
                              border: "1px solid rgba(212, 197, 169, 0.5)",
                              borderRadius: "12px",
                              py: 2.5,
                              px: 1,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                bgcolor: "rgba(160, 128, 96, 0.08)",
                                borderColor: "#a08060",
                                transform: "translateY(-2px)",
                                boxShadow:
                                  "0 4px 12px rgba(160, 128, 96, 0.15)",
                              },
                            }}
                          />
                        </Fade>
                      ))}
                    </Box>
                  )}
                </Box>
              </Fade>
            ) : (
              /* --- DOMAIN DETAIL VIEW (Summaries) --- */
              <Fade in timeout={600}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {activeEntries.length === 0 ? (
                    <Typography sx={{ color: "#888", fontStyle: "italic" }}>
                      No entries found for #{activeTag}
                    </Typography>
                  ) : (
                    activeEntries.map((entry, idx) => (
                      <Fade in timeout={300 + idx * 150} key={idx}>
                        <Box
                          sx={{
                            p: 3,
                            bgcolor: "rgba(255, 255, 255, 0.6)",
                            borderRadius: "16px",
                            border: "1px solid rgba(232, 228, 217, 0.5)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              bgcolor: "rgba(255, 255, 255, 0.9)",
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          {/* Date */}
                          <Typography
                            sx={{
                              fontFamily: "'SF Mono', 'Courier New', monospace",
                              fontSize: "0.75rem",
                              color: "#a08060",
                              mb: 2,
                              letterSpacing: "0.5px",
                            }}
                          >
                            {formatDate(entry.created_at)}
                          </Typography>

                          {/* Summary */}
                          <Typography
                            sx={{
                              fontFamily: "'Georgia', serif",
                              fontSize: "1.1rem",
                              lineHeight: 1.9,
                              color: "#444",
                              mb: 2.5,
                            }}
                          >
                            {entry.summary}
                          </Typography>

                          {/* Tags */}
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                          >
                            {(entry.tags || []).map((t) => (
                              <Typography
                                key={t}
                                sx={{
                                  fontSize: "0.75rem",
                                  color:
                                    t.toLowerCase() === activeTag
                                      ? "#a08060"
                                      : "#bbb",
                                  fontWeight:
                                    t.toLowerCase() === activeTag ? 600 : 400,
                                  fontFamily:
                                    "'SF Mono', 'Courier New', monospace",
                                  bgcolor:
                                    t.toLowerCase() === activeTag
                                      ? "rgba(160, 128, 96, 0.1)"
                                      : "transparent",
                                  px: t.toLowerCase() === activeTag ? 1 : 0,
                                  py: 0.25,
                                  borderRadius: "6px",
                                }}
                              >
                                #{t}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      </Fade>
                    ))
                  )}
                </Box>
              </Fade>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
