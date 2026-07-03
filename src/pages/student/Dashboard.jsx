import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import StudentLayout from '../../layouts/StudentLayout'

function AnnouncementsList({ department }) {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (department) fetchAnnouncements()
  }, [department])

  const fetchAnnouncements = async () => {
    try {
      const oneDayAgo = new Date()
      oneDayAgo.setDate(oneDayAgo.getDate() - 1)

      const q = query(
        collection(db, 'events'),
        where('department', '==', department)
      )
      const snap = await getDocs(q)
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(ev => new Date(ev.createdAt) >= oneDayAgo)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      setAnnouncements(data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso)
    const hours = Math.floor(diff / 3600000)
    const mins = Math.floor(diff / 60000)
    if (hours >= 1) return `${hours}h ago`
    return `${mins}m ago`
  }

  const catColors = {
    Technical: '#4f46e5', Workshop: '#7c3aed', Seminar: '#0891b2',
    Sports: '#059669', Cultural: '#d97706', Placement: '#dc2626',
    NSS: '#16a34a', NCC: '#b45309', YRC: '#0ea5e9'
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '20px 0', color: '#9ca3af' }}>
      <i className="fas fa-spinner fa-spin"></i>
    </div>
  )

  if (announcements.length === 0) return (
    <div style={{ textAlign: 'center', padding: '28px 0' }}>
      <i className="fas fa-bell-slash" style={{
        fontSize: '2rem', color: '#e5e7eb',
        display: 'block', marginBottom: 10
      }}></i>
      <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0 }}>
        No new announcements today
      </p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {announcements.map(ev => {
        const color = catColors[ev.category] || '#4f46e5'
        return (
          <div key={ev.id} style={{
            padding: '12px 14px', borderRadius: 12,
            border: `1px solid ${color}20`,
            background: `${color}06`
          }}>
            <div style={{
              fontWeight: 600, fontSize: '0.85rem',
              color: '#111827', marginBottom: 4
            }}>
              {ev.title}
            </div>
            {ev.clubName && (
              <div style={{ color, fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
                <i className="fas fa-users me-1"></i>{ev.clubName}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                background: `${color}15`, color,
                padding: '2px 8px', borderRadius: 4,
                fontSize: '0.7rem', fontWeight: 600
              }}>{ev.category}</span>
              <span style={{ color: '#9ca3af', fontSize: '0.72rem' }}>
                <i className="fas fa-clock me-1"></i>{timeAgo(ev.createdAt)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function StudentDashboard() {
  const { userProfile } = useAuth()
  const [events, setEvents] = useState([])
  const [myRegs, setMyRegs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [userProfile])

  const fetchData = async () => {
    if (!userProfile) return
    try {
      // Fetch department events
      const evQ = query(
        collection(db, 'events'),
        where('department', '==', userProfile.department),
        limit(4)
      )
      const evSnap = await getDocs(evQ)
      setEvents(evSnap.docs.map(d => ({ id: d.id, ...d.data() })))

      // Fetch my registrations count
      const regQ = query(
        collection(db, 'registrations'),
        where('studentId', '==', userProfile.uid)
      )
      const regSnap = await getDocs(regQ)
      setMyRegs(regSnap.docs)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const statCards = [
    { icon: 'fas fa-calendar-alt', label: 'Dept. Events', value: events.length, color: '#4f46e5', bg: 'rgba(79,70,229,0.1)' },
    { icon: 'fas fa-ticket-alt', label: 'My Registrations', value: myRegs.length, color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
    { icon: 'fas fa-globe', label: 'College Events', value: '∞', color: '#0891b2', bg: 'rgba(8,145,178,0.1)' },
    { icon: 'fas fa-bell', label: 'Announcements', value: 3, color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
  ]

  const categoryColors = {
    Technical: '#4f46e5', Workshop: '#7c3aed', Seminar: '#0891b2',
    Sports: '#059669', Cultural: '#d97706', Placement: '#dc2626',
    NSS: '#16a34a', NCC: '#b45309'
  }

  return (
    <StudentLayout>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        borderRadius: 20, padding: '28px 32px', marginBottom: 28,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16
      }}>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', marginBottom: 6 }}>
            Welcome back 👋
          </div>
          <h2 style={{
            color: 'white', fontFamily: 'Poppins',
            fontWeight: 800, fontSize: '1.6rem', margin: 0
          }}>
            {userProfile?.name || 'Student'}
          </h2>
          <div style={{
            color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: 6,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <i className="fas fa-building"></i>
            {userProfile?.department}
          </div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.15)', borderRadius: 16,
          padding: '16px 24px', textAlign: 'center'
        }}>
          <div style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 800, fontSize: '2rem' }}>
            {myRegs.length}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem' }}>Events Joined</div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map((card, i) => (
          <div className="col-6 col-lg-3" key={i}>
            <div style={{
              background: 'white', borderRadius: 16, padding: '20px',
              border: '1px solid #f3f4f6', boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12,
                background: card.bg, display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <i className={card.icon} style={{ color: card.color, fontSize: '1.1rem' }}></i>
              </div>
              <div>
                <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.5rem', color: '#111827', lineHeight: 1 }}>
                  {card.value}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.78rem', marginTop: 3 }}>{card.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Upcoming Events */}
        <div className="col-lg-8">
          <div style={{
            background: 'white', borderRadius: 20, padding: 24,
            border: '1px solid #f3f4f6', boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, margin: 0 }}>
                Department Events
              </h5>
              <Link to="/student/department-events" style={{
                color: '#4f46e5', fontSize: '0.85rem',
                fontWeight: 600, textDecoration: 'none'
              }}>View All →</Link>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '1.5rem' }}></i>
              </div>
            ) : events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <i className="fas fa-calendar-times" style={{ fontSize: '2.5rem', color: '#e5e7eb', display: 'block', marginBottom: 12 }}></i>
                <p style={{ color: '#9ca3af', margin: 0 }}>No events found for your department yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {events.map(ev => (
                  <Link to={`/student/event/${ev.id}`} key={ev.id} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px', borderRadius: 12,
                      border: '1px solid #f3f4f6', transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#fafafa'
                        e.currentTarget.style.borderColor = '#e0e7ff'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'white'
                        e.currentTarget.style.borderColor = '#f3f4f6'
                      }}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: `${categoryColors[ev.category] || '#4f46e5'}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <i className="fas fa-calendar" style={{ color: categoryColors[ev.category] || '#4f46e5' }}></i>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem', marginBottom: 3 }}>
                          {ev.title}
                        </div>
                        <div style={{ color: '#9ca3af', fontSize: '0.78rem', display: 'flex', gap: 12 }}>
                          <span><i className="fas fa-calendar me-1"></i>{ev.date}</span>
                          <span><i className="fas fa-map-marker-alt me-1"></i>{ev.venue}</span>
                        </div>
                      </div>
                      <span style={{
                        background: `${categoryColors[ev.category] || '#4f46e5'}15`,
                        color: categoryColors[ev.category] || '#4f46e5',
                        padding: '4px 10px', borderRadius: 6,
                        fontSize: '0.72rem', fontWeight: 600, flexShrink: 0
                      }}>{ev.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Announcements */}
<div className="col-lg-4">
  <div style={{
    background: 'white', borderRadius: 20, padding: 24,
    border: '1px solid #f3f4f6', boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
  }}>
    <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 20 }}>
      📢 Announcements
    </h5>
    <AnnouncementsList department={userProfile?.department} />
  </div>

  {/* Quick Links */}
  <div style={{
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    borderRadius: 20, padding: 24, marginTop: 16
  }}>
    <h6 style={{ color: 'white', fontWeight: 700, marginBottom: 16 }}>Quick Actions</h6>
    {[
      { label: 'Browse College Events', icon: 'fas fa-globe', path: '/student/college-events' },
      { label: 'My Registrations', icon: 'fas fa-ticket-alt', path: '/student/my-registrations' },
      { label: 'Edit Profile', icon: 'fas fa-user-edit', path: '/student/profile' },
    ].map(link => (
      <Link key={link.path} to={link.path} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', borderRadius: 10, marginBottom: 8,
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: 'white', textDecoration: 'none',
        fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s'
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
      >
        <i className={link.icon} style={{ width: 16 }}></i>
        {link.label}
      </Link>
    ))}
  </div>
</div>
      </div>
    </StudentLayout>
  )
}