import { useEffect, useRef, useState } from 'react'

function CounterItem({ icon, end, suffix, label, color }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let start = 0
          const duration = 2000
          const step = Math.ceil(end / (duration / 16))
          const timer = setInterval(() => {
            start += step
            if (start >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(start)
            }
          }, 16)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])

  return (
    <div
      ref={ref}
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20, padding: '36px 24px', textAlign: 'center',
        transition: 'all 0.3s'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.transform = 'translateY(-5px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: `${color}25`,
        border: `1px solid ${color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px'
      }}>
        <i className={icon} style={{ fontSize: 22, color }}></i>
      </div>
      <div style={{
        fontFamily: 'Poppins', fontWeight: 800,
        fontSize: '2.8rem', color: 'white', lineHeight: 1
      }}>
        {count}{suffix}
      </div>
      <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: 8 }}>{label}</div>
    </div>
  )
}

export default function Statistics() {
  const stats = [
    { icon: 'fas fa-calendar-check', end: 500, suffix: '+', label: 'Events Organized', color: '#4f46e5' },
    { icon: 'fas fa-user-graduate', end: 2500, suffix: '+', label: 'Students Registered', color: '#7c3aed' },
    { icon: 'fas fa-building', end: 20, suffix: '+', label: 'Departments', color: '#0891b2' },
    { icon: 'fas fa-chalkboard-teacher', end: 100, suffix: '+', label: 'Coordinators', color: '#059669' },
  ]

  return (
    <section style={{
      padding: '100px 0',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.4,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '30px 30px', pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 style={{
            color: 'white', fontFamily: 'Poppins',
            fontWeight: 800, fontSize: '2.5rem'
          }}>
            TCE in{' '}
            <span style={{
              background: 'linear-gradient(135deg, #818cf8, #c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>Numbers</span>
          </h2>
          <p style={{ color: '#6b7280', marginTop: 10 }}>
            A thriving campus community powered by events
          </p>
        </div>

        <div className="row g-4">
          {stats.map((stat, i) => (
            <div className="col-6 col-lg-3" key={stat.label}
              data-aos="fade-up" data-aos-delay={i * 80}>
              <CounterItem {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}