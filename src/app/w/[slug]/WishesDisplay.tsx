import type { ColorScheme } from '@/lib/templates'

type Wish = {
  id: string
  name: string
  message: string
  created_at: string
}

export default function WishesDisplay({ wishes, colors }: { wishes: Wish[]; colors: ColorScheme }) {
  if (wishes.length === 0) return null

  return (
    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
      {wishes.map((w) => (
        <div
          key={w.id}
          className="rounded-xl p-4 text-sm"
          style={{ backgroundColor: colors.primaryLight }}
        >
          <p className="font-semibold mb-1" style={{ color: colors.textDark }}>{w.name}</p>
          <p className="leading-relaxed" style={{ color: colors.textMuted }}>{w.message}</p>
          <p className="text-xs mt-2 opacity-50" style={{ color: colors.textMuted }}>
            {new Date(w.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
          </p>
        </div>
      ))}
    </div>
  )
}
