<script setup lang="ts">
import type Link from '#models/link'
import type { BreadcrumbItem, TableColumn } from '@nuxt/ui'
import { ref } from 'vue'
import { h, resolveComponent } from 'vue'
import { useClipboard } from '@vueuse/core'
import LinkAddModal from '~/components/LinkAddModal.vue'
import LinkEditModal from '~/components/LinkEditModal.vue'
import LinkQrcode from '~/components/LinkQrcode.vue'

defineProps<{
  links: Link[]
}>()

const overlay = useOverlay()
const createLink = overlay.create(LinkAddModal)
const editLink = overlay.create(LinkEditModal)
const qrCode = overlay.create(LinkQrcode)

const { copy } = useClipboard()
const copiedStates = ref<Record<string, boolean>>({})

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
      const shortUrl = link.slugCustom ? link.slugCustom : link.slugAuto
      const domain = link.domain ? link.domain.label : window.location.hostname
      const linkKey = `${domain}/${shortUrl}`

      return h(UButton, {
        color: copiedStates.value[linkKey] ? 'success' : 'neutral',
        variant: 'soft',
        size: 'sm',
        label: linkKey,
        icon: copiedStates.value[linkKey] ? 'lucide:check' : 'lucide:copy',
        onClick: async () => {
          await copy(`https://${linkKey}`)
          copiedStates.value[linkKey] = true
          setTimeout(() => {
            copiedStates.value[linkKey] = false
          }, 2000)
        },
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
      return h('span', { class: 'text-muted' }, link.category ? link.category : 'Aucune')
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
        link.tags?.map((tag) =>
          h(
            UBadge,
            {
              color: 'neutral',
              variant: 'subtle',
              class: 'text-xs rounded-full',
            },
            () => h('span', tag)
          )
        )
      )
    },
  },
  {
    header: 'QR Code',
    cell: ({ row }) => {
      const link = row.original as Link
      const shortUrl = link.slugCustom ? link.slugCustom : link.slugAuto
      const domain = link.domain ? link.domain.label : window.location.hostname
      const fullUrl = `https://${domain}/${shortUrl}`

      return h(UButton, {
        color: 'neutral',
        variant: 'soft',
        size: 'sm',
        icon: 'lucide:qr-code',
        onClick: () =>
          qrCode.open({
            url: fullUrl,
            filename: `${shortUrl}.png`,
          }),
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
