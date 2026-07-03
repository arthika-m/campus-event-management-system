export default function FAQ() {
  const faqs = [
    {
      q: 'Who can register on TCE EventSphere?',
      a: 'Any student of Thiagarajar College of Engineering can register using their college email ID. Event Coordinators are pre-registered by the administrator and only need to log in.'
    },
    {
      q: 'How do I register for an event?',
      a: 'After logging in to your Student Dashboard, browse Department Events or College-Wide Events, click on an event to view details, and click the Register button. You will receive a unique Registration ID instantly.'
    },
    {
      q: 'What is the difference between Department Events and College-Wide Events?',
      a: 'Department Events are visible only to students of that specific department. College-Wide Events are open to all students across every department — like Hackathons, Sports Meets, and Placement Drives.'
    },
    {
      q: 'Can I cancel my event registration?',
      a: 'Yes. Go to My Registrations in your Student Dashboard and cancel any upcoming event registration before the deadline set by the coordinator.'
    },
    {
      q: 'How do Event Coordinators create events?',
      a: 'Coordinators log in with their pre-created accounts, navigate to Create Event in their dashboard, fill in the event details including visibility (Department Only or College Wide), and publish the event instantly.'
    },
    {
      q: 'Is my personal data safe on this platform?',
      a: 'Yes. TCE EventSphere is built on Firebase with secure Authentication. Your data is only visible to authorized coordinators of your department and the administrator.'
    },
  ]

  return (
    <section style={{ padding: '100px 0', background: 'white' }}>
      <div className="container">
        <div className="row align-items-start g-5">
          <div className="col-lg-4" data-aos="fade-right">
            <span style={{
              background: 'rgba(79,70,229,0.1)', color: '#4f46e5',
              padding: '6px 16px', borderRadius: 100, fontSize: '0.85rem',
              fontWeight: 600, display: 'inline-block', marginBottom: 16
            }}>FAQ</span>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p style={{ color: '#6b7280', lineHeight: 1.7, marginTop: 16 }}>
              Everything you need to know about TCE EventSphere. Can't find an answer? Reach out to us below.
            </p>
            <div style={{
              marginTop: 32, padding: 24, borderRadius: 16,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'
            }}>
              <i className="fas fa-headset" style={{ color: 'white', fontSize: '1.5rem', marginBottom: 12, display: 'block' }}></i>
              <div style={{ color: 'white', fontWeight: 700, marginBottom: 6 }}>Still have questions?</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', marginBottom: 16 }}>
                Contact the TCE EventSphere support team
              </div>
              <a href="#contact" style={{
                background: 'rgba(255,255,255,0.2)', color: 'white',
                padding: '8px 20px', borderRadius: 8, textDecoration: 'none',
                fontSize: '0.85rem', fontWeight: 600, display: 'inline-block',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>Contact Us</a>
            </div>
          </div>

          <div className="col-lg-8" data-aos="fade-left">
            <div className="accordion" id="faqAccordion">
              {faqs.map((faq, i) => (
                <div key={i} style={{
                  marginBottom: 12, borderRadius: 14, overflow: 'hidden',
                  border: '1px solid #f3f4f6', background: 'white'
                }}>
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${i !== 0 ? 'collapsed' : ''}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#faq${i}`}
                      style={{
                        fontWeight: 600, fontSize: '0.95rem', color: '#111827',
                        background: 'white', borderRadius: 14, boxShadow: 'none',
                        padding: '20px 24px'
                      }}
                    >
                      {faq.q}
                    </button>
                  </h2>
                  <div id={`faq${i}`} className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`}
                    data-bs-parent="#faqAccordion">
                    <div style={{
                      padding: '0 24px 20px',
                      color: '#6b7280', lineHeight: 1.75, fontSize: '0.92rem'
                    }}>
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}