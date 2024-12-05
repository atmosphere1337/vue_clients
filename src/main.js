import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

const vuetify = createVuetify({
    components,
    directives,
  })

library.add(fas)

createApp(App)
    .use(vuetify)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
