<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import NoteEditorModal from '@/components/NoteEditorModal.vue'
import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()

const closeSidebarOnDesktop = (): void => {
  if (window.innerWidth >= 992) uiStore.closeSidebar()
}

onMounted(() => window.addEventListener('resize', closeSidebarOnDesktop))
onBeforeUnmount(() => window.removeEventListener('resize', closeSidebarOnDesktop))
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <AppSidebar />

    <button
      v-if="uiStore.isSidebarOpen"
      class="sidebar-backdrop"
      type="button"
      aria-label="Đóng menu"
      @click="uiStore.closeSidebar"
    />

    <main class="app-main">
      <RouterView />
    </main>

    <NoteEditorModal />
  </div>
</template>
