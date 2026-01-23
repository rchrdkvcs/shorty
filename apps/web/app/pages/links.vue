<script setup lang="ts">
import type Link from "@shorty/api/app/models/link";

// --- State ---
const selectedLink = ref<Link | null>(null);

const { data: links, status } = useQuery<Link[]>({
  key: ["links"],
  query: () => useApi("/links"),
});

// --- Helpers ---
const config = useRuntimeConfig();
const appBaseUrl = "http://localhost:3000"; // À remplacer par ta config

// Formatage de date natif (sans librairie externe)
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric", // ex: 24 janv. 2026
  });
};

// Helper pour afficher le bon slug
const getActiveSlug = (link: Link) => link.slugCustom || link.slugAuto;

// Helper pour le titre de la carte
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
  // TODO: Ta mutation update ici
  console.log("Saving", selectedLink.value);
};
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Mes Liens">
        <template #right>
          <UButton icon="i-heroicons-plus" label="Nouveau" color="black" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPageGrid>
        <UPageCard
          v-for="link in links"
          :key="link.id"
          @click="selectedLink = link"
          variant="soft"
          class="cursor-pointer transition-all duration-200 group"
          :class="[
            selectedLink?.id === link.id
              ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-950/20'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
          ]"
          :ui="{ body: { base: 'flex flex-col gap-3 h-full' } }"
        >
          <div class="flex items-center gap-3">
            <UAvatar
              :src="useFavicon(link.targetUrl)"
              :alt="getCardTitle(link)"
              size="sm"
              class="bg-white dark:bg-gray-900"
              :ui="{ rounded: 'rounded-md' }"
            />
            <div class="flex flex-col overflow-hidden">
              <span
                class="font-semibold truncate text-gray-900 dark:text-white"
              >
                {{ getCardTitle(link) }}
              </span>
              <span class="text-xs text-gray-500 truncate">
                {{ formatDate(link.createdAt.toString()) }}
              </span>
            </div>
          </div>

          <div class="text-sm text-gray-500 break-all line-clamp-2 flex-1">
            {{ link.targetUrl }}
          </div>

          <div
            class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800"
          >
            <UBadge variant="subtle" color="gray" size="xs">
              /{{ getActiveSlug(link) }}
            </UBadge>
            <UIcon
              v-if="link.slugCustom"
              name="i-heroicons-star-20-solid"
              class="text-yellow-500 w-4 h-4"
            />
          </div>
        </UPageCard>
      </UPageGrid>
    </template>
  </UDashboardPanel>

  <UDashboardPanel
    v-if="selectedLink"
    collapsible
    grow
    side="right"
    class="max-w-md border-l border-gray-200 dark:border-gray-800"
  >
    <template #header>
      <UDashboardNavbar title="Édition">
        <template #right>
          <UButton
            icon="i-heroicons-x-mark"
            variant="ghost"
            color="gray"
            @click="selectedLink = null"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-4 space-y-6">
        <UFormField label="Lien court final" help="Lien à partager">
          <div class="flex gap-2">
            <UInput
              :model-value="`${appBaseUrl}/${getActiveSlug(selectedLink)}`"
              readonly
              icon="i-heroicons-link"
              class="flex-1"
              :ui="{ icon: { trailing: { pointer: '' } } }"
            />
            <UButton
              icon="i-heroicons-arrow-top-right-on-square"
              color="gray"
              variant="soft"
              :to="`${appBaseUrl}/${getActiveSlug(selectedLink)}`"
              target="_blank"
            />
          </div>
        </UFormField>

        <USeparator label="Configuration" />

        <form @submit.prevent="handleSave" class="space-y-4">
          <UFormField label="URL de destination" required>
            <UInput
              v-model="selectedLink.targetUrl"
              icon="i-heroicons-globe-alt"
            />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Nom du lien">
              <UInput
                v-model="selectedLink.label"
                placeholder="Ex: Mon Portfolio"
                icon="i-heroicons-tag"
              />
            </UFormField>

            <UFormField label="Catégorie">
              <UInput
                v-model="selectedLink.category"
                placeholder="Ex: Pro"
                icon="i-heroicons-folder"
              />
            </UFormField>
          </div>

          <UFormField
            label="Slug Personnalisé"
            :description="`Slug auto: ${selectedLink.slugAuto}`"
          >
            <UInput
              v-model="selectedLink.slugCustom"
              :placeholder="selectedLink.slugAuto"
            >
              <template #leading>
                <span class="text-gray-500 text-xs">/</span>
              </template>
            </UInput>
          </UFormField>

          <div class="pt-4 flex justify-between items-center">
            <UButton
              color="red"
              variant="ghost"
              label="Supprimer"
              icon="i-heroicons-trash"
            />
            <UButton type="submit" color="black" label="Sauvegarder" />
          </div>
        </form>
      </div>
    </template>
  </UDashboardPanel>
</template>
