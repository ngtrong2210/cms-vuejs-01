import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@/styles/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'
import { useNoteStore } from '@/stores/noteStore'
import { useUiStore } from '@/stores/uiStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const uiStore = useUiStore(pinia)
uiStore.initialize()

const noteStore = useNoteStore(pinia)
await noteStore.initialize()

app.mount('#app')
