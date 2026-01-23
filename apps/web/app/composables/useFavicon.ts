export function useFavicon(url: string, size: number = 64): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=${size}&domain=${domain}`;
  } catch {
    return `https://www.google.com/s2/favicons?sz=${size}&domain=${url}`;
  }
}
