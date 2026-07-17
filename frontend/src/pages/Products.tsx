import { useEffect, useState } from 'react'
import api from '../api/axios'

interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  sku: string
  name: string
  categoryId: number | null
  category: Category | null
  unit: string
  buyPrice: string
  sellPrice: string
  minStock: number
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [form, setForm] = useState({
    sku: '',
    name: '',
    categoryId: '',
    unit: 'pcs',
    buyPrice: '',
    sellPrice: '',
    minStock: '',
  })

  const fetchProducts = async () => {
    setLoading(true)
    const res = await api.get('/products')
    setProducts(res.data)
    setLoading(false)
  }

  const fetchCategories = async () => {
    const res = await api.get('/categories')
    setCategories(res.data)
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const resetForm = () => {
    setForm({ sku: '', name: '', categoryId: '', unit: 'pcs', buyPrice: '', sellPrice: '', minStock: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      sku: form.sku,
      name: form.name,
      categoryId: form.categoryId ? Number(form.categoryId) : undefined,
      unit: form.unit,
      buyPrice: Number(form.buyPrice),
      sellPrice: Number(form.sellPrice),
      minStock: form.minStock ? Number(form.minStock) : undefined,
    }

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload)
      } else {
        await api.post('/products', payload)
      }
      resetForm()
      fetchProducts()
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan produk. Cek console untuk detail.')
    }
  }

  const handleEdit = (product: Product) => {
    setForm({
      sku: product.sku,
      name: product.name,
      categoryId: product.categoryId ? String(product.categoryId) : '',
      unit: product.unit,
      buyPrice: String(product.buyPrice),
      sellPrice: String(product.sellPrice),
      minStock: String(product.minStock),
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return
    await api.delete(`/products/${id}`)
    fetchProducts()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Produk</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }}>
          + Tambah Produk
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: 20, borderRadius: 8, marginBottom: 20 }}>
          <h3>{editingId ? 'Edit Produk' : 'Tambah Produk'}</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label>SKU</label>
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label>Nama Produk</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label>Kategori</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} style={inputStyle}>
                <option value="">- Pilih Kategori -</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Satuan</label>
              <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label>Harga Beli</label>
              <input type="number" value={form.buyPrice} onChange={(e) => setForm({ ...form, buyPrice: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label>Harga Jual</label>
              <input type="number" value={form.sellPrice} onChange={(e) => setForm({ ...form, sellPrice: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label>Stok Minimum</label>
              <input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} style={inputStyle} />
            </div>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
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
              <th style={thStyle}>SKU</th>
              <th style={thStyle}>Nama</th>
              <th style={thStyle}>Kategori</th>
              <th style={thStyle}>Harga Jual</th>
              <th style={thStyle}>Stok Min</th>
              <th style={thStyle}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={tdStyle}>{p.sku}</td>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>{p.category?.name ?? '-'}</td>
                <td style={tdStyle}>Rp {Number(p.sellPrice).toLocaleString('id-ID')}</td>
                <td style={tdStyle}>{p.minStock}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(p)} style={{ marginRight: 8 }}>Edit</button>
                  <button onClick={() => handleDelete(p.id)}>Hapus</button>
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