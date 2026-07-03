import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { db, auth } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import StudentLayout from '../../layouts/StudentLayout'

const departments = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Mechatronics Engineering',
  'Aeronautical Engineering',
]

export default function Profile() {
  const { userProfile, currentUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '',
    department: userProfile?.department || '',
  })
  const [pwForm, setPwForm] = useState({
    current: '', newPw: '', confirm: ''
  })
  const [saving, setSaving] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' })

  const showMsg = (type, text) => {
    setMsg({ type, text })
    setTimeout(() => setMsg({ type: '', text: '' }), 3000)
  }

  const showPwMsg = (type, text) => {
    setPwMsg({ type, text })
    setTimeout(() => setPwMsg({ type: '', text: '' }), 3000)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: form.name,
        phone: form.phone,
        department: form.department,
      })
      showMsg('success', 'Profile updated successfully!')
      setEditing(false)
    } catch (err) {
      showMsg('error', 'Failed to update profile.')
    }
    setSaving(false)
  }

  const handlePasswordChange = async () => {
    if (pwForm.newPw !== pwForm.confirm) {
      showPwMsg('error', 'New passwords do not match.')
      return
    }
    if (pwForm.newPw.length < 6) {
      showPwMsg('error', 'Password must be at least 6 characters.')
      return
    }
    setPwSaving(true)
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, pwForm.current)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, pwForm.newPw)
      showPwMsg('success', 'Password changed successfully!')
      setPwForm({ current: '', newPw: '', confirm: '' })
    } catch (err) {
      showPwMsg('error', 'Current password is incorrect.')
    }
    setPwSaving(false)
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '1.5px solid #e5e7eb', outline: 'none',
    fontSize: '0.9rem', transition: 'border-color 0.2s',
    background: 'white', color: '#111827'
  }

  const labelStyle = {
    fontWeight: 600, fontSize: '0.82rem',
    color: '#374151', display: 'block', marginBottom: 6
  }

  const Alert = ({ msg }) => msg.text ? (
    <div style={{
      padding: '12px 16px', borderRadius: 10, marginBottom: 16,
      background: msg.type === 'success' ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.1)',
      border: `1px solid ${msg.type === 'success' ? 'rgba(5,150,105,0.3)' : 'rgba(220,38,38,0.3)'}`,
      color: msg.type === 'success' ? '#059669' : '#dc2626',
      fontSize: '0.88rem', fontWeight: 600,
      display: 'flex', alignItems: 'center', gap: 8
    }}>
      <i className={`fas fa-${msg.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
      {msg.text}
    </div>
  ) : null

  return (
    <StudentLayout>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f0c29, #302b63)',
        borderRadius: 20, padding: '28px', marginBottom: 28
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', color: 'white', fontWeight: 800, flexShrink: 0
          }}>
            {userProfile?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h2 style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 800, margin: 0 }}>
              {userProfile?.name}
            </h2>
            <div style={{ color: '#a5b4fc', fontSize: '0.88rem', marginTop: 4 }}>
              <i className="fas fa-building me-2"></i>{userProfile?.department}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: 4 }}>
              <i className="fas fa-envelope me-2"></i>{userProfile?.email}
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span style={{
              background: 'rgba(79,70,229,0.2)',
              border: '1px solid rgba(79,70,229,0.4)',
              color: '#a5b4fc', padding: '6px 16px',
              borderRadius: 100, fontSize: '0.82rem', fontWeight: 600
            }}>
              <i className="fas fa-user-graduate me-2"></i>Student
            </span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Edit Profile */}
        <div className="col-lg-7">
          <div style={{
            background: 'white', borderRadius: 20, padding: 28,
            border: '1px solid #f3f4f6',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 24
            }}>
              <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, margin: 0 }}>
                <i className="fas fa-user-edit me-2" style={{ color: '#4f46e5' }}></i>
                Profile Information
              </h5>
              {!editing && (
                <button onClick={() => setEditing(true)} style={{
                  background: 'rgba(79,70,229,0.1)', color: '#4f46e5',
                  border: 'none', padding: '8px 16px', borderRadius: 8,
                  fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer'
                }}>
                  <i className="fas fa-edit me-1"></i> Edit
                </button>
              )}
            </div>

            <Alert msg={msg} />

            <div className="row g-3">
              <div className="col-12">
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  disabled={!editing} style={{
                    ...inputStyle,
                    background: editing ? 'white' : '#fafafa',
                    cursor: editing ? 'text' : 'default'
                  }}
                  onFocus={e => { if (editing) e.target.style.borderColor = '#4f46e5' }}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div className="col-12">
                <label style={labelStyle}>College Email</label>
                <input
                  type="email" value={userProfile?.email || ''}
                  disabled style={{
                    ...inputStyle, background: '#fafafa',
                    cursor: 'not-allowed', color: '#9ca3af'
                  }}
                />
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 4 }}>
                  <i className="fas fa-lock me-1"></i>Email cannot be changed
                </div>
              </div>

              <div className="col-md-6">
                <label style={labelStyle}>Department</label>
                <select
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  disabled={!editing}
                  style={{
                    ...inputStyle,
                    background: editing ? 'white' : '#fafafa',
                    cursor: editing ? 'pointer' : 'default',
                    appearance: 'none'
                  }}
                  onFocus={e => { if (editing) e.target.style.borderColor = '#4f46e5' }}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                >
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label style={labelStyle}>Phone Number</label>
                <input
                  type="tel" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  disabled={!editing} style={{
                    ...inputStyle,
                    background: editing ? 'white' : '#fafafa',
                    cursor: editing ? 'text' : 'default'
                  }}
                  onFocus={e => { if (editing) e.target.style.borderColor = '#4f46e5' }}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {editing && (
                <div className="col-12">
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <button onClick={handleSave} disabled={saving} style={{
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      color: 'white', border: 'none', padding: '11px 24px',
                      borderRadius: 10, fontWeight: 700, cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}>
                      {saving
                        ? <><i className="fas fa-spinner fa-spin me-2"></i>Saving...</>
                        : <><i className="fas fa-save me-2"></i>Save Changes</>
                      }
                    </button>
                    <button onClick={() => {
                      setEditing(false)
                      setForm({
                        name: userProfile?.name || '',
                        phone: userProfile?.phone || '',
                        department: userProfile?.department || '',
                      })
                    }} style={{
                      background: 'transparent', border: '1.5px solid #e5e7eb',
                      color: '#6b7280', padding: '11px 20px',
                      borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'
                    }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="col-lg-5">
          <div style={{
            background: 'white', borderRadius: 20, padding: 28,
            border: '1px solid #f3f4f6',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
          }}>
            <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 24 }}>
              <i className="fas fa-lock me-2" style={{ color: '#7c3aed' }}></i>
              Change Password
            </h5>

            <Alert msg={pwMsg} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Current Password', key: 'current', placeholder: 'Enter current password' },
                { label: 'New Password', key: 'newPw', placeholder: 'Min. 6 characters' },
                { label: 'Confirm New Password', key: 'confirm', placeholder: 'Repeat new password' },
              ].map(field => (
                <div key={field.key}>
                  <label style={labelStyle}>{field.label}</label>
                  <input
                    type="password"
                    placeholder={field.placeholder}
                    value={pwForm[field.key]}
                    onChange={e => setPwForm({ ...pwForm, [field.key]: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#7c3aed'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              ))}

              <button onClick={handlePasswordChange} disabled={pwSaving} style={{
                background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                color: 'white', border: 'none', padding: '12px',
                borderRadius: 10, fontWeight: 700, cursor: 'pointer',
                fontSize: '0.9rem', marginTop: 4
              }}>
                {pwSaving
                  ? <><i className="fas fa-spinner fa-spin me-2"></i>Updating...</>
                  : <><i className="fas fa-key me-2"></i>Update Password</>
                }
              </button>
            </div>
          </div>

          {/* Account Info Card */}
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            borderRadius: 20, padding: 24, marginTop: 16
          }}>
            <h6 style={{ color: 'white', fontWeight: 700, marginBottom: 16 }}>
              Account Information
            </h6>
            {[
              { icon: 'fas fa-shield-alt', label: 'Role', value: 'Student' },
              { icon: 'fas fa-envelope', label: 'Email', value: userProfile?.email },
              { icon: 'fas fa-phone', label: 'Phone', value: userProfile?.phone },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                marginBottom: 12, padding: '10px 14px',
                background: 'rgba(255,255,255,0.1)', borderRadius: 10
              }}>
                <i className={item.icon} style={{ color: 'rgba(255,255,255,0.7)', width: 16 }}></i>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>{item.label}</div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}