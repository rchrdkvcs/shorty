<template>
  <UDashboardGroup>
    <QrCodesPanel
      :qr-codes="qrCodes"
      :is-loading="isLoading"
      :error="error"
      @select="selectQrCode"
      @create="openCreateModal"
    />
    <QrCodeDetailsPanel
      :qr-code-id="selectedQrCodeId"
      @close="selectedQrCodeId = null"
    />

    <!-- Create QR Code Modal -->
    <UModal v-model:open="isCreateModalOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Créer un QR Code</h3>
            <UButton
              icon="i-lucide-x"
              color="gray"
              variant="ghost"
              @click="isCreateModalOpen = false"
            />
          </div>
        </template>

        <div class="flex flex-col gap-4">
          <!-- Select Link -->
          <UFormField label="Sélectionner un lien" name="linkId" required>
            <USelect
              v-model="selectedLinkId"
              :options="linkOptions"
              option-attribute="label"
              value-attribute="value"
              placeholder="Choisir un lien"
            />
          </UFormField>

          <div v-if="selectedLinkId" class="mt-4">
            <QrCodeCustomizer
              :link-id="selectedLinkId"
              :url="selectedLinkUrl"
              @saved="handleQrCodeCreated"
            />
          </div>
        </div>
      </UCard>
    </UModal>
  </UDashboardGroup>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const selectedQrCodeId = ref<string | null>(null)
const isCreateModalOpen = ref(false)
const selectedLinkId = ref<string>('')

const { data: qrCodes, isLoading, error } = useQrCodesQuery()
const { data: links } = useLinksQuery()

const linkOptions = computed(() => {
  if (!links.value) return []

  return links.value.map((link) => ({
    label: link.label || getShortUrl(link),
    value: link.id,
  }))
})

const selectedLinkUrl = computed(() => {
  if (!selectedLinkId.value || !links.value) return ''

  const link = links.value.find((l) => l.id === selectedLinkId.value)
  if (!link) return ''

  const baseUrl = window.location.origin
  const domain = link.domain?.domain
  const slug = link.slugCustom || link.slugAuto

  if (domain) {
    return `https://${domain}/${slug}`
  }

  return `${baseUrl}/r/${slug}`
})

const selectQrCode = (id: string) => {
  selectedQrCodeId.value = id
}

const openCreateModal = () => {
  selectedLinkId.value = ''
  isCreateModalOpen.value = true
}

const handleQrCodeCreated = () => {
  isCreateModalOpen.value = false
  selectedLinkId.value = ''
}

const getShortUrl = (link: any) => {
  const domain = link.domain?.domain
  const slug = link.slugCustom || link.slugAuto

  if (domain) {
    return `${domain}/${slug}`
  }

  return `shorty/${slug}`
}
</script>
