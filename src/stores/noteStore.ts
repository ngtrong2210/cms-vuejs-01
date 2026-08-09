import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { noteRepository } from '@/services/localStorageNoteRepository'
import { useUiStore } from '@/stores/uiStore'
import type { Note, NoteDraft, NoteFilter, NoteSortOrder } from '@/types/note'

const createId = (): string =>
  typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `note-${Date.now()}-${Math.random().toString(16).slice(2)}`

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('vi')

export const useNoteStore = defineStore('notes', () => {
  const uiStore = useUiStore()
  const notes = ref<Note[]>([])
  const searchQuery = ref('')
  const sortOrder = ref<NoteSortOrder>('updated-desc')
  const isReady = ref(false)
  const isSaving = ref(false)

  const activeCount = computed(
    () => notes.value.filter((note) => !note.deletedAt && !note.isArchived).length,
  )
  const pinnedCount = computed(
    () =>
      notes.value.filter(
        (note) => !note.deletedAt && !note.isArchived && note.isPinned,
      ).length,
  )
  const archivedCount = computed(
    () => notes.value.filter((note) => !note.deletedAt && note.isArchived).length,
  )
  const trashCount = computed(() => notes.value.filter((note) => note.deletedAt).length)

  const initialize = async (): Promise<void> => {
    try {
      notes.value = await noteRepository.list()
    } catch {
      uiStore.showToast('Không thể đọc dữ liệu ghi chú.', 'danger')
    } finally {
      isReady.value = true
    }
  }

  const getById = (id: string): Note | undefined => notes.value.find((note) => note.id === id)

  const getFilteredNotes = (filter: NoteFilter): Note[] => {
    const query = normalizeText(searchQuery.value.trim())
    const filtered = notes.value.filter((note) => {
      const matchesFilter =
        filter === 'trash'
          ? Boolean(note.deletedAt)
          : !note.deletedAt &&
            (filter === 'archived'
              ? note.isArchived
              : !note.isArchived && (filter === 'pinned' ? note.isPinned : true))

      if (!matchesFilter || !query) return matchesFilter
      return normalizeText(`${note.title} ${note.content}`).includes(query)
    })

    return [...filtered].sort((first, second) => {
      if (filter === 'all' && first.isPinned !== second.isPinned) {
        return first.isPinned ? -1 : 1
      }
      if (sortOrder.value === 'title-asc') {
        return first.title.localeCompare(second.title, 'vi')
      }
      const difference =
        new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
      return sortOrder.value === 'updated-desc' ? difference : -difference
    })
  }

  const execute = async (action: () => Promise<void>, errorMessage: string): Promise<boolean> => {
    isSaving.value = true
    try {
      await action()
      return true
    } catch {
      uiStore.showToast(errorMessage, 'danger')
      return false
    } finally {
      isSaving.value = false
    }
  }

  const addNote = async (draft: NoteDraft): Promise<boolean> =>
    execute(async () => {
      const now = new Date().toISOString()
      const created = await noteRepository.create({
        id: createId(),
        title: draft.title.trim(),
        content: draft.content.trim(),
        color: draft.color,
        isPinned: false,
        isArchived: false,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      })
      notes.value.unshift(created)
      uiStore.showToast('Đã tạo ghi chú mới.')
    }, 'Không thể tạo ghi chú. Vui lòng thử lại.')

  const updateNote = async (id: string, draft: NoteDraft): Promise<boolean> =>
    updateProperties(
      id,
      {
        title: draft.title.trim(),
        content: draft.content.trim(),
        color: draft.color,
      },
      'Đã cập nhật ghi chú.',
    )

  const updateProperties = async (
    id: string,
    changes: Partial<Note>,
    successMessage: string,
  ): Promise<boolean> =>
    execute(async () => {
      const current = getById(id)
      if (!current) throw new Error('Missing note')
      const updated = await noteRepository.update({
        ...current,
        ...changes,
        updatedAt: new Date().toISOString(),
      })
      const index = notes.value.findIndex((note) => note.id === id)
      notes.value[index] = updated
      uiStore.showToast(successMessage)
    }, 'Không thể cập nhật ghi chú. Vui lòng thử lại.')

  const togglePin = async (note: Note): Promise<boolean> =>
    updateProperties(
      note.id,
      { isPinned: !note.isPinned },
      note.isPinned ? 'Đã bỏ ghim ghi chú.' : 'Đã ghim ghi chú.',
    )

  const toggleArchive = async (note: Note): Promise<boolean> =>
    updateProperties(
      note.id,
      { isArchived: !note.isArchived, isPinned: note.isArchived ? note.isPinned : false },
      note.isArchived ? 'Đã đưa ghi chú về danh sách.' : 'Đã lưu trữ ghi chú.',
    )

  const moveToTrash = async (note: Note): Promise<boolean> =>
    updateProperties(note.id, { deletedAt: new Date().toISOString(), isPinned: false }, 'Đã chuyển vào thùng rác.')

  const restoreNote = async (note: Note): Promise<boolean> =>
    updateProperties(note.id, { deletedAt: null }, 'Đã khôi phục ghi chú.')

  const deleteForever = async (note: Note): Promise<boolean> =>
    execute(async () => {
      await noteRepository.delete(note.id)
      notes.value = notes.value.filter((item) => item.id !== note.id)
      uiStore.showToast('Đã xóa vĩnh viễn ghi chú.')
    }, 'Không thể xóa ghi chú. Vui lòng thử lại.')

  return {
    notes,
    searchQuery,
    sortOrder,
    isReady,
    isSaving,
    activeCount,
    pinnedCount,
    archivedCount,
    trashCount,
    initialize,
    getById,
    getFilteredNotes,
    addNote,
    updateNote,
    togglePin,
    toggleArchive,
    moveToTrash,
    restoreNote,
    deleteForever,
  }
})
