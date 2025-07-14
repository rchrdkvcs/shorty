<script setup lang="ts">
import type { BreadcrumbItem, TableColumn } from '@nuxt/ui'
import type Organization from '#models/organization'
import { ref } from 'vue'
import { h, resolveComponent } from 'vue'
import { router } from '@inertiajs/vue3'
import OrganizationAddModal from '~/components/OrganizationAddModal.vue'
import OrganizationEditModal from '~/components/OrganizationEditModal.vue'

defineProps<{
  organizations: Organization[]
}>()

const overlay = useOverlay()
const createOrganization = overlay.create(OrganizationAddModal)
const editOrganization = overlay.create(OrganizationEditModal)

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UAvatar = resolveComponent('UAvatar')

const breadcrumbItems = ref<BreadcrumbItem[]>([
  {
    label: 'Dashboard',
  },
  {
    label: 'Organisations',
    to: '/organizations',
  },
])

const columns: TableColumn<Organization>[] = [
  {
    accessorKey: 'name',
    header: 'Organisation',
    cell: ({ row }) => {
      const org = row.original as Organization
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: org.logoUrl,
          alt: org.name,
          size: 'sm',
        }),
        h('div', { class: 'flex flex-col' }, [
          h('span', { class: 'font-medium' }, org.name),
          h('span', { class: 'text-sm text-muted' }, org.description || 'Aucune description'),
        ]),
      ])
    },
  },
  {
    accessorKey: 'linksCount',
    header: 'Liens',
    cell: ({ row }) => {
      const org = row.original as any
      return h(UBadge, {
        color: 'neutral',
        variant: 'soft',
        label: `${org.$extras?.links_count || org.linksCount || org.links?.length || 0} liens`,
      })
    },
  },
  {
    accessorKey: 'domainsCount',
    header: 'Domaines',
    cell: ({ row }) => {
      const org = row.original as any
      return h(UBadge, {
        color: 'neutral',
        variant: 'soft',
        label: `${org.$extras?.domains_count || org.domainsCount || org.domains?.length || 0} domaines`,
      })
    },
  },
  {
    accessorKey: 'users',
    header: 'Membres',
    cell: ({ row }) => {
      const org = row.original as any
      return h('span', { class: 'text-muted' }, `${org.users?.length || 0} membres`)
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            'content': {
              align: 'end',
            },
            'items': getRowItems(row),
            'aria-label': 'Actions dropdown',
          },
          () =>
            h(UButton, {
              'icon': 'i-lucide-ellipsis-vertical',
              'color': 'neutral',
              'variant': 'ghost',
              'class': 'ml-auto',
              'aria-label': 'Actions dropdown',
            })
        )
      )
    },
  },
]

function getRowItems(row: any) {
  const organization = row.original as Organization
  return [
    {
      label: 'Modifier',
      icon: 'lucide:edit',
      onClick: () => {
        editOrganization.open({ organization })
      },
    },
    {
      label: 'Supprimer',
      icon: 'lucide:trash',
      color: 'error',
      onClick: () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette organisation ?')) {
          router.delete(`/organizations/${organization.id}`)
        }
      },
    },
  ]
}
</script>

<template>
  <div>
    <div class="h-16 w-full p-4 border-b border-default flex items-center gap-2">
      <UButton color="neutral" variant="ghost" icon="lucide:panel-left" />
      <UBreadcrumb :items="breadcrumbItems" class="" />
    </div>

    <div class="flex flex-col gap-8 p-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-semibold">Organisations</h1>
          <p class="text-muted">Gérez vos organisations et leurs paramètres</p>
        </div>
        <UButton
          icon="lucide:plus"
          label="Créer une organisation"
          size="lg"
          @click="createOrganization.open()"
        />
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <UInput
            type="search"
            icon="lucide:search"
            placeholder="Rechercher une organisation"
            class="w-sm"
          />
          <div class="flex gap-2">
            <UBadge label="Toutes" color="neutral" variant="soft" class="rounded-full" size="lg" />
          </div>
        </div>

        <UTable
          :data="organizations"
          :columns="columns"
          class="flex-1 border border-default rounded-lg"
        />
      </div>
    </div>
  </div>
</template>
