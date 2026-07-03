import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../firebase/config'

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

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', department: '',
    phone: '', password: '', confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const result = await createUserWithEmailAndPassword(auth, form.email, form.password)
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        name: form.name,
        email: form.email,
        department: form.department,
        phone: form.phone,
        role: 'student',
        createdAt: new Date().toISOString()
      })
      navigate('/student/dashboard')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('This email is already registered.')
      else if (err.code === 'auth/invalid-email') setError('Invalid email address.')
      else setError('Registration failed. Please try again.')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px 12px 40px',
    borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.06)', color: 'white',
    outline: 'none', fontSize: '0.9rem', transition: 'border-color 0.2s'
  }

  const labelStyle = {
    color: '#d1d5db', fontSize: '0.85rem',
    fontWeight: 600, display: 'block', marginBottom: 8
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: '5%', right: '10%',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,70,229,0.25) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: 560, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div className="text-center mb-4">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px'
            }}>
              <i className="fas fa-bolt text-white" style={{ fontSize: 20 }}></i>
            </div>
            <div style={{
              fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #818cf8, #c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>TCE EventSphere</div>
          </Link>
          <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginTop: 6 }}>
            Create your student account
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20, padding: 36
        }}>
          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.1)',
              border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: 10, padding: '12px 16px',
              color: '#f87171', fontSize: '0.88rem',
              marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8
            }}>
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="row g-3">

              {/* Full Name */}
              <div className="col-12">
                <label style={labelStyle}>Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-user" style={{
                    position: 'absolute', left: 14, top: '50%',
                    transform: 'translateY(-50%)', color: '#6b7280'
                  }}></i>
                  <input type="text" required placeholder="Your full name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#4f46e5'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="col-12">
                <label style={labelStyle}>College Email *</label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-envelope" style={{
                    position: 'absolute', left: 14, top: '50%',
                    transform: 'translateY(-50%)', color: '#6b7280'
                  }}></i>
                  <input type="email" required placeholder="yourname@tce.edu"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#4f46e5'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              {/* Department */}
              <div className="col-md-6">
                <label style={labelStyle}>Department *</label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-building" style={{
                    position: 'absolute', left: 14, top: '50%',
                    transform: 'translateY(-50%)', color: '#6b7280', zIndex: 1
                  }}></i>
                  <select required
                    value={form.department}
                    onChange={e => setForm({ ...form, department: e.target.value })}
                    style={{ ...inputStyle, appearance: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#4f46e5'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  >
                    <option value="" style={{ background: '#1e1b4b' }}>Select Department</option>
                    {departments.map(d => (
                      <option key={d} value={d} style={{ background: '#1e1b4b' }}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Phone */}
              <div className="col-md-6">
                <label style={labelStyle}>Phone Number *</label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-phone" style={{
                    position: 'absolute', left: 14, top: '50%',
                    transform: 'translateY(-50%)', color: '#6b7280'
                  }}></i>
                  <input type="tel" required placeholder="10-digit number"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#4f46e5'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="col-md-6">
                <label style={labelStyle}>Password *</label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-lock" style={{
                    position: 'absolute', left: 14, top: '50%',
                    transform: 'translateY(-50%)', color: '#6b7280'
                  }}></i>
                  <input type="password" required placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#4f46e5'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="col-md-6">
                <label style={labelStyle}>Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-lock" style={{
                    position: 'absolute', left: 14, top: '50%',
                    transform: 'translateY(-50%)', color: '#6b7280'
                  }}></i>
                  <input type="password" required placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#4f46e5'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="col-12 mt-2">
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '13px',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: 'white', border: 'none', borderRadius: 12,
                  fontWeight: 700, fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.8 : 1,
                  boxShadow: '0 4px 15px rgba(79,70,229,0.4)'
                }}>
                  {loading
                    ? <><i className="fas fa-spinner fa-spin me-2"></i>Creating Account...</>
                    : <><i className="fas fa-user-plus me-2"></i>Create Account</>
                  }
                </button>
              </div>
            </div>
          </form>

          <div style={{
            textAlign: 'center', marginTop: 20,
            color: '#6b7280', fontSize: '0.88rem'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
              Sign in here
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/" style={{ color: '#6b7280', fontSize: '0.85rem', textDecoration: 'none' }}>
            <i className="fas fa-arrow-left me-1"></i> Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}