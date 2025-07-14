<script setup lang="ts">
import LinkForm from '~/components/LinkForm.vue'
import type Link from '#models/link'
import { usePage } from '@inertiajs/vue3'

const props = defineProps<{ link: Link }>()
const emit = defineEmits(['close'])
const page = usePage()

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <LinkForm
    mode="edit"
    :link="props.link"
    :available-domains="page.props.availableDomains"
    :organizations="page.props.organizations"
    @close="handleClose"
    @success="handleClose"
  />
</template>
