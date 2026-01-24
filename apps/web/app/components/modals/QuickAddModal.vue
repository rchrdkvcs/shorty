<script setup lang="ts">
import { useVerifiedDomainsQuery, type Domain } from "~/queries/domains";

const open = defineModel<boolean>("open", { default: true });

const newLink = ref("");
const selectedDomainId = ref<string>("default");
const slugCustom = ref("");
const label = ref("");
const showAdvanced = ref(false);
const queryCache = useQueryCache();

const { data: domains } = useVerifiedDomainsQuery();

const currentHost = computed(() => {
  if (import.meta.client) {
    return globalThis.location.host;
  }
  return "shorty.app";
});

const domainOptions = computed(() => {
  const options: Array<{ label: string; value: string }> = [
    { label: `${currentHost.value} (default)`, value: "default" }
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
  get: () => domainOptions.value.find(opt => opt.value === selectedDomainId.value) || domainOptions.value[0],
  set: (val) => {
    selectedDomainId.value = val?.value ?? "default";
  }
});

const { mutate, isLoading, error } = useMutation({
  mutation: (payload: {
    targetUrl: string;
    domainId: string | null;
    slugCustom: string | null;
    label: string | null;
  }) => {
    return useApi("/links", {
      method: "POST",
      body: payload,
    });
  },
  onSuccess: () => {
    newLink.value = "";
    selectedDomainId.value = "default";
    slugCustom.value = "";
    label.value = "";
    showAdvanced.value = false;
    queryCache.invalidateQueries({ key: ["links"] });
    open.value = false;
  },
});

const handleSubmit = () => {
  if (!newLink.value) return;
  mutate({
    targetUrl: newLink.value,
    domainId: selectedDomainId.value === "default" ? null : selectedDomainId.value,
    slugCustom: slugCustom.value || null,
    label: label.value || null,
  });
};

const closeModal = () => {
  open.value = false;
};
</script>

<template>
  <UModal v-model:open="open" title="Add Link" description="Create a new shortened link" class="max-w-xl w-full">
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-lg">Add Link</h3>
            <UButton
              icon="lucide:x"
              variant="ghost"
              color="neutral"
              size="sm"
              @click="closeModal"
            />
          </div>
        </template>

        <div v-if="error" class="text-red-500 mb-4 text-sm p-3 bg-red-500/10 rounded-lg">
          An error occurred while creating the link.
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <UFormField label="Destination URL" required>
            <UInput
              v-model="newLink"
              placeholder="https://example.com/my-long-url"
              icon="lucide:link"
              autofocus
              class="w-full"
              size="lg"
              variant="subtle"
              :disabled="isLoading"
            />
          </UFormField>

          <!-- Advanced Settings Toggle -->
          <button
            type="button"
            class="flex items-center gap-2 text-sm text-muted hover:text-default transition-colors"
            @click="showAdvanced = !showAdvanced"
          >
            <UIcon
              :name="showAdvanced ? 'lucide:chevron-down' : 'lucide:chevron-right'"
              class="w-4 h-4"
            />
            Advanced settings
          </button>

          <!-- Advanced Settings Content -->
          <div v-if="showAdvanced" class="space-y-4 pl-6 border-l-2 border-default/50">
            <UFormField label="Label">
              <UInput
                v-model="label"
                placeholder="My awesome link"
                icon="lucide:tag"
                class="w-full"
                variant="subtle"
                :disabled="isLoading"
              />
            </UFormField>

            <UFormField label="Custom slug">
              <UInput
                v-model="slugCustom"
                placeholder="my-custom-slug"
                icon="lucide:pencil"
                class="w-full"
                variant="subtle"
                :disabled="isLoading"
              />
            </UFormField>

            <UFormField label="Domain">
              <USelect
                v-model="selectedDomainOption"
                :items="domainOptions"
                class="w-full"
                variant="subtle"
                :disabled="isLoading"
              />
              <template #hint>
                <NuxtLink
                  v-if="!domains?.length"
                  to="/domains"
                  class="text-primary hover:underline text-xs"
                  @click="closeModal"
                >
                  Add a custom domain
                </NuxtLink>
              </template>
            </UFormField>
          </div>

          <UButton type="submit" block size="lg" :loading="isLoading">
            Create Link
          </UButton>
        </form>
      </UCard>
    </template>
  </UModal>
</template>
