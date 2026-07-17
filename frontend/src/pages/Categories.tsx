import { useEffect, useState } from 'react'
import api from '../api/axios'

interface Category {
  id: number
  name: string
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [name, setName] = useState('')

  const fetchCategories = async () => {
    setLoading(true)
    const res = await api.get('/categories')
    setCategories(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const resetForm = () => {
    setName('')
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, { name })
      } else {
        await api.post('/categories', { name })
      }
      resetForm()
      fetchCategories()
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan kategori.')
    }
  }

  const handleEdit = (c: Category) => {
    setName(c.name)
    setEditingId(c.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return
    await api.delete(`/categories/${id}`)
    fetchCategories()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Kategori</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }}>+ Tambah Kategori</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: 20, borderRadius: 8, marginBottom: 20 }}>
          <h3>{editingId ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
          <div style={{ marginBottom: 12 }}>
            <label>Nama Kategori</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
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
              <th style={thStyle}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={tdStyle}>{c.name}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(c)} style={{ marginRight: 8 }}>Edit</button>
                  <button onClick={() => handleDelete(c.id)}>Hapus</button>
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