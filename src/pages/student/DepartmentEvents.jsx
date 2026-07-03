import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import StudentLayout from '../../layouts/StudentLayout'

const categoryColors = {
  Technical: '#4f46e5', Workshop: '#7c3aed', Seminar: '#0891b2',
  Sports: '#059669', Cultural: '#d97706', Placement: '#dc2626',
  NSS: '#16a34a', NCC: '#b45309',YRC: '#0ea5e9'
}

const categoryIcons = {
  Technical: 'fas fa-laptop-code', Workshop: 'fas fa-tools',
  Seminar: 'fas fa-chalkboard-teacher', Sports: 'fas fa-running',
  Cultural: 'fas fa-theater-masks', Placement: 'fas fa-briefcase',
  NSS: 'fas fa-hands-helping', NCC: 'fas fa-shield-alt',
  YRC: 'fas fa-heart'
}

export default function DepartmentEvents() {
  const { userProfile } = useAuth()
  const [events, setEvents] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Technical', 'Workshop', 'Seminar', 'Sports', 'Cultural', 'Placement', 'NSS', 'NCC','YRC']

  useEffect(() => { fetchEvents() }, [userProfile])

  useEffect(() => {
    let result = events
    if (activeCategory !== 'All') result = result.filter(e => e.category === activeCategory)
    if (search) result = result.filter(e =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.venue?.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [search, activeCategory, events])

  const fetchEvents = async () => {
    if (!userProfile) return
    try {
      const q = query(
        collection(db, 'events'),
        where('department', '==', userProfile.department)
      )
      const snap = await getDocs(q)
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setEvents(data)
      setFiltered(data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  return (
    <StudentLayout>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        borderRadius: 20, padding: '24px 28px', marginBottom: 28,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 12
      }}>
        <div>
          <h2 style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 800, margin: 0 }}>
            Department Events
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: '6px 0 0', fontSize: '0.88rem' }}>
            <i className="fas fa-building me-2"></i>{userProfile?.department}
          </p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.15)', borderRadius: 12,
          padding: '10px 20px', color: 'white', fontWeight: 700
        }}>
          {filtered.length} Events
        </div>
      </div>

      {/* Search */}
      <div style={{
        background: 'white', borderRadius: 14, padding: '12px 18px',
        display: 'flex', alignItems: 'center', gap: 12,
        border: '1px solid #f3f4f6', boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        marginBottom: 20
      }}>
        <i className="fas fa-search" style={{ color: '#9ca3af' }}></i>
        <input
          type="text" placeholder="Search events by name or venue..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: '0.92rem', color: '#374151', background: 'transparent'
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{
            background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer'
          }}>
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: '8px 16px', borderRadius: 100,
            border: activeCategory === cat ? 'none' : '1.5px solid #e5e7eb',
            background: activeCategory === cat
              ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'white',
            color: activeCategory === cat ? 'white' : '#6b7280',
            fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
            transition: 'all 0.2s'
          }}>{cat}</button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#4f46e5' }}></i>
          <p style={{ color: '#9ca3af', marginTop: 12 }}>Loading events...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 0',
          background: 'white', borderRadius: 20,
          border: '1px solid #f3f4f6'
        }}>
          <i className="fas fa-calendar-times" style={{ fontSize: '3rem', color: '#e5e7eb', display: 'block', marginBottom: 16 }}></i>
          <h5 style={{ color: '#374151', marginBottom: 8 }}>No Events Found</h5>
          <p style={{ color: '#9ca3af' }}>Try changing the category or search term.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map(ev => (
            <div className="col-md-6 col-lg-4" key={ev.id}>
              <Link to={`/student/event/${ev.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white', borderRadius: 20, overflow: 'hidden',
                  border: '1px solid #f3f4f6', transition: 'all 0.3s',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)', height: '100%'
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)'
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(79,70,229,0.12)'
                    e.currentTarget.style.borderColor = '#e0e7ff'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'
                    e.currentTarget.style.borderColor = '#f3f4f6'
                  }}
                >
                  {/* Banner */}
                  <div style={{
                    height: 120, padding: '20px 24px',
                    background: `linear-gradient(135deg, ${categoryColors[ev.category] || '#4f46e5'}, ${categoryColors[ev.category] || '#7c3aed'}99)`,
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <i className={categoryIcons[ev.category] || 'fas fa-calendar'}
                        style={{ color: 'white', fontSize: '1.1rem' }}></i>
                    </div>
                    <span style={{
                      background: 'rgba(255,255,255,0.2)', color: 'white',
                      padding: '4px 12px', borderRadius: 100,
                      fontSize: '0.72rem', fontWeight: 600
                    }}>{ev.category}</span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '18px 20px' }}>
                    <h6 style={{
  fontWeight: 700,
  color: '#111827',
  marginBottom: 4,
  fontSize: '0.95rem',
  lineHeight: 1.4
}}>
  {ev.title}
</h6>

{ev.clubName && (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 12
    }}
  >
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: 6,
        background: `${categoryColors[ev.category] || '#4f46e5'}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <i
        className="fas fa-users"
        style={{
          fontSize: '0.6rem',
          color: categoryColors[ev.category] || '#4f46e5'
        }}
      ></i>
    </div>

    <span
      style={{
        color: categoryColors[ev.category] || '#4f46e5',
        fontSize: '0.78rem',
        fontWeight: 600
      }}
    >
      {ev.clubName}
    </span>
  </div>
)}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
                      {[
                        ['fas fa-calendar', ev.date],
                        ['fas fa-clock', ev.time],
                        ['fas fa-map-marker-alt', ev.venue],
                        ['fas fa-users', `${ev.registeredSeats || 0} / ${ev.maxSeats} seats`]
                      ].map(([icon, text]) => (
                        <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <i className={icon} style={{
                            color: categoryColors[ev.category] || '#4f46e5',
                            fontSize: '0.75rem', width: 14
                          }}></i>
                          <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>{text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Seats progress */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{
                        background: '#f3f4f6', borderRadius: 4, height: 5, overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${Math.min(((ev.registeredSeats || 0) / ev.maxSeats) * 100, 100)}%`,
                          height: '100%',
                          background: `linear-gradient(135deg, ${categoryColors[ev.category] || '#4f46e5'}, #7c3aed)`,
                          borderRadius: 4
                        }}></div>
                      </div>
                    </div>

                    <div style={{
                      width: '100%', padding: '10px',
                      background: `${categoryColors[ev.category] || '#4f46e5'}12`,
                      color: categoryColors[ev.category] || '#4f46e5',
                      border: 'none', borderRadius: 10,
                      fontWeight: 600, fontSize: '0.85rem',
                      textAlign: 'center', cursor: 'pointer'
                    }}>
                      View Details →
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </StudentLayout>
  )
}