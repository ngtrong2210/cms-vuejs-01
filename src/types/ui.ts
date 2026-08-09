export type ThemeMode = 'light' | 'dark'
export type ToastTone = 'success' | 'danger' | 'info'

export interface ToastMessage {
  id: number
  message: string
  tone: ToastTone
}
