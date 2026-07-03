import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

export default function CoordinatorLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { userProfile } = useAuth()

  const menuItems = [
    { path: '/coordinator/dashboard', icon: 'fas fa-chart-pie', label: 'Dashboard' },
    { path: '/coordinator/create-event', icon: 'fas fa-plus-circle', label: 'Create Event' },
    { path: '/coordinator/manage-events', icon: 'fas fa-calendar-alt', label: 'Manage Events' },
    { path: '/coordinator/participants', icon: 'fas fa-users', label: 'Participants' },
    { path: '/coordinator/profile', icon: 'fas fa-user', label: 'Profile' },
  ]

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9ff' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 260 : 72, flexShrink: 0,
        background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
        transition: 'width 0.3s ease', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <i className="fas fa-bolt text-white" style={{ fontSize: 14 }}></i>
          </div>
          {sidebarOpen && (
            <span style={{
              fontFamily: 'Poppins', fontWeight: 800,
              fontSize: '0.95rem', color: 'white', whiteSpace: 'nowrap'
            }}>TCE Coordinator</span>
          )}
        </div>

        {/* User Info */}
        {sidebarOpen && (
          <div style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', gap: 12
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '1rem'
            }}>
              {userProfile?.name?.charAt(0) || 'C'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                color: 'white', fontWeight: 600, fontSize: '0.88rem',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>
                {userProfile?.name || 'Coordinator'}
              </div>
              <div style={{ color: '#f59e0b', fontSize: '0.72rem', fontWeight: 600 }}>
                Event Coordinator
              </div>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {menuItems.map(item => {
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 12px', borderRadius: 10, marginBottom: 4,
                textDecoration: 'none', transition: 'all 0.2s',
                background: isActive
                  ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'transparent',
                color: isActive ? 'white' : '#9ca3af',
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <i className={item.icon} style={{
                  fontSize: '0.95rem', width: 18,
                  textAlign: 'center', flexShrink: 0
                }}></i>
                {sidebarOpen && (
                  <span style={{
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: 'nowrap'
                  }}>
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 12px', borderRadius: 10, width: '100%',
            background: 'transparent', border: 'none',
            cursor: 'pointer', color: '#9ca3af', transition: 'all 0.2s'
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(220,38,38,0.1)'
              e.currentTarget.style.color = '#f87171'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#9ca3af'
            }}
          >
            <i className="fas fa-sign-out-alt" style={{
              fontSize: '0.95rem', width: 18, textAlign: 'center'
            }}></i>
            {sidebarOpen && <span style={{ fontSize: '0.88rem' }}>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? 260 : 72,
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Top Bar */}
        <div style={{
          background: 'white', padding: '16px 28px',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 99,
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
              background: '#f3f4f6', border: 'none', borderRadius: 8,
              width: 36, height: 36, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <i className="fas fa-bars" style={{ color: '#6b7280' }}></i>
            </button>
            <div>
              <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>
                {menuItems.find(m => m.path === location.pathname)?.label || 'Dashboard'}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                {userProfile?.department}
              </div>
            </div>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '0.9rem'
          }}>
            {userProfile?.name?.charAt(0) || 'C'}
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: '28px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}