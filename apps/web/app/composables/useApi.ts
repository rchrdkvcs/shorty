export const useApi = <T>(
  request: Parameters<typeof $fetch<T>>[0],
  opts?: Parameters<typeof $fetch<T>>[1],
) => {
  const config = useRuntimeConfig();

  return $fetch<T>(request, {
    baseURL: config.public.apiUrl,
    ...opts,

    headers: useRequestHeaders(["cookie"]) as HeadersInit,
    credentials: "include",
  });
};
