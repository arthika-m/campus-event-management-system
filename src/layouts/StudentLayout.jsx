import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

function NotificationBell({ userProfile }) {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (userProfile) fetchNotifications()
  }, [userProfile])

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const fetchNotifications = async () => {
    try {
      // Get latest 10 events from student's department
      const q = query(
        collection(db, 'events'),
        where('department', '==', userProfile.department)
      )
      const snap = await getDocs(q)
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)

      setNotifications(data)

      // Count events created in last 7 days as unread
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const unreadCount = data.filter(e =>
        new Date(e.createdAt) > weekAgo
      ).length
      setUnread(unreadCount)
    } catch (err) { console.error(err) }
  }

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso)
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor(diff / 3600000)
    const mins = Math.floor(diff / 60000)
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return `${mins}m ago`
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={() => { setOpen(!open); setUnread(0) }}
        style={{
          width: 38, height: 38, borderRadius: 10,
          background: open ? '#f0f0ff' : '#f3f4f6',
          border: open ? '1.5px solid #e0e7ff' : '1.5px solid transparent',
          cursor: 'pointer', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s'
        }}
      >
        <i className="fas fa-bell" style={{
          color: open ? '#4f46e5' : '#6b7280', fontSize: '0.95rem'
        }}></i>
        {unread > 0 && (
          <div style={{
            position: 'absolute', top: -4, right: -4,
            width: 18, height: 18, borderRadius: '50%',
            background: '#dc2626', color: 'white',
            fontSize: '0.65rem', fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid white'
          }}>{unread > 9 ? '9+' : unread}</div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 46, right: 0,
          width: 340, background: 'white', borderRadius: 16,
          border: '1px solid #f3f4f6', zIndex: 1000,
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem' }}>
              🔔 Notifications
            </div>
            <span style={{
              background: 'rgba(79,70,229,0.1)', color: '#4f46e5',
              padding: '2px 10px', borderRadius: 100,
              fontSize: '0.72rem', fontWeight: 700
            }}>
              {notifications.length} Events
            </span>
          </div>

          {/* List */}
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af' }}>
                <i className="fas fa-bell-slash" style={{ fontSize: '1.5rem', display: 'block', marginBottom: 8 }}></i>
                No new events
              </div>
            ) : notifications.map((ev, i) => {
              const isNew = new Date(ev.createdAt) > new Date(Date.now() - 7 * 86400000)
              return (
                <div key={ev.id} style={{
                  padding: '14px 20px',
                  borderBottom: i < notifications.length - 1 ? '1px solid #f9fafb' : 'none',
                  background: isNew ? 'rgba(79,70,229,0.02)' : 'white',
                  transition: 'background 0.15s', cursor: 'pointer'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.background = isNew ? 'rgba(79,70,229,0.02)' : 'white'}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <i className="fas fa-calendar-plus" style={{ color: 'white', fontSize: '0.8rem' }}></i>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.85rem', marginBottom: 2 }}>
                        {ev.title}
                      </div>
                      {ev.clubName && (
                        <div style={{ color: '#4f46e5', fontSize: '0.75rem', fontWeight: 600, marginBottom: 3 }}>
                          <i className="fas fa-users me-1"></i>{ev.clubName}
                        </div>
                      )}
                      <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                        <i className="fas fa-calendar me-1"></i>{ev.date}
                        <span style={{ margin: '0 6px' }}>•</span>
                        {timeAgo(ev.createdAt)}
                      </div>
                    </div>
                    {isNew && (
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#4f46e5', flexShrink: 0, marginTop: 4
                      }}></div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div style={{
            padding: '12px 20px', borderTop: '1px solid #f3f4f6',
            textAlign: 'center'
          }}>
            <a href="/student/department-events" style={{
              color: '#4f46e5', fontSize: '0.82rem',
              fontWeight: 600, textDecoration: 'none'
            }}>
              View All Events →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default function StudentLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { userProfile } = useAuth()

  const menuItems = [
    { path: '/student/dashboard', icon: 'fas fa-home', label: 'Dashboard' },
    { path: '/student/department-events', icon: 'fas fa-building', label: 'Department Events' },
    { path: '/student/college-events', icon: 'fas fa-globe', label: 'College-Wide Events' },
    { path: '/student/my-registrations', icon: 'fas fa-ticket-alt', label: 'My Registrations' },
    { path: '/student/profile', icon: 'fas fa-user', label: 'Profile' },
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
        background: 'linear-gradient(180deg, #0f0c29 0%, #302b63 100%)',
        transition: 'width 0.3s ease', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <i className="fas fa-bolt text-white" style={{ fontSize: 14 }}></i>
          </div>
          {sidebarOpen && (
            <span style={{
              fontFamily: 'Poppins', fontWeight: 800, fontSize: '1rem', color: 'white',
              whiteSpace: 'nowrap', overflow: 'hidden'
            }}>TCE EventSphere</span>
          )}
        </div>

        {/* User Info */}
        {sidebarOpen && (
          <div style={{
            padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', gap: 12
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '1rem'
            }}>
              {userProfile?.name?.charAt(0) || 'S'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userProfile?.name || 'Student'}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Student</div>
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
                background: isActive ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                color: isActive ? 'white' : '#9ca3af',
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <i className={item.icon} style={{ fontSize: '0.95rem', width: 18, textAlign: 'center', flexShrink: 0 }}></i>
                {sidebarOpen && (
                  <span style={{ fontSize: '0.88rem', fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap' }}>
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
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#9ca3af', transition: 'all 0.2s'
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
            <i className="fas fa-sign-out-alt" style={{ fontSize: '0.95rem', width: 18, textAlign: 'center' }}></i>
            {sidebarOpen && <span style={{ fontSize: '0.88rem' }}>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 260 : 72, transition: 'margin-left 0.3s ease' }}>
        {/* Top Bar */}
<div style={{
  background: 'white', padding: '16px 28px',
  borderBottom: '1px solid #f3f4f6',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
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

  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    {/* Notification Bell */}
    <NotificationBell userProfile={userProfile} />

    {/* Avatar */}
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer'
    }}>
      {userProfile?.name?.charAt(0) || 'S'}
    </div>
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