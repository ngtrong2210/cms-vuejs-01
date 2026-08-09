<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useNoteStore } from '@/stores/noteStore'
import { useUiStore } from '@/stores/uiStore'

const noteStore = useNoteStore()
const uiStore = useUiStore()
const { activeCount, pinnedCount, archivedCount, trashCount } = storeToRefs(noteStore)

const navigation = [
  { to: '/', label: 'Tổng quan', icon: 'bi-grid-1x2' },
  { to: '/notes', label: 'Tất cả ghi chú', icon: 'bi-journals', count: activeCount },
  { to: '/pinned', label: 'Đã ghim', icon: 'bi-pin-angle', count: pinnedCount },
  { to: '/archived', label: 'Lưu trữ', icon: 'bi-archive', count: archivedCount },
  { to: '/trash', label: 'Thùng rác', icon: 'bi-trash3', count: trashCount },
]
</script>

<template>
  <aside class="app-sidebar" :class="{ 'is-open': uiStore.isSidebarOpen }">
    <div class="sidebar-mobile-heading">
      <span>Điều hướng</span>
      <button class="icon-button" type="button" aria-label="Đóng menu" @click="uiStore.closeSidebar">
        <i class="bi bi-x-lg" />
      </button>
    </div>

    <button class="sidebar-create-button" type="button" @click="uiStore.openEditor()">
      <span class="sidebar-create-icon"><i class="bi bi-plus-lg" /></span>
      <span>Tạo ghi chú</span>
    </button>

    <nav class="sidebar-nav" aria-label="Điều hướng chính">
      <RouterLink
        v-for="item in navigation"
        :key="item.to"
        :to="item.to"
        class="sidebar-link"
        :class="{ exact: item.to === '/' }"
        @click="uiStore.closeSidebar"
      >
        <i class="bi" :class="item.icon" aria-hidden="true" />
        <span>{{ item.label }}</span>
        <span v-if="item.count" class="sidebar-count">{{ item.count.value }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar-tip">
      <div class="tip-icon"><i class="bi bi-lightbulb" /></div>
      <div>
        <strong>Mẹo nhỏ</strong>
        <p>Ghim những ghi chú quan trọng để luôn thấy chúng đầu tiên.</p>
      </div>
    </div>

    <p class="sidebar-storage"><i class="bi bi-device-ssd" /> Dữ liệu được lưu trên thiết bị này</p>
  </aside>
</template>
