import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gfMultiply } from '../logic/gf';

const NIBBLE_OPTIONS = Array.from({ length: 16 }, (_, i) => i);

function NibbleSelect({ value, onChange, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <span style={{ fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1A1A2E' }}>{label}</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {NIBBLE_OPTIONS.map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            style={{
              width: 40, height: 40,
              fontFamily: 'JetBrains Mono',
              fontWeight: 900,
              fontSize: '0.85rem',
              border: '3px solid #1A1A2E',
              background: value === n ? '#FFB347' : '#FFFFFF',
              boxShadow: value === n ? '2px 2px 0px #1A1A2E' : 'none',
              color: '#1A1A2E',
              cursor: 'pointer',
              transition: 'all 0.1s ease',
            }}
          >
            {n.toString(16).toUpperCase()}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '0.9rem', color: '#1A1A2E' }}>
          {value.toString(16).toUpperCase()} = {value.toString(2).padStart(4, '0')}₂
        </p>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', fontWeight: 600, color: '#4A4A6A' }}>decimal: {value}</p>
      </div>
    </div>
  );
}

export default function GFViz() {
  const [a, setA] = useState(4);
  const [b, setB] = useState(5);
  const { result, steps } = gfMultiply(a, b);

  const stepBg = (step) => {
    if (step.final)     return '#FDE68A';
    if (step.reduction) return '#FFD9A8';
    return '#FFF5FB';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Title */}
      <div>
        <h3 style={{ fontWeight: 900, fontSize: '1.2rem', color: '#1A1A2E', textTransform: 'uppercase' }}>GF(2⁴) Multiplication</h3>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4A4A6A', marginTop: 4 }}>
          Pilih dua nibble untuk melihat langkah perkalian Galois Field
        </p>
      </div>

      {/* Nibble Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-center">
        <NibbleSelect value={a} onChange={setA} label="Operand A" />

        <div className="flex flex-col items-center gap-3 py-4 md:py-0">
          <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '1.75rem', color: '#1A1A2E' }}>×</span>
          <motion.div
            key={`${a}-${b}`}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: '#FFB347',
              border: '4px solid #1A1A2E',
              boxShadow: '4px 4px 0px #1A1A2E',
              padding: '1rem 1.25rem',
              textAlign: 'center',
              minWidth: 100,
            }}
          >
            <p style={{ fontWeight: 900, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1A1A2E', marginBottom: 6 }}>Result</p>
            <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '1.75rem', color: '#1A1A2E' }}>
              {result.toString(16).toUpperCase()}
            </p>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', fontWeight: 700, color: '#4A4A6A', marginTop: 4 }}>
              {result.toString(2).padStart(4, '0')}₂
            </p>
          </motion.div>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', fontWeight: 700, color: '#4A4A6A' }}>mod (x⁴+x+1)</span>
        </div>

        <NibbleSelect value={b} onChange={setB} label="Operand B" />
      </div>

      {/* Step-by-step trace */}
      <div>
        <p style={{ fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1A1A2E', marginBottom: 12, borderBottom: '3px solid #1A1A2E', paddingBottom: 8 }}>
          Multiplication Steps (Peasant's Algorithm)
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <AnimatePresence mode="sync">
            {steps.map((step, i) => (
              <motion.div
                key={`${a}-${b}-${i}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                style={{
                  background: stepBg(step),
                  border: '3px solid #1A1A2E',
                  boxShadow: step.final ? '3px 3px 0px #1A1A2E' : 'none',
                  padding: '10px 14px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '0.8rem',
                  fontWeight: step.final ? 900 : 700,
                  color: '#1A1A2E',
                }}
              >
                <span style={{ fontWeight: 900, color: '#4A4A6A', marginRight: 12 }}>Step {i + 1}:</span>
                {step.description}
                {step.final && (
                  <span style={{ marginLeft: 12, fontWeight: 900, color: '#1A1A2E' }}>
                    → {result.toString(16).toUpperCase()}
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Irreducible polynomial info */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        background: '#B8F0E0',
        border: '4px solid #1A1A2E',
        boxShadow: '4px 4px 0px #1A1A2E',
        padding: '1rem 1.25rem',
      }}>
        <div style={{
          background: '#1A1A2E', color: '#FFFFFF',
          fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '0.85rem',
          width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>p</div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', fontWeight: 700, color: '#1A1A2E' }}>
          <span style={{ fontWeight: 900 }}>Irreducible polynomial:</span> x⁴ + x + 1 = 10011₂ = 0x13
        </div>
      </div>
    </div>
  );
}
