'use client';

import React from 'react';

// Pastel avatar background colors — cycle by index
const AVATAR_COLORS = [
  '#F5E211', // electric-sun
  '#ffb3e6', // pink
  '#a3defe', // sky blue
  '#c1c9b6', // sage
  '#8ED462', // leaf green
  '#FFD700', // gold
  '#F4A460', // sandy
  '#DDA0DD', // plum
];

interface FormResponseAnswer {
  fieldId: string;
  fieldLabel: string;
  fieldType: string;
  isPrimary: boolean;
  value: unknown;
}

interface ResponseRowProps {
  responseId: string;
  respondentIdentity: string;
  respondentAvatar: string;   // 1-2 initials
  submittedAt: string;        // ISO string
  answers: FormResponseAnswer[];
  index: number;              // for cycling avatar color
  onClick: () => void;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getPreviewText(answers: FormResponseAnswer[]): string {
  // Show first non-primary text answer as preview
  const firstText = answers.find(
    (a) =>
      !a.isPrimary &&
      (a.fieldType === 'short_text' ||
        a.fieldType === 'long_text' ||
        a.fieldType === 'email' ||
        a.fieldType === 'number') &&
      a.value,
  );
  if (firstText) {
    const val = String(firstText.value);
    return val.length > 80 ? val.slice(0, 80) + '…' : val;
  }

  // Fall back to any answer
  const any = answers.find((a) => !a.isPrimary && a.value != null);
  if (any) {
    const val = Array.isArray(any.value)
      ? (any.value as string[]).join(', ')
      : String(any.value);
    return val.length > 80 ? val.slice(0, 80) + '…' : val;
  }

  return '—';
}

export function ResponseRow({
  respondentIdentity,
  respondentAvatar,
  submittedAt,
  answers,
  index,
  onClick,
}: ResponseRowProps) {
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length]!;
  const preview = getPreviewText(answers);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center bg-pure-white hover:bg-canvas-cream transition-colors cursor-pointer group"
    >
      {/* Avatar + identity */}
      <div className="col-span-1 md:col-span-3 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full border-2 border-ink-charcoal flex items-center justify-center font-black text-sm text-ink-charcoal shrink-0 transition-transform group-hover:scale-110"
          style={{ backgroundColor: avatarColor }}
        >
          {respondentAvatar}
        </div>
        <span className="font-bold text-base text-ink-charcoal truncate">
          {respondentIdentity}
        </span>
      </div>

      {/* Preview of first non-primary answer */}
      <div className="col-span-1 md:col-span-7 text-base text-ink-charcoal/70 truncate">
        {preview}
      </div>

      {/* Timestamp */}
      <div className="col-span-1 md:col-span-2 text-left md:text-right text-xs font-bold uppercase tracking-wide text-ink-charcoal/50">
        {formatTimestamp(submittedAt)}
      </div>
    </div>
  );
}
