import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  /* ─── Inline styles mirroring kenzo.css header ─── */
  const s = {
    header: {
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      background: scrolled ? 'rgba(0,0,0,0.97)' : 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(12px)',
      transition: 'all 0.3s ease',
      borderBottom: scrolled ? '1px solid rgba(193,255,0,0.15)' : 'none',
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 40px',
      height: '75px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      textDecoration: 'none',
    },
    logoImg: {
      width: '42px',
      height: '42px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid #c1ff00',
    },
    logoText: {
      fontSize: '1.1rem',
      fontWeight: 800,
      color: '#c1ff00',
      fontFamily: "'Montserrat', sans-serif",
      letterSpacing: '0.02em',
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    navLink: (active) => ({
      textDecoration: 'none',
      fontSize: '0.9rem',
      fontWeight: 600,
      color: active ? '#c1ff00' : '#e0e0e0',
      fontFamily: "'Montserrat', sans-serif",
      letterSpacing: '0.03em',
      transition: 'color 0.2s',
      borderBottom: active ? '2px solid #c1ff00' : '2px solid transparent',
      paddingBottom: '2px',
    }),
    btnContact: {
      display: 'inline-block',
      padding: '9px 22px',
      border: '2px solid rgba(255,255,255,0.5)',
      borderRadius: '50px',
      color: '#fff',
      fontSize: '0.85rem',
      fontWeight: 700,
      fontFamily: "'Montserrat', sans-serif",
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      letterSpacing: '0.05em',
    },
    btnStarted: {
      display: 'inline-block',
      padding: '9px 22px',
      background: '#c1ff00',
      borderRadius: '50px',
      color: '#000',
      fontSize: '0.85rem',
      fontWeight: 800,
      fontFamily: "'Montserrat', sans-serif",
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      letterSpacing: '0.05em',
      border: '2px solid #c1ff00',
    },
    headerButtons: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#090d16', color: '#f1f5f9', fontFamily: "'Montserrat', sans-serif" }}>

      {/* ═══ HEADER — Matches Kenzo Home page exactly ═══ */}
      <header style={s.header}>
        <nav style={s.nav}>

          {/* Logo */}
          <div style={s.logo}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqQ0XxwXAPcD3YCcan5T0oiEuwcuc-WADPsA&s"
              alt="Kenzo Fitness Logo"
              style={s.logoImg}
            />
            <Link to="/" style={{ textDecoration: 'none' }}>
              <span style={s.logoText}>Kenzo Fitness</span>
            </Link>
          </div>

          {/* Nav Links */}
          <ul style={s.navLinks}>
            <li><Link to="/" style={s.navLink(isActive('/'))}>Home</Link></li>
            <li><a href="/#about" style={s.navLink(false)}>About</a></li>
            <li><Link to="/plans" style={s.navLink(isActive('/plans'))}>Plans</Link></li>
            <li><a href="/#trainers" style={s.navLink(false)}>Trainers</a></li>
            <li><a href="/#training" style={s.navLink(false)}>Exercise</a></li>
          </ul>

          {/* Action Buttons */}
          <div style={s.headerButtons}>
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : user.role === 'trainer' ? '/trainer' : '/dashboard'}
                  style={s.btnContact}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  style={{ ...s.btnStarted, cursor: 'pointer' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={s.btnContact}>LOGIN</Link>
                <Link to="/admission" style={s.btnStarted}>GET STARTED</Link>
              </>
            )}
          </div>

        </nav>
      </header>

      {/* ═══ PAGE CONTENT ═══ */}
      <main style={{ flexGrow: 1, paddingTop: '75px' }}>
        <Outlet />
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        background: '#050505',
        borderTop: '1px solid rgba(193,255,0,0.1)',
        padding: '48px 40px 24px',
        fontFamily: "'Montserrat', sans-serif",
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px', marginBottom: '32px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqQ0XxwXAPcD3YCcan5T0oiEuwcuc-WADPsA&s" style={s.logoImg} alt="Logo" />
              <span style={s.logoText}>Kenzo Fitness</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.7 }}>Your Go-To For Personalized Workouts And Elite Coaching.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              {[
                ['Facebook', 'https://img.icons8.com/ios-filled/50/FFFFFF/facebook-new.png'],
                ['Instagram', 'https://img.icons8.com/ios-filled/50/FFFFFF/instagram-new.png'],
                ['Twitter', 'https://img.icons8.com/ios-filled/50/FFFFFF/twitter.png'],
              ].map(([name, icon]) => (
                <a key={name} href="#" style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={icon} alt={name} style={{ width: 16, height: 16 }} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>FOLLOW US ON</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: '#777' }}>
              <li><a href="#" style={{ color: '#777', textDecoration: 'none' }}>Facebook</a></li>
              <li><a href="#" style={{ color: '#777', textDecoration: 'none' }}>Instagram</a></li>
              <li><a href="#" style={{ color: '#777', textDecoration: 'none' }}>YouTube</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>QUICK LINKS</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
              {[['Home', '/'], ['Plans', '/plans'], ['Admission', '/admission'], ['Login', '/login']].map(([n, t]) => (
                <li key={t}><Link to={t} style={{ color: '#777', textDecoration: 'none' }}>{n}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>CONTACT</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: '#777' }}>
              <li>Monday – Sunday</li>
              <li>6:00 AM – 10:00 PM</li>
              <li style={{ color: '#c1ff00', fontWeight: 600 }}>New York, NY 10001</li>
              <li>contact@kenzofitness.com</li>
            </ul>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', textAlign: 'center', fontSize: '0.72rem', color: '#444' }}>
          <p>&copy; 2026 Kenzo Fitness. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
