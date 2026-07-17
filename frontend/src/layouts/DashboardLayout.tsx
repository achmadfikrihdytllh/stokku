import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          background: '#1e293b',
          color: 'white',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2 style={{ marginBottom: 30 }}>StokKu</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
          <Link to="/products" style={linkStyle}>Produk</Link>
          <Link to="/categories" style={linkStyle}>Kategori</Link>
          <Link to="/warehouses" style={linkStyle}>Gudang</Link>
          <Link to="/stocks" style={linkStyle}>Stok</Link>
          <Link to="/stock-movements" style={linkStyle}>Transaksi Stok</Link>
        </nav>
        <div style={{ borderTop: '1px solid #334155', paddingTop: 16 }}>
          <p style={{ fontSize: 14, marginBottom: 8 }}>{user?.fullName ?? user?.email}</p>
          <button onClick={handleLogout} style={{ width: '100%', padding: 8 }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: 30, background: '#f8fafc' }}>
        <Outlet />
      </main>
    </div>
  )
}

const linkStyle: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
  padding: '8px 12px',
  borderRadius: 6,
}