<script setup lang="ts">
import NoteCard from '@/components/NoteCard.vue'
import type { Note } from '@/types/note'

defineProps<{
  notes: Note[]
  viewMode?: 'grid' | 'list'
  trash?: boolean
}>()
</script>

<template>
  <div class="notes-collection" :class="viewMode === 'list' ? 'view-list' : 'view-grid'">
    <NoteCard v-for="note in notes" :key="note.id" :note="note" :trash="trash" />
  </div>
</template>
