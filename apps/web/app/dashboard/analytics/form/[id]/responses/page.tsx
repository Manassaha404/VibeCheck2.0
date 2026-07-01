'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { ResponsesHeader } from '@/components/analytics/form/responses/ResponsesHeader';
import { ResponsesToolbar } from '@/components/analytics/form/responses/ResponsesToolbar';
import { ResponsesTable } from '@/components/analytics/form/responses/ResponsesTable';
import { ResponseDetailModal } from '@/components/analytics/form/responses/ResponseDetailModal';
import PageLoader from '@/components/PageLoader';
import { DashboardError } from '@/components/Dashboard/DashboardError';
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

  if (isLoading) {
    return <PageLoader />;
  }

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
        {isError ? (
          <DashboardError
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
