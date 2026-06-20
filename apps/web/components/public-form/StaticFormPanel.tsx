import React, { useState, useEffect } from "react";
import { z } from "zod";
import { ChevronRight, Sparkles, Loader2, Send } from "lucide-react";
import { SuccessScreen } from "./SuccessScreen";
import { FieldInput, Field } from "./FieldInput";
import { useSubmitStaticForm } from "../../hook/form/useSubmitStaticForm";

const buildFormSchema = (fields: Field[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach(f => {
    let fieldSchema: z.ZodTypeAny;

    if (f.type === 'email') {
      fieldSchema = f.isRequired 
        ? z.string().min(1, "This field is required").email("Invalid email format")
        : z.union([z.literal(""), z.string().email("Invalid email format")]).optional().nullable();
    } else if (f.type === 'checkbox' || f.type === 'multi_select') {
      fieldSchema = f.isRequired
        ? z.array(z.string()).min(1, "Please select at least one option")
        : z.array(z.string()).optional().nullable();
    } else if (f.type === 'number' || f.type === 'rating' || f.type === 'scale') {
      fieldSchema = f.isRequired
        ? z.union([z.number(), z.string().min(1, "This field is required")])
        : z.union([z.number(), z.string()]).optional().nullable();
    } else if (f.type === 'file') {
      fieldSchema = f.isRequired
        ? z.string().min(1, "Please upload a file")
        : z.union([z.literal(""), z.string()]).optional().nullable();
    } else {
      fieldSchema = f.isRequired
        ? z.string().min(1, "This field is required")
        : z.union([z.literal(""), z.string()]).optional().nullable();
    }
    
    if (f.type === 'checkbox' || f.type === 'multi_select') {
      shape[f.fieldId] = z.preprocess((v) => v || [], fieldSchema);
    } else {
      shape[f.fieldId] = z.preprocess((v) => (v === undefined || v === null ? "" : v), fieldSchema);
    }
  });

  return z.object(shape);
};

export function StaticFormPanel({
  form,
  previousAnswers,
  responseId,
  onSwitchToAgent,
  onSuccess,
  hideAiMode,
}: {
  form: {
    formId: string;
    title: string;
    description: string | null;
    slug: string;
    fields: Field[];
  };
  previousAnswers?: Record<string, unknown>;
  responseId?: string;
  onSwitchToAgent: () => void;
  onSuccess?: () => void;
  hideAiMode?: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, unknown>>(previousAnswers || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [uploadingFields, setUploadingFields] = useState<Set<string>>(new Set());

  const submitMutation = useSubmitStaticForm({
    onSuccess: () => {
      setSubmitted(true);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error(error);
      alert(error.message || "Failed to submit form");
    }
  });

  useEffect(() => {
    if (previousAnswers) {
      setAnswers(prev => ({ ...previousAnswers, ...prev }));
    }
  }, [previousAnswers]);

  if (!form) return null;

  if (submitted) {
    return <SuccessScreen formTitle={form.title} onReset={() => setSubmitted(false)} />;
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* AI suggestion banner */}
      {!hideAiMode && (
        <button
          id="try-ai-banner"
          onClick={onSwitchToAgent}
          className="w-full flex items-center gap-3 bg-[var(--color-electric-sun)] border-[3px] border-[var(--color-ink-charcoal)] rounded-xl px-5 py-4 shadow-hard hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-none transition-all text-left group"
        >
          <Sparkles size={24} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
          <div className="flex-1 min-w-0">
            <p className="text-headline-sm font-bold text-[var(--color-ink-charcoal)]">Try AI Mode</p>
            <p className="text-body-md opacity-80 mt-1 font-bold">Let our AI guide you through this form conversationally</p>
          </div>
          <ChevronRight size={24} className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>
      )}

      {/* Fields */}
      <div className="space-y-8 mt-8">
        {form.fields.map((field) => {
          const primaryField = form.fields.find(f => f.isPrimary);
          const primaryFieldValue = primaryField ? String(answers[primaryField.fieldId] || "") : undefined;

          return (
            <FieldInput
              key={field.fieldId}
              field={field}
              formId={form.formId}
              value={answers[field.fieldId]}
              primaryFieldValue={primaryFieldValue || undefined}
              error={errors[field.fieldId]}
              onChange={(val) => {
                setAnswers((prev) => ({ ...prev, [field.fieldId]: val }));
                if (errors[field.fieldId]) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[field.fieldId];
                    return newErrors;
                  });
                }
              }}
              onUploadingChange={(isUploading) => {
                setUploadingFields((prev) => {
                  const next = new Set(prev);
                  if (isUploading) next.add(field.fieldId);
                  else next.delete(field.fieldId);
                  return next;
                });
              }}
            />
          );
        })}
      </div>

      {/* Submit */}
      <div className="pt-8 mt-8 border-t-[3px] border-[var(--color-ink-charcoal)]">
        <button
          id="form-submit-btn"
          disabled={submitMutation.isPending || uploadingFields.size > 0}
          onClick={() => {
            const schema = buildFormSchema(form.fields);
            const result = schema.safeParse(answers);

            if (!result.success) {
              const formatted = result.error.format();
              const newErrors: Record<string, string> = {};
              Object.keys(formatted).forEach(key => {
                if (key !== '_errors') {
                  newErrors[key] = (formatted[key as keyof typeof formatted] as any)._errors[0];
                }
              });
              setErrors(newErrors);
              
              const firstErrorFieldId = Object.keys(newErrors)[0];
              if (firstErrorFieldId) {
                 const el = document.getElementById(`field-container-${firstErrorFieldId}`);
                 if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }
              return;
            }

            setErrors({});

            submitMutation.mutate({
              formId: form.formId,
              answers,
              responseId,
            });
          }}
          className="w-full md:w-auto md:min-w-[240px] bg-[var(--color-leaf-green)] text-[var(--color-ink-charcoal)] font-bold text-headline-sm py-4 px-8 border-[3px] border-[var(--color-ink-charcoal)] shadow-hard hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-none active:bg-[var(--color-primary-container)] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
        >
          {submitMutation.isPending ? (
            <><Loader2 size={24} className="animate-spin" /> Submitting…</>
          ) : uploadingFields.size > 0 ? (
            <><Loader2 size={24} className="animate-spin" /> Uploading Files…</>
          ) : (
            <>
              {responseId ? "Update Feedback" : "Submit Feedback"}
              <Send size={24} strokeWidth={2.5} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
