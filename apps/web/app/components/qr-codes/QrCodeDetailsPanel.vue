<template>
  <UDashboardPanel v-if="qrCodeId" collapsible>
    <UDashboardNavbar :title="qrCode?.name || 'QR Code'">
      <template #right>
        <UButton
          icon="i-lucide-x"
          color="gray"
          variant="ghost"
          @click="emit('close')"
        />
      </template>
    </UDashboardNavbar>

    <div v-if="isLoading" class="p-8 text-center">
      <div class="animate-pulse">Chargement...</div>
    </div>

    <div v-else-if="error" class="p-8 text-center text-red-500">
      Erreur lors du chargement du QR code
    </div>

    <div v-else-if="qrCode" class="p-4">
      <QrCodeCustomizer
        :qr-code-id="qrCode.id"
        :link-id="qrCode.linkId"
        :url="qrCodeUrl"
        :initial-data="{
          name: qrCode.name,
          foregroundColor: qrCode.foregroundColor,
          backgroundColor: qrCode.backgroundColor,
          logoUrl: qrCode.logoUrl,
          size: qrCode.size,
          errorCorrectionLevel: qrCode.errorCorrectionLevel,
          logoSize: qrCode.logoSize,
          roundedCorners: qrCode.roundedCorners,
        }"
        @updated="handleUpdated"
        @deleted="handleDeleted"
      />
    </div>
  </UDashboardPanel>
</template>

<script setup lang="ts">
const props = defineProps<{
  qrCodeId: string | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { data: qrCode, isLoading, error } = useQrCodeQuery(() => props.qrCodeId!)

const qrCodeUrl = computed(() => {
  if (!qrCode.value?.link) return ''

  const baseUrl = window.location.origin
  const domain = qrCode.value.link.domain?.domain
  const slug = qrCode.value.link.slugCustom || qrCode.value.link.slugAuto

  if (domain) {
    return `https://${domain}/${slug}`
  }

  return `${baseUrl}/r/${slug}`
})

const handleUpdated = () => {
  // Show success message
  console.log('QR code updated successfully')
}

const handleDeleted = () => {
  emit('close')
}
</script>
