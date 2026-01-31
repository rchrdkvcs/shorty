<script lang="ts" setup>
import { ref } from 'vue'
import type { NavigationMenuItem } from '@nuxt/ui'
import { usePage } from '@inertiajs/vue3'
import type User from '#models/user'
import LinkAddModal from '~/components/LinkAddModal.vue'

const navigationItems = ref<NavigationMenuItem>([
  {
    label: 'Dashboard',
    icon: 'lucide:layout-dashboard',
    to: '/dashboard',
  },
  {
    label: 'Analytics',
    icon: 'lucide:bar-chart-3',
    to: '/dashboard/analytics',
  },
  {
    label: 'My Links',
    icon: 'lucide:link',
    to: '/dashboard/links',
  },
  {
    label: 'Domains',
    icon: 'lucide:globe',
    to: '/dashboard/domains',
  },
])

const page = usePage()
const user = page.props.user as User
const overlay = useOverlay()
const quickModal = overlay.create(LinkAddModal)
</script>

<template>
  <UDashboardSidebar>
    <template #default>
      <UButton
        label="New link"
        icon="lucide:plus"
        color="neutral"
        variant="subtle"
        @click="quickModal.open()"
        block
      />
      <UNavigationMenu :items="navigationItems" orientation="vertical" />
    </template>

    <template #footer>
      <UUser
        class="p-2 hover:bg-elevated/50 border border-transparent hover:border-default/75 rounded-lg transition-colors cursor-pointer w-full"
        :avatar="{
          alt: 'Avatar',
        }"
        :name="user.username"
        :description="user.email"
      />
    </template>
  </UDashboardSidebar>
</template>
