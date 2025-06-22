import { createApp, DefineComponent, h } from 'vue'
import '../css/app.css'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import Default from '~/layouts/default.vue'
import ui from '@nuxt/ui/vue-plugin'

createInertiaApp({
  progress: { color: '#ff6467' },

  title: () => 'Shorty',

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue')
    ).then((page) => {
      if (!page.default.layout) {
        page.default.layout = Default
      }
      return page
    })
  },

  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .use(ui)
      .mount(el)
  },
})
