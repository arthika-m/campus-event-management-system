import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, addDoc, collection, query, where, getDocs, updateDoc, increment } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import StudentLayout from '../../layouts/StudentLayout'

const categoryColors = {
  Technical: '#4f46e5', Workshop: '#7c3aed', Seminar: '#0891b2',
  Sports: '#059669', Cultural: '#d97706', Placement: '#dc2626',
  NSS: '#16a34a', NCC: '#b45309', YRC: '#0ea5e9'
}

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userProfile, currentUser } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [regForm, setRegForm] = useState({ rollNumber: '', year: '' })
  const [registering, setRegistering] = useState(false)
  const [success, setSuccess] = useState(false)
  const [regId, setRegId] = useState('')

  useEffect(() => { fetchEvent() }, [id])

  const fetchEvent = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'events', id))
      if (docSnap.exists()) {
        setEvent({ id: docSnap.id, ...docSnap.data() })
        // Check if already registered (for built-in)
        if (currentUser) {
          const regQ = query(
            collection(db, 'registrations'),
            where('studentId', '==', currentUser.uid),
            where('eventId', '==', id)
          )
          const regSnap = await getDocs(regQ)
          if (!regSnap.empty) {
            setAlreadyRegistered(true)
            setRegId(regSnap.docs[0].data().registrationId || '')
          }
        }
      }
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const generateRegId = () => {
    const dept = userProfile?.department?.substring(0, 2).toUpperCase() || 'TC'
    const num = Math.floor(Math.random() * 9000) + 1000
    return `TCE2026${dept}${num}`
  }

  const handleBuiltinRegister = async (e) => {
    e.preventDefault()
    setRegistering(true)
    try {
      const newRegId = generateRegId()
      await addDoc(collection(db, 'registrations'), {
        registrationId: newRegId,
        studentId: currentUser.uid,
        studentName: userProfile.name,
        studentEmail: userProfile.email,
        studentDept: userProfile.department,
        studentPhone: userProfile.phone,
        rollNumber: regForm.rollNumber,
        year: regForm.year,
        eventId: id,
        eventTitle: event.title,
        registeredAt: new Date().toISOString(),
        status: 'upcoming'
      })
      // Update seat count
      if (!event.unlimitedSeats) {
        await updateDoc(doc(db, 'events', id), {
          registeredSeats: increment(1)
        })
      }
      setRegId(newRegId)
      setAlreadyRegistered(true)
      setSuccess(true)
      setShowModal(false)
    } catch (err) { console.error(err) }
    setRegistering(false)
  }

  const formatTime = (t) => {
    if (!t) return ''
    const [h, m] = t.split(':')
    const hour = parseInt(h)
    return `${hour > 12 ? hour - 12 : hour || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
  }

  const getRegStatus = () => {
    if (!event?.regStartDate || !event?.regEndDate) return null
    const now = new Date()
    const start = new Date(`${event.regStartDate}T${event.regStartTime || '00:00'}`)
    const end = new Date(`${event.regEndDate}T${event.regEndTime || '23:59'}`)
    if (now < start) return 'upcoming'
    if (now > end) return 'closed'
    return 'open'
  }

  const color = categoryColors[event?.category] || '#4f46e5'
  const regStatus = getRegStatus()

  const regStatusStyle = {
    open:     { bg: 'rgba(5,150,105,0.1)',   color: '#059669', text: '🟢 Registration Open',        border: 'rgba(5,150,105,0.3)' },
    upcoming: { bg: 'rgba(79,70,229,0.1)',   color: '#4f46e5', text: '🔵 Registration Not Started', border: 'rgba(79,70,229,0.3)' },
    closed:   { bg: 'rgba(220,38,38,0.1)',   color: '#dc2626', text: '🔴 Registration Closed',       border: 'rgba(220,38,38,0.3)' },
  }

  const seatsLeft = event
    ? event.unlimitedSeats ? '∞' : (event.maxSeats - (event.registeredSeats || 0))
    : 0
  const fillPercent = event && !event.unlimitedSeats
    ? Math.min(((event.registeredSeats || 0) / event.maxSeats) * 100, 100) : 0

  if (loading) return (
    <StudentLayout>
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#4f46e5' }}></i>
      </div>
    </StudentLayout>
  )
  {/* OD PDF Download — shown only if coordinator uploaded */}
{event.odPdfURL && (
  <a href={event.odPdfURL} target="_blank" rel="noreferrer"
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 10, width: '100%', padding: '12px',
      background: 'rgba(220,38,38,0.08)',
      border: '1.5px solid rgba(220,38,38,0.25)',
      borderRadius: 12, color: '#dc2626',
      textDecoration: 'none', fontWeight: 700,
      fontSize: '0.88rem', marginBottom: 12,
      transition: 'all 0.2s'
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.14)'}
    onMouseLeave={e => e.currentTarget.style.background = 'rgba(220,38,38,0.08)'}
  >
    <i className="fas fa-file-pdf"></i>
    Download OD PDF
  </a>
)}

  if (!event) return (
    <StudentLayout>
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <h5>Event not found</h5>
        <button onClick={() => navigate(-1)} style={{
          background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
          color: 'white', border: 'none', padding: '10px 24px',
          borderRadius: 10, cursor: 'pointer', marginTop: 16
        }}>Go Back</button>
      </div>
    </StudentLayout>
  )

  return (
    <StudentLayout>

      {/* Success Banner */}
      {success && (
        <div style={{
          background: 'linear-gradient(135deg, #059669, #0891b2)',
          borderRadius: 16, padding: '20px 24px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <i className="fas fa-check" style={{ color: 'white', fontSize: '1.2rem' }}></i>
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
              🎉 Registration Successful!
            </div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem' }}>
              Registration ID: <strong>{regId}</strong> — Save this for future reference!
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">

        {/* Left Column */}
        <div className="col-lg-8">

          {/* Poster */}
          <div style={{
            background: 'white', borderRadius: 20, overflow: 'hidden',
            border: '1px solid #f3f4f6', marginBottom: 20,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            {event.posterURL ? (
              event.posterType === 'pdf' ? (
                <div style={{ padding: 40, textAlign: 'center' }}>
                  <i className="fas fa-file-pdf" style={{ fontSize: '4rem', color: '#dc2626', display: 'block', marginBottom: 16 }}></i>
                  <p style={{ color: '#374151', fontWeight: 600, marginBottom: 16 }}>Event Circular / PDF</p>
                  <a href={event.posterURL} target="_blank" rel="noreferrer" style={{
                    background: 'linear-gradient(135deg,#dc2626,#b91c1c)',
                    color: 'white', padding: '11px 28px', borderRadius: 10,
                    textDecoration: 'none', fontWeight: 600
                  }}>
                    <i className="fas fa-eye me-2"></i>View Circular
                  </a>
                </div>
              ) : (
                <img src={event.posterURL} alt={event.title}
                  style={{ width: '100%', maxHeight: 520, objectFit: 'contain', display: 'block' }} />
              )
            ) : (
              <div style={{
                height: 180,
                background: `linear-gradient(135deg, ${color}, ${color}99)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <i className="fas fa-calendar-alt" style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.3)' }}></i>
              </div>
            )}
          </div>

          {/* Title + Club */}
          <div style={{
            background: 'white', borderRadius: 20, padding: 28,
            border: '1px solid #f3f4f6', marginBottom: 20
          }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              <span style={{
                background: `${color}15`, color,
                padding: '4px 14px', borderRadius: 100,
                fontSize: '0.78rem', fontWeight: 700
              }}>{event.category}</span>
              <span style={{
                background: event.registrationType === 'builtin'
                  ? 'rgba(79,70,229,0.1)' : 'rgba(16,185,129,0.1)',
                color: event.registrationType === 'builtin' ? '#4f46e5' : '#059669',
                padding: '4px 14px', borderRadius: 100,
                fontSize: '0.78rem', fontWeight: 700
              }}>
                {event.registrationType === 'builtin' ? '📋 Built-in Registration' : '🔗 External Registration'}
              </span>
              <span style={{
                background: event.visibility === 'CollegeWide'
                  ? 'rgba(5,150,105,0.1)' : 'rgba(79,70,229,0.1)',
                color: event.visibility === 'CollegeWide' ? '#059669' : '#4f46e5',
                padding: '4px 14px', borderRadius: 100,
                fontSize: '0.78rem', fontWeight: 700
              }}>
                {event.visibility === 'CollegeWide' ? '🌐 College Wide' : '🏢 Dept. Only'}
              </span>
            </div>

            <h2 style={{
              fontFamily: 'Poppins', fontWeight: 800,
              color: '#111827', marginBottom: 10, fontSize: '1.6rem'
            }}>{event.title}</h2>

            {event.clubName && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: `${color}10`, border: `1px solid ${color}25`,
                padding: '6px 16px', borderRadius: 100, marginBottom: 12
              }}>
                <i className="fas fa-users" style={{ color, fontSize: '0.8rem' }}></i>
                <span style={{ color, fontWeight: 700, fontSize: '0.85rem' }}>{event.clubName}</span>
              </div>
            )}

            <div style={{ color: '#6b7280', fontSize: '0.88rem' }}>
              <i className="fas fa-building me-2" style={{ color }}></i>
              {event.department}
            </div>
          </div>

          {/* Description */}
          <div style={{
            background: 'white', borderRadius: 20, padding: 28,
            border: '1px solid #f3f4f6'
          }}>
            <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 16 }}>
              About This Event
            </h5>
            <p style={{
              color: '#4b5563', lineHeight: 1.85,
              fontSize: '0.95rem', whiteSpace: 'pre-line', margin: 0
            }}>
              {event.description || 'No description provided.'}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-4">
          <div style={{
            background: 'white', borderRadius: 20, padding: 24,
            border: '1px solid #f3f4f6', position: 'sticky', top: 90,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>

            {/* Registration Status Badge */}
            {regStatus && (
              <div style={{
                padding: '12px 16px', borderRadius: 12, marginBottom: 20,
                background: regStatusStyle[regStatus].bg,
                border: `1px solid ${regStatusStyle[regStatus].border}`,
                color: regStatusStyle[regStatus].color,
                fontWeight: 700, fontSize: '0.88rem', textAlign: 'center'
              }}>
                {regStatusStyle[regStatus].text}
              </div>
            )}

            {/* Event Info */}
            <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 16 }}>
              Event Info
            </h5>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {[
                { icon: 'fas fa-calendar-alt', label: 'Event Date', value: event.eventDate, color: '#f59e0b' },
                { icon: 'fas fa-clock', label: 'Event Time', value: formatTime(event.eventTime), color: '#4f46e5' },
                { icon: 'fas fa-map-marker-alt', label: 'Venue', value: event.venue, color: '#dc2626' },
                { icon: 'fas fa-users', label: 'Seats', value: event.unlimitedSeats ? 'Unlimited' : `${event.registeredSeats || 0} / ${event.maxSeats}`, color: '#059669' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', borderRadius: 10,
                  background: `${item.color}08`, border: `1px solid ${item.color}20`
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: `${item.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <i className={item.icon} style={{ color: item.color, fontSize: '0.8rem' }}></i>
                  </div>
                  <div>
                    <div style={{ color: '#9ca3af', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                      {item.label}
                    </div>
                    <div style={{ color: '#111827', fontWeight: 600, fontSize: '0.88rem' }}>
                      {item.value || '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Seat Progress (built-in only) */}
            {event.registrationType === 'builtin' && !event.unlimitedSeats && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Seats Filled</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color }}>
                    {fillPercent.toFixed(0)}%
                  </span>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                  <div style={{
                    width: `${fillPercent}%`, height: '100%',
                    background: `linear-gradient(135deg, ${color}, #7c3aed)`,
                    borderRadius: 6, transition: 'width 0.5s ease'
                  }}></div>
                </div>
                <div style={{
                  color: seatsLeft === 0 ? '#dc2626' : '#059669',
                  fontSize: '0.78rem', marginTop: 5, fontWeight: 600
                }}>
                  {seatsLeft === 0 ? 'Fully Booked' : `${seatsLeft} seats remaining`}
                </div>
              </div>
            )}

            {/* Registration Period */}
            {event.regStartDate && (
              <div style={{
                background: 'rgba(79,70,229,0.05)',
                border: '1px solid rgba(79,70,229,0.15)',
                borderRadius: 12, padding: '14px 16px', marginBottom: 20
              }}>
                <div style={{
                  color: '#4f46e5', fontWeight: 700, fontSize: '0.82rem',
                  marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <i className="fas fa-clipboard-list"></i> Registration Period
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#6b7280' }}>Opens</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>
                      {event.regStartDate} {formatTime(event.regStartTime)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#6b7280' }}>Closes</span>
                    <span style={{ fontWeight: 600, color: '#dc2626' }}>
                      {event.regEndDate} {formatTime(event.regEndTime)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── BUILT-IN REGISTRATION BUTTON ── */}
            {event.registrationType === 'builtin' && (
              alreadyRegistered ? (
                <div style={{
                  background: 'rgba(5,150,105,0.08)',
                  border: '1px solid rgba(5,150,105,0.2)',
                  borderRadius: 14, padding: '20px',
                  textAlign: 'center', marginBottom: 12
                }}>
                  <i className="fas fa-check-circle" style={{ color: '#059669', fontSize: '2rem', marginBottom: 10, display: 'block' }}></i>
                  <div style={{ fontWeight: 700, color: '#059669', marginBottom: 6 }}>Already Registered!</div>
                  {regId && (
                    <>
                      <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: 6 }}>Your Registration ID</div>
                      <div style={{
                        background: '#f0fdf4', border: '1px dashed #059669',
                        borderRadius: 8, padding: '8px 12px',
                        fontWeight: 800, color: '#059669',
                        fontSize: '0.95rem', letterSpacing: '1px'
                      }}>{regId}</div>
                    </>
                  )}
                </div>
              ) : seatsLeft === 0 && !event.unlimitedSeats ? (
                <div style={{
                  background: 'rgba(220,38,38,0.08)',
                  border: '1px solid rgba(220,38,38,0.2)',
                  borderRadius: 14, padding: '16px', textAlign: 'center', marginBottom: 12
                }}>
                  <i className="fas fa-times-circle" style={{ color: '#dc2626', fontSize: '1.5rem', marginBottom: 8, display: 'block' }}></i>
                  <div style={{ fontWeight: 700, color: '#dc2626' }}>Event is Fully Booked</div>
                </div>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  disabled={regStatus === 'closed' || regStatus === 'upcoming'}
                  style={{
                    width: '100%', padding: '14px',
                    background: regStatus === 'closed' || regStatus === 'upcoming'
                      ? '#e5e7eb'
                      : `linear-gradient(135deg, ${color}, #7c3aed)`,
                    color: regStatus === 'closed' || regStatus === 'upcoming' ? '#9ca3af' : 'white',
                    border: 'none', borderRadius: 14,
                    fontWeight: 700, fontSize: '1rem',
                    cursor: regStatus === 'closed' || regStatus === 'upcoming' ? 'not-allowed' : 'pointer',
                    marginBottom: 12, transition: 'all 0.3s',
                    boxShadow: regStatus === 'open' ? `0 4px 15px ${color}40` : 'none'
                  }}>
                  {regStatus === 'closed'
                    ? <><i className="fas fa-lock me-2"></i>Registration Closed</>
                    : regStatus === 'upcoming'
                    ? <><i className="fas fa-hourglass-start me-2"></i>Registration Not Started</>
                    : <><i className="fas fa-clipboard-check me-2"></i>Register Now</>
                  }
                </button>
              )
            )}

            {/* ── EXTERNAL LINK BUTTON ── */}
            {event.registrationType === 'external' && event.registrationLink && (
              <a href={event.registrationLink} target="_blank" rel="noreferrer"
                style={{
                  display: 'block', width: '100%', padding: '14px',
                  background: regStatus === 'closed'
                    ? '#e5e7eb'
                    : `linear-gradient(135deg, ${color}, #7c3aed)`,
                  color: regStatus === 'closed' ? '#9ca3af' : 'white',
                  border: 'none', borderRadius: 14,
                  fontWeight: 700, fontSize: '1rem',
                  textAlign: 'center', textDecoration: 'none',
                  pointerEvents: regStatus === 'closed' ? 'none' : 'auto',
                  boxShadow: regStatus === 'closed' ? 'none' : `0 4px 15px ${color}40`,
                  marginBottom: 12, transition: 'all 0.3s'
                }}>
                {regStatus === 'closed'
                  ? <><i className="fas fa-lock me-2"></i>Registration Closed</>
                  : <><i className="fas fa-external-link-alt me-2"></i>Register via External Form</>
                }
              </a>
            )}

            <button onClick={() => navigate(-1)} style={{
              width: '100%', padding: '12px',
              background: 'transparent', border: '1.5px solid #e5e7eb',
              borderRadius: 12, color: '#6b7280',
              fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'
            }}>
              <i className="fas fa-arrow-left me-2"></i>Go Back
            </button>
          </div>
        </div>
      </div>

      {/* ── BUILT-IN REGISTRATION MODAL ── */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 20
        }} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div style={{
            background: 'white', borderRadius: 20, padding: 36,
            width: '100%', maxWidth: 500,
            maxHeight: '90vh', overflowY: 'auto',
            position: 'relative',
            animation: 'modalIn 0.3s ease'
          }}>
            {/* Modal Header */}
            <button onClick={() => setShowModal(false)} style={{
              position: 'absolute', top: 16, right: 16,
              background: '#f3f4f6', border: 'none',
              borderRadius: 8, width: 32, height: 32,
              cursor: 'pointer', color: '#6b7280', fontSize: '0.9rem'
            }}>✕</button>

            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: `linear-gradient(135deg, ${color}, #7c3aed)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16
            }}>
              <i className="fas fa-clipboard-check" style={{ color: 'white', fontSize: '1.2rem' }}></i>
            </div>

            <h4 style={{ fontFamily: 'Poppins', fontWeight: 800, marginBottom: 4, color: '#111827' }}>
              Register for Event
            </h4>
            <p style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: 24 }}>
              {event.title}
            </p>

            <form onSubmit={handleBuiltinRegister}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Auto-filled fields */}
                {[
                  { label: 'Full Name', value: userProfile?.name, icon: 'fas fa-user' },
                  { label: 'Email', value: userProfile?.email, icon: 'fas fa-envelope' },
                  { label: 'Department', value: userProfile?.department, icon: 'fas fa-building' },
                  { label: 'Phone', value: userProfile?.phone, icon: 'fas fa-phone' },
                ].map(field => (
                  <div key={field.label}>
                    <label style={{ fontWeight: 600, fontSize: '0.82rem', color: '#374151', display: 'block', marginBottom: 6 }}>
                      {field.label}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <i className={field.icon} style={{
                        position: 'absolute', left: 12, top: '50%',
                        transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '0.85rem'
                      }}></i>
                      <input type="text" value={field.value || ''} disabled style={{
                        width: '100%', padding: '10px 12px 10px 36px',
                        borderRadius: 10, border: '1.5px solid #e5e7eb',
                        background: '#f9fafb', color: '#6b7280',
                        fontSize: '0.88rem', cursor: 'not-allowed'
                      }} />
                      <i className="fas fa-lock" style={{
                        position: 'absolute', right: 12, top: '50%',
                        transform: 'translateY(-50%)', color: '#d1d5db', fontSize: '0.75rem'
                      }}></i>
                    </div>
                  </div>
                ))}

                {/* Roll Number — manual entry */}
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.82rem', color: '#374151', display: 'block', marginBottom: 6 }}>
                    Roll Number *
                  </label>
                  <input type="text" required
                    placeholder="e.g. 22CS001"
                    value={regForm.rollNumber}
                    onChange={e => setRegForm({ ...regForm, rollNumber: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px',
                      borderRadius: 10, border: '1.5px solid #e5e7eb',
                      outline: 'none', fontSize: '0.88rem', color: '#111827'
                    }}
                    onFocus={e => e.target.style.borderColor = color}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                {/* Year — manual entry */}
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.82rem', color: '#374151', display: 'block', marginBottom: 6 }}>
                    Year *
                  </label>
                  <select required
                    value={regForm.year}
                    onChange={e => setRegForm({ ...regForm, year: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px',
                      borderRadius: 10, border: '1.5px solid #e5e7eb',
                      outline: 'none', fontSize: '0.88rem',
                      color: '#111827', appearance: 'none', background: 'white'
                    }}
                    onFocus={e => e.target.style.borderColor = color}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                {/* Info note */}
                <div style={{
                  background: `${color}08`,
                  border: `1px solid ${color}20`,
                  borderRadius: 10, padding: '12px 14px',
                  fontSize: '0.8rem', color: '#6b7280',
                  display: 'flex', gap: 8, alignItems: 'flex-start'
                }}>
                  <i className="fas fa-info-circle" style={{ color, marginTop: 2 }}></i>
                  <span>Name, email, department and phone are auto-filled from your profile. Only Roll Number and Year need to be entered.</span>
                </div>

                {/* Submit */}
                <button type="submit" disabled={registering} style={{
                  width: '100%', padding: '13px',
                  background: `linear-gradient(135deg, ${color}, #7c3aed)`,
                  color: 'white', border: 'none', borderRadius: 12,
                  fontWeight: 700, fontSize: '1rem',
                  cursor: registering ? 'not-allowed' : 'pointer',
                  boxShadow: `0 4px 15px ${color}40`,
                  opacity: registering ? 0.8 : 1
                }}>
                  {registering
                    ? <><i className="fas fa-spinner fa-spin me-2"></i>Registering...</>
                    : <><i className="fas fa-check me-2"></i>Confirm Registration</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </StudentLayout>
  )
}
