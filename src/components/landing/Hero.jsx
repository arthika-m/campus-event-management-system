import { Link } from 'react-router-dom'

const TCE_LOGO = 'https://www.tce.edu/sites/default/files/tce-logo.png'

export default function Hero() {
  return (
    <section id="home" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex', alignItems: 'center', position: 'relative', overflowX: 'hidden'
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,70,229,0.3) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row align-items-center">

          {/* Left Content */}
          <div className="col-lg-6" data-aos="fade-right">

            {/* TCE Logo Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 100, padding: '8px 20px 8px 8px',
              marginBottom: 28
            }}>
              <img
                src={TCE_LOGO}
                alt="TCE Logo"
                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'contain', background: 'white', padding: 3 }}
                onError={e => {
                  e.target.style.display = 'none'
                }}
              />
              <span style={{ color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600 }}>
                Thiagarajar College of Engineering
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 800,
              color: 'white', lineHeight: 1.15, marginBottom: 20, fontFamily: 'Poppins'
            }}>
              TCE Smart Event<br />
              <span style={{
                background: 'linear-gradient(135deg, #818cf8, #c084fc)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>Management Portal</span>
            </h1>

            <p style={{ color: '#9ca3af', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              Discover, organize and register for department and college-wide events — all in one powerful platform built for TCE.
            </p>

            <div className="d-flex gap-3 flex-wrap">
              <a href="#events" style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white', padding: '14px 32px', borderRadius: 12,
                textDecoration: 'none', fontWeight: 700, fontSize: '1rem',
                boxShadow: '0 8px 25px rgba(79,70,229,0.45)',
                display: 'inline-flex', alignItems: 'center', gap: 8
              }}>
                <i className="fas fa-compass"></i> Explore Events
              </a>
              <Link to="/register" style={{
                background: 'transparent', color: 'white',
                padding: '14px 32px', borderRadius: 12,
                textDecoration: 'none', fontWeight: 600, fontSize: '1rem',
                border: '2px solid rgba(255,255,255,0.3)',
                display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.3s'
              }}>
                <i className="fas fa-user-plus"></i> Register Now
              </Link>
            </div>

            {/* Stats */}
            <div className="d-flex gap-4 mt-5 flex-wrap">
              {[['500+', 'Events'], ['2500+', 'Students'], ['20+', 'Departments']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.6rem' }}>{num}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Illustration */}
          <div className="col-lg-6 d-none d-lg-flex justify-content-center" data-aos="fade-left">
            <div style={{ position: 'relative', width: '100%', maxWidth: 480 }}>

              {/* Main Illustration Card */}
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 24, padding: 32, marginBottom: 16
              }}>
                {/* Portal Preview Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <img
                    src={TCE_LOGO}
                    alt="TCE"
                    style={{
                      width: 44, height: 44, borderRadius: 10,
                      objectFit: 'contain', background: 'white', padding: 4
                    }}
                    onError={e => {
                      e.target.outerHTML = `<div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#4f46e5,#7c3aed);display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:white;font-weight:800;">T</div>`
                    }}
                  />
                  <div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>TCE EventSphere</div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Smart Event Portal</div>
                  </div>
                  <div style={{
                    marginLeft: 'auto', background: 'rgba(74,222,128,0.15)',
                    color: '#4ade80', padding: '4px 12px', borderRadius: 100,
                    fontSize: '0.72rem', fontWeight: 600
                  }}>● Live</div>
                </div>

                {/* Event Preview Items */}
                {[
                  { icon: '🚀', title: 'National Hackathon 2026', dept: 'CSE Dept', color: '#4f46e5', seats: '248/300' },
                  { icon: '🎭', title: 'Culturals – Aaroha 2026', dept: 'All Departments', color: '#7c3aed', seats: '180/250' },
                  { icon: '🏆', title: 'Inter-Dept Sports Meet', dept: 'Physical Education', color: '#059669', seats: '120/200' },
                ].map((ev, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    marginBottom: 10, transition: 'all 0.3s'
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      background: `${ev.color}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem'
                    }}>{ev.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem', marginBottom: 2 }}>{ev.title}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.72rem' }}>{ev.dept}</div>
                    </div>
                    <div style={{
                      background: `${ev.color}20`, color: ev.color,
                      padding: '3px 10px', borderRadius: 6,
                      fontSize: '0.7rem', fontWeight: 700, flexShrink: 0
                    }}>{ev.seats}</div>
                  </div>
                ))}

                {/* Progress bar */}
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 10, padding: '12px 14px', marginTop: 4
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: '#a5b4fc', fontSize: '0.78rem' }}>Portal Activity</span>
                    <span style={{ color: '#a5b4fc', fontSize: '0.78rem' }}>82%</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 4, height: 6 }}>
                    <div style={{
                      width: '82%', height: '100%',
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      borderRadius: 4
                    }}></div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div style={{
                position: 'absolute', top: -20, right: -20,
                background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16,
                padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10
              }}>
                <i className="fas fa-bell" style={{ color: '#f59e0b' }}></i>
                <div>
                  <div style={{ color: 'white', fontSize: '0.78rem', fontWeight: 600 }}>New Event!</div>
                  <div style={{ color: '#6b7280', fontSize: '0.68rem' }}>IT Workshop posted</div>
                </div>
              </div>

              <div style={{
                position: 'absolute', bottom: -10, left: -20,
                background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16,
                padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10
              }}>
                <i className="fas fa-users" style={{ color: '#4ade80' }}></i>
                <div>
                  <div style={{ color: 'white', fontSize: '0.78rem', fontWeight: 600 }}>2,500+ Students</div>
                  <div style={{ color: '#6b7280', fontSize: '0.68rem' }}>Registered on portal</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}