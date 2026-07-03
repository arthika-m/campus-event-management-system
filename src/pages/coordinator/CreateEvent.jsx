import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import CoordinatorLayout from '../../layouts/CoordinatorLayout'
import { useNavigate } from 'react-router-dom'

export default function CreateEvent() {
  const { userProfile } = useAuth()
  const navigate = useNavigate()
// Update initial form state — add posterURL and posterType, remove old fields:
const [form, setForm] = useState({
  title: '', description: '', category: '',
  clubName: '', venue: '',
  regStartDate: '', regStartTime: '',
  regEndDate: '', regEndTime: '',
  eventDate: '', eventTime: '',
  maxSeats: '', unlimitedSeats: false,
  registrationLink: '',
  posterURL: '',
  posterType: 'image',
  visibility: 'DepartmentOnly'
})
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const categories = [
    'Technical', 'Workshop', 'Seminar', 'Sports',
    'Cultural', 'Placement', 'NSS', 'NCC', 'YRC'
  ]

  const convertGoogleDriveLink = (url) => {
  if (!url) return ''

  // Already converted
  if (url.includes('uc?id=')) return url

  // Convert Google Drive sharing link
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)

  if (match) {
    return `https://drive.google.com/uc?id=${match[1]}`
  }

  return url
}

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPosterFile(file)
    if (file.type.startsWith('image/')) setPosterPreview(URL.createObjectURL(file))
    else setPosterPreview('pdf')
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  try {
    await addDoc(collection(db, 'events'), {
      title: form.title,
      description: form.description,
      department: userProfile.department,
      category: form.category,
      clubName: form.clubName,
      venue: form.venue,
      regStartDate: form.regStartDate,
      regStartTime: form.regStartTime,
      regEndDate: form.regEndDate,
      regEndTime: form.regEndTime,
      eventDate: form.eventDate,
      eventTime: form.eventTime,
      maxSeats: form.unlimitedSeats ? 'Unlimited' : parseInt(form.maxSeats),
      unlimitedSeats: form.unlimitedSeats,
      registrationLink: form.registrationLink,
      posterURL: form.posterURL,
      posterType: form.posterType,
      visibility: form.visibility,
      createdBy: userProfile.email,
      createdAt: new Date().toISOString()
    })
    setMsg({ type: 'success', text: 'Event published successfully!' })
    setTimeout(() => navigate('/coordinator/manage-events'), 1500)
  } catch (err) {
    console.error(err)
    setMsg({ type: 'error', text: 'Failed to publish. Try again.' })
  }
  setLoading(false)
}
  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '1.5px solid #e5e7eb', outline: 'none',
    fontSize: '0.9rem', color: '#111827',
    background: 'white', transition: 'border-color 0.2s'
  }
  const labelStyle = {
    fontWeight: 600, fontSize: '0.82rem',
    color: '#374151', display: 'block', marginBottom: 6
  }
  const focus = e => e.target.style.borderColor = '#f59e0b'
  const blur = e => e.target.style.borderColor = '#e5e7eb'

const clearForm = () => {
  setForm({
    title: '', description: '', category: '',
    clubName: '', venue: '',
    regStartDate: '', regStartTime: '',
    regEndDate: '', regEndTime: '',
    eventDate: '', eventTime: '',
    maxSeats: '', unlimitedSeats: false,
    registrationLink: '',
    posterURL: '',
    posterType: 'image',
    visibility: 'DepartmentOnly'
  })
  setMsg({ type: '', text: '' })
}
  return (
    <CoordinatorLayout>
      <div style={{
        background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
        borderRadius: 20, padding: '24px 28px', marginBottom: 28
      }}>
        <h2 style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 800, margin: 0 }}>
          Create New Event
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', margin: '6px 0 0', fontSize: '0.88rem' }}>
          <i className="fas fa-building me-2"></i>{userProfile?.department}
        </p>
      </div>

      <div style={{
        background: 'white', borderRadius: 20, padding: 32,
        border: '1px solid #f3f4f6', boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
      }}>
        {msg.text && (
          <div style={{
            padding: '12px 16px', borderRadius: 10, marginBottom: 20,
            background: msg.type === 'success' ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.1)',
            border: `1px solid ${msg.type === 'success' ? 'rgba(5,150,105,0.3)' : 'rgba(220,38,38,0.3)'}`,
            color: msg.type === 'success' ? '#059669' : '#dc2626',
            fontWeight: 600, fontSize: '0.88rem',
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <i className={`fas fa-${msg.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">

{/* Poster / Circular */}
<div className="col-12">
  <label style={labelStyle}>
    Event Poster / Circular
    <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: 8 }}>
      (Image URL or PDF Link)
    </span>
  </label>

  {/* Type Toggle */}
  <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
    {['image', 'pdf'].map(type => (
      <button key={type} type="button"
        onClick={() => setForm({ ...form, posterType: type, posterURL: '' })}
        style={{
          padding: '7px 18px', borderRadius: 8, cursor: 'pointer',
          fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.2s',
          border: form.posterType === type ? '1.5px solid #f59e0b' : '1.5px solid #e5e7eb',
          background: form.posterType === type ? 'rgba(245,158,11,0.08)' : 'white',
          color: form.posterType === type ? '#f59e0b' : '#6b7280'
        }}>
        {type === 'image' ? '🖼 Image URL' : '📄 PDF Link'}
      </button>
    ))}
  </div>

  <div style={{ position: 'relative' }}>
    <i className={`fas fa-${form.posterType === 'pdf' ? 'file-pdf' : 'image'}`} style={{
      position: 'absolute', left: 14, top: '50%',
      transform: 'translateY(-50%)', color: '#9ca3af'
    }}></i>
    <input
      type="url"
      placeholder={
        form.posterType === 'pdf'
          ? 'https://drive.google.com/file/d/... (PDF link)'
          : 'Paste Google Drive image link'
      }
      value={form.posterURL}
      onChange={(e) =>
  setForm({
    ...form,
    posterURL:
      form.posterType === 'image'
        ? convertGoogleDriveLink(e.target.value)
        : e.target.value
  })
}
      style={{ ...inputStyle, paddingLeft: 40 }}
      onFocus={focus} onBlur={blur}
    />
  </div>

  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 6 }}>
    <i className="fas fa-info-circle me-1"></i>
    {form.posterType === 'pdf'
      ? 'Upload PDF to Google Drive → Share → Copy link → paste here.'
      : 'Upload image to Google Drive → Share → Get link and paste here'}
  </div>

  {/* Live Preview */}
  {form.posterURL && form.posterType === 'image' && (
    <div style={{ marginTop: 12 }}>
      <img src={form.posterURL} alt="Poster preview"
        onError={e => { e.target.style.display = 'none' }}
        style={{
          maxHeight: 220, maxWidth: '100%',
          borderRadius: 10, objectFit: 'contain',
          border: '1px solid #f3f4f6'
        }} />
    </div>
  )}

  {form.posterURL && form.posterType === 'pdf' && (
    <div style={{
      marginTop: 12, padding: '12px 16px', borderRadius: 10,
      background: 'rgba(220,38,38,0.06)',
      border: '1px solid rgba(220,38,38,0.15)',
      display: 'flex', alignItems: 'center', gap: 10
    }}>
      <i className="fas fa-file-pdf" style={{ color: '#dc2626', fontSize: '1.2rem' }}></i>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827' }}>PDF Circular linked</div>
        <a href={form.posterURL} target="_blank" rel="noreferrer"
          style={{ fontSize: '0.78rem', color: '#dc2626' }}>
          Click to verify link ↗
        </a>
      </div>
    </div>
  )}
</div>

            {/* Title */}
            <div className="col-12">
              <label style={labelStyle}>Event Title *</label>
              <input type="text" required placeholder="e.g. National Level Hackathon 2026"
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                style={inputStyle} onFocus={focus} onBlur={blur} />
            </div>

            {/* Club Name + Category */}
            <div className="col-md-6">
              <label style={labelStyle}>Organizing Club *</label>
              <input type="text" required placeholder="e.g. CSE Coding Club"
                value={form.clubName} onChange={e => setForm({ ...form, clubName: e.target.value })}
                style={inputStyle} onFocus={focus} onBlur={blur} />
            </div>

            <div className="col-md-6">
              <label style={labelStyle}>Category *</label>
              <select required value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ ...inputStyle, appearance: 'none' }} onFocus={focus} onBlur={blur}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Description */}
            <div className="col-12">
              <label style={labelStyle}>Brief Description *</label>
              <textarea required rows={4}
                placeholder="Write a brief message about the event, its benefits, who should attend..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
            </div>

            {/* Venue */}
            <div className="col-12">
              <label style={labelStyle}>Venue *</label>
              <input type="text" required placeholder="e.g. Main Auditorium, Block A"
                value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })}
                style={inputStyle} onFocus={focus} onBlur={blur} />
            </div>

            {/* Registration Period */}
            <div className="col-12">
              <div style={{
                background: 'rgba(79,70,229,0.04)',
                border: '1.5px solid rgba(79,70,229,0.2)',
                borderRadius: 14, padding: '20px 20px 16px'
              }}>
                <div style={{
                  fontWeight: 700, color: '#4f46e5', fontSize: '0.88rem',
                  marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8
                }}>
                  <i className="fas fa-clipboard-list"></i> Registration Period
                </div>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label style={labelStyle}>Start Date *</label>
                    <input type="date" required value={form.regStartDate}
                      onChange={e => setForm({ ...form, regStartDate: e.target.value })}
                      style={inputStyle} onFocus={focus} onBlur={blur} />
                  </div>
                  <div className="col-md-3">
                    <label style={labelStyle}>Start Time *</label>
                    <input type="time" required value={form.regStartTime}
                      onChange={e => setForm({ ...form, regStartTime: e.target.value })}
                      style={inputStyle} onFocus={focus} onBlur={blur} />
                  </div>
                  <div className="col-md-3">
                    <label style={labelStyle}>End Date *</label>
                    <input type="date" required value={form.regEndDate}
                      onChange={e => setForm({ ...form, regEndDate: e.target.value })}
                      style={inputStyle} onFocus={focus} onBlur={blur} />
                  </div>
                  <div className="col-md-3">
                    <label style={labelStyle}>End Time *</label>
                    <input type="time" required value={form.regEndTime}
                      onChange={e => setForm({ ...form, regEndTime: e.target.value })}
                      style={inputStyle} onFocus={focus} onBlur={blur} />
                  </div>
                </div>
              </div>
            </div>

            {/* Event Date & Time */}
            <div className="col-12">
              <div style={{
                background: 'rgba(245,158,11,0.04)',
                border: '1.5px solid rgba(245,158,11,0.25)',
                borderRadius: 14, padding: '20px 20px 16px'
              }}>
                <div style={{
                  fontWeight: 700, color: '#f59e0b', fontSize: '0.88rem',
                  marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8
                }}>
                  <i className="fas fa-calendar-alt"></i> Event Date & Time
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label style={labelStyle}>Event Date *</label>
                    <input type="date" required value={form.eventDate}
                      onChange={e => setForm({ ...form, eventDate: e.target.value })}
                      style={inputStyle} onFocus={focus} onBlur={blur} />
                  </div>
                  <div className="col-md-6">
                    <label style={labelStyle}>Event Time *</label>
                    <input type="time" required value={form.eventTime}
                      onChange={e => setForm({ ...form, eventTime: e.target.value })}
                      style={inputStyle} onFocus={focus} onBlur={blur} />
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Link */}
            <div className="col-12">
              <label style={labelStyle}>
                Registration Link *
                <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: 8 }}>
                  (Google Form or any external link)
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-link" style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', color: '#9ca3af'
                }}></i>
                <input type="url" required placeholder="https://forms.google.com/..."
                  value={form.registrationLink}
                  onChange={e => setForm({ ...form, registrationLink: e.target.value })}
                  style={{ ...inputStyle, paddingLeft: 40 }} onFocus={focus} onBlur={blur} />
              </div>
            </div>

            {/* Max Seats */}
            <div className="col-md-6">
              <label style={labelStyle}>Maximum Seats</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <input type="checkbox" id="unlimitedSeats"
                  checked={form.unlimitedSeats}
                  onChange={e => setForm({ ...form, unlimitedSeats: e.target.checked, maxSeats: '' })}
                  style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#f59e0b' }} />
                <label htmlFor="unlimitedSeats" style={{
                  fontWeight: 600, fontSize: '0.85rem',
                  color: '#374151', cursor: 'pointer', margin: 0
                }}>
                  Unlimited Seats
                </label>
              </div>
              {!form.unlimitedSeats && (
                <input type="number" min="1" placeholder="e.g. 100"
                  value={form.maxSeats}
                  onChange={e => setForm({ ...form, maxSeats: e.target.value })}
                  style={inputStyle} onFocus={focus} onBlur={blur} />
              )}
              {form.unlimitedSeats && (
                <div style={{
                  padding: '11px 14px', borderRadius: 10,
                  background: 'rgba(245,158,11,0.08)',
                  border: '1.5px solid rgba(245,158,11,0.25)',
                  color: '#f59e0b', fontWeight: 600, fontSize: '0.88rem'
                }}>
                  <i className="fas fa-infinity me-2"></i>No seat limit
                </div>
              )}
            </div>

            {/* Department */}
            <div className="col-md-6">
              <label style={labelStyle}>Department</label>
              <input type="text" value={userProfile?.department || ''} disabled
                style={{ ...inputStyle, background: '#fafafa', color: '#9ca3af', cursor: 'not-allowed' }} />
            </div>

            {/* Visibility */}
            <div className="col-12">
              <label style={labelStyle}>Visibility *</label>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[
                  { value: 'DepartmentOnly', label: '🏢 Department Only', desc: 'Visible only to your department students' },
                  { value: 'CollegeWide', label: '🌐 College Wide', desc: 'Visible to all students across TCE' }
                ].map(opt => (
                  <div key={opt.value} onClick={() => setForm({ ...form, visibility: opt.value })}
                    style={{
                      flex: 1, minWidth: 200, padding: '16px 20px',
                      borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                      border: form.visibility === opt.value ? '2px solid #f59e0b' : '2px solid #e5e7eb',
                      background: form.visibility === opt.value ? 'rgba(245,158,11,0.05)' : 'white'
                    }}>
                    <div style={{ fontWeight: 700, color: '#111827', marginBottom: 4, fontSize: '0.9rem' }}>
                      {opt.label}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="col-12" style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" disabled={loading} style={{
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  color: 'white', border: 'none', padding: '13px 32px',
                  borderRadius: 12, fontWeight: 700, fontSize: '0.95rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 15px rgba(245,158,11,0.35)'
                }}>
                  {loading
                    ? <><i className="fas fa-spinner fa-spin me-2"></i>Publishing...</>
                    : <><i className="fas fa-rocket me-2"></i>Publish Event</>
                  }
                </button>
                <button type="button" onClick={clearForm} style={{
                  background: 'transparent', border: '1.5px solid #e5e7eb',
                  color: '#6b7280', padding: '13px 24px',
                  borderRadius: 12, fontWeight: 600, cursor: 'pointer'
                }}>Clear Form</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </CoordinatorLayout>
  )
}