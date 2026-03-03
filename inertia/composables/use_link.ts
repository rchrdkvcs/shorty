import { ref, computed } from 'vue'
import { useClipboard } from '@vueuse/core'
import type Link from '#models/link'

export function useLink() {
  const copiedStates = ref<Record<string, boolean>>({})
  const { copy } = useClipboard()

  const buildShortUrl = (link: Link): string => {
    const shortUrl = link.slugCustom || link.slugAuto
    const domain = link.domain ? link.domain.label : globalThis.location.hostname
    return `${domain}/${shortUrl}`
  }

  const buildFullUrl = (link: Link): string => {
    const shortUrl = buildShortUrl(link)
    return `https://${shortUrl}`
  }

  const copyToClipboard = async (link: Link): Promise<void> => {
    const fullUrl = buildFullUrl(link)
    const linkKey = buildShortUrl(link)

    await copy(fullUrl)
    copiedStates.value[linkKey] = true

    setTimeout(() => {
      copiedStates.value[linkKey] = false
    }, 2000)
  }

  const getCopyState = (link: Link): boolean => {
    const linkKey = buildShortUrl(link)
    return copiedStates.value[linkKey] || false
  }

  const getCopyButtonProps = (link: Link) => {
    const linkKey = buildShortUrl(link)
    const isCopied = getCopyState(link)

    return {
      color: isCopied ? 'success' : 'neutral',
      variant: 'soft',
      size: 'sm',
      label: linkKey,
      icon: isCopied ? 'lucide:check' : 'lucide:copy',
    }
  }

  const getQRCodeData = (link: Link) => {
    const shortUrl = link.slugCustom || link.slugAuto
    const domain = link.domain ? link.domain.label : globalThis.location.hostname

    return {
      url: `https://${domain}/${shortUrl}`,
      filename: `${shortUrl}.png`,
    }
  }

  const formatTargetUrl = (url: string, maxLength: number = 50): string => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + '...'
  }

  const getLinkDisplayName = (link: Link): string => {
    return link.name || link.targetUrl || 'Lien sans nom'
  }

  const getLinkCategory = (link: Link): string => {
    return link.category || 'Aucune'
  }

  const hasCustomSlug = (link: Link): boolean => {
    return Boolean(link.slugCustom)
  }

  const getEffectiveSlug = (link: Link): string => {
    return link.slugCustom || link.slugAuto
  }

  return {
    copiedStates: computed(() => copiedStates.value),
    buildShortUrl,
    buildFullUrl,
    copyToClipboard,
    getCopyState,
    getCopyButtonProps,
    getQRCodeData,
    formatTargetUrl,
    getLinkDisplayName,
    getLinkCategory,
    hasCustomSlug,
    getEffectiveSlug,
  }
}
