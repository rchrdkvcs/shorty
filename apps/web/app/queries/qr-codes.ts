interface QrCode {
  id: string;
  userId: string;
  linkId: string;
  name: string;
  foregroundColor: string;
  backgroundColor: string;
  logoUrl: string | null;
  size: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  logoSize: number | null;
  roundedCorners: boolean;
  createdAt: string;
  updatedAt: string;
  link?: {
    id: string;
    targetUrl: string;
    slugAuto: string;
    slugCustom: string | null;
    label: string | null;
    domain?: {
      id: string;
      domain: string;
    } | null;
  };
}

interface CreateQrCodePayload {
  linkId: string;
  name: string;
  foregroundColor?: string;
  backgroundColor?: string;
  logoUrl?: string | null;
  size?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  logoSize?: number | null;
  roundedCorners?: boolean;
}

interface UpdateQrCodePayload {
  name?: string;
  foregroundColor?: string;
  backgroundColor?: string;
  logoUrl?: string | null;
  size?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  logoSize?: number | null;
  roundedCorners?: boolean;
}

export const QR_CODE_QUERY_KEYS = {
  all: ["qr-codes"] as const,
  detail: (id: string) => [...QR_CODE_QUERY_KEYS.all, id] as const,
  byLink: (linkId: string) => [...QR_CODE_QUERY_KEYS.all, "link", linkId] as const,
};

export const useQrCodesQuery = () => {
  return useQuery({
    key: QR_CODE_QUERY_KEYS.all,
    query: () => useApi<QrCode[]>("/qr-codes"),
  });
};

export const useQrCodeQuery = (id: MaybeRefOrGetter<string | null>) => {
  return useQuery({
    key: () => QR_CODE_QUERY_KEYS.detail(toValue(id) ?? ''),
    query: () => useApi<QrCode>(`/qr-codes/${toValue(id)}`),
    enabled: () => !!toValue(id),
  });
};

export const useQrCodesByLinkQuery = (linkId: MaybeRefOrGetter<string>) => {
  return useQuery({
    key: () => QR_CODE_QUERY_KEYS.byLink(toValue(linkId)),
    query: () => useApi<QrCode[]>(`/qr-codes/link/${toValue(linkId)}`),
  });
};

export const useCreateQrCodeMutation = () => {
  const cache = useQueryCache();

  return useMutation({
    mutation: (payload: CreateQrCodePayload) =>
      useApi<QrCode>("/qr-codes", {
        method: "POST",
        body: payload,
      }),
    onSettled: (_data, _error, { linkId }) => {
      cache.invalidateQueries({ key: QR_CODE_QUERY_KEYS.all });
      cache.invalidateQueries({ key: QR_CODE_QUERY_KEYS.byLink(linkId) });
    },
  });
};

export const useUpdateQrCodeMutation = () => {
  const cache = useQueryCache();

  return useMutation({
    mutation: ({ id, ...payload }: UpdateQrCodePayload & { id: string }) =>
      useApi<QrCode>(`/qr-codes/${toValue(id)}`, {
        method: "PATCH",
        body: payload,
      }),
    onSettled: (_data, _error, { id }) => {
      cache.invalidateQueries({ key: QR_CODE_QUERY_KEYS.all });
      cache.invalidateQueries({ key: QR_CODE_QUERY_KEYS.detail(id) });
    },
  });
};

export const useDeleteQrCodeMutation = () => {
  const cache = useQueryCache();

  return useMutation({
    mutation: (id: string) =>
      useApi<{ message: string }>(`/qr-codes/${toValue(id)}`, {
        method: "DELETE",
      }),
    onSettled: () => {
      cache.invalidateQueries({ key: QR_CODE_QUERY_KEYS.all });
    },
  });
};
