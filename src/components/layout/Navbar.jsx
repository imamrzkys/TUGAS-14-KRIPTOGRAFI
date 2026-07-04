import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/',          label: 'Beranda' },
  { to: '/simulator', label: 'Simulator' },
  { to: '/docs',      label: 'Referensi' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  /* close mobile menu on route change */
  useEffect(() => { setOpen(false); }, [pathname]);

  /* lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  return (
    <header
      style={{
        background: '#FF85C2',
        borderBottom: '4px solid #1A1A2E',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 group">
            <div
              style={{
                background: '#1A1A2E',
                border: '3px solid #1A1A2E',
                boxShadow: '3px 3px 0px #FDE68A',
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="3" y="7" width="12" height="8" rx="1" fill="#FF85C2" stroke="#FF85C2" strokeWidth="0.5"/>
                <path d="M6 7V5.5C6 3.6 7.3 2 9 2C10.7 2 12 3.6 12 5.5V7" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <circle cx="9" cy="11" r="1.5" fill="#1A1A2E"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: '1.25rem', color: '#1A1A2E', letterSpacing: '-0.02em' }}>
              Cipher<span style={{ color: '#1A1A2E' }}>Flow</span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  color: '#1A1A2E',
                  textDecoration: pathname === to ? 'underline' : 'none',
                  textUnderlineOffset: '4px',
                  letterSpacing: '0.05em',
                }}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/simulator"
              className="btn-brutal"
              style={{
                background: '#1A1A2E',
                color: '#FFFFFF',
                padding: '8px 20px',
                fontSize: '0.8rem',
              }}
            >
              Mulai Enkripsi
            </Link>
          </nav>

          {/* ── Hamburger ── */}
          <button
            onClick={() => setOpen(v => !v)}
            className="md:hidden"
            aria-label="Toggle menu"
            style={{
              border: '3px solid #1A1A2E',
              background: '#FFFFFF',
              padding: '6px',
              boxShadow: '2px 2px 0px #1A1A2E',
            }}
          >
            {open ? <X size={20} color="#1A1A2E" /> : <Menu size={20} color="#1A1A2E" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden', borderTop: '4px solid #1A1A2E', background: '#FFB8D9' }}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    color: '#1A1A2E',
                    padding: '12px 16px',
                    background: '#FFFFFF',
                    border: '3px solid #1A1A2E',
                    boxShadow: '3px 3px 0px #1A1A2E',
                    display: 'block',
                  }}
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/simulator"
                className="btn-brutal"
                style={{
                  background: '#1A1A2E',
                  color: '#FFFFFF',
                  padding: '12px 20px',
                  fontSize: '0.9rem',
                }}
              >
                Mulai Enkripsi →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
