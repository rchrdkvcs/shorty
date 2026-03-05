import { defineConfig } from 'vite'
import inertia from '@adonisjs/inertia/vite'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: false } }),
    vue(),
    adonisjs({ entrypoints: ['inertia/app.ts'], reload: ['resources/views/**/*.edge'] }),
    ui({
      router: 'inertia',
      ui: {
        colors: {
          primary: 'green',
          neutral: 'zinc',
        },
        button: {
          slots: {
            base: 'cursor-pointer',
          },
        },
        navigationMenu: {
          slots: {
            link: 'py-2! my-0.5! cursor-pointer',
          },
          variants: {
            active: {
              true: {
                link: 'before:bg-elevated/50! before:border-default/75 before:border',
              },
            },
          },
        },
        dashboardSidebar: {
          slots: {
            root: 'w-64! border-none py-2!',
          },
        },
        dashboardPanel: {
          slots: {
            root: 'p-4 pl-0 border-none!',
            body: 'bg-elevated/50 rounded-b-lg border border-default/75',
          },
        },
        dashboardNavbar: {
          slots: {
            root: 'bg-elevated/50 rounded-t-lg border border-default/75 border-b-0',
          },
        },
      },
    }),
  ],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~/': `${import.meta.dirname}/inertia/`,
    },
  },
})
