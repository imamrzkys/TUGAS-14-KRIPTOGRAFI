import { motion } from 'framer-motion';
import { useState } from 'react';

// ===== S-Box / InvSBox data =====
const SBOX = [
  [0x9, 0x4, 0xA, 0xB],
  [0xD, 0x1, 0x8, 0x5],
  [0x6, 0x2, 0x0, 0x3],
  [0xC, 0xE, 0xF, 0x7],
];
const INV_SBOX = [
  [0xA, 0x5, 0x9, 0xB],
  [0x1, 0x7, 0x8, 0xF],
  [0x6, 0x0, 0x2, 0x3],
  [0xC, 0x4, 0xD, 0xE],
];
const MIX_MATRIX = [[1, 4], [4, 1]];
const INV_MIX_MATRIX = [[9, 2], [2, 9]];
const RCON = [0x80, 0x30];

const ENCRYPT_OPS = [
  { op: 'Key Expansion', desc: 'Membangkitkan K0, K1, K2 dari kunci 16-bit menggunakan RotWord, SubWord, dan RCON.' },
  { op: 'AddRoundKey (K0)', desc: 'State plaintext di-XOR dengan kunci ronde K0 sebagai operasi awal.' },
  { op: 'SubNibble — Ronde 1', desc: 'Setiap nibble disubstitusi menggunakan tabel S-Box.' },
  { op: 'ShiftRows — Ronde 1', desc: 'Baris kedua digeser secara siklis ke kiri sebesar satu posisi nibble.' },
  { op: 'MixColumns — Ronde 1', desc: 'Perkalian matriks kolom atas GF(2⁴) dengan matriks [[1,4],[4,1]].' },
  { op: 'AddRoundKey (K1)', desc: 'State di-XOR dengan kunci ronde K1.' },
  { op: 'SubNibble — Ronde 2', desc: 'Substitusi nibble menggunakan S-Box pada ronde akhir.' },
  { op: 'ShiftRows — Ronde 2', desc: 'Pergeseran baris kedua secara siklis ke kiri.' },
  { op: 'AddRoundKey (K2)', desc: 'State di-XOR dengan kunci ronde K2. Keluaran merupakan ciphertext.' },
];

const DECRYPT_OPS = [
  { op: 'Key Expansion', desc: 'Proses pembangkitan kunci identik dengan enkripsi: hasilkan K0, K1, K2.' },
  { op: 'AddRoundKey (K2)', desc: 'State ciphertext di-XOR dengan kunci ronde K2.' },
  { op: 'InvShiftRows — Ronde 1', desc: 'Baris kedua digeser secara siklis ke kanan (kebalikan ShiftRows).' },
  { op: 'InvSubNibble — Ronde 1', desc: 'Substitusi menggunakan Inverse S-Box.' },
  { op: 'AddRoundKey (K1)', desc: 'State di-XOR dengan kunci ronde K1.' },
  { op: 'InvMixColumns — Ronde 1', desc: 'Perkalian matriks dengan matriks invers [[9,2],[2,9]] atas GF(2⁴).' },
  { op: 'InvShiftRows — Ronde 2', desc: 'Pergeseran baris kedua ke kanan.' },
  { op: 'InvSubNibble — Ronde 2', desc: 'Substitusi menggunakan Inverse S-Box pada ronde terakhir.' },
  { op: 'AddRoundKey (K0)', desc: 'State di-XOR dengan kunci ronde K0. Keluaran merupakan plaintext yang dipulihkan.' },
];

// ===== Sub-components =====

function SBoxTable({ data, title, description, isInv = false }) {
  const [hovered, setHovered] = useState(null);
  const headerBg = isInv ? '#5ECFB1' : '#FF85C2';

  return (
    <div className="card-brutal p-8" style={{ background: '#FFFFFF' }}>
      <div style={{
        background: headerBg,
        border: '4px solid #1A1A2E',
        boxShadow: '3px 3px 0px #1A1A2E',
        padding: '12px 20px',
        marginBottom: '1rem',
      }}>
        <h3 style={{ fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase', color: '#1A1A2E' }}>{title}</h3>
      </div>
      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4A4A6A', marginBottom: '1.25rem', lineHeight: 1.6 }}>{description}</p>
      
      <div className="overflow-x-auto">
        <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '300px', margin: '0 auto' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: '#4A4A6A', paddingRight: '12px' }}>baris\kol</th>
              {[0, 1, 2, 3].map(c => (
                <th key={c} style={{
                  padding: '8px', textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: '0.85rem',
                  fontWeight: 900, color: '#1A1A2E',
                }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, r) => (
              <tr key={r}>
                <td style={{
                  padding: '8px', textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: '0.85rem',
                  fontWeight: 900, color: '#1A1A2E', paddingRight: '12px',
                }}>{r}</td>
                {row.map((val, col) => {
                  const id = `${r}-${col}`;
                  const isHov = hovered === id;
                  return (
                    <td
                      key={col}
                      onMouseEnter={() => setHovered(id)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        padding: '10px',
                        textAlign: 'center',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '0.9rem',
                        fontWeight: 900,
                        border: '2px solid #1A1A2E',
                        background: isHov ? '#FDE68A' : '#FFFFFF',
                        color: '#1A1A2E',
                        cursor: 'default',
                        transition: 'background-color 0.1s ease',
                      }}
                    >
                      {val.toString(16).toUpperCase()}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '1.25rem',
            padding: '10px 14px',
            background: '#FFF5FB',
            border: '3px solid #1A1A2E',
            boxShadow: '3px 3px 0px #1A1A2E',
            fontFamily: 'JetBrains Mono',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#1A1A2E',
          }}
        >
          <span>S[{hovered.split('-')[0]}][{hovered.split('-')[1]}] = </span>
          <span style={{ fontWeight: 900, background: '#FF85C2', padding: '2px 6px', border: '2px solid #1A1A2E' }}>
            {data[+hovered.split('-')[0]][+hovered.split('-')[1]].toString(16).toUpperCase()}
          </span>
          <span style={{ color: '#4A4A6A', marginLeft: 12 }}>
            (biner: {data[+hovered.split('-')[0]][+hovered.split('-')[1]].toString(2).padStart(4, '0')}₂)
          </span>
        </motion.div>
      )}
    </div>
  );
}

function MatrixBlock({ matrix, title, description, note }) {
  return (
    <div className="card-brutal p-8" style={{ background: '#FFFFFF' }}>
      <div style={{
        background: '#C084FC',
        border: '4px solid #1A1A2E',
        boxShadow: '3px 3px 0px #1A1A2E',
        padding: '12px 20px',
        marginBottom: '1rem',
      }}>
        <h3 style={{ fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase', color: '#1A1A2E' }}>{title}</h3>
      </div>
      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4A4A6A', marginBottom: '1.25rem', lineHeight: 1.6 }}>{description}</p>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'JetBrains Mono' }}>
        <span style={{ fontSize: '3rem', fontWeight: 300, color: '#1A1A2E', userSelect: 'none' }}>[</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {matrix.map((row, r) => (
            <div key={r} style={{ display: 'flex', gap: 8 }}>
              {row.map((v, c) => (
                <div
                  key={c}
                  style={{
                    width: 44, height: 44,
                    border: '3px solid #1A1A2E',
                    background: '#FFF5FB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.95rem', fontWeight: 900, color: '#1A1A2E',
                    transition: 'all 0.1s ease',
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = '#FFB347';
                    e.target.style.transform = 'translate(-2px, -2px)';
                    e.target.style.boxShadow = '2px 2px 0px #1A1A2E';
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = '#FFF5FB';
                    e.target.style.transform = 'none';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {v}
                </div>
              ))}
            </div>
          ))}
        </div>
        <span style={{ fontSize: '3rem', fontWeight: 300, color: '#1A1A2E', userSelect: 'none' }}>]</span>
      </div>
      {note && (
        <p style={{
          fontFamily: 'JetBrains Mono', fontSize: '0.72rem', fontWeight: 700, color: '#4A4A6A',
          marginTop: 14, background: '#FFF5FB', border: '2px solid #1A1A2E', padding: '6px 12px',
          display: 'inline-block',
        }}>{note}</p>
      )}
    </div>
  );
}

function AlgoTable({ title, ops, mode }) {
  const badgeBg = mode === 'enc' ? '#FF85C2' : '#5ECFB1';

  return (
    <div className="card-brutal p-8" style={{ background: '#FFFFFF' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
        <div style={{ width: 12, height: 12, background: badgeBg, border: '3px solid #1A1A2E' }} />
        <h3 style={{ fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase', color: '#1A1A2E' }}>{title}</h3>
      </div>
      <ol style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {ops.map(({ op, desc }, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
            <span style={{
              width: 24, height: 24,
              background: '#1A1A2E',
              color: '#FFFFFF',
              fontFamily: 'JetBrains Mono',
              fontWeight: 900,
              fontSize: '0.65rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              marginTop: 2,
            }}>
              {i + 1}
            </span>
            <div>
              <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '0.85rem', color: '#1A1A2E' }}>{op}</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4A4A6A', lineHeight: 1.5, marginTop: 2 }}>{desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ===== Main Docs Page =====
export default function Docs() {
  return (
    <div className="page-container" style={{ background: '#FFF5FB', minHeight: '100vh', padding: '0 clamp(1rem, 4vw, 2.5rem)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', paddingTop: '2rem', paddingBottom: '3rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ paddingBottom: '2rem', borderBottom: '4px solid #1A1A2E', marginBottom: '2.5rem' }}
        >
          <div style={{
            display: 'inline-block',
            background: '#C084FC',
            border: '3px solid #1A1A2E',
            boxShadow: '3px 3px 0px #1A1A2E',
            padding: '4px 14px',
            marginBottom: 14,
            fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1A1A2E',
          }}>
            Tabel Referensi · S-AES
          </div>
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#1A1A2E', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 10 }}>
            Referensi Algoritma S-AES
          </h1>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#4A4A6A', maxWidth: 560, lineHeight: 1.6 }}>
            Tabel pencarian, matriks operasi, dan spesifikasi lengkap algoritma Simplified AES sebagai panduan akademis.
          </p>
        </motion.div>

        {/* ===== Alur Operasi ===== */}
        <section style={{ marginBottom: '2.5rem' }}>
          <SectionLabel label="Alur Operasi" />
          <div className="docs-grid" style={{ marginTop: '1.5rem' }}>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <AlgoTable title="Algoritma Enkripsi" ops={ENCRYPT_OPS} mode="enc" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}>
              <AlgoTable title="Algoritma Dekripsi" ops={DECRYPT_OPS} mode="dec" />
            </motion.div>
          </div>
        </section>

        {/* ===== S-Box ===== */}
        <section style={{ marginBottom: '2.5rem' }}>
          <SectionLabel label="Tabel Substitusi (S-Box)" />
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4A4A6A', marginTop: 8, marginBottom: '1.5rem' }}>
            Baris diindeks oleh 2 bit atas nibble; kolom diindeks oleh 2 bit bawah nibble. Arahkan kursor ke sel untuk melihat nilai.
          </p>
          <div className="docs-grid">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SBoxTable data={SBOX} title="S-Box (Enkripsi)" description="Tabel substitusi non-linier untuk operasi SubNibble pada proses enkripsi." />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}>
              <SBoxTable data={INV_SBOX} title="Inverse S-Box (Dekripsi)" description="Tabel substitusi invers untuk operasi InvSubNibble. Berlaku: S⁻¹(S(x)) = x." isInv={true} />
            </motion.div>
          </div>
        </section>

        {/* ===== MixColumns ===== */}
        <section style={{ marginBottom: '2.5rem' }}>
          <SectionLabel label="Matriks MixColumns" />
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4A4A6A', marginTop: 8, marginBottom: '1.5rem' }}>
            Perkalian matriks dilakukan atas Galois Field GF(2⁴) menggunakan polinomial irredusibel x⁴ + x + 1.
          </p>
          <div className="docs-grid">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <MatrixBlock matrix={MIX_MATRIX} title="MixColumns" description="Digunakan dalam enkripsi. Setiap kolom dikalikan dengan matriks ini atas GF(2⁴)." note="Nilai: 1 dan 4 = x² dalam GF(2⁴)" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}>
              <MatrixBlock matrix={INV_MIX_MATRIX} title="Inverse MixColumns" description="Digunakan dalam dekripsi. Merupakan invers dari matriks MixColumns atas GF(2⁴)." note="Nilai: 9 dan 2 = x dalam GF(2⁴)" />
            </motion.div>
          </div>
        </section>

        {/* ===== RCON ===== */}
        <section style={{ marginBottom: '2.5rem' }}>
          <SectionLabel label="Konstanta Ronde (RCON)" />
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4A4A6A', marginTop: 8, marginBottom: '1.5rem' }}>
            Digunakan dalam ekspansi kunci untuk memutus simetri dan mencegah kesamaan antar kunci ronde.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}
          >
            {RCON.map((val, i) => (
              <div key={i} style={{
                flex: 1, minWidth: '160px',
                background: '#FFFFFF',
                border: '4px solid #1A1A2E',
                boxShadow: '4px 4px 0px #1A1A2E',
                padding: '1.5rem',
                textAlign: 'center',
              }}>
                <p style={{ fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4A4A6A', marginBottom: 12 }}>RCON[{i + 1}]</p>
                <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '1.75rem', color: '#FF85C2', marginBottom: 4 }}>
                  {val.toString(16).toUpperCase().padStart(2, '0')}
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1A1A2E', marginLeft: 2 }}>₁₆</span>
                </p>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', fontWeight: 700, color: '#4A4A6A' }}>
                  {val.toString(2).padStart(8, '0')}₂
                </p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ===== GF info ===== */}
        <section style={{ marginBottom: '2.5rem' }}>
          <SectionLabel label="Aritmatika GF(2⁴)" />
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4A4A6A', marginTop: 8, marginBottom: '1.5rem' }}>
            Seluruh operasi perkalian dalam S-AES dilakukan atas Galois Field berorde 16.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="features-grid"
          >
            {[
              { label: 'Field', val: 'GF(2⁴) = GF(16)', note: '16 elemen: 0x0 hingga 0xF', bg: '#FFB8D9' },
              { label: 'Polinomial Irredusibel', val: 'x⁴ + x + 1', note: '= 0x13 = 10011₂', bg: '#B8F0E0' },
              { label: 'Penjumlahan', val: 'a ⊕ b (XOR)', note: 'Tanpa propagasi carry', bg: '#FDE68A' },
            ].map(({ label, val, note, bg }, i) => (
              <div key={i} style={{
                background: bg,
                border: '4px solid #1A1A2E',
                boxShadow: '4px 4px 0px #1A1A2E',
                padding: '1.5rem',
              }}>
                <p style={{ fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1A1A2E', marginBottom: 12 }}>{label}</p>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.9rem', fontWeight: 900, color: '#1A1A2E', marginBottom: 4 }}>{val}</p>
                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#4A4A6A' }}>{note}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ===== State notation ===== */}
        <section style={{ marginBottom: '1rem' }}>
          <SectionLabel label="Notasi State Matrix" />
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4A4A6A', marginTop: 8, marginBottom: '1.5rem' }}>
            Blok 16-bit diatur dalam matriks 2×2 berisi nibble (nilai 4-bit) dengan pengurutan kolom-mayor.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="docs-grid"
          >
            <div style={{
              background: '#FFFFFF',
              border: '4px solid #1A1A2E',
              boxShadow: '4px 4px 0px #1A1A2E',
              padding: '1.5rem',
            }}>
              <p style={{ fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1A1A2E', marginBottom: 16 }}>Layout Matrix</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: '180px' }}>
                {[
                  { n: 'n₀', b: 'bit [15:12]', bg: '#FFB8D9' },
                  { n: 'n₂', b: 'bit [7:4]',   bg: '#B8F0E0' },
                  { n: 'n₁', b: 'bit [11:8]',  bg: '#FDE68A' },
                  { n: 'n₃', b: 'bit [3:0]',   bg: '#E8D5FF' },
                ].map(({ n, b, bg }, i) => (
                  <div key={i} style={{
                    background: bg,
                    border: '3px solid #1A1A2E',
                    padding: '8px',
                    textAlign: 'center',
                  }}>
                    <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '1rem', color: '#1A1A2E' }}>{n}</p>
                    <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', fontWeight: 700, color: '#4A4A6A', marginTop: 2 }}>{b}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: '#FFFFFF',
              border: '4px solid #1A1A2E',
              boxShadow: '4px 4px 0px #1A1A2E',
              padding: '1.5rem',
            }}>
              <p style={{ fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1A1A2E', marginBottom: 16 }}>Urutan Bit</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none' }}>
                {[
                  { n: 'n₀', b: 'bit [15:12] — nibble paling signifikan', bg: '#FFB8D9' },
                  { n: 'n₁', b: 'bit [11:8]  — nibble kedua', bg: '#FDE68A' },
                  { n: 'n₂', b: 'bit [7:4]   — nibble ketiga', bg: '#B8F0E0' },
                  { n: 'n₃', b: 'bit [3:0]   — nibble paling tidak signifikan', bg: '#E8D5FF' },
                ].map(({ n, b, bg }, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'start', gap: 10 }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '0.72rem',
                      background: bg, border: '2px solid #1A1A2E',
                      width: 22, height: 22,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}>{n}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4A4A6A', marginTop: 2 }}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

function SectionLabel({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: '1.25rem', textTransform: 'uppercase', color: '#1A1A2E', letterSpacing: '-0.01em' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 4, background: '#1A1A2E' }} />
    </div>
  );
}
