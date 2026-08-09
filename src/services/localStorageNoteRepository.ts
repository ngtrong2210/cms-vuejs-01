import type { NoteRepository } from '@/services/noteRepository'
import type { Note, NoteColor } from '@/types/note'
import { NOTE_COLORS } from '@/types/note'

const STORAGE_KEY = 'nho-notes:v1'

const hoursAgo = (hours: number): string =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

const createSeedNotes = (): Note[] => [
  {
    id: 'welcome-note',
    title: 'Chào mừng đến với Nhớ',
    content:
      'Một góc nhỏ để lưu lại ý tưởng, công việc và những điều bạn không muốn quên. Bạn có thể ghim, đổi màu hoặc lưu trữ ghi chú này.',
    color: 'cream',
    isPinned: true,
    isArchived: false,
    createdAt: hoursAgo(72),
    updatedAt: hoursAgo(1),
    deletedAt: null,
  },
  {
    id: 'weekly-plan',
    title: 'Kế hoạch trong tuần',
    content: '• Hoàn thiện bản trình bày\n• Đặt lịch khám răng\n• Mua quà sinh nhật cho mẹ',
    color: 'mint',
    isPinned: true,
    isArchived: false,
    createdAt: hoursAgo(50),
    updatedAt: hoursAgo(3),
    deletedAt: null,
  },
  {
    id: 'book-list',
    title: 'Sách muốn đọc',
    content: 'Đi tìm lẽ sống\nNhà giả kim\nTư duy nhanh và chậm',
    color: 'sky',
    isPinned: false,
    isArchived: false,
    createdAt: hoursAgo(96),
    updatedAt: hoursAgo(18),
    deletedAt: null,
  },
  {
    id: 'project-idea',
    title: 'Ý tưởng cho dự án mới',
    content:
      'Xây dựng một không gian tập trung, tối giản và thân thiện để mọi người theo dõi thói quen mỗi ngày.',
    color: 'lilac',
    isPinned: false,
    isArchived: false,
    createdAt: hoursAgo(120),
    updatedAt: hoursAgo(28),
    deletedAt: null,
  },
  {
    id: 'shopping-list',
    title: 'Danh sách đi chợ',
    content: 'Cà phê, sữa tươi, rau xanh, trứng, bánh mì và một ít trái cây.',
    color: 'rose',
    isPinned: false,
    isArchived: false,
    createdAt: hoursAgo(60),
    updatedAt: hoursAgo(32),
    deletedAt: null,
  },
  {
    id: 'old-wifi',
    title: 'Thông tin Wi-Fi cũ',
    content: 'Ghi chú này đã được lưu trữ để giữ danh sách chính luôn gọn gàng.',
    color: 'slate',
    isPinned: false,
    isArchived: true,
    createdAt: hoursAgo(240),
    updatedAt: hoursAgo(180),
    deletedAt: null,
  },
  {
    id: 'discarded-draft',
    title: 'Bản nháp không còn dùng',
    content: 'Ghi chú trong thùng rác có thể được khôi phục hoặc xóa vĩnh viễn.',
    color: 'cream',
    isPinned: false,
    isArchived: false,
    createdAt: hoursAgo(200),
    updatedAt: hoursAgo(48),
    deletedAt: hoursAgo(48),
  },
]

const isNoteColor = (value: unknown): value is NoteColor =>
  typeof value === 'string' && NOTE_COLORS.includes(value as NoteColor)

const isNote = (value: unknown): value is Note => {
  if (!value || typeof value !== 'object') return false
  const note = value as Partial<Note>
  return (
    typeof note.id === 'string' &&
    typeof note.title === 'string' &&
    typeof note.content === 'string' &&
    isNoteColor(note.color) &&
    typeof note.isPinned === 'boolean' &&
    typeof note.isArchived === 'boolean' &&
    typeof note.createdAt === 'string' &&
    typeof note.updatedAt === 'string' &&
    (note.deletedAt === null || typeof note.deletedAt === 'string')
  )
}

const clone = <T>(value: T): T => structuredClone(value)

export class LocalStorageNoteRepository implements NoteRepository {
  private read(): Note[] {
    const storedValue = localStorage.getItem(STORAGE_KEY)

    if (!storedValue) {
      const seededNotes = createSeedNotes()
      this.write(seededNotes)
      return seededNotes
    }

    try {
      const parsed: unknown = JSON.parse(storedValue)
      if (Array.isArray(parsed) && parsed.every(isNote)) return parsed
    } catch {
      // Invalid local demo data is safely replaced with the initial examples.
    }

    const seededNotes = createSeedNotes()
    this.write(seededNotes)
    return seededNotes
  }

  private write(notes: Note[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }

  async list(): Promise<Note[]> {
    return clone(this.read())
  }

  async create(note: Note): Promise<Note> {
    const notes = this.read()
    notes.unshift(note)
    this.write(notes)
    return clone(note)
  }

  async update(note: Note): Promise<Note> {
    const notes = this.read()
    const index = notes.findIndex((item) => item.id === note.id)
    if (index === -1) throw new Error('Không tìm thấy ghi chú cần cập nhật.')
    notes[index] = note
    this.write(notes)
    return clone(note)
  }

  async delete(id: string): Promise<void> {
    this.write(this.read().filter((note) => note.id !== id))
  }
}

export const noteRepository: NoteRepository = new LocalStorageNoteRepository()
