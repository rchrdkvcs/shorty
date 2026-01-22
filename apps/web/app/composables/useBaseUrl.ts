export const useBaseUrl = (endpoint: string) => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiUrl;
  return `${baseUrl}${endpoint}`;
};
