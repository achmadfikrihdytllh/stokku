import { useEffect, useState } from 'react'
import api from '../api/axios'

interface Warehouse {
  id: number
  name: string
  address: string | null
}

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', address: '' })

  const fetchWarehouses = async () => {
    setLoading(true)
    const res = await api.get('/warehouses')
    setWarehouses(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchWarehouses()
  }, [])

  const resetForm = () => {
    setForm({ name: '', address: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/warehouses/${editingId}`, form)
      } else {
        await api.post('/warehouses', form)
      }
      resetForm()
      fetchWarehouses()
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan gudang.')
    }
  }

  const handleEdit = (w: Warehouse) => {
    setForm({ name: w.name, address: w.address ?? '' })
    setEditingId(w.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus gudang ini?')) return
    await api.delete(`/warehouses/${id}`)
    fetchWarehouses()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Gudang</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }}>+ Tambah Gudang</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: 20, borderRadius: 8, marginBottom: 20 }}>
          <h3>{editingId ? 'Edit Gudang' : 'Tambah Gudang'}</h3>
          <div style={{ marginBottom: 12 }}>
            <label>Nama Gudang</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Alamat</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit">{editingId ? 'Simpan Perubahan' : 'Tambah'}</button>
            <button type="button" onClick={resetForm}>Batal</button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
              <th style={thStyle}>Nama</th>
              <th style={thStyle}>Alamat</th>
              <th style={thStyle}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((w) => (
              <tr key={w.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={tdStyle}>{w.name}</td>
                <td style={tdStyle}>{w.address ?? '-'}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(w)} style={{ marginRight: 8 }}>Edit</button>
                  <button onClick={() => handleDelete(w.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: '100%', padding: 8, marginTop: 4 }
const thStyle: React.CSSProperties = { padding: 12 }
const tdStyle: React.CSSProperties = { padding: 12 }