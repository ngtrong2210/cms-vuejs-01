import type { Note } from '@/types/note'

/**
 * Contract used by the store. A future API implementation can replace the
 * localStorage repository without changing any view or component.
 */
export interface NoteRepository {
  list(): Promise<Note[]>
  create(note: Note): Promise<Note>
  update(note: Note): Promise<Note>
  delete(id: string): Promise<void>
}
