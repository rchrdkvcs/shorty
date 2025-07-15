import { computed } from 'vue'
import { router, usePage } from '@inertiajs/vue3'

export interface Organization {
  id: string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export const useOrganization = () => {
  const page = usePage()

  const organizations = computed(() => {
    return (page.props.organizations as Organization[]) || []
  })

  const currentOrganization = computed(() => {
    const currentOrganizationId = page.props.currentOrganizationId as string
    return organizations.value.find((org) => org.id === currentOrganizationId) || null
  })

  const switchOrganization = (organization: Organization) => {
    const currentPath = window.location.pathname
    const newUrl = `${currentPath}?organizationId=${organization.id}`
    router.visit(newUrl)
  }

  return {
    organizations,
    currentOrganization,
    switchOrganization,
  }
}
