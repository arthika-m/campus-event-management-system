import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import CoordinatorLayout from '../../layouts/CoordinatorLayout'

export default function CoordinatorDashboard() {
  const { userProfile } = useAuth()
  const [events, setEvents] = useState([])
  const [totalRegs, setTotalRegs] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [userProfile])

  const fetchData = async () => {
    if (!userProfile) return
    try {
      const evQ = query(
        collection(db, 'events'),
        where('department', '==', userProfile.department)
      )
      const evSnap = await getDocs(evQ)
      const evData = evSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      setEvents(evData)

      let regs = 0
      evData.forEach(ev => { regs += ev.registeredSeats || 0 })
      setTotalRegs(regs)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const upcoming = events.filter(e => new Date(e.date) >= new Date())
  const categoryCount = events.reduce((acc, ev) => {
    acc[ev.category] = (acc[ev.category] || 0) + 1
    return acc
  }, {})

  const statCards = [
    { icon: 'fas fa-calendar-alt', label: 'Total Events', value: events.length, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { icon: 'fas fa-clock', label: 'Upcoming Events', value: upcoming.length, color: '#4f46e5', bg: 'rgba(79,70,229,0.1)' },
    { icon: 'fas fa-users', label: 'Total Registrations', value: totalRegs, color: '#059669', bg: 'rgba(5,150,105,0.1)' },
    { icon: 'fas fa-layer-group', label: 'Categories Used', value: Object.keys(categoryCount).length, color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
  ]

  const categoryColors = {
    Technical: '#4f46e5', Workshop: '#7c3aed', Seminar: '#0891b2',
    Sports: '#059669', Cultural: '#d97706', Placement: '#dc2626',
    NSS: '#16a34a', NCC: '#b45309'
  }

  return (
    <CoordinatorLayout>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
        borderRadius: 20, padding: '28px 32px', marginBottom: 28,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 16
      }}>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', marginBottom: 6 }}>
            Welcome back 👋
          </div>
          <h2 style={{
            color: 'white', fontFamily: 'Poppins',
            fontWeight: 800, fontSize: '1.6rem', margin: 0
          }}>
            {userProfile?.name}
          </h2>
          <div style={{ color: '#f59e0b', fontSize: '0.85rem', marginTop: 6 }}>
            <i className="fas fa-building me-2"></i>
            {userProfile?.department} — Event Coordinator
          </div>
        </div>
        <Link to="/coordinator/create-event" style={{
          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
          color: 'white', padding: '13px 24px', borderRadius: 12,
          textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 15px rgba(245,158,11,0.4)'
        }}>
          <i className="fas fa-plus"></i> Create New Event
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map((card, i) => (
          <div className="col-6 col-lg-3" key={i}>
            <div style={{
              background: 'white', borderRadius: 16, padding: '20px',
              border: '1px solid #f3f4f6',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12,
                background: card.bg,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0
              }}>
                <i className={card.icon} style={{ color: card.color, fontSize: '1.1rem' }}></i>
              </div>
              <div>
                <div style={{
                  fontFamily: 'Poppins', fontWeight: 800,
                  fontSize: '1.5rem', color: '#111827', lineHeight: 1
                }}>
                  {loading ? '—' : card.value}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.78rem', marginTop: 3 }}>
                  {card.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Recent Events */}
        <div className="col-lg-8">
          <div style={{
            background: 'white', borderRadius: 20, padding: 24,
            border: '1px solid #f3f4f6',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 20
            }}>
              <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, margin: 0 }}>
                Recent Events
              </h5>
              <Link to="/coordinator/manage-events" style={{
                color: '#f59e0b', fontSize: '0.85rem',
                fontWeight: 600, textDecoration: 'none'
              }}>Manage All →</Link>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '1.5rem' }}></i>
              </div>
            ) : events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <i className="fas fa-calendar-plus" style={{
                  fontSize: '2.5rem', color: '#e5e7eb',
                  display: 'block', marginBottom: 12
                }}></i>
                <p style={{ color: '#9ca3af' }}>No events yet. Create your first event!</p>
                <Link to="/coordinator/create-event" style={{
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  color: 'white', padding: '10px 20px', borderRadius: 10,
                  textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem',
                  display: 'inline-block', marginTop: 8
                }}>Create Event</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {events.slice(0, 5).map(ev => (
                  <div key={ev.id} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', borderRadius: 12,
                    border: '1px solid #f3f4f6', transition: 'all 0.2s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <div style={{
                      width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                      background: `${categoryColors[ev.category] || '#f59e0b'}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <i className="fas fa-calendar" style={{
                        color: categoryColors[ev.category] || '#f59e0b'
                      }}></i>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 600, color: '#111827',
                        fontSize: '0.9rem', marginBottom: 3
                      }}>{ev.title}</div>
                      <div style={{ color: '#9ca3af', fontSize: '0.78rem' }}>
                        <i className="fas fa-calendar me-1"></i>{ev.date}
                        <span style={{ margin: '0 8px' }}>•</span>
                        <i className="fas fa-map-marker-alt me-1"></i>{ev.venue}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{
                        fontWeight: 700, color: '#111827', fontSize: '0.9rem'
                      }}>
                        {ev.registeredSeats || 0}/{ev.maxSeats}
                      </div>
                      <div style={{ color: '#9ca3af', fontSize: '0.72rem' }}>registered</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown & Quick Actions */}
        <div className="col-lg-4">
          {/* Category Breakdown */}
          <div style={{
            background: 'white', borderRadius: 20, padding: 24,
            border: '1px solid #f3f4f6',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            marginBottom: 16
          }}>
            <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 20 }}>
              📊 By Category
            </h5>
            {Object.keys(categoryCount).length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '0.88rem' }}>No events yet.</p>
            ) : (
              Object.entries(categoryCount).map(([cat, count]) => (
                <div key={cat} style={{ marginBottom: 12 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginBottom: 5, fontSize: '0.82rem'
                  }}>
                    <span style={{ fontWeight: 600, color: '#374151' }}>{cat}</span>
                    <span style={{ color: '#9ca3af' }}>{count} events</span>
                  </div>
                  <div style={{
                    background: '#f3f4f6', borderRadius: 4, height: 6, overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(count / events.length) * 100}%`,
                      height: '100%',
                      background: `linear-gradient(135deg, ${categoryColors[cat] || '#f59e0b'}, #ef4444)`,
                      borderRadius: 4
                    }}></div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
            borderRadius: 20, padding: 24
          }}>
            <h6 style={{ color: 'white', fontWeight: 700, marginBottom: 16 }}>
              Quick Actions
            </h6>
            {[
              { label: 'Create New Event', icon: 'fas fa-plus-circle', path: '/coordinator/create-event', color: '#f59e0b' },
              { label: 'View Participants', icon: 'fas fa-users', path: '/coordinator/participants', color: '#4f46e5' },
              { label: 'Manage Events', icon: 'fas fa-cog', path: '/coordinator/manage-events', color: '#059669' },
            ].map(link => (
              <Link key={link.path} to={link.path} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 10, marginBottom: 8,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', textDecoration: 'none',
                fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <i className={link.icon} style={{ color: link.color, width: 16 }}></i>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </CoordinatorLayout>
  )
}