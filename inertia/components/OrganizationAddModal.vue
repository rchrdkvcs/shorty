<script setup lang="ts">
import OrganizationForm from '~/components/OrganizationForm.vue'

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <OrganizationForm mode="create" @close="handleClose" @success="handleClose" />
</template>
