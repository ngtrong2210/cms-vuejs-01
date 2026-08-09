import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { NoteViewMode } from '@/types/note'
import type { ThemeMode, ToastMessage, ToastTone } from '@/types/ui'

const THEME_KEY = 'nho-notes:theme'
const VIEW_MODE_KEY = 'nho-notes:view-mode'

export const useUiStore = defineStore('ui', () => {
  const theme = ref<ThemeMode>('light')
  const viewMode = ref<NoteViewMode>('grid')
  const isSidebarOpen = ref(false)
  const isEditorOpen = ref(false)
  const editorNoteId = ref<string | null>(null)
  const toasts = ref<ToastMessage[]>([])
  let toastSequence = 0

  const applyTheme = (value: ThemeMode): void => {
    theme.value = value
    document.documentElement.dataset.bsTheme = value
    document.documentElement.dataset.theme = value
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      value === 'dark' ? '#16181d' : '#f6f7fb',
    )
  }

  const initialize = (): void => {
    const savedTheme = localStorage.getItem(THEME_KEY)
    const preferredTheme: ThemeMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    applyTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : preferredTheme)

    const savedViewMode = localStorage.getItem(VIEW_MODE_KEY)
    if (savedViewMode === 'grid' || savedViewMode === 'list') viewMode.value = savedViewMode
  }

  const toggleTheme = (): void => {
    const nextTheme: ThemeMode = theme.value === 'light' ? 'dark' : 'light'
    applyTheme(nextTheme)
    localStorage.setItem(THEME_KEY, nextTheme)
  }

  const setViewMode = (mode: NoteViewMode): void => {
    viewMode.value = mode
    localStorage.setItem(VIEW_MODE_KEY, mode)
  }

  const closeSidebar = (): void => {
    isSidebarOpen.value = false
  }

  const openEditor = (noteId: string | null = null): void => {
    editorNoteId.value = noteId
    isEditorOpen.value = true
    closeSidebar()
  }

  const closeEditor = (): void => {
    isEditorOpen.value = false
    editorNoteId.value = null
  }

  const showToast = (message: string, tone: ToastTone = 'success'): void => {
    const id = ++toastSequence
    toasts.value.push({ id, message, tone })
    window.setTimeout(() => removeToast(id), 3600)
  }

  const removeToast = (id: number): void => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  return {
    theme,
    viewMode,
    isSidebarOpen,
    isEditorOpen,
    editorNoteId,
    toasts,
    initialize,
    toggleTheme,
    setViewMode,
    closeSidebar,
    openEditor,
    closeEditor,
    showToast,
    removeToast,
  }
})
