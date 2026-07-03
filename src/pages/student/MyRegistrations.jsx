import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import StudentLayout from '../../layouts/StudentLayout'

const statusColors = {
  upcoming: { bg: 'rgba(79,70,229,0.1)', color: '#4f46e5', label: 'Upcoming' },
  completed: { bg: 'rgba(5,150,105,0.1)', color: '#059669', label: 'Completed' },
}

export default function MyRegistrations() {
  const { currentUser } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeStatus, setActiveStatus] = useState('all')

  useEffect(() => { fetchRegistrations() }, [])

  useEffect(() => {
    if (activeStatus === 'all') setFiltered(registrations)
    else setFiltered(registrations.filter(r => r.status === activeStatus))
  }, [activeStatus, registrations])

  const fetchRegistrations = async () => {
    try {
      const q = query(
        collection(db, 'registrations'),
        where('studentId', '==', currentUser.uid)
      )
      const snap = await getDocs(q)
      const data = snap.docs.map(d => ({ docId: d.id, ...d.data() }))
      data.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
      setRegistrations(data)
      setFiltered(data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const tabs = [
    { key: 'all', label: 'All', icon: 'fas fa-list' },
    { key: 'upcoming', label: 'Upcoming', icon: 'fas fa-clock' },
    { key: 'completed', label: 'Completed', icon: 'fas fa-check-circle' },
  ]

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    } catch { return iso }
  }

  return (
    <StudentLayout>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed, #db2777)',
        borderRadius: 20, padding: '24px 28px', marginBottom: 28,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 12
      }}>
        <div>
          <h2 style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 800, margin: 0 }}>
            My Registrations
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: '6px 0 0', fontSize: '0.88rem' }}>
            <i className="fas fa-ticket-alt me-2"></i>
            All your event registrations in one place
          </p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.15)', borderRadius: 12,
          padding: '10px 20px', color: 'white', fontWeight: 700
        }}>
          {registrations.length} Total
        </div>
      </div>

      {/* Stats Row */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total', value: registrations.length, color: '#7c3aed', icon: 'fas fa-ticket-alt' },
          { label: 'Upcoming', value: registrations.filter(r => r.status === 'upcoming').length, color: '#4f46e5', icon: 'fas fa-clock' },
          { label: 'Completed', value: registrations.filter(r => r.status === 'completed').length, color: '#059669', icon: 'fas fa-check-circle' },
        ].map((s, i) => (
          <div className="col-6 col-lg-4" key={i}>
            <div style={{
              background: 'white', borderRadius: 16, padding: '18px 20px',
              border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: `${s.color}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <i className={s.icon} style={{ color: s.color }}></i>
              </div>
              <div>
                <div style={{
                  fontFamily: 'Poppins', fontWeight: 800,
                  fontSize: '1.5rem', color: '#111827', lineHeight: 1
                }}>
                  {s.value}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 24,
        background: 'white', padding: 6, borderRadius: 14,
        border: '1px solid #f3f4f6', width: 'fit-content', flexWrap: 'wrap'
      }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveStatus(tab.key)} style={{
            padding: '9px 18px', borderRadius: 10, border: 'none',
            background: activeStatus === tab.key
              ? 'linear-gradient(135deg, #7c3aed, #db2777)' : 'transparent',
            color: activeStatus === tab.key ? 'white' : '#6b7280',
            fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 7
          }}>
            <i className={tab.icon} style={{ fontSize: '0.8rem' }}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Registrations List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#7c3aed' }}></i>
          <p style={{ color: '#9ca3af', marginTop: 12 }}>Loading registrations...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 0',
          background: 'white', borderRadius: 20, border: '1px solid #f3f4f6'
        }}>
          <i className="fas fa-ticket-alt" style={{
            fontSize: '3rem', color: '#e5e7eb',
            display: 'block', marginBottom: 16
          }}></i>
          <h5 style={{ color: '#374151', marginBottom: 8 }}>No Registrations Found</h5>
          <p style={{ color: '#9ca3af', marginBottom: 20 }}>
            No events registered yet.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(reg => {
            const status = statusColors[reg.status] || statusColors.upcoming
            return (
              <div key={reg.docId} style={{
                background: 'white', borderRadius: 18, padding: '22px 24px',
                border: '1px solid #f3f4f6',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                display: 'flex', alignItems: 'center',
                gap: 20, flexWrap: 'wrap', transition: 'all 0.2s'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,58,237,0.1)'
                  e.currentTarget.style.borderColor = '#e9d5ff'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)'
                  e.currentTarget.style.borderColor = '#f3f4f6'
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                  background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <i className="fas fa-calendar-check" style={{ color: 'white', fontSize: '1.1rem' }}></i>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{
                    fontWeight: 700, color: '#111827',
                    fontSize: '1rem', marginBottom: 4
                  }}>
                    {reg.eventTitle}
                  </div>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                      <i className="fas fa-building me-1"></i>{reg.studentDept}
                    </span>
                    <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                      <i className="fas fa-clock me-1"></i>{formatDate(reg.registeredAt)}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <span style={{
                  background: status.bg, color: status.color,
                  padding: '6px 14px', borderRadius: 100,
                  fontSize: '0.78rem', fontWeight: 700, flexShrink: 0
                }}>
                  {status.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </StudentLayout>
  )
}