export default function FeaturedEvents() {
  const events = [
    {
      title: 'National Level Hackathon 2026',
      dept: 'Computer Science & Engineering',
      category: 'Technical',
      date: 'Feb 15, 2026',
      venue: 'Main Auditorium',
      seats: '248/300',
      gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      icon: 'fas fa-code',
      badge: 'College Wide',
      badgeColor: '#4f46e5'
    },
    {
      title: 'Inter-Department Sports Meet',
      dept: 'Physical Education',
      category: 'Sports',
      date: 'Feb 20, 2026',
      venue: 'TCE Sports Ground',
      seats: '180/250',
      gradient: 'linear-gradient(135deg, #059669, #0891b2)',
      icon: 'fas fa-trophy',
      badge: 'College Wide',
      badgeColor: '#059669'
    },
    {
      title: 'AI & Machine Learning Workshop',
      dept: 'Information Technology',
      category: 'Workshop',
      date: 'Feb 22, 2026',
      venue: 'IT Seminar Hall',
      seats: '72/100',
      gradient: 'linear-gradient(135deg, #d97706, #dc2626)',
      icon: 'fas fa-brain',
      badge: 'Dept. Only',
      badgeColor: '#d97706'
    },
    {
      title: 'Campus Placement Drive 2026',
      dept: 'Training & Placement',
      category: 'Placement',
      date: 'Mar 1, 2026',
      venue: 'Placement Block',
      seats: '320/500',
      gradient: 'linear-gradient(135deg, #7c3aed, #db2777)',
      icon: 'fas fa-briefcase',
      badge: 'College Wide',
      badgeColor: '#7c3aed'
    },
  ]

  return (
    <section id="events" style={{ padding: '100px 0', background: 'white' }}>
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <span style={{
            background: 'rgba(124,58,237,0.1)', color: '#7c3aed',
            padding: '6px 16px', borderRadius: 100, fontSize: '0.85rem',
            fontWeight: 600, display: 'inline-block', marginBottom: 12
          }}>What's Happening</span>
          <h2 className="section-title">Featured <span className="gradient-text">Events</span></h2>
          <p className="section-subtitle">Don't miss out on these exciting upcoming events at TCE</p>
        </div>

        <div className="row g-4">
          {events.map((ev, i) => (
            <div className="col-md-6 col-lg-3" key={ev.title} data-aos="fade-up" data-aos-delay={i * 80}>
              <div style={{
                borderRadius: 20, overflow: 'hidden', background: 'white',
                border: '1px solid #f3f4f6', transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)', height: '100%'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 24px 48px rgba(0,0,0,0.12)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'
                }}
              >
                {/* Banner */}
                <div style={{
                  background: ev.gradient, padding: '32px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <i className={ev.icon} style={{ fontSize: 22, color: 'white' }}></i>
                  </div>
                  <span style={{
                    background: 'rgba(255,255,255,0.2)', color: 'white',
                    padding: '4px 12px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600
                  }}>{ev.badge}</span>
                </div>

                {/* Body */}
                <div style={{ padding: '20px' }}>
                  <span style={{
                    background: 'rgba(79,70,229,0.08)', color: '#4f46e5',
                    padding: '3px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600
                  }}>{ev.category}</span>

                  <h6 style={{ fontWeight: 700, margin: '10px 0 6px', color: '#111827', fontSize: '0.95rem', lineHeight: 1.4 }}>
                    {ev.title}
                  </h6>
                  <p style={{ color: '#6b7280', fontSize: '0.78rem', marginBottom: 14 }}>{ev.dept}</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                    {[
                      ['fas fa-calendar', ev.date],
                      ['fas fa-map-marker-alt', ev.venue],
                      ['fas fa-users', ev.seats + ' Registered']
                    ].map(([icon, text]) => (
                      <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i className={icon} style={{ color: '#4f46e5', fontSize: '0.75rem', width: 14 }}></i>
                        <span style={{ color: '#6b7280', fontSize: '0.78rem' }}>{text}</span>
                      </div>
                    ))}
                  </div>

                  <button style={{
                    width: '100%', padding: '10px',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    color: 'white', border: 'none', borderRadius: 10,
                    fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}