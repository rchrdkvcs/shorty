<script setup lang="ts">
import type Link from "@shorty/api/app/models/link";
import { useDeleteLinkMutation, useUpdateLinkMutation } from "~/queries/links";
import { useVerifiedDomainsQuery, type Domain } from "~/queries/domains";
import { useQrCodesByLinkQuery } from "~/queries/qr-codes";

const selectedLink = useState<Link | null>("selected-link", () => null);
const toast = useToast();
const showQrCodeModal = ref(false);

const { data: domains } = useVerifiedDomainsQuery();

const { data: linkQrCodes } = useQrCodesByLinkQuery(
  computed(() => selectedLink.value?.id || "")
);

const currentHost = computed(() => {
  if (import.meta.client) {
    return globalThis.location.host;
  }
  return "shorty.app";
});

const domainOptions = computed(() => {
  const options: Array<{ label: string; value: string }> = [
    { label: `${currentHost.value} (default)`, value: "" }
  ];
  if (domains.value) {
    domains.value.forEach((domain: Domain) => {
      options.push({ label: domain.domain, value: domain.id });
    });
  }
  return options;
});

// Computed for USelect binding (needs object, not just value)
const selectedDomainOption = computed({
  get: () => domainOptions.value.find(opt => opt.value === form.domainId) || domainOptions.value[0],
  set: (val) => {
    form.domainId = val?.value ?? "";
  }
});

const { mutateAsync: updateLink, isLoading: isUpdating } =
  useUpdateLinkMutation();
const { mutateAsync: deleteLink, isLoading: isDeleting } =
  useDeleteLinkMutation();

const form = reactive({
  targetUrl: "",
  label: "",
  category: "",
  slugCustom: "",
  domainId: "",
});

watch(
  selectedLink,
  (link) => {
    if (link) {
      form.targetUrl = link.targetUrl;
      form.label = link.label ?? "";
      form.category = link.category ?? "";
      form.slugCustom = link.slugCustom ?? "";
      form.domainId = link.domainId ?? "";
    }
  },
  { immediate: true },
);

const selectedDomainName = computed(() => {
  if (form.domainId && domains.value) {
    const domain = domains.value.find((d: Domain) => d.id === form.domainId);
    return domain ? `https://${domain.domain}` : "";
  }
  return "";
});

const appBaseUrl = computed(() => {
  if (selectedDomainName.value) {
    return selectedDomainName.value;
  }
  if (import.meta.client) {
    return globalThis.location.origin;
  }
  return "";
});

const linkUrl = computed(() => {
  if (!selectedLink.value) return "";

  const domain = selectedLink.value.domain?.domain;
  const slug = selectedLink.value.slugCustom || selectedLink.value.slugAuto;

  if (domain) {
    return `https://${domain}/${slug}`;
  }

  if (import.meta.client) {
    return `${globalThis.location.origin}/r/${slug}`;
  }

  return `/r/${slug}`;
});

const getCardTitle = (link: Link) => {
  if (link.label) return link.label;
  try {
    return new URL(link.targetUrl).hostname;
  } catch {
    return link.targetUrl;
  }
};

const handleSave = async () => {
  if (!selectedLink.value) return;

  try {
    await updateLink({
      id: selectedLink.value.id,
      targetUrl: form.targetUrl,
      label: form.label || null,
      category: form.category || null,
      slugCustom: form.slugCustom || null,
      domainId: form.domainId || null,
    });

    toast.add({
      title: "Lien mis à jour",
      description: "Les modifications ont été sauvegardées.",
      color: "success",
    });

    selectedLink.value = null;
  } catch (error) {
    toast.add({
      title: "Impossible de mettre à jour le lien.",
      description: error instanceof Error ? error.message : String(error),
      color: "error",
    });
  }
};

const handleDelete = async () => {
  if (!selectedLink.value) return;

  try {
    await deleteLink(selectedLink.value.id);

    toast.add({
      title: "Lien supprimé",
      description: "Le lien a été supprimé avec succès.",
      color: "success",
    });

    selectedLink.value = null;
  } catch (error) {
    toast.add({
      title: "Impossible de supprimer le lien.",
      description: error instanceof Error ? error.message : String(error),
      color: "error",
    });
  }
};

const isLoading = computed(() => isUpdating.value || isDeleting.value);

const handleQrCodeCreated = () => {
  showQrCodeModal.value = false;
  toast.add({
    title: "QR Code créé",
    description: "Le QR code a été créé avec succès.",
    color: "success",
  });
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
      <UDashboardNavbar :title="'Edit ' + getCardTitle(selectedLink)">
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

      <UFormField label="QR Codes">
        <div class="flex flex-col gap-2">
          <div v-if="linkQrCodes && linkQrCodes.length > 0" class="flex flex-wrap gap-2">
            <UBadge
              v-for="qrCode in linkQrCodes"
              :key="qrCode.id"
              :label="qrCode.name"
              color="blue"
              variant="subtle"
              size="sm"
            />
          </div>
          <UButton
            icon="lucide:qr-code"
            variant="soft"
            color="primary"
            size="sm"
            @click="showQrCodeModal = true"
          >
            {{ linkQrCodes && linkQrCodes.length > 0 ? 'Gérer les QR Codes' : 'Créer un QR Code' }}
          </UButton>
        </div>
      </UFormField>

      <USeparator label="Configuration" />

      <UFormField label="Target link" required>
        <UInput
          v-model="form.targetUrl"
          icon="lucide:globe"
          class="w-full"
          :disabled="isLoading"
        />
      </UFormField>

      <UFormField label="Label of short link">
        <UInput
          v-model="form.label"
          placeholder="Ex: Mon Portfolio"
          icon="lucide:tag"
          class="w-full"
          :disabled="isLoading"
        />
      </UFormField>

      <UFormField label="Category">
        <UInput
          v-model="form.category"
          placeholder="Ex: Pro"
          icon="lucide:folder"
          class="w-full"
          :disabled="isLoading"
        />
      </UFormField>

      <UFormField label="Domain">
        <USelect
          v-model="selectedDomainOption"
          :items="domainOptions"
          class="w-full"
          :disabled="isLoading"
        />
        <template #hint>
          <NuxtLink
            v-if="!domains?.length"
            to="/domains"
            class="text-primary hover:underline text-xs"
          >
            Add a custom domain
          </NuxtLink>
        </template>
      </UFormField>

      <UFormField label="Custom slug">
        <UFieldGroup class="w-full">
          <UBadge
            variant="subtle"
            color="neutral"
            size="lg"
            :label="`${appBaseUrl}/`"
          />

          <UInput
            v-model="form.slugCustom"
            class="w-full"
            placeholder="my-content"
            :disabled="isLoading"
          />
        </UFieldGroup>
      </UFormField>

      <UFieldGroup class="absolute bottom-8 left-1/2 -translate-x-1/2">
        <UButton
          color="error"
          label="Supprimer"
          variant="subtle"
          icon="lucide:trash"
          :loading="isDeleting"
          :disabled="isUpdating"
          @click="handleDelete"
        />
        <UButton
          color="neutral"
          variant="subtle"
          icon="lucide:save"
          label="Sauvegarder"
          :loading="isUpdating"
          :disabled="isDeleting"
          @click="handleSave"
        />
      </UFieldGroup>
    </template>

    <!-- QR Code Modal -->
    <UModal v-model:open="showQrCodeModal">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">QR Code pour ce lien</h3>
            <UButton
              icon="lucide:x"
              color="gray"
              variant="ghost"
              @click="showQrCodeModal = false"
            />
          </div>
        </template>

        <QrCodeCustomizer
          v-if="selectedLink"
          :link-id="selectedLink.id"
          :url="linkUrl"
          @saved="handleQrCodeCreated"
        />
      </UCard>
    </UModal>
  </UDashboardPanel>
</template>
