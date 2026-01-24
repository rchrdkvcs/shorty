<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="Mes QR Codes">
      <template #right>
        <UButton
          icon="i-lucide-plus"
          color="primary"
          label="Nouveau QR Code"
          @click="emit('create')"
        />
      </template>
    </UDashboardNavbar>

    <div v-if="isLoading" class="p-8 text-center text-gray-500">
      Chargement...
    </div>

    <div v-else-if="error" class="p-8 text-center text-red-500">
      Erreur lors du chargement des QR codes
    </div>

    <div v-else-if="!qrCodes || qrCodes.length === 0" class="p-8 text-center text-gray-500">
      <div class="flex flex-col items-center gap-4">
        <UIcon name="i-lucide-qr-code" class="w-16 h-16 text-gray-400" />
        <p class="text-lg">Aucun QR code créé</p>
        <p class="text-sm">Créez votre premier QR code pour vos liens raccourcis</p>
        <UButton
          icon="i-lucide-plus"
          color="primary"
          @click="emit('create')"
        >
          Créer un QR Code
        </UButton>
      </div>
    </div>

    <UPageGrid v-else class="p-4">
      <UPageCard
        v-for="qrCode in qrCodes"
        :key="qrCode.id"
        :title="qrCode.name"
        class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        @click="emit('select', qrCode.id)"
      >
        <template #icon>
          <div class="p-2 bg-white dark:bg-gray-900 rounded">
            <QrCodeGenerator
              :url="getQrCodeUrl(qrCode)"
              :foreground-color="qrCode.foregroundColor"
              :background-color="qrCode.backgroundColor"
              :logo-url="qrCode.logoUrl"
              :size="100"
              :error-correction-level="qrCode.errorCorrectionLevel"
              :logo-size="qrCode.logoSize"
              :rounded-corners="qrCode.roundedCorners"
            />
          </div>
        </template>

        <template #default>
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <UIcon name="i-lucide-link" class="w-4 h-4" />
              <span class="truncate">{{ qrCode.link?.label || getShortUrl(qrCode) }}</span>
            </div>

            <div class="flex items-center gap-2 text-xs text-gray-500">
              <UIcon name="i-lucide-calendar" class="w-3 h-3" />
              <span>{{ formatDate(qrCode.createdAt) }}</span>
            </div>

            <div class="flex gap-2 mt-2">
              <UBadge
                v-if="qrCode.link?.domain"
                :label="qrCode.link.domain.domain"
                color="blue"
                variant="subtle"
                size="xs"
              />
              <UBadge
                :label="`${qrCode.size}x${qrCode.size}px`"
                color="gray"
                variant="subtle"
                size="xs"
              />
              <UBadge
                :label="`Niveau ${qrCode.errorCorrectionLevel}`"
                color="gray"
                variant="subtle"
                size="xs"
              />
            </div>
          </div>
        </template>
      </UPageCard>
    </UPageGrid>
  </UDashboardPanel>
</template>

<script setup lang="ts">
const props = defineProps<{
  qrCodes?: any[]
  isLoading?: boolean
  error?: any
}>()

const emit = defineEmits<{
  select: [id: string]
  create: []
}>()

const getQrCodeUrl = (qrCode: any) => {
  if (!qrCode.link) return ''

  const baseUrl = window.location.origin
  const domain = qrCode.link.domain?.domain
  const slug = qrCode.link.slugCustom || qrCode.link.slugAuto

  if (domain) {
    return `https://${domain}/${slug}`
  }

  return `${baseUrl}/r/${slug}`
}

const getShortUrl = (qrCode: any) => {
  if (!qrCode.link) return ''

  const domain = qrCode.link.domain?.domain
  const slug = qrCode.link.slugCustom || qrCode.link.slugAuto

  if (domain) {
    return `${domain}/${slug}`
  }

  return `shorty/${slug}`
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>
