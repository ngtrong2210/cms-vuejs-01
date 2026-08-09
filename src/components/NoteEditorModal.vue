<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

import { useNoteStore } from '@/stores/noteStore'
import { useUiStore } from '@/stores/uiStore'
import { NOTE_COLORS, type NoteColor, type NoteDraft } from '@/types/note'

const noteStore = useNoteStore()
const uiStore = useUiStore()
const titleInput = ref<HTMLInputElement | null>(null)
const title = ref('')
const content = ref('')
const color = ref<NoteColor>('cream')
const validationMessage = ref('')

const editingNote = computed(() =>
  uiStore.editorNoteId ? noteStore.getById(uiStore.editorNoteId) : undefined,
)
const isEditing = computed(() => Boolean(editingNote.value))

const colorLabels: Record<NoteColor, string> = {
  cream: 'Kem',
  rose: 'Hồng',
  mint: 'Bạc hà',
  sky: 'Xanh da trời',
  lilac: 'Tím nhạt',
  slate: 'Xám',
}

watch(
  () => uiStore.isEditorOpen,
  async (isOpen) => {
    if (isOpen) {
      title.value = editingNote.value?.title ?? ''
      content.value = editingNote.value?.content ?? ''
      color.value = editingNote.value?.color ?? 'cream'
      validationMessage.value = ''
      document.body.classList.add('modal-open')
      await nextTick()
      titleInput.value?.focus()
    } else {
      document.body.classList.remove('modal-open')
    }
  },
)

const close = (): void => {
  if (!noteStore.isSaving) uiStore.closeEditor()
}

const submit = async (): Promise<void> => {
  if (!title.value.trim() && !content.value.trim()) {
    validationMessage.value = 'Hãy nhập tiêu đề hoặc nội dung cho ghi chú.'
    titleInput.value?.focus()
    return
  }

  const draft: NoteDraft = {
    title: title.value.trim() || 'Ghi chú không có tiêu đề',
    content: content.value,
    color: color.value,
  }
  const succeeded = editingNote.value
    ? await noteStore.updateNote(editingNote.value.id, draft)
    : await noteStore.addNote(draft)
  if (succeeded) close()
}

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && uiStore.isEditorOpen) close()
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && uiStore.isEditorOpen) void submit()
}

document.addEventListener('keydown', handleKeydown)
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('modal-open')
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="uiStore.isEditorOpen"
        class="modal-layer note-editor-layer"
        role="presentation"
        @mousedown.self="close"
      >
        <section
          class="note-editor"
          :class="`note-${color}`"
          role="dialog"
          aria-modal="true"
          aria-labelledby="editor-title"
        >
          <header class="editor-header">
            <div>
              <span class="eyebrow">{{ isEditing ? 'Chỉnh sửa ghi chú' : 'Ghi chú mới' }}</span>
              <h2 id="editor-title">{{ isEditing ? 'Cập nhật điều bạn đang nghĩ' : 'Bạn đang nghĩ gì?' }}</h2>
            </div>
            <button class="icon-button" type="button" aria-label="Đóng" :disabled="noteStore.isSaving" @click="close">
              <i class="bi bi-x-lg" />
            </button>
          </header>

          <form @submit.prevent="submit">
            <div class="editor-fields">
              <input
                ref="titleInput"
                v-model="title"
                class="editor-title-input"
                type="text"
                maxlength="100"
                placeholder="Tiêu đề ghi chú"
                aria-label="Tiêu đề"
                @input="validationMessage = ''"
              />
              <textarea
                v-model="content"
                class="editor-content-input"
                rows="9"
                maxlength="5000"
                placeholder="Viết nội dung ở đây..."
                aria-label="Nội dung"
                @input="validationMessage = ''"
              />
            </div>

            <p v-if="validationMessage" class="editor-validation" role="alert">
              <i class="bi bi-exclamation-circle" /> {{ validationMessage }}
            </p>

            <footer class="editor-footer">
              <fieldset class="color-picker">
                <legend>Màu ghi chú</legend>
                <label v-for="item in NOTE_COLORS" :key="item" :title="colorLabels[item]">
                  <input v-model="color" type="radio" name="note-color" :value="item" />
                  <span :class="`color-${item}`">
                    <i v-if="color === item" class="bi bi-check-lg" />
                  </span>
                  <span class="visually-hidden">{{ colorLabels[item] }}</span>
                </label>
              </fieldset>

              <div class="editor-actions">
                <span class="editor-shortcut">Ctrl + Enter để lưu</span>
                <button class="btn btn-light" type="button" :disabled="noteStore.isSaving" @click="close">Hủy</button>
                <button class="btn btn-primary" type="submit" :disabled="noteStore.isSaving">
                  <span v-if="noteStore.isSaving" class="spinner-border spinner-border-sm" />
                  <i v-else class="bi bi-check2" />
                  {{ isEditing ? 'Lưu thay đổi' : 'Tạo ghi chú' }}
                </button>
              </div>
            </footer>
          </form>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
