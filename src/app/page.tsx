import Link from 'next/link'

const FEATURES = [
  { icon: '🎨', title: '3 Desain Template', desc: 'Elegant, Modern, dan Floral — cocok untuk berbagai tema pernikahan' },
  { icon: '🎨', title: '5 Skema Warna', desc: 'Blush Pink, Sage Green, Navy Blue, Champagne, dan Lavender' },
  { icon: '⏱️', title: 'Countdown Timer', desc: 'Hitung mundur otomatis menuju hari spesialmu' },
  { icon: '💌', title: 'RSVP & Ucapan', desc: 'Tamu konfirmasi kehadiran dan kirim ucapan langsung di undangan' },
  { icon: '🖼️', title: 'Galeri Foto', desc: 'Upload foto prewedding untuk ditampilkan di undangan' },
  { icon: '🎵', title: 'Musik Latar', desc: 'Tambahkan lagu favorit yang diputar saat undangan dibuka' },
  { icon: '📲', title: 'Share & QR Code', desc: 'Bagikan via WhatsApp atau QR Code yang bisa langsung diunduh' },
  { icon: '👥', title: 'Kelola Tamu', desc: 'Manajemen daftar tamu lengkap dengan export ke CSV' },
]

const TEMPLATES = [
  { id: 'elegant', name: 'Elegant', desc: 'Klasik & romantis', icon: '🌸', bg: 'bg-rose-50', accent: 'bg-rose-400' },
  { id: 'modern', name: 'Modern', desc: 'Bersih & minimalis', icon: '◆', bg: 'bg-slate-900', accent: 'bg-indigo-500' },
  { id: 'floral', name: 'Floral', desc: 'Natural & botanical', icon: '🌿', bg: 'bg-emerald-50', accent: 'bg-emerald-500' },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-base-100">

      {/* Navbar */}
      <nav className="navbar bg-base-100/80 backdrop-blur-sm sticky top-0 z-40 border-b border-base-200 px-4 md:px-8">
        <div className="flex-1">
          <span className="text-lg font-bold text-primary">💍 Wedding App</span>
        </div>
        <div className="flex-none gap-2">
          <Link href="/login" className="btn btn-ghost btn-sm">Masuk</Link>
          <Link href="/register" className="btn btn-primary btn-sm">Daftar Gratis</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4 text-center bg-linear-to-b from-primary/5 to-base-100">
        <p className="text-sm font-medium text-primary mb-4 tracking-wide">
          ✨ Platform Undangan Pernikahan Digital
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-base-content leading-tight mb-4">
          Buat Undangan Pernikahan
          <br />
          <span className="text-primary">yang Berkesan</span>
        </h1>
        <p className="text-base-content/60 text-lg max-w-xl mx-auto mb-10">
          Desain undangan digital elegan dalam hitungan menit.
          Lengkap dengan RSVP, galeri foto, musik, dan countdown timer.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register" className="btn btn-primary btn-lg">
            Buat Undangan Sekarang
          </Link>
          <Link href="/login" className="btn btn-outline btn-lg">
            Sudah Punya Akun
          </Link>
        </div>
        <p className="text-xs text-base-content/40 mt-4">Gratis · Tanpa kartu kredit</p>
      </section>

      {/* Template Preview */}
      <section className="py-16 px-4 bg-base-200/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">3 Pilihan Template</h2>
          <p className="text-base-content/60 text-center mb-10">
            Setiap template bisa dikustomisasi dengan 5 skema warna
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEMPLATES.map((t) => (
              <div key={t.id} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                {/* Template mini preview */}
                <div className={`${t.bg} h-40 flex flex-col items-center justify-center gap-2 relative`}>
                  <span className="text-4xl">{t.icon}</span>
                  <div className={`w-16 h-0.5 ${t.accent}`} />
                  <div className="text-center">
                    <div className={`h-2 w-20 rounded ${t.id === 'modern' ? 'bg-white/30' : 'bg-base-content/10'} mb-1.5`} />
                    <div className={`h-1.5 w-14 rounded ${t.id === 'modern' ? 'bg-white/20' : 'bg-base-content/8'} mx-auto`} />
                  </div>
                </div>
                <div className="card-body py-4 px-5">
                  <h3 className="font-bold">{t.name}</h3>
                  <p className="text-sm text-base-content/60">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Semua yang Kamu Butuhkan</h2>
          <p className="text-base-content/60 text-center mb-10">
            Fitur lengkap untuk undangan digital yang profesional
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="card bg-base-100 border border-base-200 hover:border-primary/30 transition-colors">
                <div className="card-body py-5 px-4">
                  <span className="text-2xl mb-2">{f.icon}</span>
                  <h3 className="font-semibold text-sm">{f.title}</h3>
                  <p className="text-xs text-base-content/50 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-10">Cara Membuatnya</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Daftar & Isi Data', desc: 'Buat akun gratis dan isi informasi pasangan, tanggal, dan lokasi pernikahan' },
              { step: '02', title: 'Pilih Desain', desc: 'Pilih template dan skema warna yang paling sesuai dengan tema pernikahanmu' },
              { step: '03', title: 'Bagikan ke Tamu', desc: 'Share via WhatsApp, QR Code, atau copy link — tamu langsung bisa RSVP' },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-content font-bold text-lg flex items-center justify-center mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-base-content/60">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Siap membuat undangan impianmu?
        </h2>
        <p className="text-base-content/60 mb-8">
          Bergabung dan buat undangan digital pertamamu sekarang — gratis.
        </p>
        <Link href="/register" className="btn btn-primary btn-lg">
          Mulai Sekarang — Gratis
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-base-content/40 border-t border-base-200">
        <p>💍 Wedding App · Dibuat dengan ❤️ untuk pasangan Indonesia</p>
      </footer>
    </main>
  )
}
