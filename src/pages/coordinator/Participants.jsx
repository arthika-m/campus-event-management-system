import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import CoordinatorLayout from '../../layouts/CoordinatorLayout'

export default function Participants() {
  const { userProfile } = useAuth()
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(false)
  const [eventsLoading, setEventsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchEvents() }, [userProfile])
  useEffect(() => { if (selectedEvent) fetchParticipants(selectedEvent) }, [selectedEvent])

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
      if (data.length > 0) setSelectedEvent(data[0].id)
    } catch (err) { console.error(err) }
    setEventsLoading(false)
  }

  const fetchParticipants = async (eventId) => {
    setLoading(true)
    try {
      const q = query(
        collection(db, 'registrations'),
        where('eventId', '==', eventId)
      )
      const snap = await getDocs(q)
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => new Date(a.registeredAt) - new Date(b.registeredAt))
      setParticipants(data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const exportCSV = () => {
    const headers = ['Reg ID', 'Name', 'Email', 'Department', 'Phone', 'Registered At']
    const rows = participants.map(p => [
      p.registrationId, p.studentName, p.studentEmail,
      p.studentDept, p.studentPhone,
      new Date(p.registeredAt).toLocaleString()
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const ev = events.find(e => e.id === selectedEvent)
    a.download = `${ev?.title || 'participants'}.csv`
    a.click()
  }

  const filteredParticipants = participants.filter(p =>
    !search ||
    p.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    p.studentEmail?.toLowerCase().includes(search.toLowerCase()) ||
    p.registrationId?.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    } catch { return iso }
  }

  const selectedEventData = events.find(e => e.id === selectedEvent)

  return (
    <CoordinatorLayout>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
        borderRadius: 20, padding: '24px 28px', marginBottom: 28,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 12
      }}>
        <div>
          <h2 style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 800, margin: 0 }}>
            Participants
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: '6px 0 0', fontSize: '0.88rem' }}>
            <i className="fas fa-users me-2"></i>
            View and export event registrations
          </p>
        </div>
        {participants.length > 0 && (
          <button onClick={exportCSV} style={{
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white', padding: '10px 20px', borderRadius: 10,
            fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <i className="fas fa-download"></i> Export CSV
          </button>
        )}
      </div>

      {/* Event Selector */}
      <div style={{
        background: 'white', borderRadius: 16, padding: '20px 24px',
        border: '1px solid #f3f4f6', marginBottom: 20,
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
      }}>
        <label style={{ fontWeight: 700, fontSize: '0.88rem', color: '#374151', display: 'block', marginBottom: 10 }}>
          Select Event to View Participants
        </label>
        {eventsLoading ? (
          <div style={{ color: '#9ca3af' }}>
            <i className="fas fa-spinner fa-spin me-2"></i>Loading events...
          </div>
        ) : events.length === 0 ? (
          <div style={{ color: '#9ca3af' }}>No events found. Create an event first.</div>
        ) : (
          <select
            value={selectedEvent}
            onChange={e => setSelectedEvent(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: 10,
              border: '1.5px solid #e5e7eb', outline: 'none',
              fontSize: '0.9rem', color: '#111827', appearance: 'none'
            }}
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.title} — {ev.date} ({ev.registeredSeats || 0} registered)
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Stats for selected event */}
      {selectedEventData && (
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Registered', value: participants.length, color: '#7c3aed', icon: 'fas fa-users' },
            { label: 'Seats Available', value: selectedEventData.maxSeats - (selectedEventData.registeredSeats || 0), color: '#059669', icon: 'fas fa-chair' },
            { label: 'Max Capacity', value: selectedEventData.maxSeats, color: '#0891b2', icon: 'fas fa-flag' },
            { label: 'Fill Rate', value: `${Math.round(((selectedEventData.registeredSeats || 0) / selectedEventData.maxSeats) * 100)}%`, color: '#f59e0b', icon: 'fas fa-chart-pie' },
          ].map((s, i) => (
            <div className="col-6 col-lg-3" key={i}>
              <div style={{
                background: 'white', borderRadius: 14, padding: '18px 20px',
                border: '1px solid #f3f4f6', display: 'flex',
                alignItems: 'center', gap: 14,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${s.color}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <i className={s.icon} style={{ color: s.color }}></i>
                </div>
                <div>
                  <div style={{
                    fontFamily: 'Poppins', fontWeight: 800,
                    fontSize: '1.4rem', color: '#111827', lineHeight: 1
                  }}>{s.value}</div>
                  <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div style={{
        background: 'white', borderRadius: 12, padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        border: '1px solid #f3f4f6', marginBottom: 16
      }}>
        <i className="fas fa-search" style={{ color: '#9ca3af' }}></i>
        <input type="text"
          placeholder="Search by name, email or registration ID..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: '0.9rem', background: 'transparent', color: '#374151'
          }}
        />
      </div>

      {/* Participants Table */}
      <div style={{
        background: 'white', borderRadius: 20,
        border: '1px solid #f3f4f6', overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#7c3aed' }}></i>
            <p style={{ color: '#9ca3af', marginTop: 12 }}>Loading participants...</p>
          </div>
        ) : filteredParticipants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <i className="fas fa-users" style={{
              fontSize: '3rem', color: '#e5e7eb', display: 'block', marginBottom: 16
            }}></i>
            <h5 style={{ color: '#374151' }}>No Participants Yet</h5>
            <p style={{ color: '#9ca3af' }}>Students haven't registered for this event yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid #f3f4f6' }}>
                  {['#', 'Reg ID', 'Student Name', 'Department', 'Email', 'Phone', 'Registered At'].map(h => (
                    <th key={h} style={{
                      padding: '14px 18px', textAlign: 'left',
                      fontSize: '0.78rem', fontWeight: 700,
                      color: '#9ca3af', textTransform: 'uppercase',
                      letterSpacing: '0.5px', whiteSpace: 'nowrap'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((p, i) => (
                  <tr key={p.id}
                    style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '14px 18px', color: '#9ca3af', fontSize: '0.82rem' }}>
                      {i + 1}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        background: 'rgba(124,58,237,0.08)',
                        color: '#7c3aed', padding: '4px 10px',
                        borderRadius: 6, fontSize: '0.78rem', fontWeight: 700
                      }}>{p.registrationId}</span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0
                        }}>
                          {p.studentName?.charAt(0) || 'S'}
                        </div>
                        <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.88rem' }}>
                          {p.studentName}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ color: '#6b7280', fontSize: '0.82rem' }}>{p.studentDept}</span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ color: '#6b7280', fontSize: '0.82rem' }}>{p.studentEmail}</span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ color: '#6b7280', fontSize: '0.82rem' }}>{p.studentPhone}</span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ color: '#9ca3af', fontSize: '0.78rem' }}>
                        {formatDate(p.registeredAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CoordinatorLayout>
  )
}