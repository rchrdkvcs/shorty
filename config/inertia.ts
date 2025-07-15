import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'
import User from '#models/user'
import Organization from '#models/organization'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    user: (ctx) => ctx.inertia.always(() => ctx.auth.user),
    organizations: (ctx) => {
      return ctx.inertia.lazy(async () => {
        if (!ctx.auth.user) return []

        const organizations = await Organization.query()
          .whereHas('users', (userQuery) => {
            userQuery.where('user_id', ctx.auth.user!.id)
          })
          .select('id', 'name', 'description')
          .orderBy('name')

        return organizations
      })
    },
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: false,
    entrypoint: 'inertia/app/ssr.ts',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {
    user: User
    organizations: Organization[]
  }
}
