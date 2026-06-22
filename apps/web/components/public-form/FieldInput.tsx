import React, { useState } from "react";
import { User, Mail, MessageSquare, Hash, Phone, Calendar, CheckSquare, List, CircleDot, Star, Smile, Upload, File as FileIcon, Loader2 } from "lucide-react";
import { trpc } from "@/trpc/client";

export type FieldType =
  | "short_text" | "long_text" | "number" | "email" | "phone"
  | "date" | "select" | "multi_select" | "radio" | "checkbox"
  | "rating" | "scale" | "mood" | "file";

export interface Field {
  fieldId: string;
  label: string;
  type: FieldType;
  placeholder: string | null;
  helperText: string | null;
  isRequired: boolean;
  isPrimary?: boolean;
  options: { id: string; value: string }[] | null;
}

const MOOD_OPTIONS = [
  { id: "😄", value: "Amazing", emoji: "😄" },
  { id: "😊", value: "Good", emoji: "😊" },
  { id: "😐", value: "Okay", emoji: "😐" },
  { id: "😕", value: "Not great", emoji: "😕" },
  { id: "😞", value: "Bad", emoji: "😞" },
];

function getFieldIcon(type: FieldType) {
  switch (type) {
    case "short_text": return <User size={20} />;
    case "long_text": return <MessageSquare size={20} />;
    case "email": return <Mail size={20} />;
    case "number": return <Hash size={20} />;
    case "phone": return <Phone size={20} />;
    case "date": return <Calendar size={20} />;
    case "checkbox":
    case "multi_select": return <CheckSquare size={20} />;
    case "select": return <List size={20} />;
    case "radio": return <CircleDot size={20} />;
    case "rating":
    case "scale": return <Star size={20} />;
    case "mood": return <Smile size={20} />;
    case "file": return <Upload size={20} />;
    default: return null;
  }
}

export function FieldInput({
  field,
  formId,
  value,
  primaryFieldValue,
  onChange,
  error,
}: {
  field: Field;
  formId: string;
  value: unknown;
  primaryFieldValue?: string;
  onChange: (val: unknown) => void;
  error?: string;
}) {
  const baseInput =
    "w-full bg-transparent border-none p-4 text-body-lg text-[var(--color-ink-charcoal)] placeholder-[var(--color-tertiary)] focus:ring-0 outline-none font-bold";
  const inputWrapper =
    "border-[3px] border-[var(--color-ink-charcoal)] bg-white shadow-hard-sm transition-all focus-within:border-[var(--color-electric-sun)] focus-within:shadow-[0_0_0_4px_var(--color-electric-sun),4px_4px_0px_0px_var(--color-ink-charcoal)] relative overflow-hidden";

  return (
    <div id={`field-container-${field.fieldId}`} className="space-y-3 group animate-fade-up">
      <label className="text-headline-sm font-bold text-[var(--color-ink-charcoal)] block group-hover:text-[var(--color-primary)] transition-colors flex items-center gap-2">
        {getFieldIcon(field.type)}
        {field.label}
        {field.isRequired && <span className="text-[var(--color-error)]">*</span>}
      </label>
      {field.helperText && (
        <p className="text-body-md opacity-70 mt-1">{field.helperText}</p>
      )}

      {/* ── Text types ── */}
      {(field.type === "short_text" || field.type === "email" || field.type === "phone") && (
        <div className={inputWrapper}>
          <input
            id={`field-${field.fieldId}`}
            type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
            placeholder={field.placeholder ?? ""}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={baseInput}
          />
        </div>
      )}
      {field.type === "long_text" && (
        <div className={inputWrapper}>
          <textarea
            id={`field-${field.fieldId}`}
            placeholder={field.placeholder ?? ""}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className={`${baseInput} resize-none min-h-[120px] custom-scrollbar`}
          />
        </div>
      )}
      {field.type === "number" && (
        <div className={inputWrapper}>
          <input
            id={`field-${field.fieldId}`}
            type="number"
            placeholder={field.placeholder ?? ""}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={baseInput}
          />
        </div>
      )}
      {field.type === "date" && (
        <div className={inputWrapper}>
          <input
            id={`field-${field.fieldId}`}
            type="date"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={baseInput}
          />
        </div>
      )}

      {/* ── Select ── */}
      {field.type === "select" && (
        <div className={inputWrapper}>
          <select
            id={`field-${field.fieldId}`}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={baseInput}
          >
            <option value="">Choose an option…</option>
            {field.options?.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.value}</option>
            ))}
          </select>
        </div>
      )}

      {/* ── Radio / Checkbox / Multi Select ── */}
      {(field.type === "radio" || field.type === "checkbox" || field.type === "multi_select") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field.options?.map((opt) => {
            const isRadio = field.type === "radio";
            const selected = isRadio
              ? value === opt.id
              : Array.isArray(value) ? (value as string[]).includes(opt.id) : false;

            return (
              <label
                key={opt.id}
                id={`${isRadio ? 'radio' : 'check'}-${field.fieldId}-${opt.id}`}
                className="cursor-pointer group/opt"
              >
                <input
                  type={isRadio ? "radio" : "checkbox"}
                  name={field.fieldId}
                  value={opt.id}
                  checked={selected}
                  onChange={() => {
                    if (isRadio) {
                      onChange(opt.id);
                    } else {
                      const cur = Array.isArray(value) ? (value as string[]) : [];
                      onChange(selected ? cur.filter((v) => v !== opt.id) : [...cur, opt.id]);
                    }
                  }}
                  className="peer sr-only"
                />
                <div className={`border-[3px] border-[var(--color-ink-charcoal)] bg-white p-4 transition-all flex items-center gap-3 ${selected
                    ? "bg-[var(--color-electric-sun)] shadow-hard"
                    : "hover:bg-[var(--color-canvas-cream)]"
                  }`}>
                  <div className={`w-5 h-5 border-[3px] border-[var(--color-ink-charcoal)] flex items-center justify-center flex-shrink-0 bg-white ${isRadio ? "rounded-full" : "rounded"}`}>
                    {selected && (
                      <div className={`bg-[var(--color-ink-charcoal)] ${isRadio ? "w-2.5 h-2.5 rounded-full" : "w-2.5 h-2.5"}`} />
                    )}
                  </div>
                  <span className="text-body-lg font-bold">{opt.value}</span>
                </div>
              </label>
            );
          })}
        </div>
      )}

      {/* ── Rating ── */}
      {field.type === "rating" && (
        <div className="flex gap-4 flex-wrap">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer">
              <input
                type="radio"
                name={`rating-${field.fieldId}`}
                value={n}
                checked={value === n}
                onChange={() => onChange(n)}
                className="peer sr-only"
              />
              <div className={`border-[3px] border-[var(--color-ink-charcoal)] bg-white w-14 h-14 flex flex-col items-center justify-center transition-all peer-checked:bg-[var(--color-electric-sun)] peer-checked:shadow-hard hover:bg-[var(--color-canvas-cream)]`}>
                <span className="text-2xl">⭐</span>
              </div>
            </label>
          ))}
        </div>
      )}

      {/* ── Scale (1–10) ── */}
      {field.type === "scale" && (
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <label key={n} className="cursor-pointer">
              <input
                type="radio"
                name={`scale-${field.fieldId}`}
                value={n}
                checked={value === n}
                onChange={() => onChange(n)}
                className="peer sr-only"
              />
              <div className={`border-[3px] border-[var(--color-ink-charcoal)] bg-white w-12 h-12 flex items-center justify-center transition-all text-body-lg font-bold peer-checked:bg-[var(--color-leaf-green)] peer-checked:shadow-hard hover:bg-[var(--color-canvas-cream)]`}>
                {n}
              </div>
            </label>
          ))}
        </div>
      )}

      {/* ── Mood ── */}
      {field.type === "mood" && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {MOOD_OPTIONS.map((m) => (
            <label key={m.id} className="cursor-pointer">
              <input
                type="radio"
                name={`mood-${field.fieldId}`}
                value={m.id}
                checked={value === m.id}
                onChange={() => onChange(m.id)}
                className="peer sr-only"
              />
              <div className={`border-[3px] border-[var(--color-ink-charcoal)] bg-white p-4 flex flex-col items-center gap-2 transition-all peer-checked:bg-[var(--color-electric-sun)] peer-checked:shadow-hard hover:bg-[var(--color-canvas-cream)]`}>
                <span className="text-4xl">{m.emoji}</span>
                <span className="text-label-md font-bold text-[var(--color-ink-charcoal)]">{m.value}</span>
              </div>
            </label>
          ))}
        </div>
      )}

      {/* ── File ── */}
      {field.type === "file" && (
        <div className={inputWrapper + " flex items-center p-4 gap-4"}>
          {value ? (
            <div className="flex items-center gap-3 w-full">
              <FileIcon size={24} className="text-[var(--color-ink-charcoal)]" />
              <span className="text-body-lg font-bold truncate flex-1">
                {value instanceof File ? value.name : String(value)}
              </span>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                }}
                className="text-label-sm font-bold opacity-60 hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="cursor-pointer flex items-center gap-3 w-full hover:opacity-80 transition-opacity">
              <Upload size={24} className="text-[var(--color-ink-charcoal)]" />
              <span className="text-body-lg font-bold text-[var(--color-ink-charcoal)] placeholder">Click to upload a file</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onChange(file);
                  }
                }}
              />
            </label>
          )}
        </div>
      )}

      {error && (
        <p className="text-[var(--color-error)] text-label-md font-bold animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
}
