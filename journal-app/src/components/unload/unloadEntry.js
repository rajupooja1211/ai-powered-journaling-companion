"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import EntryScreen from "./entry";

export default function UnloadMind() {
  const params = useSearchParams();
  const name = params.get("name") || "Friend";
  const [step, setStep] = useState("entry");

  return (
    <AnimatePresence mode="wait">
      {step === "entry" && (
        <EntryScreen key="entry" name={name} setStep={setStep} />
      )}
    </AnimatePresence>
  );
}
