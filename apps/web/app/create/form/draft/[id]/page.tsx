"use client";

import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import Navbar from "@/components/Navbar";
import { FieldPalette } from "@/components/form-builder/field-palette";
import { FormPreviewCanvas } from "@/components/form-builder/form-canvas-preview";
import { FormLinearPreview } from "@/components/form-builder/form-linear-preview";
import { FieldSettings } from "@/components/form-builder/field-settings";
import { AgentChat } from "@/components/form-builder/agent-chat";
import { useFormBuilderStore } from "@/store/formStore/formBuilderStore";
import { FormSettingsModal } from "@/components/form-builder/FormSettingsModal";
import {
  List,
  GitMerge,
  Save,
  Loader2,
  Check,
  Send,
  Ghost,
  Home,
  Settings,
  BarChart2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useUserInfoStore } from "@/store/userInfoStore";
import { useSaveDraftForm } from "@/hook/form/useSaveDraftForm";
import { useLoadDraftForm } from "@/hook/form/useLoadDraftForm";
import { usePublishForm } from "@/hook/form/usePublishForm";

import PageLoader from "@/components/PageLoader";
export default function FormDraftBuilderPage() {
  const router = useRouter();
  const { viewMode, setViewMode } = useFormBuilderStore();
  const params = useParams();
  const formSlug = params?.id as string;
  const { username, isGoogleDriveConnected } = useUserInfoStore();
  const { handleSaveDraft, isSaving } = useSaveDraftForm();
  const [isSaved, setIsSaved] = React.useState(false);
  const { handlePublishForm, isPublishing } = usePublishForm();
  const [isPublished, setIsPublished] = React.useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);
  const { loadDraft, isLoading, apiError, isFormPublished } =
    useLoadDraftForm();

  React.useEffect(() => {
    if (formSlug) {
      loadDraft(formSlug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSlug]);

  const onSaveDraft = async () => {
    if (!username || !formSlug) return;

    const nodes = useFormBuilderStore.getState().nodes;

    const hasFileField = nodes.some((node) => node.data.type === "file");
    if (hasFileField && !isGoogleDriveConnected) {
      return;
    }

    const fields = nodes.map((node) => ({
      id: node.id,
      type: node.data.type,
      label: node.data.label,
      placeholder: node.data.placeholder,
      isRequired: node.data.isRequired,
      isPrimary: node.data.isPrimary,
      helperText: node.data.helperText,
      options: node.data.options,
    }));

    const success = await handleSaveDraft({
      formSlug,
      fields,
    });

    if (success) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const onPublish = async () => {
    if (!username || !formSlug) return;

    const nodes = useFormBuilderStore.getState().nodes;

    const hasFileField = nodes.some((node) => node.data.type === "file");
    if (hasFileField && !isGoogleDriveConnected) {
      return;
    }

    const fields = nodes.map((node) => ({
      id: node.id,
      type: node.data.type,
      label: node.data.label,
      placeholder: node.data.placeholder,
      isRequired: node.data.isRequired,
      isPrimary: node.data.isPrimary,
      helperText: node.data.helperText,
      options: node.data.options,
    }));

    const response = await handlePublishForm({
      formSlug,
      fields,
    });

    if (response.success && response.formSlug) {
      setIsPublished(true);
      setTimeout(() => setIsPublished(false), 2000);
      router.replace(`/dashboard/analytics/form/${response.formSlug}`);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (apiError) {
    return (
      <div className="bg-canvas-cream bg-dot-pattern h-screen flex flex-col items-center justify-center font-body-md text-ink-charcoal selection:bg-electric-sun selection:text-ink-charcoal p-6 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-leaf-green/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-electric-sun/20 rounded-full blur-3xl" />

        <div className="w-full max-w-md bg-white border-[3px] border-ink-charcoal shadow-hard p-8 flex flex-col items-center text-center relative animate-fade-up z-10">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-electric-sun border-b-[3px] border-ink-charcoal" />

          {/* Icon */}
          <div className="w-20 h-20 bg-canvas-cream border-[3px] border-ink-charcoal rounded flex items-center justify-center mt-4 mb-6 shadow-[4px_4px_0px_0px_rgba(44,46,42,1)]">
            <Ghost className="w-10 h-10 text-ink-charcoal" strokeWidth={2.5} />
          </div>

          <h1 className="text-display-sm font-bold mb-3 uppercase tracking-tight">
            Form Not Found
          </h1>

          <div className="w-16 h-1.5 bg-ink-charcoal mb-5" />

          <p className="text-body-lg font-bold opacity-80 mb-8 leading-relaxed">
            {apiError ||
              "We couldn't track down this form. It may have been deleted, or you might not have the correct permissions."}
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="group flex items-center gap-2 px-8 py-3.5 bg-leaf-green text-pure-white font-bold font-label-md uppercase border-[3px] border-ink-charcoal shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] transition-all active:translate-y-0 active:shadow-none"
          >
            <Home
              className="w-5 h-5 transition-transform group-hover:-rotate-12"
              strokeWidth={2.5}
            />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-canvas-cream bg-dot-pattern h-screen flex flex-col font-body-md text-ink-charcoal selection:bg-electric-sun selection:text-ink-charcoal relative overflow-hidden">
      {/* Top Navigation */}
      <Navbar />

      {/* View Toolbar */}
      <div className="border-b-2 border-ink-charcoal bg-pure-white px-2 sm:px-4 py-2 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 md:gap-0 z-20 shadow-[0_2px_0px_0px_rgba(44,46,42,1)] relative">
        <div className="hidden md:flex flex-1" />
        {/* View Mode Toggle */}
        <div className="flex bg-surface-container-low border-2 border-ink-charcoal rounded p-1 w-full sm:w-auto justify-center">
          <button
            onClick={() => setViewMode("linear")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded font-label-md transition-colors text-sm sm:text-base ${viewMode === "linear" ? "bg-electric-sun border-2 border-ink-charcoal shadow-[2px_2px_0px_0px_rgba(44,46,42,1)]" : "border-2 border-transparent hover:bg-pure-white"}`}
          >
            <List className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Normal View</span>
          </button>
          <button
            onClick={() => setViewMode("canvas")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded font-label-md transition-colors text-sm sm:text-base ${viewMode === "canvas" ? "bg-electric-sun border-2 border-ink-charcoal shadow-[2px_2px_0px_0px_rgba(44,46,42,1)]" : "border-2 border-transparent hover:bg-pure-white"}`}
          >
            <GitMerge className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Logic Canvas</span>
          </button>
        </div>
        {/* Action Buttons */}
        <div className="flex-1 flex justify-center sm:justify-end gap-1.5 sm:gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 sm:px-6 py-2 bg-surface-variant text-ink-charcoal font-bold font-label-md uppercase border-2 border-ink-charcoal rounded shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] transition-all active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <button
            onClick={onSaveDraft}
            disabled={isSaving || isSaved || isPublishing}
            className="flex items-center gap-1.5 px-3 sm:px-6 py-2 bg-leaf-green text-pure-white font-bold font-label-md uppercase border-2 border-ink-charcoal rounded shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] transition-all active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : isSaved ? (
              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span className="hidden sm:inline">
              {isSaving
                ? "Saving..."
                : isSaved
                  ? "Saved"
                  : isFormPublished
                    ? "Save"
                    : "Save Draft"}
            </span>
            <span className="sm:hidden">
              {isSaving ? "..." : isSaved ? "✓" : ""}
            </span>
          </button>

          {!isFormPublished ? (
            <button
              onClick={onPublish}
              disabled={isPublishing || isPublished || isSaving}
              className="flex items-center gap-1.5 px-3 sm:px-6 py-2 bg-electric-sun text-ink-charcoal font-bold font-label-md uppercase border-2 border-ink-charcoal rounded shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] transition-all active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPublishing ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : isPublished ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              <span className="hidden sm:inline">
                {isPublishing
                  ? "Publishing..."
                  : isPublished
                    ? "Published"
                    : "Publish"}
              </span>
            </button>
          ) : (
            <button
              onClick={() =>
                router.replace(`/dashboard/analytics/form/${formSlug}`)
              }
              className="flex items-center gap-1.5 px-3 sm:px-6 py-2 bg-electric-sun text-ink-charcoal font-bold font-label-md uppercase border-2 border-ink-charcoal rounded shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] transition-all active:translate-y-0 active:shadow-none"
            >
              <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">View Analytics</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Builder Layout - fixed height to allow canvas scrolling/zooming */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative min-h-0">
        <ReactFlowProvider>
          {/* Top (mobile) / Left (desktop) Sidebar: Field Palette */}
          <FieldPalette />

          {/* Center Canvas or Linear Layout */}
          {viewMode === "canvas" ? (
            <FormPreviewCanvas />
          ) : (
            <FormLinearPreview />
          )}

          {/* Bottom (mobile) / Right (desktop) Sidebar: Field Settings & Properties */}
          <FieldSettings />
        </ReactFlowProvider>
      </main>

      {/* Agent Chat Widget */}
      <AgentChat />

      {/* Form Settings Modal */}
      <FormSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        formSlug={formSlug}
      />
    </div>
  );
}
