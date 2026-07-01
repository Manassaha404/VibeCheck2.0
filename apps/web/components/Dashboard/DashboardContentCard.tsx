"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart2,
  FileText,
  Megaphone,
  ExternalLink,
  MoreHorizontal,
  Eye,
  Users,
  Clock,
  Archive,
  Trash2,
  Loader2,
  Zap,
} from "lucide-react";
import { trpc } from "@/trpc/client";

export type ContentType = "poll" | "form" | "petition";
export type ContentStatus = "draft" | "active" | "closed" | "archived";

export interface DashboardItem {
  id: string;
  type: ContentType;
  title: string;
  description?: string | null;
  slug: string;
  status: ContentStatus;
  responses: number;
  createdAt: string; // ISO string from the service
  href?: string;
}

interface DashboardContentCardProps {
  item: DashboardItem;
  onActionSuccess?: () => void;
}

const typeConfig: Record<
  ContentType,
  { icon: React.ReactNode; label: string; color: string; bg: string }
> = {
  poll: {
    icon: <BarChart2 size={16} strokeWidth={2.5} />,
    label: "Poll",
    color: "text-[var(--color-primary)]",
    bg: "bg-[var(--color-primary-container)]",
  },
  form: {
    icon: <FileText size={16} strokeWidth={2.5} />,
    label: "Form",
    color: "text-[var(--color-secondary)]",
    bg: "bg-[var(--color-secondary-container)]",
  },
  petition: {
    icon: <Megaphone size={16} strokeWidth={2.5} />,
    label: "Petition",
    color: "text-[var(--color-ink-charcoal)]",
    bg: "bg-[var(--color-sky-blue)]",
  },
};

const statusConfig: Record<ContentStatus, { label: string; class: string }> = {
  active: {
    label: "Active",
    class:
      "bg-[var(--color-leaf-green)] text-[var(--color-ink-charcoal)]",
  },
  draft: {
    label: "Draft",
    class:
      "bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]",
  },
  closed: {
    label: "Closed",
    class: "bg-[var(--color-vivid-coral)] text-[var(--color-pure-white)]",
  },
  archived: {
    label: "Archived",
    class:
      "bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)]",
  },
};

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoString;
  }
}

export function DashboardContentCard({
  item,
  onActionSuccess,
}: DashboardContentCardProps) {
  const tc = typeConfig[item.type];
  const sc = statusConfig[item.status];
  const detailHref = item.href ?? `/${item.type}/${item.slug}`;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setConfirmDelete(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // ── tRPC mutations ──────────────────────────────────────────────

  const utils = trpc.useUtils();

  const invalidateDashboard = () => {
    utils.form.getDashboard.invalidate();
    utils.poll.getDashboard.invalidate();
    utils.petition.getDashboard.invalidate();
  };

  // Form mutations
  const archiveForm = trpc.form.archiveItem.useMutation({
    onSuccess: () => { invalidateDashboard(); onActionSuccess?.(); setDropdownOpen(false); },
  });
  const activateForm = trpc.form.activateItem.useMutation({
    onSuccess: () => { invalidateDashboard(); onActionSuccess?.(); setDropdownOpen(false); },
  });
  const deleteForm = trpc.form.deleteItem.useMutation({
    onSuccess: () => { invalidateDashboard(); onActionSuccess?.(); setDropdownOpen(false); setConfirmDelete(false); },
  });

  // Poll mutations
  const archivePoll = trpc.poll.archiveItem.useMutation({
    onSuccess: () => { invalidateDashboard(); onActionSuccess?.(); setDropdownOpen(false); },
  });
  const activatePoll = trpc.poll.activateItem.useMutation({
    onSuccess: () => { invalidateDashboard(); onActionSuccess?.(); setDropdownOpen(false); },
  });
  const deletePoll = trpc.poll.deleteItem.useMutation({
    onSuccess: () => { invalidateDashboard(); onActionSuccess?.(); setDropdownOpen(false); setConfirmDelete(false); },
  });

  // Petition mutations
  const archivePetition = trpc.petition.archiveItem.useMutation({
    onSuccess: () => { invalidateDashboard(); onActionSuccess?.(); setDropdownOpen(false); },
  });
  const activatePetition = trpc.petition.activateItem.useMutation({
    onSuccess: () => { invalidateDashboard(); onActionSuccess?.(); setDropdownOpen(false); },
  });
  const deletePetition = trpc.petition.deleteItem.useMutation({
    onSuccess: () => { invalidateDashboard(); onActionSuccess?.(); setDropdownOpen(false); setConfirmDelete(false); },
  });

  const isArchiving =
    archiveForm.isPending || archivePoll.isPending || archivePetition.isPending;
  const isActivating =
    activateForm.isPending || activatePoll.isPending || activatePetition.isPending;
  const isDeleting =
    deleteForm.isPending || deletePoll.isPending || deletePetition.isPending;
  const isMutating = isArchiving || isActivating || isDeleting;

  function handleArchive() {
    if (item.type === "form") {
      archiveForm.mutate({ formSlug: item.slug });
    } else if (item.type === "poll") {
      archivePoll.mutate({ pollId: item.id });
    } else {
      archivePetition.mutate({ petitionId: item.id });
    }
  }

  function handleActivate() {
    if (item.type === "form") {
      activateForm.mutate({ formSlug: item.slug });
    } else if (item.type === "poll") {
      activatePoll.mutate({ pollId: item.id });
    } else {
      activatePetition.mutate({ petitionId: item.id });
    }
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    if (item.type === "form") {
      deleteForm.mutate({ formSlug: item.slug });
    } else if (item.type === "poll") {
      deletePoll.mutate({ pollId: item.id });
    } else {
      deletePetition.mutate({ petitionId: item.id });
    }
  }

  const responseLabel =
    item.type === "petition" ? "signatures" : item.type === "form" ? "responses" : "votes";

  let actionHref = `/dashboard/analytics/${item.type}/${item.slug}`;
  let actionLabel = "Analytics";
  let ActionIcon = BarChart2;

  if (item.status === "draft") {
    actionHref = `/create/${item.type}/draft/${item.id}`;
    actionLabel = "Edit Draft";
    ActionIcon = FileText;
  }

  return (
    <article
      id={`content-card-${item.id}`}
      className="group bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-xl p-5 shadow-hard card-lift flex flex-col gap-4 h-[260px]"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Type badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[var(--color-outline-variant)] text-label-sm font-bold ${tc.bg} ${tc.color}`}
          >
            {tc.icon}
            {tc.label}
          </span>
          {/* Status badge */}
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-label-sm font-bold border border-[var(--color-ink-charcoal)] ${sc.class}`}
          >
            {sc.label}
          </span>
        </div>

        {/* 3-dot menu */}
        <div className="relative">
          <button
            ref={btnRef}
            id={`card-menu-btn-${item.id}`}
            aria-label="More options"
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            disabled={isMutating}
            onClick={() => {
              setDropdownOpen((prev) => !prev);
              setConfirmDelete(false);
            }}
            className="p-1.5 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface-variant)] disabled:opacity-40"
          >
            {isMutating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <MoreHorizontal size={18} />
            )}
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              role="menu"
              aria-label="Card actions"
              className="absolute right-0 top-full mt-1.5 w-44 bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-xl shadow-hard z-50 overflow-hidden"
            >
              {/* Archive / Activate toggle based on current status */}
              {item.status === "archived" ? (
                <button
                  role="menuitem"
                  id={`card-activate-${item.id}`}
                  disabled={isActivating}
                  onClick={handleActivate}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-label-md font-medium text-[var(--color-leaf-green)] hover:bg-[var(--color-surface-container)] transition-colors disabled:opacity-50"
                >
                  {isActivating ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Zap size={15} />
                  )}
                  Activate
                </button>
              ) : (
                <button
                  role="menuitem"
                  id={`card-archive-${item.id}`}
                  disabled={isArchiving}
                  onClick={handleArchive}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-label-md font-medium text-[var(--color-ink-charcoal)] hover:bg-[var(--color-surface-container)] transition-colors disabled:opacity-50"
                >
                  {isArchiving ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Archive size={15} />
                  )}
                  Archive
                </button>
              )}

              {/* Divider */}
              <div className="h-px bg-[var(--color-outline-variant)]" />

              {/* Delete option — with inline confirmation */}
              <button
                role="menuitem"
                id={`card-delete-${item.id}`}
                disabled={isDeleting}
                onClick={handleDelete}
                className={[
                  "w-full flex items-center gap-2.5 px-4 py-2.5 text-label-md font-medium transition-colors disabled:opacity-50",
                  confirmDelete
                    ? "bg-[var(--color-vivid-coral)] text-white hover:bg-[var(--color-vivid-coral)]"
                    : "text-[var(--color-error)] hover:bg-[var(--color-error-container)]",
                ].join(" ")}
              >
                {isDeleting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}
                {confirmDelete ? "Confirm Delete" : "Delete"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title + description */}
      <div className="flex-1">
        <h3 className="text-headline-sm font-display font-bold text-[var(--color-ink-charcoal)] line-clamp-2 leading-tight">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-body-md text-[var(--color-on-surface-variant)] mt-1.5 line-clamp-2">
            {item.description}
          </p>
        )}
      </div>

      {/* Footer meta */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--color-outline-variant)]">
        <div className="flex items-center gap-4 text-label-sm text-[var(--color-on-surface-variant)]">
          <span className="inline-flex items-center gap-1.5">
            <Users size={13} />
            {item.responses.toLocaleString()} {responseLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} />
            {formatDate(item.createdAt)}
          </span>
        </div>

        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 text-label-sm font-bold text-[var(--color-primary)] hover:underline"
        >
          <ActionIcon size={13} />
          {actionLabel}
          <ExternalLink size={11} />
        </Link>
      </div>
    </article>
  );
}
