"use client";

import React, { useEffect } from "react";
import {
  X,
  Star,
  Calendar,
  Hash,
  FileText,
  CheckSquare,
  Smile,
} from "lucide-react";
import { formatTimestamp, formatValue } from "./utils";

import { FormResponseAnswer } from "@repo/services/form/model";

interface ResponseDetailModalProps {
  responseId: string;
  respondentIdentity: string;
  respondentAvatar: string;
  submittedAt: string;
  answers: FormResponseAnswer[];
  onClose: () => void;
}

function FieldTypeIcon({ type }: { type: string }) {
  const cls = "shrink-0 mt-0.5";
  switch (type) {
    case "rating":
    case "scale":
      return <Star size={14} className={cls} strokeWidth={2.5} />;
    case "date":
      return <Calendar size={14} className={cls} strokeWidth={2.5} />;
    case "number":
      return <Hash size={14} className={cls} strokeWidth={2.5} />;
    case "checkbox":
    case "multi_select":
      return <CheckSquare size={14} className={cls} strokeWidth={2.5} />;
    case "mood":
      return <Smile size={14} className={cls} strokeWidth={2.5} />;
    default:
      return <FileText size={14} className={cls} strokeWidth={2.5} />;
  }
}

export function ResponseDetailModal({
  respondentIdentity,
  respondentAvatar,
  submittedAt,
  answers,
  onClose,
}: ResponseDetailModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const primaryAnswer = answers.find((a) => a.isPrimary);
  const otherAnswers = answers.filter((a) => !a.isPrimary);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-ink-charcoal/60 backdrop-blur-sm" />

      <div className="relative z-10 bg-canvas-cream border-4 border-ink-charcoal shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between gap-4 p-6 border-b-4 border-ink-charcoal bg-electric-sun">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-4 border-ink-charcoal bg-pure-white flex items-center justify-center font-black text-xl text-ink-charcoal shrink-0">
              {respondentAvatar}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-ink-charcoal/60">
                Respondent
              </p>
              <h2 className="font-black text-2xl uppercase text-ink-charcoal leading-tight break-all">
                {respondentIdentity}
              </h2>
              {primaryAnswer && (
                <p className="text-xs font-bold text-ink-charcoal/70 mt-0.5">
                  {primaryAnswer.fieldLabel}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="shrink-0 bg-ink-charcoal text-pure-white border-2 border-ink-charcoal p-2 hover:bg-[#FF007F] transition-colors shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="px-6 py-2 bg-pure-white border-b-4 border-ink-charcoal">
          <p className="text-xs font-bold text-ink-charcoal/60 uppercase tracking-wide">
            Submitted: {formatTimestamp(submittedAt)}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {otherAnswers.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-black text-xl uppercase text-ink-charcoal/40">
                No additional answers
              </p>
            </div>
          ) : (
            otherAnswers.map((answer) => (
              <div
                key={answer.fieldId}
                className="bg-pure-white border-4 border-ink-charcoal p-4 shadow-[4px_4px_0px_0px_rgba(44,46,42,1)]"
              >
                <div className="flex items-start gap-2 mb-2">
                  <FieldTypeIcon type={answer.fieldType} />
                  <p className="text-xs font-black uppercase tracking-widest text-ink-charcoal/60">
                    {answer.fieldLabel}
                  </p>
                </div>
                <p className="font-bold text-base text-ink-charcoal break-words whitespace-pre-wrap">
                  {answer.value == null ? (
                    <span className="text-ink-charcoal/30 italic">
                      No answer
                    </span>
                  ) : (
                    formatValue(answer.value, answer.fieldType)
                  )}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t-4 border-ink-charcoal bg-canvas-cream flex justify-end">
          <button
            onClick={onClose}
            className="bg-ink-charcoal text-pure-white font-black uppercase text-sm px-6 py-3 border-4 border-ink-charcoal shadow-[4px_4px_0px_0px_rgba(44,46,42,0.4)] hover:bg-[#FF007F] transition-colors active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
