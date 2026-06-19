import { trpc } from "@/trpc/client";

export function useSubmitStaticForm(options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) {
  return trpc.form.submitStaticForm.useMutation(options);
}
