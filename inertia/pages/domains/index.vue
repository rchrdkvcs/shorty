<script setup lang="ts">
import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'

interface Domain {
  id: string
  name: string
  description?: string
  label: string
  isActive: boolean
  organizationId: string
  organization?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface Props {
  domains: Domain[]
  organizationId?: string
}

const props = defineProps<Props>()

const { copy } = useClipboard()
const copiedField = ref<string | null>(null)

const copyField = async (field: string, value: string) => {
  await copy(value)
  copiedField.value = field
  setTimeout(() => {
    copiedField.value = null
  }, 2000)
}

// selectedDomain will be used for future edit functionality
const selectedDomain = ref<Domain | null>(null)

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="My Domains">
        <template #right>
          <UButton icon="lucide:plus" label="Add Domain" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Empty State -->
      <div v-if="!domains?.length" class="text-center text-muted py-12">
        <UIcon name="lucide:globe" class="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p class="text-lg font-medium">No domains added yet</p>
        <p class="text-sm mb-4">Add a custom domain to use with your shortened links</p>
        <UButton icon="lucide:plus" label="Add Domain" />
      </div>

      <!-- Domains List -->
      <UPageGrid v-else>
        <UCard v-for="domain in domains" :key="domain.id" variant="subtle">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div
                class="rounded-md bg-primary/10 shrink-0 flex items-center justify-center p-2"
              >
                <UIcon name="lucide:globe" class="size-5 text-primary" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-semibold truncate">{{ domain.label }}</p>
                <p class="text-sm text-muted truncate">{{ domain.description || 'No description' }}</p>
              </div>
            </div>
            <div class="flex gap-1">
              <UButton
                icon="lucide:settings"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="selectedDomain = domain"
              />
            </div>
          </div>

          <USeparator class="my-3" />

          <div class="space-y-2 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-muted">Status</span>
              <UBadge :color="domain.isActive ? 'success' : 'neutral'" variant="subtle" size="sm">
                {{ domain.isActive ? 'Active' : 'Inactive' }}
              </UBadge>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-muted">Created</span>
              <span>{{ formatDate(domain.createdAt) }}</span>
            </div>
          </div>
        </UCard>
      </UPageGrid>
    </template>
  </UDashboardPanel>
</template>
