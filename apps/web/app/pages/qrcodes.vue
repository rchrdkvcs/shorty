<script setup lang="ts">
import { useQrCodesQuery } from "~/queries/qr-codes";
import { useLinksQuery } from "~/queries/links";
import QrCodeModal from "~/components/qr-codes/QrCodeModal.vue";

const selectedQrCodeId = ref<string | null>(null);
const isCreateModalOpen = ref(false);
const selectedLinkId = ref<string>("");
const overlay = useOverlay();
const qrCodeModal = overlay.create(QrCodeModal);

const { data: qrCodes, isLoading, error } = useQrCodesQuery();
const { data: links } = useLinksQuery();

const selectedLinkUrl = computed(() => {
  if (!selectedLinkId.value || !links.value) return "";

  const link = links.value.find((l) => l.id === selectedLinkId.value);
  if (!link) return "";

  const baseUrl = globalThis.location.origin;
  const domain = link.domain?.domain;
  const slug = link.slugCustom || link.slugAuto;

  if (domain) {
    return `https://${domain}/${slug}`;
  }

  return `${baseUrl}/r/${slug}`;
});

const selectQrCode = (id: string) => {
  selectedQrCodeId.value = id;
};

const openCreateModal = () => {
  selectedLinkId.value = "";
  isCreateModalOpen.value = true;
};

const handleQrCodeCreated = () => {
  isCreateModalOpen.value = false;
  selectedLinkId.value = "";
};
</script>

<template>
  <QrCodesPanel
    :qr-codes="qrCodes"
    :is-loading="isLoading"
    :error="error"
    @select="selectQrCode"
    @create="qrCodeModal.open()"
  />

  <QrCodeDetailsPanel
    :qr-code-id="selectedQrCodeId"
    @close="selectedQrCodeId = null"
  />
</template>
