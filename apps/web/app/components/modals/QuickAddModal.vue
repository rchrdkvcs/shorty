<script setup lang="ts">
const newLink = ref("");
const queryCache = useQueryCache();

const { mutate, isLoading, error } = useMutation({
  mutation: (targetUrl: string) => {
    return useApi("/links", {
      method: "POST",
      body: { targetUrl },
    });
  },
  onSuccess: () => {
    newLink.value = "";
    queryCache.invalidateQueries({ key: ["links"] });
  },
});

const handleSubmit = () => {
  if (!newLink.value) return;
  mutate(newLink.value);
};
</script>

<template>
  <UModal class="max-w-2xl w-full">
    <template #content>
      <UCard>
        <div v-if="error" class="text-red-500 mb-2 text-sm">
          Une erreur est survenue lors de la création.
        </div>

        <form @submit.prevent="handleSubmit">
          <UFormField label="Quick add link" size="xl">
            <UInput
              v-model="newLink"
              placeholder="https://destination.url"
              autofocus
              class="w-full"
              size="xl"
              variant="subtle"
              :disabled="isLoading"
              :loading="isLoading"
            >
              <template #trailing>
                <UButton type="submit" size="lg" :loading="isLoading">
                  Add
                </UButton>
              </template>
            </UInput>
          </UFormField>
        </form>
      </UCard>
    </template>
  </UModal>
</template>
