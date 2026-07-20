import { useEffect, useState } from 'react'
import api from '../api/axios'

interface Product {
  id: number
  sku: string
  name: string
}

interface Warehouse {
  id: number
  name: string
}

interface ReturnItem {
  id: number
  type: 'customer' | 'supplier'
  quantity: number
  condition: 'good' | 'damaged' | 'defective'
  reason: string | null
  createdAt: string
  product: Product
  warehouse: Warehouse
  user: { fullName: string | null; email: string } | null
}

export default function Returns() {
  const [returns, setReturns] = useState<ReturnItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    type: 'customer',
    productId: '',
    warehouseId: '',
    quantity: '',
    condition: 'good',
    reason: '',
  })

  const fetchReturns = async () => {
    setLoading(true)
    const res = await api.get('/returns')
    setReturns(res.data)
    setLoading(false)
  }

  const fetchLookups = async () => {
    const [prodRes, whRes] = await Promise.all([api.get('/products'), api.get('/warehouses')])
    setProducts(prodRes.data)
    setWarehouses(whRes.data)
  }

  useEffect(() => {
    fetchReturns()
    fetchLookups()
  }, [])

  const resetForm = () => {
    setForm({ type: 'customer', productId: '', warehouseId: '', quantity: '', condition: 'good', reason: '' })
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/returns', {
        type: form.type,
        productId: Number(form.productId),
        warehouseId: Number(form.warehouseId),
        quantity: Number(form.quantity),
        condition: form.condition,
        reason: form.reason || undefined,
      })
      resetForm()
      fetchReturns()
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Gagal menyimpan retur.')
    }
  }

  const typeLabel = (type: string) => (type === 'customer' ? 'Dari Customer' : 'Ke Supplier')

  const conditionLabel = (condition: string) => {
    const map: Record<string, string> = { good: 'Baik', damaged: 'Rusak', defective: 'Cacat' }
    return map[condition] ?? condition
  }

  const conditionClass = (condition: string) => {
    if (condition === 'good') return 'pill-good'
    if (condition === 'damaged') return 'pill-damaged'
    return 'pill-defective'
  }

  return (
    <div className="returns-page">
      <style>{RETURNS_STYLES}</style>

      <div className="page-head">
        <div>
          <p className="eyebrow">Inventori</p>
          <h1>Retur Barang</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          + Catat Retur
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card form-card">
          <h3>Catat Retur Baru</h3>

          <div className="form-grid">
            <div className="field">
              <label>Jenis Retur</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="customer">Dari Customer (barang masuk)</option>
                <option value="supplier">Ke Supplier (barang keluar)</option>
              </select>
            </div>
            <div className="field">
              <label>Kondisi Barang</label>
              <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
                <option value="good">Baik</option>
                <option value="damaged">Rusak</option>
                <option value="defective">Cacat</option>
              </select>
            </div>
            <div className="field">
              <label>Produk</label>
              <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} required>
                <option value="">— Pilih Produk —</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Gudang</label>
              <select value={form.warehouseId} onChange={(e) => setForm({ ...form, warehouseId: e.target.value })} required>
                <option value="">— Pilih Gudang —</option>
                {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Jumlah</label>
              <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            </div>
            <div className="field field-wide">
              <label>Alasan / Catatan</label>
              <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Opsional" />
            </div>
          </div>

          {form.type === 'customer' && form.condition !== 'good' && (
            <p className="notice">
              <span className="notice-icon">⚠</span>
              Kondisi barang <strong>{conditionLabel(form.condition)}</strong> tidak akan menambah stok yang bisa dijual, tapi tetap tercatat sebagai histori.
            </p>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Simpan</button>
            <button type="button" onClick={resetForm} className="btn btn-ghost">Batal</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="card state-card">
          <span className="spinner spinner-lg" />
          <p>Memuat data retur…</p>
        </div>
      ) : returns.length === 0 ? (
        <div className="card state-card">
          <p className="state-title">Belum ada retur tercatat</p>
          <p className="state-sub">Retur dari customer maupun ke supplier akan muncul di sini setelah dicatat.</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            + Catat Retur
          </button>
        </div>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jenis</th>
                <th>Produk</th>
                <th>Gudang</th>
                <th>Jumlah</th>
                <th>Kondisi</th>
                <th>Alasan</th>
                <th>Oleh</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((r) => (
                <tr key={r.id}>
                  <td className="col-nowrap muted">{new Date(r.createdAt).toLocaleString('id-ID')}</td>
                  <td className="col-nowrap">
                    <span className={`type-pill ${r.type === 'customer' ? 'type-in' : 'type-out'}`}>
                      {typeLabel(r.type)}
                    </span>
                  </td>
                  <td className="col-name">{r.product.name}</td>
                  <td>{r.warehouse.name}</td>
                  <td>{r.quantity}</td>
                  <td className="col-nowrap">
                    <span className={`pill ${conditionClass(r.condition)}`}>{conditionLabel(r.condition)}</span>
                  </td>
                  <td className="col-reason">{r.reason ?? <span className="muted">—</span>}</td>
                  <td className="muted">{r.user?.fullName ?? r.user?.email ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const RETURNS_STYLES = `
.returns-page {
  --bg: #f5f6f8;
  --surface: #ffffff;
  --border: #e6e8ec;
  --text: #1a1f2b;
  --text-soft: #667085;
  --text-faint: #9aa1b1;
  --accent: #0f7a72;
  --accent-dark: #0b5f59;
  --accent-soft: #e6f4f2;
  --radius: 12px;
  --shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06);
  max-width: 100%;
  overflow-x: hidden;
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif;
}

.returns-page h1 { margin: 2px 0 0; font-size: 26px; font-weight: 700; letter-spacing: -0.01em; }
.returns-page h3 { margin: 0 0 16px; font-size: 17px; font-weight: 600; }
.eyebrow {
  margin: 0; font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--text-faint);
}

.page-head {
  display: flex; justify-content: space-between; align-items: flex-end;
  flex-wrap: wrap; gap: 16px; margin-bottom: 24px;
}

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

.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { background: var(--accent-dark); }

.btn-ghost { background: var(--surface); color: var(--text); border-color: var(--border); }
.btn-ghost:hover { background: #f0f1f4; border-color: #d7dae0; }

.spinner-lg {
  width: 22px; height: 22px; border-radius: 50%;
  border: 3px solid var(--accent-soft); border-top-color: var(--accent);
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Form */
.form-card { padding: 24px; margin-bottom: 20px; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field-wide { grid-column: 1 / -1; }
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

.notice {
  margin: 16px 0 0; padding: 10px 14px; background: #fef3c7; color: #92610a;
  border-radius: 8px; font-size: 13px; display: flex; align-items: flex-start; gap: 8px;
}
.notice-icon { flex-shrink: 0; }

/* Empty / loading state */
.state-card {
  padding: 48px 24px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.state-card .spinner-lg { margin-bottom: 4px; }
.state-title { font-size: 15px; font-weight: 600; margin: 0; }
.state-sub { font-size: 13.5px; color: var(--text-soft); margin: 0 0 6px; max-width: 360px; }

/* Table */
.table-wrap { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
table { width: 100%; min-width: 800px; border-collapse: collapse; }
thead tr { border-bottom: 1px solid var(--border); }
th {
  text-align: left; padding: 12px 16px; font-size: 12px; font-weight: 600;
  letter-spacing: 0.02em; text-transform: uppercase; color: var(--text-faint);
}
td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid var(--border); }
tbody tr { transition: background-color 100ms ease; }
tbody tr:hover { background: #f8f9fb; }
tbody tr:last-child td { border-bottom: none; }

.col-nowrap { white-space: nowrap; }
.col-name { font-weight: 500; }
.col-reason { color: var(--text-soft); max-width: 220px; }
.muted { color: var(--text-faint); }

/* Pills */
.pill {
  display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 600;
  padding: 3px 10px; border-radius: 999px;
}
.pill::before { content: ''; width: 6px; height: 6px; border-radius: 50%; }
.pill-good { background: #eafaf0; color: #15803d; }
.pill-good::before { background: #22c55e; }
.pill-damaged { background: #fff3e8; color: #c2540a; }
.pill-damaged::before { background: #f97316; }
.pill-defective { background: #fdeaea; color: #b91c1c; }
.pill-defective::before { background: #ef4444; }

.type-pill {
  display: inline-block; font-size: 12.5px; font-weight: 500;
  padding: 3px 10px; border-radius: 999px;
}
.type-in { background: var(--accent-soft); color: var(--accent-dark); }
.type-out { background: #eef1f5; color: var(--text-soft); }

@media (max-width: 640px) {
  .page-head { align-items: flex-start; }
}
`