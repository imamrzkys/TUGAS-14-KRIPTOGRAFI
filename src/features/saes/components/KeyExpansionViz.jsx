import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import StateMatrix from '../../../components/matrix/StateMatrix';

const W_COLORS = {
  w0: '#FFB8D9',
  w1: '#B8F0E0',
  w2: '#FDE68A',
  w3: '#E8D5FF',
  w4: '#FFD9A8',
  w5: '#BFDBFE',
};

function WordBox({ label, hex, description, bg = '#FFFFFF', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      style={{
        background: bg,
        border: '3px solid #1A1A2E',
        boxShadow: '3px 3px 0px #1A1A2E',
        padding: '12px 14px',
        textAlign: 'center',
      }}
    >
      <p style={{ fontWeight: 900, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4A4A6A', marginBottom: 4 }}>{label}</p>
      <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '1rem', color: '#1A1A2E' }}>{hex}</p>
      {description && <p style={{ fontSize: '0.62rem', fontWeight: 600, color: '#4A4A6A', marginTop: 4 }}>{description}</p>}
    </motion.div>
  );
}

function StepCard({ title, children }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '4px solid #1A1A2E',
      boxShadow: '4px 4px 0px #1A1A2E',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: -4, left: -4,
        background: '#1A1A2E',
        color: '#FFFFFF',
        fontWeight: 900,
        fontSize: '0.65rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        padding: '6px 14px',
      }}>
        {title}
      </div>
      <div style={{ marginTop: '1.25rem' }}>
        {children}
      </div>
    </div>
  );
}

function XorLine({ children }) {
  return (
    <div style={{
      fontFamily: 'JetBrains Mono',
      fontWeight: 700,
      fontSize: '0.85rem',
      color: '#1A1A2E',
      padding: '10px 14px',
      borderBottom: '2px dashed #1A1A2E',
      lineHeight: 2,
      marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

export default function KeyExpansionViz({ keyData }) {
  if (!keyData) return null;
  const { display, K0Matrix, K1Matrix, K2Matrix } = keyData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 900, fontSize: '1.25rem', color: '#1A1A2E', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Key Expansion</h3>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4A4A6A', marginTop: 4 }}>16-bit key → tiga round key (K0, K1, K2)</p>
      </div>

      {/* Round Keys Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {[
          { label: 'K0 (Round 0)', matrix: K0Matrix, hex: display.K0, bg: '#FFB8D9' },
          { label: 'K1 (Round 1)', matrix: K1Matrix, hex: display.K1, bg: '#B8F0E0' },
          { label: 'K2 (Round 2)', matrix: K2Matrix, hex: display.K2, bg: '#E8D5FF' },
        ].map(({ label, matrix, hex, bg }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: bg,
              border: '4px solid #1A1A2E',
              boxShadow: '4px 4px 0px #1A1A2E',
              padding: '1.25rem',
              textAlign: 'center',
            }}
          >
            <p style={{ fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1A1A2E', marginBottom: 8 }}>{label}</p>
            <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '1rem', color: '#1A1A2E', marginBottom: 12 }}>{hex}</p>
            <StateMatrix state={matrix} size="sm" />
          </motion.div>
        ))}
      </div>

      {/* ── Expansion Trace ── */}
      <p style={{ fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1A1A2E', marginBottom: '1rem', borderBottom: '3px solid #1A1A2E', paddingBottom: 8 }}>
        Expansion Trace
      </p>

      {/* Step 1: Initial Words */}
      <StepCard title="Step 1 — Initial Words">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <WordBox label="w0 (upper byte)" hex={display.w0} bg={W_COLORS.w0} description="bits [15:8] of key" delay={0} />
          <WordBox label="w1 (lower byte)" hex={display.w1} bg={W_COLORS.w1} description="bits [7:0] of key" delay={0.05} />
        </div>
      </StepCard>

      {/* Step 2-5: Generate K1 */}
      <StepCard title="Steps 2–5 — Generate K1">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-center mb-6">
          <WordBox label="RotWord(w1)" hex={display.rotW1} bg="#E8D5FF" description={`swap nibbles of ${display.w1}`} delay={0.1} />
          <div className="flex flex-col items-center py-2 md:py-0">
            <ArrowRight size={20} className="hidden md:block" color="#1A1A2E" strokeWidth={3} />
            <span className="block md:hidden text-lg font-black text-dark">↓</span>
          </div>
          <WordBox label="SubWord(RotWord(w1))" hex={display.subRotW1} bg="#BFDBFE" description="apply S-Box" delay={0.15} />
        </div>

        <XorLine>
          w2 = w0 ⊕ RCON[1] ⊕ SubWord(RotWord(w1))<br/>
          <span style={{ fontWeight: 900, color: '#1A1A2E' }}>{display.w0} ⊕ {display.rcon1} ⊕ {display.subRotW1} = {display.w2}</span>
        </XorLine>

        <XorLine>
          w3 = w2 ⊕ w1<br/>
          <span style={{ fontWeight: 900 }}>{display.w2} ⊕ {display.w1} = {display.w3}</span>
        </XorLine>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <WordBox label="w2" hex={display.w2} bg={W_COLORS.w2} delay={0.2} />
          <WordBox label="w3" hex={display.w3} bg={W_COLORS.w3} delay={0.25} />
        </div>
      </StepCard>

      {/* Step 6-9: Generate K2 */}
      <StepCard title="Steps 6–9 — Generate K2">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-center mb-6">
          <WordBox label="RotWord(w3)" hex={display.rotW3} bg="#E8D5FF" description={`swap nibbles of ${display.w3}`} delay={0.3} />
          <div className="flex flex-col items-center py-2 md:py-0">
            <ArrowRight size={20} className="hidden md:block" color="#1A1A2E" strokeWidth={3} />
            <span className="block md:hidden text-lg font-black text-dark">↓</span>
          </div>
          <WordBox label="SubWord(RotWord(w3))" hex={display.subRotW3} bg="#BFDBFE" description="apply S-Box" delay={0.35} />
        </div>

        <XorLine>
          w4 = w2 ⊕ RCON[2] ⊕ SubWord(RotWord(w3))<br/>
          <span style={{ fontWeight: 900 }}>{display.w2} ⊕ {display.rcon2} ⊕ {display.subRotW3} = {display.w4}</span>
        </XorLine>

        <XorLine>
          w5 = w4 ⊕ w3<br/>
          <span style={{ fontWeight: 900 }}>{display.w4} ⊕ {display.w3} = {display.w5}</span>
        </XorLine>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <WordBox label="w4" hex={display.w4} bg={W_COLORS.w4} delay={0.4} />
          <WordBox label="w5" hex={display.w5} bg={W_COLORS.w5} delay={0.45} />
        </div>
      </StepCard>
    </div>
  );
}
