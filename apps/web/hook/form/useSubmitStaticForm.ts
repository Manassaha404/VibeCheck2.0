import { trpc } from "@/trpc/client";

export function useSubmitStaticForm(options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) {
  const utils = trpc.useUtils();
  
  return trpc.form.submitStaticForm.useMutation({
    ...options,
    onSuccess: (...args) => {
      utils.form.getPublicForm.invalidate();
      utils.form.getFormResponses.invalidate();
      utils.form.getFormAnalytics.invalidate();
      
      if (options?.onSuccess) {
        options.onSuccess();
      }
    }
  });
}
