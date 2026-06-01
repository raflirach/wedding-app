import WeddingForm from '../_components/WeddingForm'
import { createWedding } from '@/app/actions/weddings'

export default function NewWeddingPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Buat Undangan Baru</h1>
        <p className="text-base-content/60 mt-1">Isi detail pernikahan kamu</p>
      </div>
      <WeddingForm
        onSubmit={createWedding}
        submitLabel="Buat Undangan"
        cancelHref="/dashboard"
      />
    </div>
  )
}
