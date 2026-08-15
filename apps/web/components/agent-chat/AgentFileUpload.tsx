"use client";

import React, { useRef, useState } from "react";
import { Paperclip, AlertCircle, X } from "lucide-react";

interface AgentFileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/markdown",
];
const MAX_SIZE_MB = 10;

export default function AgentFileUpload({
  onFileSelect,
  selectedFile,
  onClear,
}: AgentFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const validate = (file: File): boolean => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Unsupported file type. Use PDF, TXT, DOC, DOCX, or MD.");
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File exceeds ${MAX_SIZE_MB} MB limit.`);
      return false;
    }
    setError(null);
    return true;
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validate(file)) {
      onFileSelect(file);
    }
    e.target.value = "";
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    onClear();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={() => !selectedFile && inputRef.current?.click()}
        className="flex items-center gap-2 w-full px-3 py-2 rounded border-2 border-ink-charcoal bg-pure-white hover:bg-lavender hover:shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] transition-all text-label-sm font-bold text-ink-charcoal"
        aria-label={selectedFile ? `Selected file: ${selectedFile.name}` : "Choose a file to upload"}
      >
        <Paperclip className="w-4 h-4 shrink-0" />
        <span className="min-w-0 truncate">
          {selectedFile ? selectedFile.name : "Choose a file…"}
        </span>
        {selectedFile ? (
          <button
            type="button"
            onClick={handleClear}
            className="ml-auto shrink-0 p-0.5 rounded hover:bg-ink-charcoal/10 transition-colors"
            aria-label="Clear selected file"
          >
            <X className="w-3.5 h-3.5 text-ink-charcoal/70" />
          </button>
        ) : (
          <span className="ml-auto shrink-0 text-ink-charcoal/50 font-medium text-[11px]">
            PDF · TXT · DOC · DOCX · MD
          </span>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,.doc,.docx,.md"
        className="sr-only"
        onChange={onInputChange}
        aria-label="File upload input"
      />

      {error && (
        <div
          className="flex items-center gap-1.5 text-[#ff4b4b] font-medium text-label-sm"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
