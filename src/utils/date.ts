const relativeFormatter = new Intl.RelativeTimeFormat('vi', { numeric: 'auto' })

export const formatRelativeDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  const seconds = Math.round((date.getTime() - Date.now()) / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)

  if (Math.abs(seconds) < 60) return 'vừa xong'
  if (Math.abs(minutes) < 60) return relativeFormatter.format(minutes, 'minute')
  if (Math.abs(hours) < 24) return relativeFormatter.format(hours, 'hour')
  if (Math.abs(days) < 7) return relativeFormatter.format(days, 'day')

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  }).format(date)
}

export const formatFullDate = (isoDate: string): string =>
  new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoDate))
