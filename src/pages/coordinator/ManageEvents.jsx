import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import CoordinatorLayout from '../../layouts/CoordinatorLayout'
import { Link } from 'react-router-dom'

const categoryColors = {
  Technical: '#4f46e5', Workshop: '#7c3aed', Seminar: '#0891b2',
  Sports: '#059669', Cultural: '#d97706', Placement: '#dc2626',
  NSS: '#16a34a', NCC: '#b45309'
}

export default function ManageEvents() {
  const { userProfile } = useAuth()
  const [events, setEvents] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [editModal, setEditModal] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchEvents() }, [userProfile])

  useEffect(() => {
    if (!search) { setFiltered(events); return }
    setFiltered(events.filter(e =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase())
    ))
  }, [search, events])

  const fetchEvents = async () => {
    if (!userProfile) return
    try {
      const q = query(
        collection(db, 'events'),
        where('department', '==', userProfile.department)
      )
      const snap = await getDocs(q)
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setEvents(data)
      setFiltered(data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return
    setDeleting(id)
    try {
      await deleteDoc(doc(db, 'events', id))
      setEvents(prev => prev.filter(e => e.id !== id))
    } catch (err) { console.error(err) }
    setDeleting(null)
  }

  const openEdit = (ev) => {
    setEditForm({ ...ev })
    setEditModal(ev.id)
  }

  const handleEditSave = async () => {
    setSaving(true)
    try {
      await updateDoc(doc(db, 'events', editModal), {
  title: editForm.title,
  description: editForm.description,
  venue: editForm.venue,
  date: editForm.date,
  time: editForm.time,
  maxSeats: parseInt(editForm.maxSeats),
  category: editForm.category,
  visibility: editForm.visibility,
  clubName: editForm.clubName || '',
})
      setEvents(prev => prev.map(e => e.id === editModal ? { ...e, ...editForm } : e))
      setEditModal(null)
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1.5px solid #e5e7eb', outline: 'none',
    fontSize: '0.88rem', color: '#111827'
  }

  return (
    <CoordinatorLayout>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #059669, #0891b2)',
        borderRadius: 20, padding: '24px 28px', marginBottom: 28,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 12
      }}>
        <div>
          <h2 style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 800, margin: 0 }}>
            Manage Events
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: '6px 0 0', fontSize: '0.88rem' }}>
            {filtered.length} events in {userProfile?.department}
          </p>
        </div>
        <Link to="/coordinator/create-event" style={{
          background: 'rgba(255,255,255,0.2)', color: 'white',
          padding: '10px 20px', borderRadius: 10, textDecoration: 'none',
          fontWeight: 600, fontSize: '0.88rem', border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <i className="fas fa-plus me-2"></i>New Event
        </Link>
      </div>

      {/* Search */}
      <div style={{
        background: 'white', borderRadius: 14, padding: '12px 18px',
        display: 'flex', alignItems: 'center', gap: 12,
        border: '1px solid #f3f4f6', marginBottom: 20,
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
      }}>
        <i className="fas fa-search" style={{ color: '#9ca3af' }}></i>
        <input type="text"
          placeholder="Search events by name, category or venue..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: '0.92rem', color: '#374151', background: 'transparent'
          }}
        />
      </div>

      {/* Table */}
      <div style={{
        background: 'white', borderRadius: 20,
        border: '1px solid #f3f4f6', overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#f59e0b' }}></i>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <i className="fas fa-calendar-times" style={{
              fontSize: '3rem', color: '#e5e7eb', display: 'block', marginBottom: 16
            }}></i>
            <h5 style={{ color: '#374151' }}>No Events Found</h5>
            <Link to="/coordinator/create-event" style={{
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              color: 'white', padding: '10px 24px', borderRadius: 10,
              textDecoration: 'none', fontWeight: 600, display: 'inline-block', marginTop: 12
            }}>Create First Event</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid #f3f4f6' }}>
                  {['Event', 'Category', 'Date & Time', 'Venue', 'Seats', 'Visibility', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '14px 18px', textAlign: 'left',
                      fontSize: '0.78rem', fontWeight: 700,
                      color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px',
                      whiteSpace: 'nowrap'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(ev => (
                  <tr key={ev.id} style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '14px 18px', maxWidth: 220 }}>
                      <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.88rem', marginBottom: 2 }}>
                        {ev.title}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        background: `${categoryColors[ev.category] || '#f59e0b'}15`,
                        color: categoryColors[ev.category] || '#f59e0b',
                        padding: '4px 10px', borderRadius: 6,
                        fontSize: '0.75rem', fontWeight: 600
                      }}>{ev.category}</span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ color: '#374151', fontSize: '0.82rem', fontWeight: 600 }}>{ev.date}</div>
                      <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{ev.time}</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ color: '#374151', fontSize: '0.82rem' }}>{ev.venue}</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.88rem' }}>
                        {ev.registeredSeats || 0}/{ev.maxSeats}
                      </div>
                      <div style={{ background: '#f3f4f6', borderRadius: 3, height: 4, marginTop: 4, overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(((ev.registeredSeats || 0) / ev.maxSeats) * 100, 100)}%`,
                          height: '100%', background: '#f59e0b', borderRadius: 3
                        }}></div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        background: ev.visibility === 'CollegeWide'
                          ? 'rgba(5,150,105,0.1)' : 'rgba(79,70,229,0.1)',
                        color: ev.visibility === 'CollegeWide' ? '#059669' : '#4f46e5',
                        padding: '4px 10px', borderRadius: 6,
                        fontSize: '0.72rem', fontWeight: 600
                      }}>
                        {ev.visibility === 'CollegeWide' ? '🌐 College' : '🏢 Dept.'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(ev)} style={{
                          background: 'rgba(79,70,229,0.1)', color: '#4f46e5',
                          border: 'none', padding: '6px 12px', borderRadius: 7,
                          fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer'
                        }}>
                          <i className="fas fa-edit me-1"></i>Edit
                        </button>
                        <button onClick={() => handleDelete(ev.id)}
                          disabled={deleting === ev.id} style={{
                            background: 'rgba(220,38,38,0.1)', color: '#dc2626',
                            border: 'none', padding: '6px 12px', borderRadius: 7,
                            fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer'
                          }}>
                          {deleting === ev.id
                            ? <i className="fas fa-spinner fa-spin"></i>
                            : <><i className="fas fa-trash me-1"></i>Delete</>
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 1000, display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: 20
        }} onClick={(e) => { if (e.target === e.currentTarget) setEditModal(null) }}>
          <div style={{
            background: 'white', borderRadius: 20, padding: 32,
            width: '100%', maxWidth: 600, maxHeight: '90vh',
            overflowY: 'auto', position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, margin: 0 }}>Edit Event</h5>
              <button onClick={() => setEditModal(null)} style={{
                background: '#f3f4f6', border: 'none', borderRadius: 8,
                width: 32, height: 32, cursor: 'pointer', color: '#6b7280'
              }}>✕</button>
            </div>

            <div className="row g-3">
              <div className="col-12">
                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: 6 }}>Title</label>
                <input type="text" value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  style={inputStyle} />
              </div>
              <div className="col-12">
                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: 6 }}>Description</label>
                <textarea rows={3} value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div className="col-md-6">
  <label style={{
    fontWeight: 600,
    fontSize: '0.82rem',
    display: 'block',
    marginBottom: 6
  }}>
    Organizing Club
  </label>

  <input
    type="text"
    placeholder="e.g. CSE Coding Club"
    value={editForm.clubName || ''}
    onChange={e =>
      setEditForm({
        ...editForm,
        clubName: e.target.value
      })
    }
    style={inputStyle}
  />
</div>
              <div className="col-md-6">
                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: 6 }}>Date</label>
                <input type="date" value={editForm.date}
                  onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                  style={inputStyle} />
              </div>
              <div className="col-md-6">
                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: 6 }}>Time</label>
                <input type="time" value={editForm.time}
                  onChange={e => setEditForm({ ...editForm, time: e.target.value })}
                  style={inputStyle} />
              </div>
              <div className="col-md-6">
                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: 6 }}>Venue</label>
                <input type="text" value={editForm.venue}
                  onChange={e => setEditForm({ ...editForm, venue: e.target.value })}
                  style={inputStyle} />
              </div>
              <div className="col-md-6">
                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: 6 }}>Max Seats</label>
                <input type="number" value={editForm.maxSeats}
                  onChange={e => setEditForm({ ...editForm, maxSeats: e.target.value })}
                  style={inputStyle} />
              </div>
              <div className="col-md-6">
                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: 6 }}>Category</label>
                <select value={editForm.category}
                  onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                  style={{ ...inputStyle, appearance: 'none' }}>
                  {['Technical', 'Workshop', 'Seminar', 'Sports', 'Cultural', 'Placement', 'NSS', 'NCC'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: 6 }}>Visibility</label>
                <select value={editForm.visibility}
                  onChange={e => setEditForm({ ...editForm, visibility: e.target.value })}
                  style={{ ...inputStyle, appearance: 'none' }}>
                  <option value="DepartmentOnly">🏢 Department Only</option>
                  <option value="CollegeWide">🌐 College Wide</option>
                </select>
              </div>
              <div className="col-12" style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={handleEditSave} disabled={saving} style={{
                    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                    color: 'white', border: 'none', padding: '11px 24px',
                    borderRadius: 10, fontWeight: 700, cursor: 'pointer'
                  }}>
                    {saving ? <><i className="fas fa-spinner fa-spin me-2"></i>Saving...</> : 'Save Changes'}
                  </button>
                  <button onClick={() => setEditModal(null)} style={{
                    background: 'transparent', border: '1.5px solid #e5e7eb',
                    color: '#6b7280', padding: '11px 20px',
                    borderRadius: 10, fontWeight: 600, cursor: 'pointer'
                  }}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </CoordinatorLayout>
  )
}