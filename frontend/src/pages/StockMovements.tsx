import { useEffect, useState } from 'react'
import api from '../api/axios'

interface Product {
  id: number
  name: string
}

interface Warehouse {
  id: number
  name: string
}

interface Movement {
  id: number
  type: 'in' | 'out' | 'transfer_in' | 'transfer_out'
  quantity: number
  referenceNote: string | null
  createdAt: string
  product: Product
  warehouse: Warehouse
  user: { id: number; fullName?: string; email: string } | null
}

const typeLabel: Record<Movement['type'], string> = {
  in: 'Masuk',
  out: 'Keluar',
  transfer_in: 'Transfer Masuk',
  transfer_out: 'Transfer Keluar',
}

const typeColor: Record<Movement['type'], string> = {
  in: '#16a34a',
  out: '#dc2626',
  transfer_in: '#2563eb',
  transfer_out: '#d97706',
}

export default function StockMovements() {
  const [movements, setMovements] = useState<Movement[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // filter
  const [filterType, setFilterType] = useState('')

  // modal
  const [showInOutModal, setShowInOutModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)

  // form: in/out
  const [ioProductId, setIoProductId] = useState('')
  const [ioWarehouseId, setIoWarehouseId] = useState('')
  const [ioType, setIoType] = useState<'in' | 'out'>('in')
  const [ioQuantity, setIoQuantity] = useState('')
  const [ioNote, setIoNote] = useState('')
  const [ioSubmitting, setIoSubmitting] = useState(false)
  const [ioError, setIoError] = useState<string | null>(null)

  // form: transfer
  const [trProductId, setTrProductId] = useState('')
  const [trFromWarehouseId, setTrFromWarehouseId] = useState('')
  const [trToWarehouseId, setTrToWarehouseId] = useState('')
  const [trQuantity, setTrQuantity] = useState('')
  const [trNote, setTrNote] = useState('')
  const [trSubmitting, setTrSubmitting] = useState(false)
  const [trError, setTrError] = useState<string | null>(null)

  async function loadMovements() {
    setLoading(true)
    setErrorMsg(null)
    try {
      const params = filterType ? { type: filterType } : {}
      const res = await api.get('/stock-movements', { params })
      setMovements(res.data)
    } catch (err: any) {
      console.error('load movements error:', err)
      setErrorMsg(
        err?.response?.status
          ? `Gagal memuat data (status ${err.response.status})`
          : 'Gagal memuat data transaksi.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function loadDropdowns() {
    try {
      const [productsRes, warehousesRes] = await Promise.all([
        api.get('/products'),
        api.get('/warehouses'),
      ])
      setProducts(productsRes.data.data ?? productsRes.data)
      setWarehouses(warehousesRes.data.data ?? warehousesRes.data)
    } catch (err) {
      console.error('load dropdowns error:', err)
    }
  }

  useEffect(() => {
    loadDropdowns()
  }, [])

  useEffect(() => {
    loadMovements()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType])

  async function handleSubmitInOut(e: React.FormEvent) {
    e.preventDefault()
    setIoError(null)

    if (!ioProductId || !ioWarehouseId || !ioQuantity) {
      setIoError('Semua field wajib diisi')
      return
    }

    setIoSubmitting(true)
    try {
      await api.post('/stock-movements', {
        productId: Number(ioProductId),
        warehouseId: Number(ioWarehouseId),
        type: ioType,
        quantity: Number(ioQuantity),
        referenceNote: ioNote || undefined,
      })
      setShowInOutModal(false)
      setIoProductId('')
      setIoWarehouseId('')
      setIoQuantity('')
      setIoNote('')
      setIoType('in')
      loadMovements()
    } catch (err: any) {
      console.error('submit in/out error:', err)
      setIoError(
        err?.response?.data?.message ??
          (err?.response?.status
            ? `Gagal menyimpan (status ${err.response.status})`
            : 'Gagal menyimpan transaksi.')
      )
    } finally {
      setIoSubmitting(false)
    }
  }

  async function handleSubmitTransfer(e: React.FormEvent) {
    e.preventDefault()
    setTrError(null)

    if (!trProductId || !trFromWarehouseId || !trToWarehouseId || !trQuantity) {
      setTrError('Semua field wajib diisi')
      return
    }
    if (trFromWarehouseId === trToWarehouseId) {
      setTrError('Gudang asal dan tujuan tidak boleh sama')
      return
    }

    setTrSubmitting(true)
    try {
      await api.post('/stock-movements/transfer', {
        productId: Number(trProductId),
        fromWarehouseId: Number(trFromWarehouseId),
        toWarehouseId: Number(trToWarehouseId),
        quantity: Number(trQuantity),
        referenceNote: trNote || undefined,
      })
      setShowTransferModal(false)
      setTrProductId('')
      setTrFromWarehouseId('')
      setTrToWarehouseId('')
      setTrQuantity('')
      setTrNote('')
      loadMovements()
    } catch (err: any) {
      console.error('submit transfer error:', err)
      setTrError(
        err?.response?.data?.message ??
          (err?.response?.status
            ? `Gagal menyimpan (status ${err.response.status})`
            : 'Gagal menyimpan transfer.')
      )
    } finally {
      setTrSubmitting(false)
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
            Transaksi Stok
          </h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            Histori stok masuk, keluar, dan transfer antar gudang.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowInOutModal(true)} style={primaryBtn}>
            + Stok Masuk/Keluar
          </button>
          <button onClick={() => setShowTransferModal(true)} style={secondaryBtn}>
            ⇄ Transfer Gudang
          </button>
        </div>
      </div>

      {errorMsg && (
        <div style={errorBanner}>⚠ {errorMsg}</div>
      )}

      {/* Filter */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
        <label style={{ fontSize: 13, color: '#64748b' }}>Filter tipe:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={selectStyle}
        >
          <option value="">Semua</option>
          <option value="in">Masuk</option>
          <option value="out">Keluar</option>
          <option value="transfer_in">Transfer Masuk</option>
          <option value="transfer_out">Transfer Keluar</option>
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          background: 'white',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
              <Th>Tanggal</Th>
              <Th>Produk</Th>
              <Th>Gudang</Th>
              <Th>Tipe</Th>
              <Th>Qty</Th>
              <Th>Catatan</Th>
              <Th>Oleh</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={emptyCellStyle}>
                  Memuat data...
                </td>
              </tr>
            ) : movements.length === 0 ? (
              <tr>
                <td colSpan={7} style={emptyCellStyle}>
                  Belum ada transaksi.
                </td>
              </tr>
            ) : (
              movements.map((m) => (
                <tr key={m.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <Td>{new Date(m.createdAt).toLocaleString('id-ID')}</Td>
                  <Td>{m.product?.name ?? '-'}</Td>
                  <Td>{m.warehouse?.name ?? '-'}</Td>
                  <Td>
                    <span
                      style={{
                        color: typeColor[m.type],
                        fontWeight: 600,
                        fontSize: 12.5,
                        background: `${typeColor[m.type]}15`,
                        padding: '3px 10px',
                        borderRadius: 999,
                      }}
                    >
                      {typeLabel[m.type]}
                    </span>
                  </Td>
                  <Td>{m.quantity}</Td>
                  <Td>{m.referenceNote ?? '-'}</Td>
                  <Td>{m.user?.fullName ?? m.user?.email ?? '-'}</Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: In/Out */}
      {showInOutModal && (
        <Modal title="Stok Masuk / Keluar" onClose={() => setShowInOutModal(false)}>
          <form onSubmit={handleSubmitInOut}>
            {ioError && <div style={formErrorStyle}>{ioError}</div>}

            <Field label="Tipe">
              <select value={ioType} onChange={(e) => setIoType(e.target.value as 'in' | 'out')} style={selectStyle}>
                <option value="in">Stok Masuk</option>
                <option value="out">Stok Keluar</option>
              </select>
            </Field>

            <Field label="Produk">
              <select value={ioProductId} onChange={(e) => setIoProductId(e.target.value)} style={selectStyle}>
                <option value="">Pilih produk</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Gudang">
              <select value={ioWarehouseId} onChange={(e) => setIoWarehouseId(e.target.value)} style={selectStyle}>
                <option value="">Pilih gudang</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Jumlah">
              <input
                type="number"
                min={1}
                value={ioQuantity}
                onChange={(e) => setIoQuantity(e.target.value)}
                style={inputStyle}
              />
            </Field>

            <Field label="Catatan (opsional)">
              <input
                type="text"
                value={ioNote}
                onChange={(e) => setIoNote(e.target.value)}
                style={inputStyle}
              />
            </Field>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button type="button" onClick={() => setShowInOutModal(false)} style={secondaryBtn}>
                Batal
              </button>
              <button type="submit" disabled={ioSubmitting} style={primaryBtn}>
                {ioSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Transfer */}
      {showTransferModal && (
        <Modal title="Transfer Antar Gudang" onClose={() => setShowTransferModal(false)}>
          <form onSubmit={handleSubmitTransfer}>
            {trError && <div style={formErrorStyle}>{trError}</div>}

            <Field label="Produk">
              <select value={trProductId} onChange={(e) => setTrProductId(e.target.value)} style={selectStyle}>
                <option value="">Pilih produk</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Dari Gudang">
              <select value={trFromWarehouseId} onChange={(e) => setTrFromWarehouseId(e.target.value)} style={selectStyle}>
                <option value="">Pilih gudang asal</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Ke Gudang">
              <select value={trToWarehouseId} onChange={(e) => setTrToWarehouseId(e.target.value)} style={selectStyle}>
                <option value="">Pilih gudang tujuan</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Jumlah">
              <input
                type="number"
                min={1}
                value={trQuantity}
                onChange={(e) => setTrQuantity(e.target.value)}
                style={inputStyle}
              />
            </Field>

            <Field label="Catatan (opsional)">
              <input
                type="text"
                value={trNote}
                onChange={(e) => setTrNote(e.target.value)}
                style={inputStyle}
              />
            </Field>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button type="button" onClick={() => setShowTransferModal(false)} style={secondaryBtn}>
                Batal
              </button>
              <button type="submit" disabled={trSubmitting} style={primaryBtn}>
                {trSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ padding: '12px 16px', fontSize: 12.5, color: '#64748b', fontWeight: 600 }}>
      {children}
    </th>
  )
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: '12px 16px', color: '#1e293b' }}>{children}</td>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 13, color: '#475569', marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 12,
          padding: 24,
          width: 420,
          maxWidth: '90%',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>
          {title}
        </h3>
        {children}
      </div>
    </div>
  )
}

const primaryBtn: React.CSSProperties = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  padding: '9px 16px',
  borderRadius: 8,
  fontSize: 13.5,
  fontWeight: 600,
  cursor: 'pointer',
}

const secondaryBtn: React.CSSProperties = {
  background: 'white',
  color: '#334155',
  border: '1px solid #cbd5e1',
  padding: '9px 16px',
  borderRadius: 8,
  fontSize: 13.5,
  fontWeight: 600,
  cursor: 'pointer',
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  fontSize: 13.5,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  fontSize: 13.5,
  boxSizing: 'border-box',
}

const errorBanner: React.CSSProperties = {
  background: '#fef2f2',
  border: '1px solid #fecaca',
  color: '#b91c1c',
  padding: '12px 16px',
  borderRadius: 8,
  marginBottom: 20,
  fontSize: 14,
}

const formErrorStyle: React.CSSProperties = {
  background: '#fef2f2',
  color: '#b91c1c',
  padding: '10px 12px',
  borderRadius: 8,
  fontSize: 13,
  marginBottom: 14,
}

const emptyCellStyle: React.CSSProperties = {
  padding: '40px 16px',
  textAlign: 'center',
  color: '#94a3b8',
  fontSize: 14,
}