<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useNoteStore } from '@/stores/noteStore'
import { useUiStore } from '@/stores/uiStore'

defineProps<{
  title: string
  subtitle: string
  resultCount: number
}>()

const noteStore = useNoteStore()
const uiStore = useUiStore()
const { sortOrder } = storeToRefs(noteStore)
</script>

<template>
  <div class="notes-toolbar">
    <div class="page-heading">
      <div class="page-title-row">
        <h1>{{ title }}</h1>
        <span class="result-count">{{ resultCount }}</span>
      </div>
      <p>{{ subtitle }}</p>
    </div>

    <div class="toolbar-controls">
      <label class="sort-control">
        <i class="bi bi-arrow-down-up" aria-hidden="true" />
        <span class="visually-hidden">Sắp xếp ghi chú</span>
        <select v-model="sortOrder" aria-label="Sắp xếp ghi chú">
          <option value="updated-desc">Mới cập nhật</option>
          <option value="updated-asc">Cũ cập nhật</option>
          <option value="title-asc">Theo tiêu đề</option>
        </select>
      </label>

      <div class="view-switcher" role="group" aria-label="Kiểu hiển thị">
        <button
          type="button"
          aria-label="Hiển thị dạng lưới"
          :class="{ active: uiStore.viewMode === 'grid' }"
          @click="uiStore.setViewMode('grid')"
        >
          <i class="bi bi-grid" />
        </button>
        <button
          type="button"
          aria-label="Hiển thị dạng danh sách"
          :class="{ active: uiStore.viewMode === 'list' }"
          @click="uiStore.setViewMode('list')"
        >
          <i class="bi bi-view-stacked" />
        </button>
      </div>
    </div>
  </div>
</template>
