import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, ChevronDown, AlertCircle } from 'lucide-react';
import { useSAES, TEST_VECTOR } from '../../features/saes/hooks/useSAES';
import StepCard from '../../components/cards/StepCard';
import KeyExpansionViz from '../../features/saes/components/KeyExpansionViz';
import ResultPanel from '../../features/saes/components/ResultPanel';
import GFViz from '../../features/saes/components/GFViz';

/* ── Styles ───────────────────────────────────────────────── */
const S = {
  page: { minHeight: '100vh', background: '#FFF5FB', paddingTop: 80, paddingBottom: 64 },
  wrap: { maxWidth: 960, margin: '0 auto', padding: '0 clamp(0.875rem, 4vw, 2.5rem)' },
  label: { fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1A1A2E', marginBottom: 8, display: 'block' },
};

/* ── Input Field ─────────────────────────────────────────── */
function BinaryInput({ label, value, onChange, error, hexLabel, placeholder }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || '0000000000000000'}
        className="input-brutal"
        style={{ width: '100%', padding: '14px 16px', fontSize: '1rem', letterSpacing: '0.1em' }}
        maxLength={16}
        spellCheck={false}
      />
      <div style={{ minHeight: 22, marginTop: 6 }}>
        {error ? (
          <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 700, color: '#FF4444' }}>
            <AlertCircle size={13} /> {error}
          </p>
        ) : hexLabel ? (
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', fontWeight: 700, color: '#4A4A6A' }}>
            HEX: <span style={{ color: '#1A1A2E', fontWeight: 900 }}>{hexLabel}</span>
          </p>
        ) : (
          <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#4A4A6A' }}>Format: 16 digit biner (0 atau 1)</p>
        )}
      </div>
    </div>
  );
}

/* ── Collapse Section ────────────────────────────────────── */
function CollapseSection({ title, subtitle, open, onToggle, accent = '#FF85C2', children }) {
  return (
    <div style={{ border: '4px solid #1A1A2E', boxShadow: '4px 4px 0px #1A1A2E', marginBottom: 0 }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          background: open ? accent : '#FFFFFF',
          border: 'none',
          borderBottom: open ? '4px solid #1A1A2E' : 'none',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
          <div style={{
            width: 10, height: 10,
            background: open ? '#1A1A2E' : '#CCCCCC',
            border: '2px solid #1A1A2E',
          }} />
          <div>
            <p style={{ fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', color: '#1A1A2E' }}>{title}</p>
            <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#4A4A6A', marginTop: 2 }}>{subtitle}</p>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={20} color="#1A1A2E" strokeWidth={3} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '1.5rem 1.25rem', background: '#FFFFFF' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIMULATOR PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Simulator() {
  const saes = useSAES();
  const [mode, setMode] = useState('encrypt');
  const [activeStep, setActiveStep] = useState(null);
  const [showKeyExp, setShowKeyExp] = useState(false);
  const [showGF, setShowGF] = useState(false);
  const stepsRef = useRef(null);

  const binToHex = (bin) => bin && bin.length === 16 ? '0x' + parseInt(bin, 2).toString(16).toUpperCase().padStart(4, '0') : null;

  return (
    <div style={S.page}>
      <div style={S.wrap}>

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ paddingBottom: '2rem', borderBottom: '4px solid #1A1A2E', marginBottom: '2rem' }}
        >
          <div style={{
            display: 'inline-block',
            background: '#FF85C2',
            border: '3px solid #1A1A2E',
            boxShadow: '3px 3px 0px #1A1A2E',
            padding: '4px 14px',
            marginBottom: 14,
            fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1A1A2E',
          }}>
            S-AES Simulator
          </div>
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#1A1A2E', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 10 }}>
            Laboratorium Cipher Interaktif
          </h1>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#4A4A6A', maxWidth: 560, lineHeight: 1.6 }}>
            Masukkan plaintext dan kunci biner 16-bit, lalu jalankan enkripsi atau dekripsi untuk melihat setiap tahapan S-AES secara visual.
          </p>
        </motion.div>

        {/* ── INPUT PANEL ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            background: '#FFFFFF',
            border: '4px solid #1A1A2E',
            boxShadow: '6px 6px 0px #1A1A2E',
            padding: '1.75rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={S.label}>Mode:</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setMode('encrypt')}
                className="btn-brutal"
                style={{
                  background: mode === 'encrypt' ? '#FF85C2' : '#FFFFFF',
                  color: '#1A1A2E',
                  padding: '8px 20px',
                  fontSize: '0.8rem',
                }}
              >
                Enkripsi
              </button>
              <button
                onClick={() => setMode('decrypt')}
                className="btn-brutal"
                style={{
                  background: mode === 'decrypt' ? '#5ECFB1' : '#FFFFFF',
                  color: '#1A1A2E',
                  padding: '8px 20px',
                  fontSize: '0.8rem',
                }}
              >
                Dekripsi
              </button>
            </div>
          </div>

          {/* Input grid */}
          <div className="input-grid" style={{ marginBottom: '1.5rem' }}>
            <BinaryInput
              label="Plaintext / Ciphertext — Format Biner (16-bit)"
              value={saes.plaintextBin}
              onChange={saes.handlePlaintextChange}
              error={saes.errors.plaintext}
              hexLabel={binToHex(saes.plaintextBin)}
            />
            <BinaryInput
              label="Kunci — Format Biner (16-bit)"
              value={saes.keyBin}
              onChange={saes.handleKeyChange}
              error={saes.errors.key}
              hexLabel={binToHex(saes.keyBin)}
            />
          </div>

          {/* Action row */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: '1.25rem', borderTop: '3px dashed #1A1A2E', alignItems: 'center' }}>
            <button
              onClick={mode === 'encrypt' ? saes.handleEncrypt : saes.handleDecrypt}
              className="btn-brutal"
              style={{ background: '#FFB347', color: '#1A1A2E', padding: '10px 24px', fontSize: '0.875rem', flexShrink: 0 }}
            >
              {mode === 'encrypt' ? 'Enkripsi' : 'Dekripsi'} <ArrowRight size={15} />
            </button>
            <button
              onClick={saes.reset}
              className="btn-brutal"
              style={{ background: '#FFFFFF', color: '#1A1A2E', padding: '10px 18px', fontSize: '0.8rem', flexShrink: 0 }}
            >
              <RotateCcw size={14} /> Reset
            </button>
            <button
              onClick={saes.loadTestVector}
              className="btn-brutal"
              style={{ background: '#C084FC', color: '#1A1A2E', padding: '10px 18px', fontSize: '0.8rem', flexShrink: 0 }}
            >
              Test Vector
            </button>
          </div>
        </motion.div>

        {/* ── RESULTS ── */}
        <AnimatePresence>
          {saes.result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
            >
              {/* Result panel */}
              <ResultPanel result={saes.result} />

              {/* Key Expansion */}
              <CollapseSection
                title="Ekspansi Kunci (Key Expansion)"
                subtitle="Pelacakan pembangkitan K0 → K1 → K2"
                open={showKeyExp}
                onToggle={() => setShowKeyExp(v => !v)}
                accent="#FFD9A8"
              >
                <KeyExpansionViz keyData={saes.result.keyData} />
              </CollapseSection>

              {/* GF Explorer */}
              <CollapseSection
                title="Penjelajah Aritmatika GF(2⁴)"
                subtitle="Perkalian Galois Field secara interaktif"
                open={showGF}
                onToggle={() => setShowGF(v => !v)}
                accent="#B8F0E0"
              >
                <GFViz />
              </CollapseSection>

              {/* Operation Steps */}
              <div ref={stepsRef}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingBottom: '1rem',
                  borderBottom: '4px solid #1A1A2E',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap', gap: 10,
                }}>
                  <h2 style={{ fontWeight: 900, fontSize: '1.25rem', textTransform: 'uppercase', color: '#1A1A2E' }}>
                    Langkah-langkah Operasi
                  </h2>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '0.7rem',
                      background: '#FFF5FB', border: '2px solid #1A1A2E',
                      padding: '4px 12px', color: '#1A1A2E',
                    }}>
                      {saes.result.steps.length} langkah
                    </span>
                    <span style={{
                      fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '0.7rem',
                      background: saes.result.mode === 'encrypt' ? '#FFB8D9' : '#B8F0E0',
                      border: '2px solid #1A1A2E',
                      padding: '4px 12px', color: '#1A1A2E',
                    }}>
                      {saes.result.mode === 'encrypt' ? 'Enkripsi' : 'Dekripsi'}
                    </span>
                  </div>
                </div>

                {/* Step scroll tabs */}
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: '1.25rem' }}
                  className="scrollbar-none">
                  {saes.result.steps.map((step, i) => (
                    <button
                      key={step.id}
                      onClick={() => {
                        setActiveStep(prev => prev === step.id ? null : step.id);
                        setTimeout(() => {
                          document.getElementById(`step-${step.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 80);
                      }}
                      style={{
                        flexShrink: 0,
                        fontFamily: 'JetBrains Mono',
                        fontWeight: 900,
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        padding: '6px 14px',
                        border: '3px solid #1A1A2E',
                        background: activeStep === step.id ? '#1A1A2E' : '#FFFFFF',
                        color: activeStep === step.id ? '#FFFFFF' : '#1A1A2E',
                        boxShadow: activeStep === step.id ? '2px 2px 0px #FFB347' : '2px 2px 0px #1A1A2E',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ opacity: 0.5 }}>{i + 1} </span>{step.operation}
                    </button>
                  ))}
                </div>

                {/* Step Cards Grid */}
                <div className="steps-grid">
                  {saes.result.steps.map((step, i) => (
                    <div id={`step-${step.id}`} key={step.id}>
                      <StepCard
                        step={step}
                        index={i}
                        isActive={activeStep === step.id}
                        onClick={() => setActiveStep(prev => prev === step.id ? null : step.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state ── */}
        {!saes.result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: '#FFFFFF',
              border: '4px solid #1A1A2E',
              boxShadow: '4px 4px 0px #1A1A2E',
              padding: '3rem',
              textAlign: 'center',
              marginTop: '1rem',
            }}
          >
            <div style={{
              width: 64, height: 64,
              background: '#FDE68A',
              border: '4px solid #1A1A2E',
              boxShadow: '4px 4px 0px #1A1A2E',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '1.75rem',
            }}>
              🔐
            </div>
            <h3 style={{ fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase', color: '#1A1A2E', marginBottom: 8 }}>
              Simulator Siap
            </h3>
            <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#4A4A6A' }}>
              Masukkan plaintext dan kunci biner 16-bit, lalu tekan tombol Enkripsi atau muat Test Vector.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
