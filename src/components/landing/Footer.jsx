import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 100%)',
      padding: '60px 0 0', color: 'white'
    }}>
      <div className="container">
        <div className="row g-5 mb-5">
          {/* Brand */}
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-16" style={{ marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <i className="fas fa-bolt text-white"></i>
              </div>
              <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.2rem' }}>
                TCE EventSphere
              </span>
            </div>
            <p style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '0.9rem', marginBottom: 24 }}>
              The official Smart Event Management Portal for Thiagarajar College of Engineering, Madurai. Discover, organize and register for all campus events.
            </p>
            <div className="d-flex gap-3">
              {[
                { icon: 'fab fa-instagram', color: '#e1306c' },
                { icon: 'fab fa-linkedin', color: '#0077b5' },
                { icon: 'fab fa-twitter', color: '#1da1f2' },
                { icon: 'fab fa-youtube', color: '#ff0000' },
              ].map(({ icon, color }) => (
                <a key={icon} href="#" style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s', color: 'white', textDecoration: 'none'
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = color
                    e.currentTarget.style.borderColor = color
                    e.currentTarget.style.transform = 'translateY(-3px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <i className={icon} style={{ fontSize: '0.9rem' }}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="col-6 col-lg-2">
            <h6 style={{ fontWeight: 700, marginBottom: 20, color: 'white' }}>Quick Links</h6>
            {['Home', 'Categories', 'Events', 'About', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} style={{
                display: 'block', color: '#9ca3af', textDecoration: 'none',
                marginBottom: 10, fontSize: '0.88rem', transition: 'color 0.2s'
              }}
                onMouseEnter={e => e.target.style.color = '#818cf8'}
                onMouseLeave={e => e.target.style.color = '#9ca3af'}
              >{link}</a>
            ))}
          </div>

          <div className="col-6 col-lg-2">
            <h6 style={{ fontWeight: 700, marginBottom: 20, color: 'white' }}>For Students</h6>
            {['Register', 'Login', 'My Events', 'Department Events', 'College Events'].map(link => (
              <a key={link} href="#" style={{
                display: 'block', color: '#9ca3af', textDecoration: 'none',
                marginBottom: 10, fontSize: '0.88rem', transition: 'color 0.2s'
              }}
                onMouseEnter={e => e.target.style.color = '#818cf8'}
                onMouseLeave={e => e.target.style.color = '#9ca3af'}
              >{link}</a>
            ))}
          </div>

          <div className="col-lg-4">
            <h6 style={{ fontWeight: 700, marginBottom: 20, color: 'white' }}>Stay Updated</h6>
            <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: 16 }}>
              Subscribe to get notified about new events and announcements.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="email" placeholder="your@tce.edu"
                style={{
                  flex: 1, padding: '11px 16px', borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'white', outline: 'none', fontSize: '0.85rem'
                }}
              />
              <button style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white', border: 'none', padding: '11px 18px',
                borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
              }}>
                <i className="fas fa-bell"></i>
              </button>
            </div>
            <div style={{
              marginTop: 24, padding: '16px 20px',
              background: 'rgba(79,70,229,0.15)',
              border: '1px solid rgba(79,70,229,0.3)',
              borderRadius: 12
            }}>
              <div style={{ color: '#a5b4fc', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                📍 Thiagarajar College of Engineering
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.78rem' }}>
                Thiruparankundram, Madurai – 625 015
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '20px 0', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12
        }}>
          <p style={{ color: '#6b7280', fontSize: '0.82rem', margin: 0 }}>
            © 2026 TCE EventSphere. Built for SiteCraft – Web Development Challenge.
          </p>
          <div className="d-flex gap-4">
            {['Privacy Policy', 'Terms of Use', 'Support'].map(link => (
              <a key={link} href="#" style={{
                color: '#6b7280', textDecoration: 'none',
                fontSize: '0.82rem', transition: 'color 0.2s'
              }}
                onMouseEnter={e => e.target.style.color = '#818cf8'}
                onMouseLeave={e => e.target.style.color = '#6b7280'}
              >{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}