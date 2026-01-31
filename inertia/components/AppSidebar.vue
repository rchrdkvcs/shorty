<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { NavigationMenuItem } from '@nuxt/ui'
import type { DropdownMenuItem } from '@nuxt/ui'
import { usePage } from '@inertiajs/vue3'
import type User from '#models/user'
import { useOrganization } from '~/composables/use_organization'
import OrganizationForm from '~/components/OrganizationForm.vue'

const navigationItems = ref<NavigationMenuItem[]>([
  [
    {
      label: 'Navigation',
      type: 'label',
      class: 'text-muted',
    },
    {
      label: 'Liens',
      icon: 'lucide:link',
      to: '/dashboard/links',
    },
    {
      label: 'Analytics',
      icon: 'lucide:bar-chart-3',
      to: '/dashboard/analytics',
    },
  ],
])
const { organizations, currentOrganization, switchOrganization } = useOrganization()
const page = usePage()
const overlay = useOverlay()
const orgModal = overlay.create(OrganizationForm)

const organizationSwitchItems = computed(() => {
  const items: DropdownMenuItem[] = []

  if (organizations.value.length > 0) {
    items.push([
      ...organizations.value.map((org) => ({
        class: 'cursor-pointer',
        label: org.name,
        icon: 'lucide:building',
        onClick: () => {
          switchOrganization(org)
        },
      })),
    ])
  }

  items.push([
    {
      label: 'Ajouter une organisation',
      icon: 'lucide:plus',
      onClick: () => {
        orgModal.open({ mode: 'create' })
      },
    },
    {
      label: 'Gérer les organisations',
      icon: 'lucide:settings',
      to: '/dashboard/organizations',
    },
  ])

  return items
})

const profileItems = ref<DropdownMenuItem[]>([
  {
    label: 'Mon profil',
    icon: 'lucide:user',
    to: '/profile',
  },
  {
    label: 'Paramètres',
    icon: 'lucide:cog',
    to: '/account-settings',
  },
  {
    label: 'Déconnexion',
    icon: 'lucide:log-out',
    color: 'error',
  },
])

const user = page.props.user as User
</script>

<template>
  <UNavigationMenu
    :items="navigationItems"
    :ui="{
      list: 'p-2',
      link: 'cursor-pointer py-2',
    }"
    class="w-64 border-r border-default"
    orientation="vertical"
  >
    <template #list-leading>
      <div class="p-2 pb-0">
        <UDropdownMenu
          :items="organizationSwitchItems"
          :ui="{
            content: 'w-58',
          }"
          class="w-full"
        >
          <UButton
            color="neutral"
            variant="ghost"
            class="flex justify-start items-center gap-2 w-full"
          >
            <span class="p-2 bg-muted rounded-md">
              <UIcon name="lucide:building-2" class="size-5" />
            </span>
            <p class="flex flex-col justify-center items-start flex-1 min-w-0">
              <span class="font-semibold truncate">
                {{ currentOrganization?.name || organizations[0]?.name || 'Aucune organisation' }}
              </span>
              <span class="text-xs text-muted">Organisation actuelle</span>
            </p>
            <UIcon name="lucide:chevron-down" class="size-4 text-muted" />
          </UButton>
        </UDropdownMenu>
      </div>
    </template>

    <template #list-trailing>
      <div class="p-2 mt-auto">
        <UDropdownMenu
          :items="profileItems"
          :ui="{
            content: 'w-58',
          }"
          class="w-full"
        >
          <UButton color="neutral" variant="ghost" class="flex justify-start items-center gap-2">
            <span class="p-2 bg-muted rounded-md">
              <UIcon name="lucide:user" class="size-5" />
            </span>
            <p class="flex flex-col justify-center items-start">
              <span class="font-semibold capitalize">{{ user.username }}</span>
              <span class="text-xs text-muted">{{ user.email }}</span>
            </p>
          </UButton>
        </UDropdownMenu>
      </div>
    </template>
  </UNavigationMenu>
</template>
