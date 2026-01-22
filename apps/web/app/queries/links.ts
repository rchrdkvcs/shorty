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
    query: () =>
      $fetch<Link[]>(useBaseUrl("/links"), {
        credentials: "include",
      }),
  });
};

export const useLinkQuery = (id: MaybeRefOrGetter<string>) => {
  return useQuery({
    key: () => LINK_QUERY_KEYS.detail(toValue(id)),
    query: () =>
      $fetch<Link>(useBaseUrl(`/links/${toValue(id)}`), {
        credentials: "include",
      }),
  });
};

export const useCreateLinkMutation = () => {
  const cache = useQueryCache();

  return useMutation({
    mutation: (payload: CreateLinkPayload) =>
      $fetch<Link>(useBaseUrl("/links"), {
        method: "POST",
        body: payload,
        credentials: "include",
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
      $fetch<Link>(useBaseUrl(`/links/${id}`), {
        method: "PATCH",
        body: payload,
        credentials: "include",
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
      $fetch(useBaseUrl(`/links/${id}`), {
        method: "DELETE",
        credentials: "include",
      }),
    onSettled: () => {
      cache.invalidateQueries({ key: LINK_QUERY_KEYS.all });
    },
  });
};
