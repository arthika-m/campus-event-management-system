import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const TCE_LOGO = 'https://www.tce.edu/sites/default/files/tce-logo.png'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      boxShadow: scrolled ? '0 2px 20px rgba(79,70,229,0.1)' : 'none',
      padding: '12px 0'
    }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src={TCE_LOGO}
              alt="TCE Logo"
              style={{
                width: 40, height: 40, borderRadius: 8,
                objectFit: 'contain',
                background: scrolled ? 'transparent' : 'rgba(255,255,255,0.1)',
                padding: 3
              }}
              onError={e => {
                e.target.outerHTML = `<div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#4f46e5,#7c3aed);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:1rem;">T</div>`
              }}
            />
            <div>
              <div style={{
                fontFamily: 'Poppins', fontWeight: 800, fontSize: '1rem', lineHeight: 1.1,
                background: scrolled ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'none',
                WebkitBackgroundClip: scrolled ? 'text' : 'unset',
                WebkitTextFillColor: scrolled ? 'transparent' : 'white',
                color: scrolled ? 'transparent' : 'white'
              }}>TCE EventSphere</div>
              <div style={{ fontSize: '0.65rem', color: scrolled ? '#9ca3af' : 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                Thiagarajar College of Engineering
              </div>
            </div>
          </Link>

          {/* Nav Links */}
          <ul style={{ display: 'flex', gap: 4, margin: 0, padding: 0, listStyle: 'none' }}
            className="d-none d-lg-flex">
            {['Home', 'Categories', 'Events', 'About'].map(item => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} style={{
                  color: scrolled ? '#374151' : 'white',
                  fontWeight: 500, padding: '8px 16px', borderRadius: 8,
                  textDecoration: 'none', transition: 'all 0.2s', display: 'block',
                  fontSize: '0.9rem'
                }}
                  onMouseEnter={e => e.target.style.background = scrolled ? 'rgba(79,70,229,0.08)' : 'rgba(255,255,255,0.1)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >{item}</a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/login" style={{
              color: scrolled ? '#4f46e5' : 'white',
              fontWeight: 600, padding: '8px 20px', borderRadius: 10,
              textDecoration: 'none',
              border: scrolled ? '2px solid #4f46e5' : '2px solid rgba(255,255,255,0.5)',
              fontSize: '0.9rem', transition: 'all 0.3s'
            }}>Login</Link>
            <Link to="/register" style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: 'white', padding: '9px 22px', borderRadius: 10,
              textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
              boxShadow: '0 4px 15px rgba(79,70,229,0.4)'
            }}>Register</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}