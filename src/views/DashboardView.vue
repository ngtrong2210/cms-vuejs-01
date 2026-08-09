<script setup lang="ts">
import { computed } from 'vue'

import EmptyState from '@/components/EmptyState.vue'
import NoteList from '@/components/NoteList.vue'
import { useNoteStore } from '@/stores/noteStore'
import { useUiStore } from '@/stores/uiStore'

const noteStore = useNoteStore()
const uiStore = useUiStore()

const recentNotes = computed(() => noteStore.getFilteredNotes('all').slice(0, 6))

const statistics = computed(() => [
  {
    label: 'Ghi chú',
    value: noteStore.activeCount,
    icon: 'bi-journals',
    className: 'stat-primary',
    to: '/notes',
  },
  {
    label: 'Đã ghim',
    value: noteStore.pinnedCount,
    icon: 'bi-pin-angle-fill',
    className: 'stat-amber',
    to: '/pinned',
  },
  {
    label: 'Lưu trữ',
    value: noteStore.archivedCount,
    icon: 'bi-archive-fill',
    className: 'stat-green',
    to: '/archived',
  },
  {
    label: 'Thùng rác',
    value: noteStore.trashCount,
    icon: 'bi-trash3-fill',
    className: 'stat-slate',
    to: '/trash',
  },
])
</script>

<template>
  <div class="page-container dashboard-page">
    <section class="dashboard-hero">
      <div>
        <span class="eyebrow">Không gian của bạn</span>
        <h1>Xin chào, hôm nay bạn muốn ghi lại điều gì?</h1>
        <p>Thu thập ý tưởng, sắp xếp công việc và giữ những điều quan trọng luôn bên mình.</p>
      </div>
      <button class="btn btn-primary hero-action" type="button" @click="uiStore.openEditor()">
        <i class="bi bi-plus-lg" /> Tạo ghi chú mới
      </button>
      <div class="hero-decoration" aria-hidden="true">
        <i class="bi bi-pencil-square" />
      </div>
    </section>

    <section aria-labelledby="overview-title">
      <h2 id="overview-title" class="section-title">Tổng quan</h2>
      <div class="stats-grid">
        <RouterLink
          v-for="stat in statistics"
          :key="stat.label"
          :to="stat.to"
          class="stat-card"
        >
          <span class="stat-icon" :class="stat.className"><i class="bi" :class="stat.icon" /></span>
          <span class="stat-copy">
            <strong>{{ stat.value }}</strong>
            <small>{{ stat.label }}</small>
          </span>
          <i class="bi bi-arrow-up-right stat-arrow" />
        </RouterLink>
      </div>
    </section>

    <section class="recent-section" aria-labelledby="recent-title">
      <div class="section-heading-row">
        <div>
          <h2 id="recent-title" class="section-title">Ghi chú gần đây</h2>
          <p>Những ghi chú bạn vừa cập nhật.</p>
        </div>
        <RouterLink to="/notes" class="view-all-link">Xem tất cả <i class="bi bi-arrow-right" /></RouterLink>
      </div>

      <NoteList v-if="recentNotes.length" :notes="recentNotes" :view-mode="uiStore.viewMode" />
      <EmptyState
        v-else-if="noteStore.searchQuery"
        icon="bi-search"
        title="Không tìm thấy ghi chú"
        message="Không có kết quả phù hợp với từ khóa hiện tại."
        action-label="Xóa tìm kiếm"
        @action="noteStore.searchQuery = ''"
      />
      <EmptyState
        v-else
        icon="bi-journal-plus"
        title="Chưa có ghi chú"
        message="Tạo ghi chú đầu tiên để bắt đầu không gian của riêng bạn."
        action-label="Tạo ghi chú"
        @action="uiStore.openEditor()"
      />
    </section>
  </div>
</template>
