"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import EntryScreen from "./entry";
import RecordingScreen from "./recording";

export default function UnloadMind() {
  const params = useSearchParams();
  const name = params.get("name") || "Friend";
  const [step, setStep] = useState("entry");

  return (
    <AnimatePresence mode="wait">
      {step === "entry" && (
        <EntryScreen key="entry" name={name} setStep={setStep} />
      )}
      {/* Add other screens here as you create them */}
      {step === "recording" && (
        <RecordingScreen key="recording" name={name} setStep={setStep} />
      )}
    </AnimatePresence>
  );
}
