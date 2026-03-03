<script setup lang="ts">
import type Link from '#models/link'
import type { TableColumn, TableRow } from '@nuxt/ui'
import { h, ref, resolveComponent } from 'vue'
import { useLink } from '~/composables/use_link'
import LinkAddModal from '~/components/LinkAddModal.vue'
import LinkEditModal from '~/components/LinkEditModal.vue'
import LinkQrcode from '~/components/LinkQrcode.vue'

defineProps<{
  links: Link[]
  availableDomains: any[]
  organizations: any[]
}>()

const overlay = useOverlay()
const createLink = overlay.create(LinkAddModal)
const editLink = overlay.create(LinkEditModal)
const qrCode = overlay.create(LinkQrcode)
const selectedLink = ref<TableRow<Link> | null>(null)
const { copyToClipboard, getCopyButtonProps, getQRCodeData, getLinkCategory } = useLink()

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const columns: TableColumn<Link>[] = [
  {
    accessorKey: 'name',
    header: 'Nom',
  },
  {
    accessorKey: 'slugAuto',
    header: 'Lien court',
    cell: ({ row }) => {
      const link = row.original as Link
      const buttonProps = getCopyButtonProps(link)

      return h(UButton, {
        ...buttonProps,
        onClick: () => copyToClipboard(link),
      })
    },
  },
  {
    accessorKey: 'targetUrl',
    header: 'Destination',
    cell: ({ row }) => {
      const link = row.original as Link
      return h(UButton, {
        color: 'neutral',
        variant: 'soft',
        size: 'sm',
        label: link.targetUrl,
        icon: 'lucide:external-link',
        to: link.targetUrl,
        target: '_blank',
        class: 'text-wrap',
      })
    },
  },
  {
    accessorKey: 'category',
    header: 'Catégorie',
    cell: ({ row }) => {
      const link = row.original as Link
      return h('span', { class: 'text-muted' }, getLinkCategory(link))
    },
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const link = row.original as Link
      return h(
        'div',
        { class: 'flex flex-wrap gap-2' },
        link.tags && link.tags.length > 0
          ? link.tags.map((tag: string) =>
              h(UBadge, {
                key: tag,
                color: 'neutral',
                variant: 'subtle',
                class: 'text-xs rounded-full mr-1',
                label: tag,
              })
            )
          : h('span', { class: 'text-muted' }, 'Aucun tag')
      )
    },
  },
  {
    header: 'QR Code',
    cell: ({ row }) => {
      const link = row.original as Link
      const qrData = getQRCodeData(link)

      return h(UButton, {
        color: 'neutral',
        variant: 'soft',
        size: 'sm',
        icon: 'lucide:qr-code',
        onClick: () => qrCode.open(qrData),
      })
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
  const link = row.original as Link
  return [
    {
      label: 'Modifier',
      icon: 'lucide:edit',
      onClick: () => {
        editLink.open({ link })
      },
    },
    {
      label: 'Supprimer',
      icon: 'lucide:trash',
      color: 'error',
    },
  ]
}
</script>

<template>
  <UDashboardPanel id="inbox-1">
    <template #header>
      <UDashboardNavbar>
        <template #left>
          <div class="flex flex-col">
            <h1 class="text-lg font-semibold">Mes liens</h1>
            <p class="text-muted text-sm">
              Gérez vos liens raccourcis et suivez leurs performances
            </p>
          </div>
        </template>

        <template #right>
          <UFieldGroup>
            <UInput type="search" icon="lucide:search" placeholder="Rechercher un lien" />
            <UButton color="neutral" variant="subtle" icon="i-lucide-search" />
          </UFieldGroup>
          <UButton
            icon="lucide:plus"
            label="Ajouter un lien"
            @click="createLink.open()"
            class="w-fit ml-auto"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UFieldGroup>
        <UInput type="search" icon="lucide:search" placeholder="Rechercher un lien" />
        <UButton color="neutral" variant="subtle" icon="i-lucide-search" />
      </UFieldGroup>

      <USeparator />

      <UPageGrid>
        <UCard
          v-for="link in links"
          :key="link.id"
          variant="soft"
          class="hover:bg-muted cursor-pointer transition ease-in-out duration-200"
          @click="selectedLink = link"
        >
          <template #header>
            <div class="flex gap-2 items-center">
              <img :src="link.targetUrl" alt="Favicon" />
              <h3 class="font-semibold">{{ link.displayName ?? "Ce lien n'a pas de nom" }}</h3>
            </div>
          </template>
        </UCard>
      </UPageGrid>
    </template>
  </UDashboardPanel>

  <UDashboardPanel v-if="selectedLink" :id="selectedLink.id">
    <template #body> Hello from new panel for link {{ selectedLink.name }} </template>
  </UDashboardPanel>
</template>
