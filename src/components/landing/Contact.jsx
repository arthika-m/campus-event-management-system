import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 10,
    border: '1.5px solid #e5e7eb', outline: 'none',
    fontSize: '0.9rem', transition: 'border-color 0.2s'
  }

  const labelStyle = {
    fontWeight: 600, fontSize: '0.85rem',
    color: '#374151', marginBottom: 6, display: 'block'
  }

  return (
    <section id="contact" style={{ padding: '100px 0', background: '#fafafa' }}>
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <span style={{
            background: 'rgba(79,70,229,0.1)', color: '#4f46e5',
            padding: '6px 16px', borderRadius: 100, fontSize: '0.85rem',
            fontWeight: 600, display: 'inline-block', marginBottom: 12
          }}>Get In Touch</span>
          <h2 className="section-title">Contact <span className="gradient-text">Us</span></h2>
          <p className="section-subtitle">Have questions or feedback? We'd love to hear from you.</p>
        </div>

        {/* Centered Form Only */}
        <div className="row justify-content-center">
          <div className="col-lg-8" data-aos="fade-up">
            <div style={{
              background: 'white', borderRadius: 24, padding: 40,
              border: '1px solid #f3f4f6',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              {sent && (
                <div style={{
                  background: 'rgba(5,150,105,0.1)',
                  border: '1px solid rgba(5,150,105,0.2)',
                  borderRadius: 12, padding: '14px 20px', marginBottom: 24,
                  color: '#059669', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 10
                }}>
                  <i className="fas fa-check-circle"></i>
                  Message sent! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label style={labelStyle}>Full Name *</label>
                    <input
                      type="text" required placeholder="Your full name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#4f46e5'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  <div className="col-md-6">
                    <label style={labelStyle}>Email Address *</label>
                    <input
                      type="email" required placeholder="your@tce.edu"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#4f46e5'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  <div className="col-12">
                    <label style={labelStyle}>Subject *</label>
                    <input
                      type="text" required placeholder="What is this about?"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#4f46e5'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  <div className="col-12">
                    <label style={labelStyle}>Message *</label>
                    <textarea
                      required rows={5}
                      placeholder="Write your message here..."
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={e => e.target.style.borderColor = '#4f46e5'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  <div className="col-12">
                    <button type="submit" style={{
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      color: 'white', border: 'none', padding: '13px 36px',
                      borderRadius: 12, fontWeight: 700, fontSize: '0.95rem',
                      cursor: 'pointer', transition: 'all 0.3s',
                      boxShadow: '0 4px 15px rgba(79,70,229,0.35)'
                    }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <i className="fas fa-paper-plane me-2"></i> Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}