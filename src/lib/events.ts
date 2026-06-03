export const EVENT_TYPES = [
  { id: 'wedding',    label: 'Pernikahan',  icon: '💍', description: 'Undangan pernikahan' },
  { id: 'reunion',    label: 'Reuni',       icon: '🤝', description: 'Reuni keluarga / sekolah' },
  { id: 'syukuran',   label: 'Syukuran',   icon: '🤲', description: 'Syukuran & tasyakuran' },
  { id: 'birthday',   label: 'Ulang Tahun', icon: '🎂', description: 'Pesta ulang tahun' },
  { id: 'graduation', label: 'Wisuda',     icon: '🎓', description: 'Wisuda & kelulusan' },
  { id: 'other',      label: 'Lainnya',    icon: '📅', description: 'Event lainnya' },
] as const

export type EventTypeId = (typeof EVENT_TYPES)[number]['id']

export function getEventType(id?: string | null) {
  return EVENT_TYPES.find((e) => e.id === id) ?? EVENT_TYPES[0]
}

export function isWeddingType(id?: string | null) {
  return !id || id === 'wedding'
}
