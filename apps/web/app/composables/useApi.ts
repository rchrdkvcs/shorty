export const useApi = <T>(
  request: Parameters<typeof $fetch<T>>[0],
  opts?: Parameters<typeof $fetch<T>>[1],
) => {
  return $fetch<T>(request, {
    baseURL: "/adonis",
    ...opts,

    headers: useRequestHeaders(["cookie"]) as HeadersInit,
    credentials: "include",
  });
};
