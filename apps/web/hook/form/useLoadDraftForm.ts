import { useState } from "react";
import { trpc } from "@/trpc/client";
import { useFormBuilderStore, FieldNode } from "@/store/formStore/formBuilderStore";

export const useLoadDraftForm = () => {
  const [apiError, setApiError] = useState<string | null>(null);

  const { mutateAsync: loadDraftMutation, isPending: isLoading } =
    trpc.form.loadSaveDraft.useMutation();
  const { setNodes, syncLinearEdges, setFormId } = useFormBuilderStore();

  const loadDraft = async (formSlug: string) => {
    setApiError(null);
    try {
      const response = await loadDraftMutation({ formSlug });
      if (response?.form) {
        const sortedFields = response.fields.sort(
          (a: any, b: any) => a.orderIndex - b.orderIndex,
        );

        // Persist the formId (UUID) to the store so the agent can use it
        setFormId(response.form.formId);

        const nodes: FieldNode[] = sortedFields.map(
          (field: any, index: number) => ({
            id: field.fieldId,
            type: "fieldNode",
            position: { x: 350, y: 50 + index * 250 },
            data: {
              label: field.label,
              type: field.type,
              placeholder: field.placeholder || undefined,
              helperText: field.helperText || undefined,
              isRequired: field.isRequired,
              isPrimary: field.isPrimary,
              options: field.options || undefined,
            },
          }),
        );

        setNodes(nodes);
        syncLinearEdges();
        return true;
      }
      return false;
    } catch (error: any) {
      setApiError(error.message || "Failed to load draft.");
      return false;
    }
  };

  return { loadDraft, apiError, isLoading };
};
