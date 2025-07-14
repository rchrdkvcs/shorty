<script setup lang="ts">
import LinkForm from '~/components/LinkForm.vue'
import { usePage } from '@inertiajs/vue3'

const emit = defineEmits(['close'])
const page = usePage()

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <LinkForm
    mode="create"
    :available-domains="page.props.availableDomains"
    :organizations="page.props.organizations"
    @close="handleClose"
    @success="handleClose"
  />
</template>
