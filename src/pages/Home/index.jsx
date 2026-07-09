import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const FEATURES = [
  { title: 'Visualisasi Bertahap', desc: 'Setiap operasi S-AES dianimasikan secara real-time disertai transformasi state matrix yang terstruktur.', label: '01', bg: '#FFB8D9' },
  { title: 'Key Expansion', desc: 'Proses pembangkitan kunci K0, K1, K2 melalui RotWord, SubWord, dan RCON ditampilkan secara eksplisit.', label: '02', bg: '#B8F0E0' },
  { title: 'Aritmatika GF(2⁴)', desc: 'Perkalian Galois Field ditelusuri langkah demi langkah menggunakan algoritma petani untuk pemahaman mendalam.', label: '03', bg: '#FFD9A8' },
  { title: 'Enkripsi & Dekripsi', desc: 'Mendukung cipher maju dan cipher balik dengan Inverse S-Box, InvShiftRows, dan InvMixColumns.', label: '04', bg: '#E8D5FF' },
  { title: 'Tabel Referensi', desc: 'S-Box, Inverse S-Box, matriks MixColumns, konstanta RCON, dan notasi state matrix tersedia lengkap.', label: '05', bg: '#FEF3C7' },
  { title: 'Test Vector Terverifikasi', desc: 'Algoritma diverifikasi menggunakan test vector dari buku teks Stallings untuk memastikan kebenaran implementasi.', label: '06', bg: '#BFDBFE' },
];

const STATS = [
  { value: '9', label: 'Operasi S-AES' },
  { value: '3', label: 'Round Keys' },
  { value: '16-bit', label: 'Ukuran Blok' },
  { value: '100%', label: 'Open Source' },
];

const ALGORITHM_STEPS = [
  { round: 'Key Expansion', ops: 'Membangkitkan K0, K1, K2 dari kunci 16-bit menggunakan RotWord, SubWord, dan RCON.', bg: '#FFB8D9', num: '01' },
  { round: 'Initial AddRoundKey', ops: 'State plaintext di-XOR dengan kunci ronde K0 sebelum ronde dimulai.', bg: '#B8F0E0', num: '02' },
  { round: 'Round 1', ops: 'SubNibble → ShiftRows → MixColumns → AddRoundKey (K1)', bg: '#FDE68A', num: '03' },
  { round: 'Round 2 (Final)', ops: 'SubNibble → ShiftRows → AddRoundKey (K2). Tanpa MixColumns.', bg: '#E8D5FF', num: '04' },
];

const PIPELINE = ['Plaintext', 'AddRoundKey', 'SubNibble', 'ShiftRows', 'MixColumns', 'AddRoundKey', 'SubNibble', 'ShiftRows', 'AddRoundKey', 'Ciphertext'];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#FFF5FB', minHeight: '100vh' }}>

      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════ */}
      <section style={{
        background: '#FDE68A',
        borderBottom: '4px solid #1A1A2E',
        paddingTop: 'calc(3rem + 72px)',
        paddingBottom: '3rem',
        paddingLeft: 'clamp(1rem, 5vw, 5rem)',
        paddingRight: 'clamp(1rem, 5vw, 5rem)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#FFFFFF',
              border: '3px solid #1A1A2E',
              boxShadow: '3px 3px 0px #1A1A2E',
              padding: '6px 16px',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ width: 8, height: 8, background: '#FF85C2', border: '2px solid #1A1A2E' }} />
            <span style={{ fontWeight: 900, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1A1A2E' }}>
              Platform Edukasi Kriptografi
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontWeight: 900,
              fontSize: 'clamp(3rem, 8vw, 6.5rem)',
              lineHeight: 1.0,
              color: '#1A1A2E',
              textTransform: 'uppercase',
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
            }}
          >
            CIPHER<span style={{ color: '#FF85C2', WebkitTextStroke: '2px #1A1A2E' }}>FLOW</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              fontWeight: 700,
              color: '#1A1A2E',
              maxWidth: 600,
              lineHeight: 1.5,
              marginBottom: '2rem',
            }}
          >
            Platform visualisasi interaktif algoritma{' '}
            <span style={{ background: '#FF85C2', padding: '2px 8px', border: '2px solid #1A1A2E' }}>
              Simplified AES (S-AES)
            </span>{' '}
            — pahami setiap langkah enkripsi secara mendalam.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: '3rem' }}
          >
            <button
              onClick={() => navigate('/simulator')}
              className="btn-brutal"
              style={{ background: '#1A1A2E', color: '#FFFFFF', padding: '14px 32px', fontSize: '1rem' }}
            >
              Mulai Simulator <ArrowRight size={18} />
            </button>
            <Link
              to="/docs"
              className="btn-brutal"
              style={{ background: '#FFFFFF', color: '#1A1A2E', padding: '14px 32px', fontSize: '1rem', textDecoration: 'none' }}
            >
              Lihat Referensi
            </Link>
          </motion.div>

          {/* Pipeline strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PIPELINE.map((label, i) => (
                <span key={i} style={{
                  background: i === 0 || i === PIPELINE.length - 1 ? '#FF85C2' : '#FFFFFF',
                  border: '2px solid #1A1A2E',
                  fontFamily: 'JetBrains Mono',
                  fontWeight: 900,
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  padding: '4px 12px',
                  color: '#1A1A2E',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {label}
                  {i < PIPELINE.length - 1 && <ArrowRight size={10} />}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS BAR
          ═══════════════════════════════════════════════════════ */}
      <section style={{
        background: '#5ECFB1',
        borderBottom: '4px solid #1A1A2E',
        padding: '2rem clamp(1rem, 5vw, 5rem)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }} className="stats-grid">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{ textAlign: 'center' }}
            >
              <p style={{ fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#1A1A2E', lineHeight: 1.1 }}>{value}</p>
              <p style={{ fontWeight: 900, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1A1A2E', marginTop: 4 }}>{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURE CARDS
          ═══════════════════════════════════════════════════════ */}
      <section style={{
        background: '#FFF5FB',
        borderBottom: '4px solid #1A1A2E',
        padding: '4rem clamp(1rem, 5vw, 5rem)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '2.5rem' }}
          >
            <p style={{ fontWeight: 900, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#4A4A6A', marginBottom: 8 }}>
              Fitur Platform
            </p>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.75rem, 5vw, 3.5rem)', color: '#1A1A2E', textTransform: 'uppercase', lineHeight: 1.1 }}>
              Semua yang kamu butuhkan
            </h2>
          </motion.div>

          <div className="features-grid">
            {FEATURES.map(({ title, desc, label, bg }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card-brutal"
                style={{ background: bg, padding: '2rem' }}
              >
                <p style={{ fontWeight: 900, fontSize: '2.5rem', color: '#1A1A2E', opacity: 0.15, lineHeight: 1, marginBottom: '0.5rem' }}>{label}</p>
                <h3 style={{ fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase', color: '#1A1A2E', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>{title}</h3>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1A1A2E', lineHeight: 1.65 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS / ALGORITHM
          ═══════════════════════════════════════════════════════ */}
      <section style={{
        background: '#FFFFFF',
        borderBottom: '4px solid #1A1A2E',
        padding: '5rem clamp(1.5rem, 5vw, 5rem)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '3rem' }}
          >
            <p style={{ fontWeight: 900, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#4A4A6A', marginBottom: 8 }}>Cara Kerja</p>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#1A1A2E', textTransform: 'uppercase', lineHeight: 1.1 }}>
              Alur Enkripsi S-AES
            </h2>
          </motion.div>

          <div className="algo-grid">
            {ALGORITHM_STEPS.map(({ round, ops, bg, num }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: '#FFFFFF',
                  border: '4px solid #1A1A2E',
                  boxShadow: '4px 4px 0px #1A1A2E',
                  padding: '1.5rem',
                  display: 'flex',
                  gap: 16,
                }}
              >
                <div style={{
                  background: '#1A1A2E', color: '#FFFFFF',
                  fontWeight: 900, fontSize: '0.85rem',
                  minWidth: 44, height: 44,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>{num}</div>
                <div>
                  <h3 style={{ fontWeight: 900, fontSize: '0.95rem', textTransform: 'uppercase', color: '#1A1A2E', marginBottom: 6 }}>{round}</h3>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4A4A6A', lineHeight: 1.6 }}>{ops}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* State Matrix Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginTop: '3rem' }}
          >
            <p style={{ fontWeight: 900, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4A4A6A', marginBottom: 16 }}>
              State Matrix 2×2
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start' }}>
              {[
                { label: 'n₀', sublabel: 'bit [15:12]', bg: '#FFB8D9' },
                { label: 'n₂', sublabel: 'bit [7:4]',   bg: '#B8F0E0' },
                { label: 'n₁', sublabel: 'bit [11:8]',  bg: '#FDE68A' },
                { label: 'n₃', sublabel: 'bit [3:0]',   bg: '#E8D5FF' },
              ].map(({ label, sublabel, bg }, i) => (
                <div key={i} style={{
                  background: bg,
                  border: '4px solid #1A1A2E',
                  boxShadow: '4px 4px 0px #1A1A2E',
                  padding: '1rem 1.5rem',
                  textAlign: 'center',
                  minWidth: 100,
                }}>
                  <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '1.25rem', color: '#1A1A2E' }}>{label}</p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', fontWeight: 700, color: '#4A4A6A', marginTop: 4 }}>{sublabel}</p>
                </div>
              ))}

              {/* Round Keys */}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[
                  { label: 'K0', bg: '#FFB8D9' },
                  { label: 'K1', bg: '#B8F0E0' },
                  { label: 'K2', bg: '#E8D5FF' },
                ].map(({ label, bg }) => (
                  <div key={label} style={{
                    background: bg,
                    border: '4px solid #1A1A2E',
                    boxShadow: '4px 4px 0px #1A1A2E',
                    padding: '12px 24px',
                    fontWeight: 900, fontSize: '0.95rem', color: '#1A1A2E',
                  }}>{label}</div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA BOTTOM
          ═══════════════════════════════════════════════════════ */}
      <section style={{
        background: '#FFB347',
        borderBottom: '4px solid #1A1A2E',
        padding: '5rem clamp(1.5rem, 5vw, 5rem)',
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 4rem)', textTransform: 'uppercase', color: '#1A1A2E', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Siap Mulai<br/>Eksplorasi?
          </h2>
          <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1A1A2E', marginBottom: '2.5rem', maxWidth: 500, margin: '0 auto 2.5rem' }}>
            Masukkan plaintext dan kunci 16-bit, lalu saksikan setiap langkah enkripsi S-AES secara interaktif.
          </p>
          <button
            onClick={() => navigate('/simulator')}
            className="btn-brutal"
            style={{ background: '#1A1A2E', color: '#FFFFFF', padding: '18px 48px', fontSize: '1.1rem' }}
          >
            Buka Simulator →
          </button>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════ */}
      <footer style={{
        background: '#1A1A2E',
        borderTop: '4px solid #FF85C2',
        padding: '2rem clamp(1.5rem, 5vw, 5rem)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: '#FF85C2', border: '2px solid #FF85C2',
              width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontWeight: 900, fontSize: '0.75rem', color: '#1A1A2E' }}>CF</span>
            </div>
            <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#FFFFFF' }}>CipherFlow</span>
          </div>
          <p style={{ fontWeight: 700, fontSize: '0.8rem', color: '#94A3B8', textAlign: 'center' }}>
            Platform Visualisasi S-AES · Proyek Kriptografi Akademik
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {[{ to: '/', label: 'Beranda' }, { to: '/simulator', label: 'Simulator' }, { to: '/docs', label: 'Referensi' }].map(({ to, label }) => (
              <Link key={to} to={to} style={{ fontWeight: 800, fontSize: '0.8rem', color: '#FFFFFF', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = '#FF85C2'}
                onMouseLeave={e => e.target.style.color = '#FFFFFF'}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
