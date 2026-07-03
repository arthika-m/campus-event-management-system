import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../../firebase/config'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await signInWithEmailAndPassword(auth, form.email, form.password)
      const docRef = doc(db, 'users', result.user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const role = docSnap.data().role
        if (role === 'coordinator') navigate('/coordinator/dashboard')
        else navigate('/student/dashboard')
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    }
    setLoading(false)
  }

  const fillDemo = (type) => {
    if (type === 'student') setForm({ email: 'student.demo@tce.edu', password: 'Student@123' })
    else setForm({ email: 'it.coordinator@tce.edu', password: 'Coordinator@123' })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '10%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,70,229,0.3) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div className="text-center mb-4">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <i className="fas fa-bolt text-white" style={{ fontSize: 22 }}></i>
            </div>
            <div style={{
              fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.3rem',
              background: 'linear-gradient(135deg, #818cf8, #c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>TCE EventSphere</div>
          </Link>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: 6 }}>
            Sign in to your account
          </p>
        </div>

        {/* Demo Accounts Card */}
        <div style={{
          background: 'rgba(79,70,229,0.15)',
          border: '1px solid rgba(79,70,229,0.3)',
          borderRadius: 16, padding: 20, marginBottom: 24
        }}>
          <div style={{
            color: '#a5b4fc', fontWeight: 700, fontSize: '0.85rem',
            marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8
          }}>
            <i className="fas fa-flask"></i> Demo Accounts — Click to fill
          </div>
          <div className="row g-2">
            <div className="col-6">
              <button onClick={() => fillDemo('student')} style={{
                width: '100%', padding: '10px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <div style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600, marginBottom: 4 }}>
                  <i className="fas fa-user-graduate me-1"></i> Student
                </div>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>student.demo@tce.edu</div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>Student@123</div>
              </button>
            </div>
            <div className="col-6">
              <button onClick={() => fillDemo('coordinator')} style={{
                width: '100%', padding: '10px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, marginBottom: 4 }}>
                  <i className="fas fa-chalkboard-teacher me-1"></i> Coordinator
                </div>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>it.coordinator@tce.edu</div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>Coordinator@123</div>
              </button>
            </div>
          </div>
        </div>

        {/* Login Form */}
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

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 20 }}>
              <label style={{
                color: '#d1d5db', fontSize: '0.85rem',
                fontWeight: 600, display: 'block', marginBottom: 8
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-envelope" style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', color: '#6b7280', fontSize: '0.9rem'
                }}></i>
                <input
                  type="email" required
                  placeholder="your@tce.edu"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: '100%', padding: '12px 16px 12px 40px',
                    borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.06)', color: 'white',
                    outline: 'none', fontSize: '0.9rem', transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#4f46e5'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{
                color: '#d1d5db', fontSize: '0.85rem',
                fontWeight: 600, display: 'block', marginBottom: 8
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-lock" style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', color: '#6b7280', fontSize: '0.9rem'
                }}></i>
                <input
                  type="password" required
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: '100%', padding: '12px 16px 12px 40px',
                    borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.06)', color: 'white',
                    outline: 'none', fontSize: '0.9rem', transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#4f46e5'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: 'white', border: 'none', borderRadius: 12,
              fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1, transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(79,70,229,0.4)'
            }}>
              {loading
                ? <><i className="fas fa-spinner fa-spin me-2"></i>Signing in...</>
                : <><i className="fas fa-sign-in-alt me-2"></i>Sign In</>
              }
              
            </button>
          </form>

          <div style={{
            textAlign: 'center', marginTop: 24,
            color: '#6b7280', fontSize: '0.88rem'
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
              Register here
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