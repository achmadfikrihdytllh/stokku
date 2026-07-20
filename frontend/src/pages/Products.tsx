import { useEffect, useState, useRef } from 'react'
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

interface ImportResult {
  created: number
  updated: number
  errors: { row: number; message: string }[]
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleExport = async () => {
    const res = await api.get('/products/export', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'produk.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handleDownloadTemplate = async () => {
    const res = await api.get('/products/import-template', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'template-import-produk.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    setImportResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await api.post('/products/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setImportResult(res.data)
      fetchProducts()
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Gagal mengimpor file.')
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="products-page">
      <style>{PRODUCTS_STYLES}</style>

      <div className="page-head">
        <div>
          <p className="eyebrow">Inventori</p>
          <h1>Produk</h1>
        </div>
        <div className="head-actions">
          <button onClick={handleDownloadTemplate} className="btn btn-ghost">
            Download Template
          </button>
          <button onClick={handleImportClick} disabled={importing} className="btn btn-ghost">
            {importing ? (
              <span className="btn-loading">
                <span className="spinner" /> Mengimpor…
              </span>
            ) : (
              'Import Excel'
            )}
          </button>
          <button onClick={handleExport} className="btn btn-ghost">
            Export Excel
          </button>
          <button onClick={() => { resetForm(); setShowForm(true) }} className="btn btn-primary">
            + Tambah Produk
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
        />
      </div>

      {importResult && (
        <div className="card import-result">
          <div className="import-result-summary">
            <span className="check-badge">✓</span>
            <p>
              Import selesai — <strong>{importResult.created}</strong> produk baru,{' '}
              <strong>{importResult.updated}</strong> produk diupdate.
            </p>
          </div>
          {importResult.errors.length > 0 && (
            <div className="import-errors">
              <p className="import-errors-title">{importResult.errors.length} baris gagal diimpor</p>
              <ul>
                {importResult.errors.map((err, i) => (
                  <li key={i}>
                    <span className="row-tag">Baris {err.row}</span> {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={() => setImportResult(null)} className="btn btn-text">
            Tutup
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card form-card">
          <h3>{editingId ? 'Edit Produk' : 'Tambah Produk'}</h3>

          <div className="form-grid">
            <div className="field">
              <label>SKU</label>
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            </div>
            <div className="field">
              <label>Nama Produk</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="field">
              <label>Kategori</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">— Pilih Kategori —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Satuan</label>
              <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            </div>
            <div className="field">
              <label>Harga Beli</label>
              <input type="number" value={form.buyPrice} onChange={(e) => setForm({ ...form, buyPrice: e.target.value })} required />
            </div>
            <div className="field">
              <label>Harga Jual</label>
              <input type="number" value={form.sellPrice} onChange={(e) => setForm({ ...form, sellPrice: e.target.value })} required />
            </div>
            <div className="field">
              <label>Stok Minimum</label>
              <input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Simpan Perubahan' : 'Tambah'}
            </button>
            <button type="button" onClick={resetForm} className="btn btn-ghost">
              Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="card state-card">
          <span className="spinner spinner-lg" />
          <p>Memuat produk…</p>
        </div>
      ) : products.length === 0 ? (
        <div className="card state-card">
          <p className="state-title">Belum ada produk</p>
          <p className="state-sub">Tambahkan produk pertama atau import dari Excel untuk mulai mengisi inventori.</p>
          <button onClick={() => { resetForm(); setShowForm(true) }} className="btn btn-primary">
            + Tambah Produk
          </button>
        </div>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Nama</th>
                <th>Kategori</th>
                <th>Harga Jual</th>
                <th>Stok Min</th>
                <th className="col-actions">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td><span className="sku-tag">{p.sku}</span></td>
                  <td className="col-name">{p.name}</td>
                  <td>
                    {p.category?.name ? (
                      <span className="category-pill">{p.category.name}</span>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td className="col-price">Rp {Number(p.sellPrice).toLocaleString('id-ID')}</td>
                  <td>{p.minStock}</td>
                  <td className="col-actions">
                    <button onClick={() => handleEdit(p)} className="btn btn-text">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="btn btn-text btn-danger">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const PRODUCTS_STYLES = `
.products-page {
  --bg: #f5f6f8;
  --surface: #ffffff;
  --border: #e6e8ec;
  --text: #1a1f2b;
  --text-soft: #667085;
  --text-faint: #9aa1b1;
  --accent: #0f7a72;
  --accent-dark: #0b5f59;
  --accent-soft: #e6f4f2;
  --danger: #d1453d;
  --danger-soft: #fbeae9;
  --radius: 12px;
  --shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06);
  max-width: 100%;
  overflow-x: hidden;
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif;
}

.products-page h1 { margin: 2px 0 0; font-size: 26px; font-weight: 700; letter-spacing: -0.01em; }
.products-page h3 { margin: 0 0 16px; font-size: 17px; font-weight: 600; }
.eyebrow {
  margin: 0; font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--text-faint);
}

.page-head {
  display: flex; justify-content: space-between; align-items: flex-end;
  flex-wrap: wrap; gap: 16px; margin-bottom: 24px;
}
.head-actions { display: flex; gap: 8px; flex-wrap: wrap; }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

/* Buttons */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  font-size: 14px; font-weight: 500; line-height: 1;
  padding: 10px 16px; border-radius: 9px; border: 1px solid transparent;
  cursor: pointer; white-space: nowrap;
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease, transform 80ms ease;
}
.btn:active { transform: translateY(1px); }
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.btn:disabled { cursor: not-allowed; opacity: 0.6; }

.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover:not(:disabled) { background: var(--accent-dark); }

.btn-ghost { background: var(--surface); color: var(--text); border-color: var(--border); }
.btn-ghost:hover:not(:disabled) { background: #f0f1f4; border-color: #d7dae0; }

.btn-text { background: transparent; color: var(--accent); padding: 6px 10px; }
.btn-text:hover:not(:disabled) { background: var(--accent-soft); }
.btn-danger { color: var(--danger); }
.btn-danger:hover:not(:disabled) { background: var(--danger-soft); }

.btn-loading { display: inline-flex; align-items: center; gap: 8px; }
.spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
  animation: spin 0.7s linear infinite;
}
.spinner-lg {
  width: 22px; height: 22px; border: 3px solid var(--accent-soft); border-top-color: var(--accent);
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Import result */
.import-result { padding: 20px 22px; margin-bottom: 20px; }
.import-result-summary { display: flex; align-items: center; gap: 10px; }
.check-badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--accent-soft); color: var(--accent-dark);
  font-size: 12px; font-weight: 700; flex-shrink: 0;
}
.import-result p { margin: 0; font-size: 14px; color: var(--text); }
.import-errors { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
.import-errors-title { font-weight: 600; color: var(--danger); margin: 0 0 6px; font-size: 13px; }
.import-errors ul { margin: 0; padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 4px; }
.import-errors li { font-size: 13px; color: var(--text-soft); }
.row-tag {
  display: inline-block; background: var(--danger-soft); color: var(--danger);
  font-size: 11px; font-weight: 600; padding: 1px 7px; border-radius: 6px; margin-right: 6px;
}
.import-result .btn-text { margin-top: 14px; padding-left: 0; }

/* Form */
.form-card { padding: 24px; margin-bottom: 20px; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 12.5px; font-weight: 600; color: var(--text-soft); }
.field input, .field select {
  width: 100%; box-sizing: border-box; font-size: 14px; color: var(--text);
  padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px;
  background: #fafbfc; transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;
}
.field input:hover, .field select:hover { border-color: #c9ccd3; }
.field input:focus, .field select:focus {
  outline: none; border-color: var(--accent); background: #fff;
  box-shadow: 0 0 0 3px var(--accent-soft);
}
.form-actions { margin-top: 20px; display: flex; gap: 8px; flex-wrap: wrap; }

/* Empty / loading state */
.state-card {
  padding: 48px 24px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.state-card .spinner-lg { margin-bottom: 4px; }
.state-title { font-size: 15px; font-weight: 600; margin: 0; }
.state-sub { font-size: 13.5px; color: var(--text-soft); margin: 0 0 6px; max-width: 340px; }

/* Table */
.table-wrap { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
table { width: 100%; min-width: 640px; border-collapse: collapse; }
thead tr { border-bottom: 1px solid var(--border); }
th {
  text-align: left; padding: 12px 16px; font-size: 12px; font-weight: 600;
  letter-spacing: 0.02em; text-transform: uppercase; color: var(--text-faint);
}
td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid var(--border); }
tbody tr { transition: background-color 100ms ease; }
tbody tr:hover { background: #f8f9fb; }
tbody tr:last-child td { border-bottom: none; }

.col-name { font-weight: 500; }
.col-price { white-space: nowrap; font-variant-numeric: tabular-nums; }
.col-actions { white-space: nowrap; text-align: right; }
.muted { color: var(--text-faint); }

.sku-tag {
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px;
  background: #f0f1f4; color: var(--text-soft); padding: 3px 8px; border-radius: 6px;
}
.category-pill {
  display: inline-block; font-size: 12.5px; font-weight: 500;
  background: var(--accent-soft); color: var(--accent-dark); padding: 3px 10px; border-radius: 999px;
}

@media (max-width: 640px) {
  .page-head { align-items: flex-start; }
  .head-actions { width: 100%; }
  .head-actions .btn { flex: 1 1 auto; }
  .col-actions { text-align: left; }
}
`