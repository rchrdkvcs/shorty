<script lang="ts" setup>
import { ref } from 'vue'
import type { NavigationMenuItem } from '@nuxt/ui'
import type { DropdownMenuItem } from '@nuxt/ui'
import { usePage } from '@inertiajs/vue3'
import type User from '#models/user'

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
      label: 'QR Codes',
      icon: 'lucide:qr-code',
      to: '/dashboard/qr-codes',
    },
    {
      label: 'Paramètres',
      icon: 'lucide:cog',
      to: '/settings',
    },
  ],
])
const organizationItems = ref<DropdownMenuItem[]>([
  {
    label: 'Organisation 1',
    icon: 'lucide:building-2',
  },
  {
    label: 'Ajouter une organisation',
    icon: 'lucide:plus',
  },
])
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

const user = usePage().props.user as User
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
          :items="organizationItems"
          :ui="{
            content: 'w-58',
          }"
          class="w-full"
        >
          <UButton color="neutral" variant="ghost" class="flex justify-start items-center gap-2">
            <span class="p-2 bg-muted rounded-md">
              <UIcon name="lucide:building-2" class="size-5" />
            </span>
            <p class="flex flex-col justify-center items-start">
              <span class="font-semibold">Mon Organisation</span>
              <span class="text-xs text-muted">Organisation</span>
            </p>
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
