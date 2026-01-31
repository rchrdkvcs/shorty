<script setup lang="ts">
import type Link from '#models/link'
import type { BreadcrumbItem, TableColumn } from '@nuxt/ui'
import { ref } from 'vue'
import { h, resolveComponent } from 'vue'
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

const { copyToClipboard, getCopyButtonProps, getQRCodeData, getLinkCategory } = useLink()

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const breadcrumbItems = ref<BreadcrumbItem[]>([
  {
    label: 'Dashboard',
  },
  {
    label: 'Mes liens',
    to: '/components',
  },
])

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
  <div>
    <div class="h-16 w-full p-4 border-b border-default flex items-center gap-2">
      <UButton color="neutral" variant="ghost" icon="lucide:panel-left" />
      <UBreadcrumb :items="breadcrumbItems" class="" />
    </div>

    <div class="flex flex-col gap-8 p-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-semibold">Mes liens</h1>
          <p class="text-muted">Gérez vos liens raccourcis et suivez leurs performances</p>
        </div>
        <UButton icon="lucide:plus" label="Creer un lien" size="lg" @click="createLink.open()" />
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <UInput
            type="search"
            icon="lucide:search"
            placeholder="Rechercher un lien"
            class="w-sm"
          />
          <div class="flex gap-2">
            <UBadge label="Tous" color="neutral" variant="soft" class="rounded-full" size="lg" />
          </div>
        </div>

        <UTable :data="links" :columns="columns" class="flex-1 border border-default rounded-lg" />
      </div>
    </div>
  </div>
</template>
