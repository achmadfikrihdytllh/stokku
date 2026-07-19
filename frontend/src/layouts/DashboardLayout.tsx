import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/products', label: 'Produk' },
  { to: '/categories', label: 'Kategori' },
  { to: '/warehouses', label: 'Gudang' },
  { to: '/stocks', label: 'Stok' },
  { to: '/stock-movements', label: 'Transaksi Stok' },
  { to: '/returns', label: 'Retur' },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Tutup sidebar otomatis kalau pindah halaman di mobile
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Overlay backdrop, cuma muncul di mobile pas sidebar kebuka */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          background: '#1e293b',
          color: 'white',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          position: isMobile ? 'fixed' : 'relative',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transform: isMobile
            ? sidebarOpen
              ? 'translateX(0)'
              : 'translateX(-100%)'
            : 'none',
          transition: 'transform 0.25s ease',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 30,
          }}
        >
          <h2 style={{ margin: 0 }}>StokKu</h2>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: 22,
                cursor: 'pointer',
                lineHeight: 1,
              }}
              aria-label="Tutup menu"
            >
              ✕
            </button>
          )}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} style={linkStyle}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid #334155', paddingTop: 16 }}>
          <p style={{ fontSize: 14, marginBottom: 8 }}>{user?.fullName ?? user?.email}</p>
          <button onClick={handleLogout} style={{ width: '100%', padding: 8 }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar mobile, cuma muncul di layar kecil */}
        {isMobile && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              background: 'white',
              borderBottom: '1px solid #e2e8f0',
              position: 'sticky',
              top: 0,
              zIndex: 30,
            }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 22,
                cursor: 'pointer',
                padding: 4,
                lineHeight: 1,
              }}
              aria-label="Buka menu"
            >
              ☰
            </button>
            <strong style={{ fontSize: 16, color: '#0f172a' }}>StokKu</strong>
          </div>
        )}

        <main
          style={{
            flex: '1 1 0%',
            padding: isMobile ? 16 : 30,
            background: '#f8fafc',
            minWidth: 0,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

const linkStyle: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
  padding: '8px 12px',
  borderRadius: 6,
}