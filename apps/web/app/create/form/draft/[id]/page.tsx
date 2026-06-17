"use client";

import React from "react";
import { ReactFlowProvider } from '@xyflow/react';
import Navbar from "@/components/Navbar";
import { FieldPalette } from "@/components/form-builder/field-palette";
import { FormPreviewCanvas } from "@/components/form-builder/form-canvas-preview";
import { FormLinearPreview } from "@/components/form-builder/form-linear-preview";
import { FieldSettings } from "@/components/form-builder/field-settings";
import { AgentChat } from "@/components/form-builder/agent-chat";
import { useFormBuilderStore } from "@/store/formStore/formBuilderStore";
import { List, GitMerge, Save, Loader2, Check, Send } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useUserInfoStore } from "@/store/userInfoStore";
import { useSaveDraftForm } from "@/hook/form/useSaveDraftForm";
import { useLoadDraftForm } from "@/hook/form/useLoadDraftForm";
import { usePublishForm } from "@/hook/form/usePublishForm";
import { PageLoader } from "@/components/PageLoader";
export default function FormDraftBuilderPage() {
  const router = useRouter();
  const { viewMode, setViewMode } = useFormBuilderStore();
  const params = useParams();
  const formSlug = params?.id as string;
  const { username } = useUserInfoStore();
  const { handleSaveDraft, isSaving } = useSaveDraftForm();
  const [isSaved, setIsSaved] = React.useState(false);
  const { handlePublishForm, isPublishing } = usePublishForm();
  const [isPublished, setIsPublished] = React.useState(false);
  const { loadDraft, isLoading } = useLoadDraftForm();

  React.useEffect(() => {
    if (formSlug) {
      loadDraft(formSlug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSlug]);

  const onSaveDraft = async () => {
    if (!username || !formSlug) return;
    
    const nodes = useFormBuilderStore.getState().nodes;
    
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
      router.push(`/dashboard/analytics/form/${response.formSlug}`)
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading Draft..." />;
  }

  return (
    <div className="bg-canvas-cream h-screen overflow-hidden flex flex-col font-body-md text-ink-charcoal selection:bg-electric-sun selection:text-ink-charcoal">
      {/* Top Navigation */}
      <Navbar />

      {/* View Toolbar */}
      <div className="border-b-2 border-ink-charcoal bg-pure-white px-4 py-2 flex justify-between items-center z-20 shadow-[0_2px_0px_0px_rgba(44,46,42,1)] relative">
        <div className="flex-1" />
        <div className="flex bg-surface-container-low border-2 border-ink-charcoal rounded p-1">
          <button 
            onClick={() => setViewMode('linear')}
            className={`flex items-center gap-2 px-4 py-2 rounded font-label-md transition-colors ${viewMode === 'linear' ? 'bg-electric-sun border-2 border-ink-charcoal shadow-[2px_2px_0px_0px_rgba(44,46,42,1)]' : 'border-2 border-transparent hover:bg-pure-white'}`}
          >
            <List className="w-5 h-5" />
            Normal View
          </button>
          <button 
            onClick={() => setViewMode('canvas')}
            className={`flex items-center gap-2 px-4 py-2 rounded font-label-md transition-colors ${viewMode === 'canvas' ? 'bg-electric-sun border-2 border-ink-charcoal shadow-[2px_2px_0px_0px_rgba(44,46,42,1)]' : 'border-2 border-transparent hover:bg-pure-white'}`}
          >
            <GitMerge className="w-5 h-5" />
            Logic Canvas
          </button>
        </div>
        <div className="flex-1 flex justify-end gap-2">
          <button 
            onClick={onSaveDraft}
            disabled={isSaving || isSaved || isPublishing}
            className="flex items-center gap-2 px-6 py-2 bg-leaf-green text-pure-white font-bold font-label-md uppercase border-2 border-ink-charcoal rounded shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] transition-all active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : isSaved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {isSaving ? "Saving..." : isSaved ? "Saved" : "Save Draft"}
          </button>
          
          <button 
            onClick={onPublish}
            disabled={isPublishing || isPublished || isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-electric-sun text-ink-charcoal font-bold font-label-md uppercase border-2 border-ink-charcoal rounded shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] transition-all active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : isPublished ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5" />}
            {isPublishing ? "Publishing..." : isPublished ? "Published" : "Publish"}
          </button>
        </div>
      </div>

      {/* Main Builder Layout - fixed height to allow canvas scrolling/zooming */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <ReactFlowProvider>
          {/* Left Sidebar: Field Palette */}
          <FieldPalette />

          {/* Center Canvas or Linear Layout */}
          {viewMode === 'canvas' ? <FormPreviewCanvas /> : <FormLinearPreview />}

          {/* Right Sidebar: Field Settings & Properties */}
          <FieldSettings />
        </ReactFlowProvider>
      </main>

      {/* Agent Chat Widget */}
      <AgentChat />
    </div>
  );
}
