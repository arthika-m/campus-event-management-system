export default function Categories() {
  const categories = [
    { icon: 'fas fa-laptop-code', label: 'Technical', color: '#4f46e5', bg: 'rgba(79,70,229,0.1)', count: '120+ Events' },
    { icon: 'fas fa-tools', label: 'Workshop', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', count: '85+ Events' },
    { icon: 'fas fa-chalkboard-teacher', label: 'Seminar', color: '#0891b2', bg: 'rgba(8,145,178,0.1)', count: '60+ Events' },
    { icon: 'fas fa-running', label: 'Sports', color: '#059669', bg: 'rgba(5,150,105,0.1)', count: '45+ Events' },
    { icon: 'fas fa-theater-masks', label: 'Cultural', color: '#d97706', bg: 'rgba(217,119,6,0.1)', count: '70+ Events' },
    { icon: 'fas fa-briefcase', label: 'Placement', color: '#dc2626', bg: 'rgba(220,38,38,0.1)', count: '30+ Events' },
    { icon: 'fas fa-hands-helping', label: 'NSS', color: '#16a34a', bg: 'rgba(22,163,74,0.1)', count: '25+ Events' },
    { icon: 'fas fa-shield-alt', label: 'NCC', color: '#b45309', bg: 'rgba(180,83,9,0.1)', count: '20+ Events' },
    { icon: 'fas fa-heart', label: 'YRC', color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', count: '15+ Events' },
  ]

  return (
    <section id="categories" style={{ padding: '100px 0', background: '#fafafa' }}>
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <span style={{
            background: 'rgba(79,70,229,0.1)', color: '#4f46e5',
            padding: '6px 16px', borderRadius: 100, fontSize: '0.85rem',
            fontWeight: 600, display: 'inline-block', marginBottom: 12
          }}>Browse by Category</span>
          <h2 className="section-title">Event <span className="gradient-text">Categories</span></h2>
          <p className="section-subtitle">Find events that match your interests across all departments</p>
        </div>

        <div className="row g-4">
          {categories.map((cat, i) => (
            <div className="col-6 col-md-4 col-lg-3" key={cat.label} data-aos="fade-up" data-aos-delay={i * 60}>
              <div
                style={{
                  background: 'white', borderRadius: 20, padding: '28px 20px',
                  textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease',
                  border: '1px solid #f3f4f6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = `0 20px 40px ${cat.color}25`
                  e.currentTarget.style.borderColor = cat.color
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'
                  e.currentTarget.style.borderColor = '#f3f4f6'
                }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: 18,
                  background: cat.bg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <i className={cat.icon} style={{ fontSize: 26, color: cat.color }}></i>
                </div>
                <h6 style={{ fontWeight: 700, marginBottom: 4, color: '#111827' }}>{cat.label}</h6>
                <p style={{ color: '#9ca3af', fontSize: '0.78rem', margin: 0 }}>{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}