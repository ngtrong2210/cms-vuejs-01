<script setup lang="ts">
import { ref } from 'vue'

import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useNoteStore } from '@/stores/noteStore'
import { useUiStore } from '@/stores/uiStore'
import type { Note } from '@/types/note'
import { formatFullDate, formatRelativeDate } from '@/utils/date'

const props = defineProps<{
  note: Note
  trash?: boolean
}>()

const noteStore = useNoteStore()
const uiStore = useUiStore()
const isMenuOpen = ref(false)
const isConfirmingDelete = ref(false)

const requestDelete = (): void => {
  isMenuOpen.value = false
  isConfirmingDelete.value = true
}

const confirmDelete = async (): Promise<void> => {
  const succeeded = props.trash
    ? await noteStore.deleteForever(props.note)
    : await noteStore.moveToTrash(props.note)
  if (succeeded) isConfirmingDelete.value = false
}

const edit = (): void => {
  isMenuOpen.value = false
  uiStore.openEditor(props.note.id)
}

const runAction = async (action: () => Promise<boolean>): Promise<void> => {
  isMenuOpen.value = false
  await action()
}
</script>

<template>
  <article class="note-card" :class="[`note-${note.color}`, { 'is-pinned': note.isPinned }]">
    <div class="note-card-topline">
      <span v-if="note.isPinned && !trash" class="pinned-label"><i class="bi bi-pin-angle-fill" /> Đã ghim</span>
      <span v-else class="note-color-dot" aria-hidden="true" />

      <div class="note-card-actions">
        <button
          v-if="!trash && !note.isArchived"
          class="card-icon-button pin-button"
          type="button"
          :aria-label="note.isPinned ? 'Bỏ ghim ghi chú' : 'Ghim ghi chú'"
          :title="note.isPinned ? 'Bỏ ghim' : 'Ghim'"
          @click="runAction(() => noteStore.togglePin(note))"
        >
          <i class="bi" :class="note.isPinned ? 'bi-pin-angle-fill' : 'bi-pin-angle'" />
        </button>

        <div class="card-menu-wrap">
          <button
            class="card-icon-button"
            type="button"
            aria-label="Mở menu thao tác"
            :aria-expanded="isMenuOpen"
            @click="isMenuOpen = !isMenuOpen"
          >
            <i class="bi bi-three-dots" />
          </button>

          <div v-if="isMenuOpen" class="card-menu">
            <template v-if="trash">
              <button type="button" @click="runAction(() => noteStore.restoreNote(note))">
                <i class="bi bi-arrow-counterclockwise" /> Khôi phục
              </button>
              <button class="danger" type="button" @click="requestDelete">
                <i class="bi bi-trash3" /> Xóa vĩnh viễn
              </button>
            </template>
            <template v-else>
              <button type="button" @click="edit"><i class="bi bi-pencil" /> Chỉnh sửa</button>
              <button
                v-if="!note.isArchived"
                type="button"
                @click="runAction(() => noteStore.togglePin(note))"
              >
                <i class="bi" :class="note.isPinned ? 'bi-pin-angle' : 'bi-pin-angle-fill'" />
                {{ note.isPinned ? 'Bỏ ghim' : 'Ghim ghi chú' }}
              </button>
              <button type="button" @click="runAction(() => noteStore.toggleArchive(note))">
                <i class="bi" :class="note.isArchived ? 'bi-inbox' : 'bi-archive'" />
                {{ note.isArchived ? 'Bỏ lưu trữ' : 'Lưu trữ' }}
              </button>
              <button class="danger" type="button" @click="requestDelete">
                <i class="bi bi-trash3" /> Chuyển vào thùng rác
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="note-card-body" @dblclick="!trash && edit()">
      <h3>{{ note.title }}</h3>
      <p>{{ note.content || 'Ghi chú này chưa có nội dung.' }}</p>
    </div>

    <footer class="note-card-footer">
      <span :title="formatFullDate(note.updatedAt)">
        <i class="bi bi-clock" /> {{ formatRelativeDate(note.updatedAt) }}
      </span>
      <button v-if="!trash" type="button" aria-label="Chỉnh sửa ghi chú" @click="edit">
        <i class="bi bi-pencil" />
      </button>
      <span v-else class="trash-date"><i class="bi bi-trash3" /> Trong thùng rác</span>
    </footer>
  </article>

  <ConfirmDialog
    v-if="isConfirmingDelete"
    :title="trash ? 'Xóa vĩnh viễn ghi chú?' : 'Chuyển vào thùng rác?'"
    :message="
      trash
        ? 'Hành động này không thể hoàn tác. Ghi chú sẽ bị xóa khỏi thiết bị của bạn.'
        : 'Bạn có thể khôi phục ghi chú này từ thùng rác sau đó.'
    "
    :confirm-label="trash ? 'Xóa vĩnh viễn' : 'Chuyển vào thùng rác'"
    :dangerous="true"
    :busy="noteStore.isSaving"
    @cancel="isConfirmingDelete = false"
    @confirm="confirmDelete"
  />
</template>
