<script setup lang="ts">
import type Link from '#models/link'
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'
import { useFavicon } from '~/composables/use_favicon'
import { useLink } from '~/composables/use_link'

const props = defineProps<{
  links: Link[]
  availableDomains: any[]
  organizations: any[]
}>()

const selectedLink = ref<Link | null>(null)
const { copyToClipboard } = useLink()

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const getCardTitle = (link: Link) => {
  if (link.name) return link.name
  try {
    return new URL(link.targetUrl).hostname
  } catch {
    return link.targetUrl
  }
}

const copyShortUrl = async (link: Link) => {
  await copyToClipboard(link)
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="My Links" />
    </template>

    <template #body>
      <UPageGrid :class="selectedLink && 'grid-cols-2!'">
        <UCard v-for="link in links" :key="link.id" variant="subtle" class="group">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <UAvatar :src="useFavicon(link.targetUrl)" :alt="getCardTitle(link)" />
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

          <div class="flex items-center justify-start gap-2 flex-wrap mt-3">
            <UBadge v-if="link.domain" variant="subtle" color="primary" size="sm">
              <UIcon name="lucide:globe" class="w-3 h-3 mr-1" />
              {{ link.domain.label }}
            </UBadge>
            <UButton
              v-if="link.slugCustom"
              icon="lucide:copy"
              variant="soft"
              color="neutral"
              size="sm"
              @click="copyShortUrl(link)"
            >
              /{{ link.slugCustom }}
            </UButton>
            <UButton
              icon="lucide:copy"
              variant="soft"
              color="neutral"
              size="sm"
              @click="copyShortUrl(link)"
            >
              /{{ link.slugAuto }}
            </UButton>
          </div>
        </UCard>
      </UPageGrid>
    </template>
  </UDashboardPanel>

  <!-- Details Panel -->
  <UDashboardPanel v-if="selectedLink" class="max-w-md">
    <template #header>
      <UDashboardNavbar :title="'Edit ' + getCardTitle(selectedLink)">
        <template #right>
          <UButton icon="lucide:x" variant="ghost" color="gray" @click="selectedLink = null" />
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
            @click="copyShortUrl(selectedLink)"
          >
            /{{ selectedLink.slugCustom }}
          </UButton>
          <UButton
            icon="lucide:copy"
            variant="soft"
            color="neutral"
            size="sm"
            @click="copyShortUrl(selectedLink)"
          >
            /{{ selectedLink.slugAuto }}
          </UButton>
        </div>
      </UFormField>

      <USeparator label="Configuration" />

      <UFormField label="Target link" required>
        <UInput
          v-model="selectedLink.targetUrl"
          placeholder="https://example.com"
          icon="lucide:link"
        />
      </UFormField>

      <UFormField label="Label">
        <UInput v-model="selectedLink.name" placeholder="My awesome link" icon="lucide:tag" />
      </UFormField>

      <UFormField label="Custom slug">
        <UInput v-model="selectedLink.slugCustom" placeholder="custom-slug" icon="lucide:link-2" />
      </UFormField>

      <div class="flex gap-2 mt-4">
        <UButton variant="soft" color="neutral" label="Cancel" @click="selectedLink = null" block />
        <UButton label="Save changes" @click="selectedLink = null" block />
      </div>

      <USeparator />

      <UButton
        variant="ghost"
        color="error"
        label="Delete link"
        icon="lucide:trash"
        @click="selectedLink = null"
        block
      />
    </template>
  </UDashboardPanel>
</template>
