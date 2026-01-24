import type Link from "@shorty/api/app/models/link";
import { useClipboard } from "@vueuse/core";

export function useCopyShortUrl() {
  const toast = useToast();
  const { copy, isSupported } = useClipboard();

  const getShortUrl = (link: Link, slug: string) => {
    if (import.meta.client) {
      const baseUrl = link.domain?.domain
        ? `https://${link.domain.domain}` 
        : globalThis.location.origin;
      return `${baseUrl}/${slug}`;
    }
    // Server-side: cannot copy to clipboard, return empty string
    return "";
  };

  const copyShortUrl = async (link: Link, slug: string) => {
    const url = getShortUrl(link, slug);
    
    if (!url) {
      toast.add({
        title: "Erreur",
        description: "Impossible de copier l'URL côté serveur.",
        color: "error",
      });
      return;
    }

    if (!isSupported.value) {
      toast.add({
        title: "Non supporté",
        description: "Votre navigateur ne supporte pas la copie dans le presse-papier.",
        color: "error",
      });
      return;
    }

    try {
      await copy(url);
      toast.add({
        title: "URL copiée",
        description: `${url} a été copié dans le presse-papier.`,
        color: "success",
      });
    } catch (error) {
      console.error("Failed to copy URL to clipboard:", error);
      toast.add({
        title: "Erreur de copie",
        description: "Impossible de copier l'URL dans le presse-papier.",
        color: "error",
      });
    }
  };

  return {
    copyShortUrl,
  };
}
