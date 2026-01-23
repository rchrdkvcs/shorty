export interface Domain {
  id: string;
  userId: string;
  domain: string;
  isVerified: boolean;
  verificationToken: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateDomainPayload {
  domain: string;
}

interface UpdateDomainPayload {
  domain?: string;
}

interface VerifyResponse {
  verified: boolean;
  message: string;
}

export const DOMAIN_QUERY_KEYS = {
  all: ["domains"] as const,
  verified: () => [...DOMAIN_QUERY_KEYS.all, "verified"] as const,
  detail: (id: string) => [...DOMAIN_QUERY_KEYS.all, id] as const,
};

export const useDomainsQuery = () => {
  return useQuery({
    key: DOMAIN_QUERY_KEYS.all,
    query: () => useApi<Domain[]>("/domains"),
  });
};

export const useVerifiedDomainsQuery = () => {
  return useQuery({
    key: DOMAIN_QUERY_KEYS.verified(),
    query: () => useApi<Domain[]>("/domains/verified"),
  });
};

export const useDomainQuery = (id: MaybeRefOrGetter<string>) => {
  return useQuery({
    key: () => DOMAIN_QUERY_KEYS.detail(toValue(id)),
    query: () => useApi<Domain>(`/domains/${toValue(id)}`),
  });
};

export const useCreateDomainMutation = () => {
  const cache = useQueryCache();

  return useMutation({
    mutation: (payload: CreateDomainPayload) =>
      useApi<Domain>("/domains", {
        method: "POST",
        body: payload,
      }),
    onSettled: () => {
      cache.invalidateQueries({ key: DOMAIN_QUERY_KEYS.all });
    },
  });
};

export const useUpdateDomainMutation = () => {
  const cache = useQueryCache();

  return useMutation({
    mutation: ({ id, ...payload }: UpdateDomainPayload & { id: string }) =>
      useApi<Domain>(`/domains/${id}`, {
        method: "PATCH",
        body: payload,
      }),
    onSettled: (_data, _error, { id }) => {
      cache.invalidateQueries({ key: DOMAIN_QUERY_KEYS.all });
      cache.invalidateQueries({ key: DOMAIN_QUERY_KEYS.detail(id) });
    },
  });
};

export const useDeleteDomainMutation = () => {
  const cache = useQueryCache();

  return useMutation({
    mutation: (id: string) =>
      useApi(`/domains/${id}`, {
        method: "DELETE",
      }),
    onSettled: () => {
      cache.invalidateQueries({ key: DOMAIN_QUERY_KEYS.all });
    },
  });
};

export const useVerifyDomainMutation = () => {
  const cache = useQueryCache();

  return useMutation({
    mutation: (id: string) =>
      useApi<VerifyResponse>(`/domains/${id}/verify`, {
        method: "POST",
      }),
    onSettled: (_data, _error, id) => {
      cache.invalidateQueries({ key: DOMAIN_QUERY_KEYS.all });
      cache.invalidateQueries({ key: DOMAIN_QUERY_KEYS.verified() });
      cache.invalidateQueries({ key: DOMAIN_QUERY_KEYS.detail(id) });
    },
  });
};
