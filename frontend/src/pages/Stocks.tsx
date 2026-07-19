import { useEffect, useState } from 'react'
import api from '../api/axios'

interface Warehouse {
  id: number
  name: string
}

interface Product {
  id: number
  sku: string
  name: string
  minStock: number
}

interface Stock {
  id: number
  quantity: number
  product: Product
  warehouse: Warehouse
}

export default function Stocks() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [filterWarehouse, setFilterWarehouse] = useState('')
  const [filterLowStock, setFilterLowStock] = useState(false)

  const fetchWarehouses = async () => {
    const res = await api.get('/warehouses')
    setWarehouses(res.data)
  }

  const fetchStocks = async () => {
    setLoading(true)
    const params: Record<string, string> = {}
    if (filterWarehouse) params.warehouseId = filterWarehouse
    if (filterLowStock) params.lowStock = 'true'

    const res = await api.get('/stocks', { params })
    setStocks(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchWarehouses()
  }, [])

  useEffect(() => {
    fetchStocks()
  }, [filterWarehouse, filterLowStock])

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <h1 style={{ marginBottom: 20 }}>Stok</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <select
          value={filterWarehouse}
          onChange={(e) => setFilterWarehouse(e.target.value)}
          style={{ padding: 8, flex: '1 1 200px', maxWidth: '100%' }}
        >
          <option value="">Semua Gudang</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>

        <label style={{ display: 'flex', alignItems: 'center', gap: 6, flex: '1 1 auto', whiteSpace: 'nowrap' }}>
          <input
            type="checkbox"
            checked={filterLowStock}
            onChange={(e) => setFilterLowStock(e.target.checked)}
          />
          Tampilkan hanya stok menipis
        </label>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        // Wrapper ini yang bikin tabel bisa discroll ke samping di layar kecil,
        // tanpa mendorong seluruh halaman jadi melebar.
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', background: 'white', borderRadius: 8 }}>
          <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                <th style={thStyle}>SKU</th>
                <th style={thStyle}>Produk</th>
                <th style={thStyle}>Gudang</th>
                <th style={thStyle}>Jumlah</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((s) => {
                const isLow = s.quantity <= s.product.minStock
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={tdStyle}>{s.product.sku}</td>
                    <td style={tdStyle}>{s.product.name}</td>
                    <td style={tdStyle}>{s.warehouse.name}</td>
                    <td style={tdStyle}>{s.quantity}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                      {isLow ? (
                        <span style={{ color: 'red', fontWeight: 600 }}>Stok Menipis</span>
                      ) : (
                        <span style={{ color: 'green' }}>Aman</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const thStyle: React.CSSProperties = { padding: 12 }
const tdStyle: React.CSSProperties = { padding: 12 }