<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { useNoteStore } from '@/stores/noteStore'
import { useUiStore } from '@/stores/uiStore'

const noteStore = useNoteStore()
const uiStore = useUiStore()
const { searchQuery } = storeToRefs(noteStore)
const searchInput = ref<HTMLInputElement | null>(null)

const focusSearch = (event: KeyboardEvent): void => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    searchInput.value?.focus()
  }
}

onMounted(() => document.addEventListener('keydown', focusSearch))
onBeforeUnmount(() => document.removeEventListener('keydown', focusSearch))
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="header-brand-group">
        <button
          class="icon-button mobile-menu-button"
          type="button"
          aria-label="Mở menu"
          :aria-expanded="uiStore.isSidebarOpen"
          @click="uiStore.isSidebarOpen = !uiStore.isSidebarOpen"
        >
          <i class="bi bi-list" aria-hidden="true" />
        </button>

        <RouterLink class="brand" to="/" aria-label="Nhớ Notes - Trang tổng quan">
          <span class="brand-mark"><i class="bi bi-journal-bookmark-fill" /></span>
          <span class="brand-name">Nhớ</span>
        </RouterLink>
      </div>

      <label class="search-box">
        <i class="bi bi-search" aria-hidden="true" />
        <span class="visually-hidden">Tìm kiếm ghi chú</span>
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="search"
          autocomplete="off"
          placeholder="Tìm trong ghi chú..."
        />
        <button
          v-if="searchQuery"
          class="clear-search"
          type="button"
          aria-label="Xóa nội dung tìm kiếm"
          @click="searchQuery = ''"
        >
          <i class="bi bi-x-lg" />
        </button>
        <kbd class="search-shortcut">Ctrl K</kbd>
      </label>

      <div class="header-actions">
        <button
          class="icon-button"
          type="button"
          :aria-label="uiStore.theme === 'light' ? 'Bật giao diện tối' : 'Bật giao diện sáng'"
          :title="uiStore.theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'"
          @click="uiStore.toggleTheme"
        >
          <i :class="uiStore.theme === 'light' ? 'bi bi-moon-stars' : 'bi bi-sun'" />
        </button>
        <button class="btn btn-primary new-note-header" type="button" @click="uiStore.openEditor()">
          <i class="bi bi-plus-lg" />
          <span>Ghi chú mới</span>
        </button>
      </div>
    </div>
  </header>
</template>
