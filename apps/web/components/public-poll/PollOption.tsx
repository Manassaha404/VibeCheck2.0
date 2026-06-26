"use client";

import React, { useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PollOptionProps {
  id: string;
  text: string;
  value: string;
  name: string;
  checked: boolean;
  onChange: (value: string) => void;
  index: number;
}

const hoverColors = [
  "hover:bg-electric-sun",
  "hover:bg-leaf-green",
  "hover:bg-tangerine",
  "hover:bg-lavender",
  "hover:bg-vivid-coral",
  "hover:bg-sky-blue",
  "hover:bg-mint",
];

export const PollOption = ({
  id,
  text,
  value,
  name,
  checked,
  onChange,
  index,
}: PollOptionProps) => {
  const hoverColor = hoverColors[index % hoverColors.length];
  const containerRef = useRef<HTMLLabelElement>(null);

  const handleChange = () => {
    onChange(value);
    // Simple micro-interaction
    if (containerRef.current) {
      containerRef.current.style.transform = "scale(1.02)";
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.transform = "";
        }
      }, 150);
    }
  };

  return (
    <label
      ref={containerRef}
      htmlFor={id}
      className={cn(
        "flex items-center p-6 bg-canvas-cream rounded-xl cursor-pointer transition-all group hard-shadow-sm btn-hover-press border-2 border-ink-charcoal",
        hoverColor,
        checked && "ring-2 ring-inset ring-ink-charcoal"
      )}
      style={{ transition: "all 0.15s ease-out" }}
    >
      <div className="relative flex items-center justify-center mr-6">
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          className="appearance-none w-6 h-6 border-2 border-ink-charcoal rounded-full outline-none cursor-pointer bg-pure-white"
        />
        {checked && (
          <div className="absolute w-3 h-3 bg-electric-sun rounded-full border-2 border-ink-charcoal pointer-events-none" />
        )}
      </div>

      <span className="font-headline-sm text-headline-sm flex-grow">
        {text}
      </span>

      <span className={cn("transition-opacity", checked ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
        <CheckCircle2 size={24} strokeWidth={2.5} />
      </span>
    </label>
  );
};
