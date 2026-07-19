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

  const conditionColor = (condition: string) => {
    if (condition === 'good') return '#22c55e'
    if (condition === 'damaged') return '#f97316'
    return '#ef4444'
  }

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <h1 style={{ margin: 0 }}>Retur Barang</h1>
        <button onClick={() => setShowForm(true)}>+ Catat Retur</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: 20, borderRadius: 8, marginBottom: 20 }}>
          <h3>Catat Retur Baru</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
            }}
          >
            <div>
              <label>Jenis Retur</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                <option value="customer">Dari Customer (barang masuk)</option>
                <option value="supplier">Ke Supplier (barang keluar)</option>
              </select>
            </div>
            <div>
              <label>Kondisi Barang</label>
              <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} style={inputStyle}>
                <option value="good">Baik</option>
                <option value="damaged">Rusak</option>
                <option value="defective">Cacat</option>
              </select>
            </div>
            <div>
              <label>Produk</label>
              <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} required style={inputStyle}>
                <option value="">- Pilih Produk -</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>)}
              </select>
            </div>
            <div>
              <label>Gudang</label>
              <select value={form.warehouseId} onChange={(e) => setForm({ ...form, warehouseId: e.target.value })} required style={inputStyle}>
                <option value="">- Pilih Gudang -</option>
                {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div>
              <label>Jumlah</label>
              <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Alasan / Catatan</label>
              <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} style={inputStyle} />
            </div>
          </div>

          {form.type === 'customer' && form.condition !== 'good' && (
            <p style={{ marginTop: 12, padding: 10, background: '#fef3c7', borderRadius: 6, fontSize: 13 }}>
              ⚠️ Kondisi barang "{conditionLabel(form.condition)}" tidak akan menambah stok yang bisa dijual, tapi tetap tercatat sebagai histori.
            </p>
          )}

          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="submit">Simpan</button>
            <button type="button" onClick={resetForm}>Batal</button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        // Wrapper ini yang bikin tabel bisa discroll ke samping di layar kecil,
        // tanpa mendorong seluruh halaman jadi melebar.
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', background: 'white', borderRadius: 8 }}>
          <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                <th style={thStyle}>Tanggal</th>
                <th style={thStyle}>Jenis</th>
                <th style={thStyle}>Produk</th>
                <th style={thStyle}>Gudang</th>
                <th style={thStyle}>Jumlah</th>
                <th style={thStyle}>Kondisi</th>
                <th style={thStyle}>Alasan</th>
                <th style={thStyle}>Oleh</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{new Date(r.createdAt).toLocaleString('id-ID')}</td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{typeLabel(r.type)}</td>
                  <td style={tdStyle}>{r.product.name}</td>
                  <td style={tdStyle}>{r.warehouse.name}</td>
                  <td style={tdStyle}>{r.quantity}</td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    <span style={{ color: conditionColor(r.condition), fontWeight: 600 }}>
                      {conditionLabel(r.condition)}
                    </span>
                  </td>
                  <td style={tdStyle}>{r.reason ?? '-'}</td>
                  <td style={tdStyle}>{r.user?.fullName ?? r.user?.email ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: '100%', padding: 8, marginTop: 4, boxSizing: 'border-box' }
const thStyle: React.CSSProperties = { padding: 12 }
const tdStyle: React.CSSProperties = { padding: 12 }