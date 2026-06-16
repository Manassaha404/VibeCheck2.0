'use client';

import React from 'react';
import { Wind } from 'lucide-react';
import { ResponseRow } from './ResponseRow';
import { ResponsesPagination } from './ResponsesPagination';

interface FormResponseAnswer {
  fieldId: string;
  fieldLabel: string;
  fieldType: string;
  isPrimary: boolean;
  value: unknown;
}

interface FormResponseItem {
  responseId: string;
  respondentIdentity: string;
  respondentAvatar: string;
  submittedAt: string;
  answers: FormResponseAnswer[];
}

interface ResponsesTableProps {
  responses: FormResponseItem[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onRowClick: (response: FormResponseItem) => void;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="bg-canvas-cream border-4 border-ink-charcoal shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] p-8 text-center -rotate-1">
        <Wind size={48} strokeWidth={1.5} className="text-ink-charcoal/30 mx-auto mb-3" />
        <p className="font-black text-2xl uppercase text-ink-charcoal">
          No Vibes Yet
        </p>
        <p className="font-bold text-sm text-ink-charcoal/50 mt-1">
          Responses will appear here once submitted
        </p>
      </div>
    </div>
  );
}

export function ResponsesTable({
  responses,
  total,
  page,
  pageSize,
  onPageChange,
  onRowClick,
}: ResponsesTableProps) {
  return (
    <section className="bg-pure-white border-4 border-ink-charcoal shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] overflow-hidden flex flex-col w-full">
      {/* Column headers */}
      <div className="grid grid-cols-12 gap-4 p-4 border-b-4 border-ink-charcoal bg-canvas-cream font-black text-xs uppercase tracking-widest text-ink-charcoal hidden md:grid">
        <div className="col-span-3">Respondent</div>
        <div className="col-span-7">Response Preview</div>
        <div className="col-span-2 text-right">Submitted</div>
      </div>

      {/* Rows */}
      {responses.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col divide-y-4 divide-ink-charcoal">
          {responses.map((r, i) => (
            <ResponseRow
              key={r.responseId}
              responseId={r.responseId}
              respondentIdentity={r.respondentIdentity}
              respondentAvatar={r.respondentAvatar}
              submittedAt={r.submittedAt}
              answers={r.answers}
              index={i + (page - 1) * pageSize}
              onClick={() => onRowClick(r)}
            />
          ))}
        </div>
      )}

      {/* Pagination footer */}
      <ResponsesPagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
      />
    </section>
  );
}
