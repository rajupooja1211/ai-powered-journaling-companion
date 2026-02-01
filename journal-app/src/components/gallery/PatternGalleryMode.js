"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import GalleryLayout from "./GalleryLayout";

export default function PatternGalleryMode() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user info
  useEffect(() => {
    if (userId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("User API response:", data);

          // Handle different possible response structures
          const fullName =
            data?.user?.full_name || data?.full_name || data?.name || "Guest";
          setUserName(fullName);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          setUserName("Guest");
          setLoading(false);
        });
    } else {
      // No userId provided
      setUserName("Guest");
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #f5f5dc, #e8dcc0)",
        }}
      >
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "1.5rem",
            color: "#4a4a4a",
          }}
        >
          Loading your patterns...
        </p>
      </div>
    );
  }

  return <GalleryLayout userId={userId} userName={userName} />;
}
