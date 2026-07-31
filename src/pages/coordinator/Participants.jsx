import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import CoordinatorLayout from '../../layouts/CoordinatorLayout'

export default function Participants() {
  const { userProfile } = useAuth()
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [participants, setParticipants] = useState([])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(false)
  const [eventsLoading, setEventsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [savingAttendance, setSavingAttendance] = useState(false)
  const [attendanceSaved, setAttendanceSaved] = useState(false)
  const [uploadingOD, setUploadingOD] = useState(false)
  const [odURL, setOdURL] = useState('')
  const [odMsg, setOdMsg] = useState('')

  useEffect(() => { fetchEvents() }, [userProfile])
  useEffect(() => {
    if (selectedEvent) {
      fetchParticipants(selectedEvent)
      fetchODLink(selectedEvent)
    }
  }, [selectedEvent])

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
    setAttendanceSaved(false)
    try {
      const q = query(
        collection(db, 'registrations'),
        where('eventId', '==', eventId)
      )
      const snap = await getDocs(q)
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => new Date(a.registeredAt) - new Date(b.registeredAt))
      setParticipants(data)

      // Load existing attendance
      const att = {}
      data.forEach(p => {
        att[p.id] = p.attendance || 'absent'
      })
      setAttendance(att)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const fetchODLink = async (eventId) => {
    try {
      const eventDoc = await getDocs(
        query(collection(db, 'events'), where('__name__', '==', eventId))
      )
      if (!eventDoc.empty) {
        const data = eventDoc.docs[0].data()
        setOdURL(data.odPdfURL || '')
      }
    } catch (err) { console.error(err) }
  }

  const toggleAttendance = (id) => {
    setAttendance(prev => ({
      ...prev,
      [id]: prev[id] === 'present' ? 'absent' : 'present'
    }))
    setAttendanceSaved(false)
  }

  const saveAttendance = async () => {
    setSavingAttendance(true)
    try {
      await Promise.all(
        participants.map(p =>
          updateDoc(doc(db, 'registrations', p.id), {
            attendance: attendance[p.id] || 'absent'
          })
        )
      )
      setAttendanceSaved(true)
      setTimeout(() => setAttendanceSaved(false), 3000)
    } catch (err) { console.error(err) }
    setSavingAttendance(false)
  }

  const handleODUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || file.type !== 'application/pdf') {
      setOdMsg('Please upload a PDF file only.')
      return
    }
    setUploadingOD(true)
    setOdMsg('')
    try {
      const storageRef = ref(storage, `od-pdfs/${selectedEvent}_OD.pdf`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      await updateDoc(doc(db, 'events', selectedEvent), { odPdfURL: url })
      setOdURL(url)
      setOdMsg('OD PDF uploaded successfully!')
      setTimeout(() => setOdMsg(''), 3000)
    } catch (err) {
      console.error(err)
      setOdMsg('Upload failed. Try again.')
    }
    setUploadingOD(false)
  }

  const exportCSV = (type) => {
    const list = type === 'participated'
      ? participants.filter(p => attendance[p.id] === 'present')
      : participants

    if (list.length === 0) {
      alert(type === 'participated'
        ? 'No students marked as Present yet. Please save attendance first.'
        : 'No registered students found.')
      return
    }

    const headers = ['S.No', 'Name', 'Roll Number', 'Department', 'Year', 'Email', 'Phone', 'Registered At', 'Attendance']
    const rows = list.map((p, i) => [
      i + 1,
      p.studentName,
      p.rollNumber || '—',
      p.studentDept,
      p.year || '—',
      p.studentEmail,
      p.studentPhone,
      new Date(p.registeredAt).toLocaleString('en-IN'),
      attendance[p.id] === 'present' ? 'Present' : 'Absent'
    ])

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const ev = events.find(e => e.id === selectedEvent)
    a.download = `${ev?.title || 'event'}_${type === 'participated' ? 'Participated' : 'Registered'}_Students.csv`
    a.click()
  }

  const filteredParticipants = participants.filter(p =>
    !search ||
    p.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    p.studentEmail?.toLowerCase().includes(search.toLowerCase()) ||
    p.rollNumber?.toLowerCase().includes(search.toLowerCase())
  )

  const presentCount = Object.values(attendance).filter(v => v === 'present').length
  const absentCount = participants.length - presentCount
  const selectedEventData = events.find(e => e.id === selectedEvent)

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    } catch { return iso }
  }

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
            Participants & Attendance
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: '6px 0 0', fontSize: '0.88rem' }}>
            <i className="fas fa-users me-2"></i>
            Mark attendance and manage OD for events
          </p>
        </div>
      </div>

      {/* Event Selector */}
      <div style={{
        background: 'white', borderRadius: 16, padding: '20px 24px',
        border: '1px solid #f3f4f6', marginBottom: 20,
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
      }}>
        <label style={{ fontWeight: 700, fontSize: '0.88rem', color: '#374151', display: 'block', marginBottom: 10 }}>
          Select Event
        </label>
        {eventsLoading ? (
          <div style={{ color: '#9ca3af' }}>
            <i className="fas fa-spinner fa-spin me-2"></i>Loading events...
          </div>
        ) : events.length === 0 ? (
          <div style={{ color: '#9ca3af' }}>No events found.</div>
        ) : (
          <select value={selectedEvent}
            onChange={e => setSelectedEvent(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: 10,
              border: '1.5px solid #e5e7eb', outline: 'none',
              fontSize: '0.9rem', color: '#111827', appearance: 'none'
            }}>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.title} — {ev.eventDate} ({ev.registeredSeats || 0} registered)
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Stats */}
      {selectedEventData && (
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Registered', value: participants.length, color: '#7c3aed', icon: 'fas fa-users' },
            { label: 'Present', value: presentCount, color: '#059669', icon: 'fas fa-check-circle' },
            { label: 'Absent', value: absentCount, color: '#dc2626', icon: 'fas fa-times-circle' },
            { label: 'Attendance %', value: participants.length > 0 ? `${Math.round((presentCount / participants.length) * 100)}%` : '0%', color: '#f59e0b', icon: 'fas fa-chart-pie' },
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

      {/* Action Buttons Row */}
      <div style={{
        background: 'white', borderRadius: 16, padding: '20px 24px',
        border: '1px solid #f3f4f6', marginBottom: 20,
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>

          {/* Save Attendance */}
          <button onClick={saveAttendance} disabled={savingAttendance || participants.length === 0}
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: 'white', border: 'none', padding: '10px 20px',
              borderRadius: 10, fontWeight: 600, fontSize: '0.85rem',
              cursor: participants.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              opacity: participants.length === 0 ? 0.5 : 1
            }}>
            {savingAttendance
              ? <><i className="fas fa-spinner fa-spin"></i> Saving...</>
              : <><i className="fas fa-save"></i> Save Attendance</>
            }
          </button>

          {attendanceSaved && (
            <span style={{
              color: '#059669', fontWeight: 600, fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <i className="fas fa-check-circle"></i> Attendance saved!
            </span>
          )}

          <div style={{ flex: 1 }} />

          {/* Download Registered */}
          <button onClick={() => exportCSV('registered')}
            disabled={participants.length === 0}
            style={{
              background: 'rgba(79,70,229,0.08)', color: '#4f46e5',
              border: '1.5px solid rgba(79,70,229,0.25)',
              padding: '10px 18px', borderRadius: 10,
              fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              opacity: participants.length === 0 ? 0.5 : 1
            }}>
            <i className="fas fa-download"></i> Registered Students CSV
          </button>

          {/* Download Participated */}
          <button onClick={() => exportCSV('participated')}
            disabled={presentCount === 0}
            style={{
              background: 'rgba(5,150,105,0.08)', color: '#059669',
              border: '1.5px solid rgba(5,150,105,0.25)',
              padding: '10px 18px', borderRadius: 10,
              fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              opacity: presentCount === 0 ? 0.5 : 1
            }}>
            <i className="fas fa-file-csv"></i> Participated Students CSV
          </button>
        </div>
      </div>

      {/* OD PDF Upload Section */}
      <div style={{
        background: 'white', borderRadius: 16, padding: '20px 24px',
        border: '1px solid #f3f4f6', marginBottom: 20,
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
      }}>
        <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 16, color: '#111827' }}>
          <i className="fas fa-file-pdf me-2" style={{ color: '#dc2626' }}></i>
          OD (On Duty) PDF
        </h6>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>

          {/* Upload Button */}
          <label style={{
            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
            color: 'white', padding: '10px 20px', borderRadius: 10,
            fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <input type="file" accept="application/pdf"
              onChange={handleODUpload}
              style={{ display: 'none' }} />
            {uploadingOD
              ? <><i className="fas fa-spinner fa-spin"></i> Uploading...</>
              : <><i className="fas fa-upload"></i> {odURL ? 'Replace OD PDF' : 'Upload OD PDF'}</>
            }
          </label>

          {/* Current OD Status */}
          {odURL ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(5,150,105,0.08)',
              border: '1px solid rgba(5,150,105,0.2)',
              padding: '10px 16px', borderRadius: 10
            }}>
              <i className="fas fa-check-circle" style={{ color: '#059669' }}></i>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#059669' }}>
                  OD PDF Uploaded
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Students can download from Event Details page
                </div>
              </div>
              <a href={odURL} target="_blank" rel="noreferrer" style={{
                background: 'rgba(5,150,105,0.1)', color: '#059669',
                padding: '5px 12px', borderRadius: 7,
                textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600
              }}>
                <i className="fas fa-eye me-1"></i>Preview
              </a>
            </div>
          ) : (
            <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
              <i className="fas fa-info-circle me-2"></i>
              No OD PDF uploaded yet for this event
            </div>
          )}

          {/* Message */}
          {odMsg && (
            <span style={{
              color: odMsg.includes('success') ? '#059669' : '#dc2626',
              fontWeight: 600, fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <i className={`fas fa-${odMsg.includes('success') ? 'check-circle' : 'exclamation-circle'}`}></i>
              {odMsg}
            </span>
          )}
        </div>
      </div>

      {/* Search */}
      <div style={{
        background: 'white', borderRadius: 12, padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        border: '1px solid #f3f4f6', marginBottom: 16
      }}>
        <i className="fas fa-search" style={{ color: '#9ca3af' }}></i>
        <input type="text"
          placeholder="Search by name, email or roll number..."
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
            <p style={{ color: '#9ca3af' }}>
              {participants.length === 0
                ? 'No students have registered for this event.'
                : 'No results match your search.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid #f3f4f6' }}>
                  {['#', 'Name', 'Roll No', 'Dept', 'Year', 'Email', 'Phone', 'Registered At', 'Attendance'].map(h => (
                    <th key={h} style={{
                      padding: '14px 16px', textAlign: 'left',
                      fontSize: '0.78rem', fontWeight: 700,
                      color: '#9ca3af', textTransform: 'uppercase',
                      letterSpacing: '0.5px', whiteSpace: 'nowrap'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((p, i) => {
                  const isPresent = attendance[p.id] === 'present'
                  return (
                    <tr key={p.id}
                      style={{
                        borderBottom: '1px solid #f9fafb',
                        background: isPresent ? 'rgba(5,150,105,0.03)' : 'white',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = isPresent ? 'rgba(5,150,105,0.06)' : '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background = isPresent ? 'rgba(5,150,105,0.03)' : 'white'}
                    >
                      <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '0.82rem' }}>
                        {i + 1}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                            background: isPresent
                              ? 'linear-gradient(135deg, #059669, #0891b2)'
                              : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 700, fontSize: '0.8rem'
                          }}>
                            {p.studentName?.charAt(0) || 'S'}
                          </div>
                          <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.88rem' }}>
                            {p.studentName}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          background: 'rgba(79,70,229,0.08)', color: '#4f46e5',
                          padding: '3px 10px', borderRadius: 6,
                          fontSize: '0.78rem', fontWeight: 600
                        }}>
                          {p.rollNumber || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: '0.82rem' }}>
                        {p.studentDept}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: '0.82rem' }}>
                        {p.year || '—'}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: '0.82rem' }}>
                        {p.studentEmail}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: '0.82rem' }}>
                        {p.studentPhone}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                        {formatDate(p.registeredAt)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => toggleAttendance(p.id)}
                          style={{
                            padding: '7px 16px', borderRadius: 8, border: 'none',
                            fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: isPresent
                              ? 'rgba(5,150,105,0.12)' : 'rgba(220,38,38,0.08)',
                            color: isPresent ? '#059669' : '#dc2626',
                            display: 'flex', alignItems: 'center', gap: 6,
                            whiteSpace: 'nowrap'
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                          {isPresent
                            ? <><i className="fas fa-check-circle"></i> Present</>
                            : <><i className="fas fa-times-circle"></i> Absent</>
                          }
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom note */}
      {participants.length > 0 && (
        <div style={{
          marginTop: 16, padding: '12px 16px', borderRadius: 10,
          background: 'rgba(79,70,229,0.05)',
          border: '1px solid rgba(79,70,229,0.15)',
          color: '#6b7280', fontSize: '0.82rem',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <i className="fas fa-info-circle" style={{ color: '#4f46e5' }}></i>
          Click <strong style={{ color: '#059669' }}>Present / Absent</strong> to toggle attendance for each student, then click <strong style={{ color: '#4f46e5' }}>Save Attendance</strong> to confirm. After saving, use <strong style={{ color: '#059669' }}>Participated Students CSV</strong> to export only present students for OD purpose.
        </div>
      )}
    </CoordinatorLayout>
  )
}
