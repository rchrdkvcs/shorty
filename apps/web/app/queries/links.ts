import type Link from "@shorty/api/app/models/link";

interface CreateLinkPayload {
  targetUrl: string;
  slugCustom?: string | null;
  label?: string | null;
  category?: string | null;
}

interface UpdateLinkPayload {
  targetUrl?: string;
  slugCustom?: string | null;
  label?: string | null;
  category?: string | null;
}

export const LINK_QUERY_KEYS = {
  all: ["links"] as const,
  detail: (id: string) => [...LINK_QUERY_KEYS.all, id] as const,
};

export const useLinksQuery = () => {
  return useQuery({
    key: LINK_QUERY_KEYS.all,
    query: () => useApi<Link[]>("/links"),
  });
};

export const useLinkQuery = (id: MaybeRefOrGetter<string>) => {
  return useQuery({
    key: () => LINK_QUERY_KEYS.detail(toValue(id)),
    query: () => useApi<Link>(`/links/${toValue(id)}`),
  });
};

export const useCreateLinkMutation = () => {
  const cache = useQueryCache();

  return useMutation({
    mutation: (payload: CreateLinkPayload) =>
      useApi<Link>("/links", {
        method: "POST",
        body: payload,
      }),
    onSettled: () => {
      cache.invalidateQueries({ key: LINK_QUERY_KEYS.all });
    },
  });
};

export const useUpdateLinkMutation = () => {
  const cache = useQueryCache();

  return useMutation({
    mutation: ({ id, ...payload }: UpdateLinkPayload & { id: string }) =>
      useApi<Link>(`/links/${toValue(id)}`, {
        method: "PATCH",
        body: payload,
      }),
    onSettled: (_data, _error, { id }) => {
      cache.invalidateQueries({ key: LINK_QUERY_KEYS.all });
      cache.invalidateQueries({ key: LINK_QUERY_KEYS.detail(id) });
    },
  });
};

export const useDeleteLinkMutation = () => {
  const cache = useQueryCache();

  return useMutation({
    mutation: (id: string) =>
      useApi<Link>(`/links/${toValue(id)}`, {
        method: "DELETE",
      }),
    onSettled: () => {
      cache.invalidateQueries({ key: LINK_QUERY_KEYS.all });
    },
  });
};
