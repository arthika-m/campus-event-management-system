import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import CoordinatorLayout from '../../layouts/CoordinatorLayout'

export default function CoordinatorProfile() {
  const { userProfile, currentUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '',
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: form.name, phone: form.phone
      })
      setMsg({ type: 'success', text: 'Profile updated!' })
      setEditing(false)
      setTimeout(() => setMsg({ type: '', text: '' }), 3000)
    } catch {
      setMsg({ type: 'error', text: 'Update failed.' })
    }
    setSaving(false)
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '1.5px solid #e5e7eb', outline: 'none',
    fontSize: '0.9rem', color: '#111827', transition: 'border-color 0.2s'
  }

  return (
    <CoordinatorLayout>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
        borderRadius: 20, padding: 28, marginBottom: 28
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', color: 'white', fontWeight: 800
          }}>
            {userProfile?.name?.charAt(0) || 'C'}
          </div>
          <div>
            <h2 style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 800, margin: 0 }}>
              {userProfile?.name}
            </h2>
            <div style={{ color: '#f59e0b', fontSize: '0.88rem', marginTop: 4 }}>
              <i className="fas fa-chalkboard-teacher me-2"></i>Event Coordinator
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: 4 }}>
              <i className="fas fa-building me-2"></i>{userProfile?.department}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div style={{
            background: 'white', borderRadius: 20, padding: 28,
            border: '1px solid #f3f4f6',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, margin: 0 }}>
                Profile Information
              </h5>
              {!editing && (
                <button onClick={() => setEditing(true)} style={{
                  background: 'rgba(245,158,11,0.1)', color: '#f59e0b',
                  border: 'none', padding: '8px 16px', borderRadius: 8,
                  fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer'
                }}>
                  <i className="fas fa-edit me-1"></i>Edit
                </button>
              )}
            </div>

            {msg.text && (
              <div style={{
                padding: '12px 16px', borderRadius: 10, marginBottom: 16,
                background: msg.type === 'success' ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.1)',
                color: msg.type === 'success' ? '#059669' : '#dc2626',
                fontWeight: 600, fontSize: '0.88rem'
              }}>{msg.text}</div>
            )}

            <div className="row g-3">
              <div className="col-12">
                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: 6 }}>Full Name</label>
                <input type="text" value={form.name} disabled={!editing}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ ...inputStyle, background: editing ? 'white' : '#fafafa' }}
                  onFocus={e => { if (editing) e.target.style.borderColor = '#f59e0b' }}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div className="col-12">
                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: 6 }}>Email</label>
                <input type="email" value={userProfile?.email || ''} disabled
                  style={{ ...inputStyle, background: '#fafafa', color: '#9ca3af', cursor: 'not-allowed' }}
                />
              </div>
              <div className="col-md-6">
                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: 6 }}>Department</label>
                <input type="text" value={userProfile?.department || ''} disabled
                  style={{ ...inputStyle, background: '#fafafa', color: '#9ca3af', cursor: 'not-allowed' }}
                />
              </div>
              <div className="col-md-6">
                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: 6 }}>Phone</label>
                <input type="tel" value={form.phone} disabled={!editing}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  style={{ ...inputStyle, background: editing ? 'white' : '#fafafa' }}
                  onFocus={e => { if (editing) e.target.style.borderColor = '#f59e0b' }}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              {editing && (
                <div className="col-12">
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={handleSave} disabled={saving} style={{
                      background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                      color: 'white', border: 'none', padding: '11px 24px',
                      borderRadius: 10, fontWeight: 700, cursor: 'pointer'
                    }}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={() => setEditing(false)} style={{
                      background: 'transparent', border: '1.5px solid #e5e7eb',
                      color: '#6b7280', padding: '11px 20px',
                      borderRadius: 10, fontWeight: 600, cursor: 'pointer'
                    }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
            borderRadius: 20, padding: 24
          }}>
            <h6 style={{ color: 'white', fontWeight: 700, marginBottom: 16 }}>Account Info</h6>
            {[
              { icon: 'fas fa-shield-alt', label: 'Role', value: 'Event Coordinator', color: '#f59e0b' },
              { icon: 'fas fa-building', label: 'Department', value: userProfile?.department, color: '#4f46e5' },
              { icon: 'fas fa-envelope', label: 'Email', value: userProfile?.email, color: '#0891b2' },
              { icon: 'fas fa-phone', label: 'Phone', value: userProfile?.phone, color: '#059669' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.06)', marginBottom: 8
              }}>
                <i className={item.icon} style={{ color: item.color, width: 16 }}></i>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>{item.label}</div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CoordinatorLayout>
  )
}