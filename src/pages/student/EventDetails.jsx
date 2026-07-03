import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import StudentLayout from '../../layouts/StudentLayout'

const categoryColors = {
  Technical: '#4f46e5', Workshop: '#7c3aed', Seminar: '#0891b2',
  Sports: '#059669', Cultural: '#d97706', Placement: '#dc2626',
  NSS: '#16a34a', NCC: '#b45309', YRC: '#0891b2'
}

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchEvent() }, [id])

  const fetchEvent = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'events', id))
      if (docSnap.exists()) setEvent({ id: docSnap.id, ...docSnap.data() })
    } catch (err) { console.error(err) }
    setLoading(false)
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
    open: { bg: 'rgba(5,150,105,0.1)', color: '#059669', text: '🟢 Registration Open', border: 'rgba(5,150,105,0.3)' },
    upcoming: { bg: 'rgba(79,70,229,0.1)', color: '#4f46e5', text: '🔵 Registration Not Started', border: 'rgba(79,70,229,0.3)' },
    closed: { bg: 'rgba(220,38,38,0.1)', color: '#dc2626', text: '🔴 Registration Closed', border: 'rgba(220,38,38,0.3)' },
  }

  console.log("Poster URL:", event?.posterURL)

  if (loading) return (
    <StudentLayout>
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#4f46e5' }}></i>
      </div>
    </StudentLayout>
  )

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
                  <i className="fas fa-file-pdf" style={{
                    fontSize: '4rem', color: '#dc2626', display: 'block', marginBottom: 16
                  }}></i>
                  <p style={{ color: '#374151', fontWeight: 600, marginBottom: 16 }}>
                    Event Circular / PDF
                  </p>
                  <a href={event.posterURL} target="_blank" rel="noreferrer" style={{
                    background: 'linear-gradient(135deg,#dc2626,#b91c1c)',
                    color: 'white', padding: '11px 28px', borderRadius: 10,
                    textDecoration: 'none', fontWeight: 600
                  }}>
                    <i className="fas fa-eye me-2"></i>View Circular
                  </a>
                </div>
              ) : (
                <img
  src={event.posterURL}
  alt={event.title}
  onLoad={() => console.log("Image Loaded")}
  onError={(e) => {
    console.log("Image Failed");
    console.log(e.target.src);
  }}
  style={{
    width: '100%',
    maxHeight: 520,
    objectFit: 'contain',
    display: 'block'
  }}
/>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {[
                { icon: 'fas fa-calendar-alt', label: 'Event Date', value: event.eventDate, color: '#f59e0b' },
                { icon: 'fas fa-clock', label: 'Event Time', value: formatTime(event.eventTime), color: '#4f46e5' },
                { icon: 'fas fa-map-marker-alt', label: 'Venue', value: event.venue, color: '#dc2626' },
                { icon: 'fas fa-users', label: 'Seats', value: event.unlimitedSeats ? 'Unlimited' : event.maxSeats, color: '#059669' },
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

            {/* Register Button */}
            {event.registrationLink && (
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
                  : <><i className="fas fa-external-link-alt me-2"></i>Register Now</>
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
    </StudentLayout>
  )
}