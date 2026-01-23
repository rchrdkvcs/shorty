<script setup lang="ts">
import type Link from "@shorty/api/app/models/link";

const selectedLink = useState<Link | null>("selected-link", () => null);

const appBaseUrl = () => {
  if (import.meta.client) {
    return globalThis.location.origin;
  }

  return "";
};

const getCardTitle = (link: Link) => {
  if (link.label) return link.label;
  try {
    return new URL(link.targetUrl).hostname;
  } catch {
    return link.targetUrl;
  }
};
</script>

<template>
  <UDashboardPanel
    v-if="selectedLink"
    class="max-w-md"
    :ui="{
      footer: 'bg-elevated/50!',
    }"
  >
    <template #header>
      <UDashboardNavbar :title="'Edition de ' + getCardTitle(selectedLink)">
        <template #right>
          <UButton
            icon="lucide:x"
            variant="ghost"
            color="gray"
            @click="selectedLink = null"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UFormField label="Short URLs">
        <div class="flex flex-wrap gap-2 justify-start items-center">
          <UButton
            v-if="selectedLink.slugCustom"
            icon="lucide:copy"
            variant="soft"
            color="neutral"
            size="sm"
          >
            /{{ selectedLink.slugCustom }}
          </UButton>
          <UButton icon="lucide:copy" variant="soft" color="neutral" size="sm">
            /{{ selectedLink.slugAuto }}
          </UButton>
        </div>
      </UFormField>

      <USeparator label="Configuration" />

      <UFormField label="Target link" required>
        <UInput
          v-model="selectedLink.targetUrl"
          icon="lucide:globe"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Label of short link">
        <UInput
          v-model="selectedLink.label"
          placeholder="Ex: Mon Portfolio"
          icon="lucide:tag"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Category">
        <UInput
          v-model="selectedLink.category"
          placeholder="Ex: Pro"
          icon="lucide:folder"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Custom slug">
        <UFieldGroup class="w-full">
          <UBadge
            variant="subtle"
            color="neutral"
            size="lg"
            :label="`${appBaseUrl()}/`"
          />

          <UInput
            v-model="selectedLink.slugCustom"
            class="w-full"
            placeholder="my-content"
          />
        </UFieldGroup>
      </UFormField>

      <UFieldGroup class="absolute bottom-8 left-1/2 -translate-x-1/2">
        <UButton
          color="error"
          label="Supprimer"
          variant="subtle"
          icon="lucide:trash"
        />
        <UButton
          type="submit"
          color="neutral"
          variant="subtle"
          icon="lucide:save"
          label="Sauvegarder"
        />
      </UFieldGroup>
    </template>
  </UDashboardPanel>
</template>
