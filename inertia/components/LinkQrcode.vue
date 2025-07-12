<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQRCode } from '~/composables/use_qrcode'

interface Props {
  url: string
  filename: string
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])
const { generateQRCode, downloadQRCode } = useQRCode()
const qrCodeDataUrl = ref<string>('')

const generateQR = async () => {
  console.log('Début génération QR pour URL:', props.url)
  if (props.url) {
    try {
      qrCodeDataUrl.value = await generateQRCode(props.url)
      console.log('QR code généré avec succès')
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error)
    }
  } else {
    console.log("Pas d'URL fournie")
  }
}

const handleDownload = () => {
  if (qrCodeDataUrl.value) {
    downloadQRCode(props.url, props.filename)
  }
}

onMounted(() => {
  console.log('Composant monté, props:', props)
  generateQR()
})
</script>

<template>
  <UModal class="z-50">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">QR Code</h3>
      </div>
    </template>

    <template #body>
      <div class="flex flex-col items-center gap-4">
        <div v-if="qrCodeDataUrl" class="bg-white rounded-lg">
          <img :src="qrCodeDataUrl" :alt="`QR Code pour ${url}`" class="w-64 h-64" />
        </div>
        <div v-else class="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600 mb-2">URL raccourcie :</p>
          <p class="text-sm font-mono bg-gray-100 px-3 py-1 rounded">{{ url }}</p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton icon="i-lucide-download" @click="handleDownload" :disabled="!qrCodeDataUrl">
          Télécharger
        </UButton>
      </div>
    </template>
  </UModal>
</template>
