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

  const lowStockCount = stocks.filter((s) => s.quantity <= s.product.minStock).length

  return (
    <div className="stocks-page">
      <style>{STOCKS_STYLES}</style>

      <div className="page-head">
        <div>
          <p className="eyebrow">Inventori</p>
          <h1>Stok</h1>
        </div>
        {!loading && stocks.length > 0 && (
          <p className="summary-line">
            {stocks.length} baris stok
            {lowStockCount > 0 && (
              <>
                {' · '}
                <span className="summary-low">{lowStockCount} menipis</span>
              </>
            )}
          </p>
        )}
      </div>

      <div className="filter-bar card">
        <select
          value={filterWarehouse}
          onChange={(e) => setFilterWarehouse(e.target.value)}
          className="filter-select"
        >
          <option value="">Semua Gudang</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>

        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={filterLowStock}
            onChange={(e) => setFilterLowStock(e.target.checked)}
          />
          <span className="checkbox-box" aria-hidden="true" />
          Tampilkan hanya stok menipis
        </label>
      </div>

      {loading ? (
        <div className="card state-card">
          <span className="spinner-lg" />
          <p>Memuat data stok…</p>
        </div>
      ) : stocks.length === 0 ? (
        <div className="card state-card">
          <p className="state-title">Tidak ada data stok</p>
          <p className="state-sub">
            {filterLowStock || filterWarehouse
              ? 'Tidak ada stok yang cocok dengan filter saat ini.'
              : 'Belum ada stok tercatat untuk gudang manapun.'}
          </p>
        </div>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Produk</th>
                <th>Gudang</th>
                <th>Jumlah</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((s) => {
                const isLow = s.quantity <= s.product.minStock
                return (
                  <tr key={s.id} className={isLow ? 'row-low' : ''}>
                    <td><span className="sku-tag">{s.product.sku}</span></td>
                    <td className="col-name">{s.product.name}</td>
                    <td>{s.warehouse.name}</td>
                    <td className="col-qty">{s.quantity}</td>
                    <td className="col-nowrap">
                      {isLow ? (
                        <span className="pill pill-low">Stok Menipis</span>
                      ) : (
                        <span className="pill pill-ok">Aman</span>
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

const STOCKS_STYLES = `
.stocks-page {
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

.stocks-page h1 { margin: 2px 0 0; font-size: 26px; font-weight: 700; letter-spacing: -0.01em; }
.eyebrow {
  margin: 0; font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--text-faint);
}

.page-head {
  display: flex; justify-content: space-between; align-items: flex-end;
  flex-wrap: wrap; gap: 12px; margin-bottom: 20px;
}
.summary-line { margin: 0; font-size: 13.5px; color: var(--text-soft); }
.summary-low { color: #c2540a; font-weight: 600; }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

/* Filter bar */
.filter-bar {
  display: flex; gap: 16px; flex-wrap: wrap; align-items: center;
  padding: 14px 18px; margin-bottom: 20px;
}
.filter-select {
  flex: 1 1 220px; max-width: 320px; font-size: 14px; color: var(--text);
  padding: 9px 12px; border: 1px solid var(--border); border-radius: 8px;
  background: #fafbfc; transition: border-color 120ms ease, box-shadow 120ms ease;
}
.filter-select:hover { border-color: #c9ccd3; }
.filter-select:focus {
  outline: none; border-color: var(--accent); background: #fff;
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.checkbox-field {
  display: flex; align-items: center; gap: 8px; flex: 1 1 auto;
  white-space: nowrap; font-size: 14px; color: var(--text); cursor: pointer; position: relative;
}
.checkbox-field input {
  position: absolute; opacity: 0; width: 18px; height: 18px; margin: 0; cursor: pointer;
}
.checkbox-box {
  width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid #c9ccd3;
  background: #fff; flex-shrink: 0; position: relative;
  transition: background-color 120ms ease, border-color 120ms ease;
}
.checkbox-field input:checked + .checkbox-box {
  background: var(--accent); border-color: var(--accent);
}
.checkbox-field input:checked + .checkbox-box::after {
  content: ''; position: absolute; left: 5px; top: 1px;
  width: 5px; height: 9px; border: solid #fff; border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.checkbox-field input:focus-visible + .checkbox-box { outline: 2px solid var(--accent); outline-offset: 2px; }

/* Empty / loading state */
.state-card {
  padding: 48px 24px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.spinner-lg {
  width: 22px; height: 22px; border-radius: 50%;
  border: 3px solid var(--accent-soft); border-top-color: var(--accent);
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.state-title { font-size: 15px; font-weight: 600; margin: 0; }
.state-sub { font-size: 13.5px; color: var(--text-soft); margin: 0; max-width: 340px; }

/* Table */
.table-wrap { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
table { width: 100%; min-width: 560px; border-collapse: collapse; }
thead tr { border-bottom: 1px solid var(--border); }
th {
  text-align: left; padding: 12px 16px; font-size: 12px; font-weight: 600;
  letter-spacing: 0.02em; text-transform: uppercase; color: var(--text-faint);
}
td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid var(--border); }
tbody tr { transition: background-color 100ms ease; }
tbody tr:hover { background: #f8f9fb; }
tbody tr:last-child td { border-bottom: none; }
tbody tr.row-low { background: #fef9f4; }
tbody tr.row-low:hover { background: #fdf3e9; }

.col-name { font-weight: 500; }
.col-qty { font-variant-numeric: tabular-nums; font-weight: 500; }
.col-nowrap { white-space: nowrap; }

.sku-tag {
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px;
  background: #f0f1f4; color: var(--text-soft); padding: 3px 8px; border-radius: 6px;
}

.pill {
  display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 600;
  padding: 3px 10px; border-radius: 999px;
}
.pill::before { content: ''; width: 6px; height: 6px; border-radius: 50%; }
.pill-ok { background: #eafaf0; color: #15803d; }
.pill-ok::before { background: #22c55e; }
.pill-low { background: #fdeaea; color: #b91c1c; }
.pill-low::before { background: #ef4444; }

@media (max-width: 640px) {
  .page-head { align-items: flex-start; }
  .filter-bar { flex-direction: column; align-items: stretch; }
  .filter-select { max-width: none; }
}
`