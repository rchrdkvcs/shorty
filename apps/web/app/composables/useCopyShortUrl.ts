import type Link from "@shorty/api/app/models/link";
import { useClipboard } from "@vueuse/core";

export function useCopyShortUrl() {
  const toast = useToast();
  const { copy } = useClipboard();

  const getShortUrl = (link: Link, slug: string) => {
    if (import.meta.client) {
      const baseUrl = link.domain 
        ? `https://${link.domain.domain}` 
        : globalThis.location.origin;
      return `${baseUrl}/${slug}`;
    }
    return `/${slug}`;
  };

  const copyShortUrl = async (link: Link, slug: string) => {
    const url = getShortUrl(link, slug);
    await copy(url);
    toast.add({
      title: "URL copiée",
      description: `${url} a été copié dans le presse-papier.`,
      color: "success",
    });
  };

  return {
    copyShortUrl,
  };
}
