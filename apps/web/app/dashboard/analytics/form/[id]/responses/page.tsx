'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { AlertTriangle, RefreshCw } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { ResponsesHeader } from '@/components/analytics/form/responses/ResponsesHeader';
import { ResponsesToolbar } from '@/components/analytics/form/responses/ResponsesToolbar';
import { ResponsesTable } from '@/components/analytics/form/responses/ResponsesTable';
import { ResponseDetailModal } from '@/components/analytics/form/responses/ResponseDetailModal';
import { ResponsesSkeleton } from '@/components/analytics/form/responses/ResponsesSkeleton';
import { useFormResponses } from '@/hook/form/useFormResponses';

// ── Types ───────────────────────────────────────────────────────
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

// ── Error state ─────────────────────────────────────────────────
function ResponsesError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="bg-[#FF007F] border-4 border-ink-charcoal shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] p-12 text-center max-w-lg rotate-1">
        <AlertTriangle size={64} strokeWidth={2} className="text-pure-white mx-auto mb-4" />
        <h2 className="font-black text-5xl uppercase text-pure-white mb-4">
          VIBE CHECK FAILED!
        </h2>
        <p className="font-bold text-pure-white/80 text-lg mb-8">{message}</p>
        <button
          onClick={onRetry}
          className="bg-electric-sun text-ink-charcoal font-black uppercase text-xl px-8 py-4 border-4 border-ink-charcoal shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] hover:bg-pure-white transition-colors flex items-center gap-3 mx-auto active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <RefreshCw size={24} strokeWidth={3} />
          TRY AGAIN
        </button>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────
export default function FormResponsesPage() {
  const params = useParams();
  const formSlug = params?.id as string;

  // Pagination + filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<FormResponseItem | null>(null);

  const { data, isLoading, isError, error, refetch } = useFormResponses({
    formSlug,
    page,
    limit,
    search,
  });

  // Reset to page 1 when search or limit changes
  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleLimitChange = useCallback((val: number) => {
    setLimit(val);
    setPage(1);
  }, []);

  // Last response timestamp
  const lastResponseAt = useMemo(() => {
    if (!data?.responses.length) return null;
    return data.responses[0]?.submittedAt ?? null;
  }, [data]);

  return (
    <div className="text-ink-charcoal min-h-screen flex flex-col bg-dot-pattern">
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12 space-y-8">
        {isLoading ? (
          <ResponsesSkeleton />
        ) : isError ? (
          <ResponsesError
            message={
              (error as { message?: string })?.message ??
              'Could not load responses for this form.'
            }
            onRetry={refetch}
          />
        ) : data ? (
          <>
            {/* 1. Page header */}
            <ResponsesHeader
              formTitle={data.form.title}
              formSlug={data.form.slug}
              totalResponses={data.total}
              lastResponseAt={lastResponseAt}
            />

            {/* 2. Search + per-page toolbar */}
            <ResponsesToolbar
              search={search}
              onSearchChange={handleSearchChange}
              limit={limit}
              onLimitChange={handleLimitChange}
              totalResults={data.total}
            />

            {/* 3. Table + pagination */}
            <ResponsesTable
              responses={data.responses as FormResponseItem[]}
              total={data.total}
              page={page}
              pageSize={data.pageSize}
              onPageChange={setPage}
              onRowClick={setSelectedResponse}
            />
          </>
        ) : null}
      </main>

      <Footer />

      {/* 4. Detail modal (portal-like, rendered at root level) */}
      {selectedResponse && (
        <ResponseDetailModal
          responseId={selectedResponse.responseId}
          respondentIdentity={selectedResponse.respondentIdentity}
          respondentAvatar={selectedResponse.respondentAvatar}
          submittedAt={selectedResponse.submittedAt}
          answers={selectedResponse.answers}
          onClose={() => setSelectedResponse(null)}
        />
      )}
    </div>
  );
}
