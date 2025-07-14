<script setup lang="ts">
import OrganizationForm from '~/components/OrganizationForm.vue'
import type { Organization } from '~/types/organization'

const props = defineProps<{ organization: Organization }>()
const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <OrganizationForm
    mode="edit"
    :organization="props.organization"
    @close="handleClose"
    @success="handleClose"
  />
</template>
