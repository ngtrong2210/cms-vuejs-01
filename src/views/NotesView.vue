<script setup lang="ts">
import { computed } from 'vue'

import EmptyState from '@/components/EmptyState.vue'
import NoteList from '@/components/NoteList.vue'
import NotesToolbar from '@/components/NotesToolbar.vue'
import { useNoteStore } from '@/stores/noteStore'
import { useUiStore } from '@/stores/uiStore'
import type { NoteFilter } from '@/types/note'

const props = defineProps<{ filter: NoteFilter }>()

const noteStore = useNoteStore()
const uiStore = useUiStore()

const pageCopy: Record<NoteFilter, { title: string; subtitle: string; icon: string; empty: string }> = {
  all: {
    title: 'Tất cả ghi chú',
    subtitle: 'Mọi ý tưởng và việc cần nhớ, ở cùng một nơi.',
    icon: 'bi-journal-text',
    empty: 'Bạn chưa có ghi chú nào. Hãy bắt đầu bằng một điều nhỏ.',
  },
  pinned: {
    title: 'Ghi chú đã ghim',
    subtitle: 'Những ghi chú quan trọng luôn trong tầm mắt.',
    icon: 'bi-pin-angle',
    empty: 'Chưa có ghi chú nào được ghim. Bạn có thể ghim từ menu trên mỗi thẻ.',
  },
  archived: {
    title: 'Lưu trữ',
    subtitle: 'Các ghi chú đã cất đi nhưng vẫn sẵn sàng khi bạn cần.',
    icon: 'bi-archive',
    empty: 'Kho lưu trữ đang trống.',
  },
  trash: {
    title: 'Thùng rác',
    subtitle: 'Khôi phục ghi chú hoặc xóa vĩnh viễn khỏi thiết bị.',
    icon: 'bi-trash3',
    empty: 'Thùng rác đang trống. Không có gì cần dọn dẹp.',
  },
}

const visibleNotes = computed(() => noteStore.getFilteredNotes(props.filter))
const copy = computed(() => pageCopy[props.filter])
const hasSearch = computed(() => Boolean(noteStore.searchQuery.trim()))
</script>

<template>
  <div class="page-container">
    <NotesToolbar
      :title="copy.title"
      :subtitle="copy.subtitle"
      :result-count="visibleNotes.length"
    />

    <div v-if="filter === 'trash' && visibleNotes.length" class="trash-notice">
      <i class="bi bi-info-circle" />
      <span>Ghi chú trong thùng rác chỉ bị xóa khi bạn chọn “Xóa vĩnh viễn”.</span>
    </div>

    <NoteList
      v-if="visibleNotes.length"
      :notes="visibleNotes"
      :view-mode="uiStore.viewMode"
      :trash="filter === 'trash'"
    />

    <EmptyState
      v-else-if="hasSearch"
      icon="bi-search"
      title="Không tìm thấy ghi chú"
      message="Thử một từ khóa khác hoặc xóa nội dung tìm kiếm hiện tại."
      action-label="Xóa tìm kiếm"
      @action="noteStore.searchQuery = ''"
    />

    <EmptyState
      v-else
      :icon="copy.icon"
      :title="filter === 'all' ? 'Bắt đầu ghi lại điều hay' : copy.title"
      :message="copy.empty"
      :action-label="filter === 'all' ? 'Tạo ghi chú đầu tiên' : ''"
      @action="uiStore.openEditor()"
    />
  </div>
</template>
