<script setup lang="ts">
import type Link from "@shorty/api/app/models/link";

const selectedLink = useState<Link | null>("selected-link", () => null);
const { copyShortUrl } = useCopyShortUrl();

const { data: links, status } = useQuery<Link[]>({
  key: ["links"],
  query: () => useApi("/links"),
});

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="My Links" />
    </template>

    <template #body>
      <UPageGrid :class="selectedLink && 'grid-cols-2!'">
        <UPageCard
          v-for="link in links"
          :key="link.id"
          variant="soft"
          class="group"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <UAvatar
                :src="useFavicon(link.targetUrl)"
                :alt="getCardTitle(link)"
              />
              <div class="flex flex-col">
                <span class="font-semibold truncate text-sm">
                  {{ getCardTitle(link) }}
                </span>
                <span class="text-xs truncate text-muted">
                  {{ formatDate(link.createdAt.toString()) }}
                </span>
              </div>
            </div>

            <UFieldGroup size="sm">
              <UButton
                icon="lucide:pencil"
                variant="ghost"
                color="neutral"
                @click="selectedLink = link"
              />
              <UButton
                icon="lucide:external-link"
                variant="ghost"
                color="neutral"
                :to="link.targetUrl"
                target="_blank"
                :external="true"
              />
            </UFieldGroup>
          </div>

          <div class="flex items-center justify-start gap-2 flex-wrap">
            <UBadge
              v-if="link.domain"
              variant="subtle"
              color="primary"
              size="sm"
            >
              <UIcon name="lucide:globe" class="w-3 h-3 mr-1" />
              {{ link.domain.domain }}
            </UBadge>
            <UButton
              v-if="link.slugCustom"
              icon="lucide:copy"
              variant="soft"
              color="neutral"
              size="sm"
              @click="copyShortUrl(link, link.slugCustom)"
            >
              /{{ link.slugCustom }}
            </UButton>
            <UButton
              icon="lucide:copy"
              variant="soft"
              color="neutral"
              size="sm"
              @click="copyShortUrl(link, link.slugAuto)"
            >
              /{{ link.slugAuto }}
            </UButton>
          </div>
        </UPageCard>
      </UPageGrid>
    </template>
  </UDashboardPanel>
</template>
