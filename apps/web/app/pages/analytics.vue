<script setup lang="ts">
import {
  useAnalyticsOverviewQuery,
  useClicksByBrowserQuery,
  useClicksByDeviceQuery,
  useClicksByPeriodQuery,
  useClicksByReferrerQuery,
  useTopLinksQuery,
} from "~/queries/analytics";

const days = ref(30);

const { data: overview, status: overviewStatus } =
  useAnalyticsOverviewQuery(days);
const { data: clicksByPeriod, status: clicksByPeriodStatus } =
  useClicksByPeriodQuery(days);
const { data: topLinks, status: topLinksStatus } = useTopLinksQuery(5);
const { data: clicksByReferrer, status: clicksByReferrerStatus } =
  useClicksByReferrerQuery(5);
const { data: clicksByDevice, status: clicksByDeviceStatus } =
  useClicksByDeviceQuery();
const { data: clicksByBrowser, status: clicksByBrowserStatus } =
  useClicksByBrowserQuery();

const stats = computed(() => [
  {
    label: "Total Clicks",
    value: overview.value?.totalClicks ?? 0,
    icon: "lucide:mouse-pointer-click",
  },
  {
    label: "Total Links",
    value: overview.value?.totalLinks ?? 0,
    icon: "lucide:link",
  },
  {
    label: "Today",
    value: overview.value?.clicksToday ?? 0,
    icon: "lucide:calendar-check",
  },
  {
    label: "This Week",
    value: overview.value?.clicksThisWeek ?? 0,
    icon: "lucide:calendar-days",
  },
]);

const periodOptions = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
];

const getHostname = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

const maxClicks = computed(() => {
  if (!clicksByPeriod.value?.length) return 0;
  return Math.max(...clicksByPeriod.value.map((d) => d.clicks));
});

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
};
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Analytics">
        <template #right>
          <USelect
            v-model="days"
            :items="periodOptions"
            class="w-48 cursor-pointer"
            icon="lucide:calendar"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UCard v-for="stat in stats" :key="stat.label" variant="subtle">
            <div class="flex items-center gap-3">
              <div
                class="rounded-md bg-primary/10 shrink-0 flex items-center justify-center p-2"
              >
                <UIcon :name="stat.icon" class="size-6 text-primary" />
              </div>
              <div>
                <p class="text-2xl font-bold">
                  {{ stat.value.toLocaleString() }}
                </p>
                <p class="text-sm text-muted">{{ stat.label }}</p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Chart Section -->
        <UCard variant="subtle">
          <template #header>
            <h3 class="font-semibold">Clicks over time</h3>
          </template>

          <div
            v-if="clicksByPeriodStatus === 'pending'"
            class="h-48 flex items-center justify-center"
          >
            <UIcon
              name="lucide:loader-2"
              class="w-6 h-6 animate-spin text-muted"
            />
          </div>

          <div
            v-else-if="!clicksByPeriod?.length"
            class="h-48 flex items-center justify-center text-muted"
          >
            No data available
          </div>

          <div v-else class="h-48">
            <div class="flex items-end gap-1 h-full">
              <div
                v-for="item in clicksByPeriod"
                :key="item.date"
                class="flex-1 flex flex-col items-center justify-end h-full group"
              >
                <div class="relative w-full flex justify-center mb-1">
                  <span
                    class="absolute -top-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-default px-1 rounded"
                  >
                    {{ item.clicks }}
                  </span>
                </div>
                <div
                  class="w-full max-w-8 bg-primary/60 hover:bg-primary rounded-t transition-all"
                  :style="{
                    height:
                      maxClicks > 0
                        ? `${(item.clicks / maxClicks) * 100}%`
                        : '0%',
                    minHeight: item.clicks > 0 ? '4px' : '0px',
                  }"
                />
                <span
                  class="text-[10px] text-muted mt-1 truncate w-full text-center"
                >
                  {{ formatDate(item.date) }}
                </span>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Bottom Grid -->
        <div class="grid lg:grid-cols-2 gap-4">
          <!-- Top Links -->
          <UCard variant="subtle">
            <template #header>
              <h3 class="font-semibold">Top Links</h3>
            </template>

            <div v-if="topLinksStatus === 'pending'" class="space-y-3">
              <USkeleton v-for="i in 5" :key="i" class="h-12" />
            </div>

            <div
              v-else-if="!topLinks?.length"
              class="text-center text-muted py-8"
            >
              No clicks recorded yet
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="link in topLinks"
                :key="link.linkId"
                class="flex items-center justify-between p-2 rounded-lg hover:bg-elevated/50 transition-colors"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <UAvatar
                    :src="useFavicon(link.targetUrl)"
                    :alt="link.label || getHostname(link.targetUrl)"
                    size="sm"
                  />
                  <div class="min-w-0">
                    <p class="text-sm font-medium truncate">
                      {{ link.label || getHostname(link.targetUrl) }}
                    </p>
                    <p class="text-xs text-muted truncate">
                      /{{ link.slugCustom || link.slugAuto }}
                    </p>
                  </div>
                </div>
                <span class="text-sm font-semibold text-primary">
                  {{ link.clicks.toLocaleString() }}
                </span>
              </div>
            </div>
          </UCard>

          <!-- Top Referrers -->
          <UCard variant="subtle">
            <template #header>
              <h3 class="font-semibold">Top Referrers</h3>
            </template>

            <div v-if="clicksByReferrerStatus === 'pending'" class="space-y-3">
              <USkeleton v-for="i in 5" :key="i" class="h-10" />
            </div>

            <div
              v-else-if="!clicksByReferrer?.length"
              class="text-center text-muted py-8"
            >
              No referrer data available
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="ref in clicksByReferrer"
                :key="ref.referrer"
                class="flex items-center justify-between p-2 rounded-lg hover:bg-elevated/50 transition-colors"
              >
                <span class="text-sm truncate">{{ ref.referrer }}</span>
                <span class="text-sm font-semibold text-primary">
                  {{ ref.clicks.toLocaleString() }}
                </span>
              </div>
            </div>
          </UCard>

          <!-- Devices -->
          <UCard variant="subtle">
            <template #header>
              <h3 class="font-semibold">Devices</h3>
            </template>

            <div v-if="clicksByDeviceStatus === 'pending'" class="space-y-3">
              <USkeleton v-for="i in 3" :key="i" class="h-10" />
            </div>

            <div
              v-else-if="!clicksByDevice?.length"
              class="text-center text-muted py-8"
            >
              No device data available
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="device in clicksByDevice"
                :key="device.device"
                class="space-y-1"
              >
                <div class="flex items-center justify-between text-sm">
                  <span>{{ device.device }}</span>
                  <span class="font-semibold">{{
                    device.clicks.toLocaleString()
                  }}</span>
                </div>
                <div class="h-2 bg-elevated rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary rounded-full transition-all"
                    :style="{
                      width: `${(device.clicks / (overview?.totalClicks || 1)) * 100}%`,
                    }"
                  />
                </div>
              </div>
            </div>
          </UCard>

          <!-- Browsers -->
          <UCard variant="subtle">
            <template #header>
              <h3 class="font-semibold">Browsers</h3>
            </template>

            <div v-if="clicksByBrowserStatus === 'pending'" class="space-y-3">
              <USkeleton v-for="i in 3" :key="i" class="h-10" />
            </div>

            <div
              v-else-if="!clicksByBrowser?.length"
              class="text-center text-muted py-8"
            >
              No browser data available
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="browser in clicksByBrowser"
                :key="browser.browser"
                class="space-y-1"
              >
                <div class="flex items-center justify-between text-sm">
                  <span>{{ browser.browser }}</span>
                  <span class="font-semibold">{{
                    browser.clicks.toLocaleString()
                  }}</span>
                </div>
                <div class="h-2 bg-elevated rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary rounded-full transition-all"
                    :style="{
                      width: `${(browser.clicks / (overview?.totalClicks || 1)) * 100}%`,
                    }"
                  />
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
