import { trpc } from "@/trpc/client";

export function usePublicForm(
  username: string,
  slug: string,
  options?: { password?: string; editMode?: boolean },
) {
  const { password, editMode } = options || {};

  const { data: form, isLoading, isError, refetch, isFetching } = trpc.form.getPublicForm.useQuery(
    { username, slug, password, editMode },
    { staleTime: 1000 * 60 * 5 },
  );

  const { data: session } = trpc.agent.respondentAgentGetSession.useQuery(
    { formId: form?.formId ?? "" },
    { enabled: !!form?.formId, staleTime: 0 },
  );

  return { form, isLoading, isError, refetch, session, isFetching };
}

