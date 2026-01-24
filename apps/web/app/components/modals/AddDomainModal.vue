<script setup lang="ts">
import { useCreateDomainMutation } from "~/queries/domains";

const open = defineModel<boolean>("open", { default: true });

const domain = ref("");
const queryCache = useQueryCache();

const { mutateAsync, isLoading, error } = useCreateDomainMutation();

const closeModal = () => {
  open.value = false;
};

const handleSubmit = async () => {
  if (!domain.value) return;
  try {
    await mutateAsync({ domain: domain.value });
    domain.value = "";
    queryCache.invalidateQueries({ key: ["domains"] });
    closeModal();
  } catch {
    // Error is handled by the mutation's error state
  }
};
</script>

<template>
  <UModal v-model:open="open" title="Add Custom Domain" description="Add your own domain for shortened links" class="max-w-lg w-full">
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-lg">Add Custom Domain</h3>
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
          An error occurred while adding the domain.
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <UFormField label="Domain name" required>
            <UInput
              v-model="domain"
              placeholder="example.com"
              icon="lucide:globe"
              autofocus
              class="w-full"
              size="lg"
              variant="subtle"
              :disabled="isLoading"
            />
          </UFormField>

          <div class="bg-elevated/50 rounded-lg p-3 text-sm text-muted">
            <p class="font-medium text-default mb-1">How it works:</p>
            <ol class="list-decimal list-inside space-y-1">
              <li>Add your domain here</li>
              <li>Configure the DNS TXT record we provide</li>
              <li>Click verify to confirm ownership</li>
              <li>Use your domain for shortened links</li>
            </ol>
          </div>

          <div class="flex gap-2 justify-end">
            <UButton
              variant="ghost"
              color="neutral"
              @click="closeModal"
              :disabled="isLoading"
            >
              Cancel
            </UButton>
            <UButton type="submit" :loading="isLoading">
              Add Domain
            </UButton>
          </div>
        </form>
      </UCard>
    </template>
  </UModal>
</template>
