export function getFavicon(url: string, size: number = 64): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=${size}&domain=${domain}`;
  } catch {
    // Si l'URL est invalide, on essaie de l'utiliser directement comme domaine
    return `https://www.google.com/s2/favicons?sz=${size}&domain=${url}`;
  }
}

export function useFavicon() {
  return {
    getFavicon,
  };
}
