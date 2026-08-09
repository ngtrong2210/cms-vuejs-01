export const NOTE_COLORS = ['cream', 'rose', 'mint', 'sky', 'lilac', 'slate'] as const

export type NoteColor = (typeof NOTE_COLORS)[number]

export interface Note {
  id: string
  title: string
  content: string
  color: NoteColor
  isPinned: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface NoteDraft {
  title: string
  content: string
  color: NoteColor
}

export type NoteFilter = 'all' | 'pinned' | 'archived' | 'trash'
export type NoteSortOrder = 'updated-desc' | 'updated-asc' | 'title-asc'
export type NoteViewMode = 'grid' | 'list'
