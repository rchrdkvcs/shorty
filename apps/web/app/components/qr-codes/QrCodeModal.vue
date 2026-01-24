<script setup lang="ts">
import { useLinksQuery } from "~/queries/links";

const { data: links } = useLinksQuery();

const getShortUrl = (link: any) => {
  const domain = link.domain?.domain;
  const slug = link.slugCustom || link.slugAuto;

  if (domain) {
    return `${domain}/${slug}`;
  }

  return `shorty/${slug}`;
};

const linkOptions = computed(() => {
  if (!links.value) return [];

  return links.value.map((link) => ({
    label: link.label || getShortUrl(link),
    value: link.id,
  }));
});
</script>

<template>
  <UModal>
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h3 class="text-lg font-semibold">Créer un QR Code</h3>
        <UButton
          icon="i-lucide-x"
          color="gray"
          variant="ghost"
          @click="isCreateModalOpen = false"
        />
      </div>
    </template>

    <template #body>
      <div class="flex flex-col gap-4">
        <!-- Select Link -->
        <UFormField
          label="Sélectionner un lien"
          name="linkId"
          required
          class="w-full"
        >
          <USelect
            v-model="selectedLinkId"
            :items="linkOptions"
            option-attribute="label"
            value-attribute="value"
            placeholder="Choisir un lien"
            class="w-full"
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
    </template>
  </UModal>
</template>
