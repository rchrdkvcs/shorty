<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BreadcrumbItem } from '@nuxt/ui'
import { useFavicon } from '~/composables/use_favicon'

interface Analytics {
  overview: {
    totalClicks: number
    totalLinks: number
    clicksToday: number
    clicksThisWeek: number
    clicksThisMonth: number
  }
  clicksByPeriod: Array<{
    date: string
    clicks: number
  }>
  topLinks: Array<{
    linkId: string
    clicks: number
    label: string | null
    slugAuto: string
    slugCustom: string | null
    targetUrl: string
  }>
  clicksByReferrer: Array<{
    referrer: string
    clicks: number
  }>
  clicksByDevice: Array<{
    device: string
    clicks: number
  }>
  clicksByBrowser: Array<{
    browser: string
    clicks: number
  }>
}

const props = defineProps<Analytics>()

const breadcrumbItems = ref<BreadcrumbItem[]>([
  {
    label: 'Dashboard',
  },
  {
    label: 'Analytics',
    to: '/dashboard/analytics',
  },
])

const stats = computed(() => [
  {
    label: 'Total Clicks',
    value: props.overview.totalClicks,
    icon: 'lucide:mouse-pointer-click',
  },
  {
    label: 'Total Links',
    value: props.overview.totalLinks,
    icon: 'lucide:link',
  },
  {
    label: 'Aujourd\'hui',
    value: props.overview.clicksToday,
    icon: 'lucide:calendar-check',
  },
  {
    label: 'Cette semaine',
    value: props.overview.clicksThisWeek,
    icon: 'lucide:calendar-days',
  },
])

const maxClicks = computed(() => {
  if (!props.clicksByPeriod?.length) return 0
  return Math.max(...props.clicksByPeriod.map((d) => d.clicks))
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  })
}

const getHostname = (url: string) => {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}
</script>

<template>
  <div>
    <div class="h-16 w-full p-4 border-b border-default flex items-center gap-2">
      <UButton color="neutral" variant="ghost" icon="lucide:panel-left" />
      <UBreadcrumb :items="breadcrumbItems" />
    </div>

    <div class="flex flex-col gap-8 p-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-semibold">Analytics</h1>
          <p class="text-muted">Suivez les performances de vos liens raccourcis</p>
        </div>
      </div>

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
          <h3 class="font-semibold">Clics au fil du temps</h3>
        </template>

        <div v-if="!clicksByPeriod?.length" class="h-48 flex items-center justify-center text-muted">
          Aucune donnée disponible
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
                  height: maxClicks > 0 ? `${(item.clicks / maxClicks) * 100}%` : '0%',
                  minHeight: item.clicks > 0 ? '4px' : '0px',
                }"
              />
              <span class="text-[10px] text-muted mt-1 truncate w-full text-center">
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
            <h3 class="font-semibold">Liens les plus cliqués</h3>
          </template>

          <div v-if="!topLinks?.length" class="text-center text-muted py-8">
            Aucun clic enregistré
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="link in topLinks"
              :key="link.linkId"
              class="flex items-center justify-between p-2 rounded-lg hover:bg-elevated/50 transition-colors"
            >
              <div class="flex items-center gap-2 min-w-0">
                <UAvatar :src="useFavicon(link.targetUrl)" :alt="link.label || getHostname(link.targetUrl)" size="sm" />
                <div class="min-w-0">
                  <p class="font-medium truncate text-sm">
                    {{ link.label || getHostname(link.targetUrl) }}
                  </p>
                  <p class="text-xs text-muted truncate">
                    /{{ link.slugCustom || link.slugAuto }}
                  </p>
                </div>
              </div>
              <div class="text-right shrink-0 ml-2">
                <p class="font-semibold">{{ link.clicks }}</p>
                <p class="text-xs text-muted">clics</p>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Top Referrers -->
        <UCard variant="subtle">
          <template #header>
            <h3 class="font-semibold">Principales sources</h3>
          </template>

          <div v-if="!clicksByReferrer?.length" class="text-center text-muted py-8">
            Aucune source enregistrée
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="item in clicksByReferrer"
              :key="item.referrer"
              class="flex items-center justify-between p-2 rounded-lg hover:bg-elevated/50 transition-colors"
            >
              <div class="min-w-0 flex-1">
                <p class="font-medium truncate text-sm">{{ getHostname(item.referrer) }}</p>
              </div>
              <div class="text-right shrink-0 ml-2">
                <p class="font-semibold">{{ item.clicks }}</p>
                <p class="text-xs text-muted">clics</p>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Devices -->
        <UCard variant="subtle">
          <template #header>
            <h3 class="font-semibold">Appareils</h3>
          </template>

          <div v-if="!clicksByDevice?.length" class="text-center text-muted py-8">
            Aucune donnée d'appareil
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="item in clicksByDevice"
              :key="item.device"
              class="flex items-center justify-between p-2 rounded-lg hover:bg-elevated/50 transition-colors"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  :name="
                    item.device === 'mobile'
                      ? 'lucide:smartphone'
                      : item.device === 'tablet'
                        ? 'lucide:tablet'
                        : 'lucide:monitor'
                  "
                  class="size-4 text-muted"
                />
                <p class="font-medium text-sm capitalize">{{ item.device }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold">{{ item.clicks }}</p>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Browsers -->
        <UCard variant="subtle">
          <template #header>
            <h3 class="font-semibold">Navigateurs</h3>
          </template>

          <div v-if="!clicksByBrowser?.length" class="text-center text-muted py-8">
            Aucune donnée de navigateur
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="item in clicksByBrowser"
              :key="item.browser"
              class="flex items-center justify-between p-2 rounded-lg hover:bg-elevated/50 transition-colors"
            >
              <div class="flex items-center gap-2">
                <UIcon name="lucide:globe" class="size-4 text-muted" />
                <p class="font-medium text-sm">{{ item.browser }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold">{{ item.clicks }}</p>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
