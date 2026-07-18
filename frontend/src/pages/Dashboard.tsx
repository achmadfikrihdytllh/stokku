import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer,
} from 'recharts'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

interface Summary {
  totalProducts: number
  totalWarehouses: number
  totalInventoryValue: number
  lowStockCount: number
}

interface TrendData {
  date: string
  in: number
  out: number
}

interface TopProduct {
  name: string
  quantity: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<Summary | null>(null)
  const [trend, setTrend] = useState<TrendData[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      setLoading(true)
      setErrorMsg(null)
      try {
        const [summaryRes, trendRes, topRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/movement-trend'),
          api.get('/dashboard/top-products'),
        ])
        if (!isMounted) return
        setSummary(summaryRes.data)
        setTrend(trendRes.data)
        setTopProducts(topRes.data)
      } catch (err: any) {
        console.error('Dashboard load error:', err)
        if (!isMounted) return
        setErrorMsg(
          err?.response?.status
            ? `Gagal memuat data (status ${err.response.status})`
            : 'Gagal memuat data. Cek koneksi atau server backend.'
        )
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadDashboard()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        .stokku-summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }
        .stokku-chart-grid {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
          gap: 20px;
        }
        @media (max-width: 768px) {
          .stokku-chart-grid {
            grid-template-columns: 1fr;
          }
          .stokku-summary-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>
          Halo, {user?.fullName ?? user?.email}! Ini ringkasan gudang kamu hari ini.
        </p>
      </div>

      {/* Error banner */}
      {errorMsg && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: 8,
            marginBottom: 24,
            fontSize: 14,
          }}
        >
          ⚠ {errorMsg}
        </div>
      )}

      {/* Summary Cards */}
      <div className="stokku-summary-grid">
        <StatCard
          label="Total Produk"
          value={loading ? '...' : summary?.totalProducts ?? '-'}
          icon="📦"
        />
        <StatCard
          label="Total Gudang"
          value={loading ? '...' : summary?.totalWarehouses ?? '-'}
          icon="🏢"
        />
        <StatCard
          label="Nilai Inventaris"
          value={
            loading
              ? '...'
              : summary
              ? `Rp ${summary.totalInventoryValue.toLocaleString('id-ID')}`
              : '-'
          }
          icon="💰"
        />
        <StatCard
          label="Stok Menipis"
          value={loading ? '...' : summary?.lowStockCount ?? '-'}
          icon="⚠️"
          highlight={summary ? summary.lowStockCount > 0 : false}
        />
      </div>

      {/* Charts */}
      <div className="stokku-chart-grid">
        <ChartCard title="Tren Transaksi Stok (7 Hari Terakhir)">
          {loading ? (
            <EmptyState text="Memuat data..." />
          ) : trend.length === 0 ? (
            <EmptyState text="Belum ada data transaksi." />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="in" name="Masuk" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="out" name="Keluar" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Top 5 Produk (Stok Terbanyak)">
          {loading ? (
            <EmptyState text="Memuat data..." />
          ) : topProducts.length === 0 ? (
            <EmptyState text="Belum ada data produk." />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                />
                <Tooltip />
                <Bar dataKey="quantity" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string
  value: string | number
  icon: string
  highlight?: boolean
}) {
  return (
    <div
      style={{
        background: 'white',
        padding: '18px 20px',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: highlight ? '#fef2f2' : '#eff6ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ color: '#64748b', fontSize: 12.5, marginBottom: 2 }}>{label}</p>
        <p
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: highlight ? '#dc2626' : '#0f172a',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {value}
        </p>
      </div>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'white',
        padding: 20,
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <h3 style={{ marginBottom: 16, fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        height: 280,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        fontSize: 14,
      }}
    >
      {text}
    </div>
  )
}