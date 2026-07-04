import { motion } from 'framer-motion';
import StateMatrix from '../matrix/StateMatrix';
import { ArrowRight } from 'lucide-react';

const OP_COLORS = {
  AddRoundKey:    { bg: '#BFDBFE', label: '#1A1A2E' },
  SubNibble:      { bg: '#FFB8D9', label: '#1A1A2E' },
  InvSubNibble:   { bg: '#FFB8D9', label: '#1A1A2E' },
  ShiftRows:      { bg: '#E8D5FF', label: '#1A1A2E' },
  InvShiftRows:   { bg: '#E8D5FF', label: '#1A1A2E' },
  MixColumns:     { bg: '#B8F0E0', label: '#1A1A2E' },
  InvMixColumns:  { bg: '#B8F0E0', label: '#1A1A2E' },
};

export default function StepCard({ step, index, isActive, onClick }) {
  if (!step) return null;
  const color = OP_COLORS[step.operation] || OP_COLORS.AddRoundKey;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onClick={onClick}
      className={`step-card ${isActive ? 'active' : ''}`}
      style={{
        background: '#FFFFFF',
        borderRadius: 0,
        padding: '1.5rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            background: color.bg,
            border: '3px solid #1A1A2E',
            boxShadow: '2px 2px 0px #1A1A2E',
            fontWeight: 900,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '4px 10px',
            color: '#1A1A2E',
          }}>
            {step.operation}
          </span>
          {step.roundKey && (
            <span style={{
              background: '#FDE68A',
              border: '2px solid #1A1A2E',
              fontWeight: 800,
              fontSize: '0.65rem',
              padding: '2px 8px',
              color: '#1A1A2E',
            }}>
              {step.roundKey}
            </span>
          )}
        </div>
        <div style={{
          background: '#1A1A2E',
          color: '#FFFFFF',
          fontWeight: 900,
          fontSize: '0.75rem',
          width: 28, height: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {index + 1}
        </div>
      </div>

      {/* Label & explanation */}
      <h3 style={{ fontWeight: 900, fontSize: '0.95rem', color: '#1A1A2E', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
        {step.label}
      </h3>
      <p style={{ fontSize: '0.8rem', color: '#4A4A6A', lineHeight: 1.6, marginBottom: '1.25rem' }}>
        {step.explanation}
      </p>

      {/* State before → after */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <StateMatrix state={step.stateBefore} label="Before" size="sm" />
        <div style={{
          background: '#1A1A2E',
          padding: '8px',
          border: '3px solid #1A1A2E',
          boxShadow: '3px 3px 0px #FDE68A',
        }}>
          <ArrowRight size={16} color="#FFFFFF" />
        </div>
        <StateMatrix state={step.stateAfter} label="After" size="sm" />
      </div>

      {/* Expandable trace */}
      {isActive && step.trace && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '3px dashed #1A1A2E' }}
        >
          <TraceDetail step={step} color={color} />
        </motion.div>
      )}
    </motion.div>
  );
}

/* ── Trace Details ─────────────────────────────────────────── */
function TraceBlock({ bg, children }) {
  return (
    <div style={{
      background: bg || '#FFFFFF',
      border: '3px solid #1A1A2E',
      boxShadow: '3px 3px 0px #1A1A2E',
      padding: '1rem 1.25rem',
      marginBottom: '0.75rem',
    }}>
      {children}
    </div>
  );
}

function TraceLabel({ children }) {
  return (
    <p style={{ fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1A1A2E', marginBottom: '0.75rem' }}>
      {children}
    </p>
  );
}

function TraceDetail({ step, color }) {
  if (step.operation === 'SubNibble' || step.operation === 'InvSubNibble') {
    return (
      <div>
        <TraceLabel>Substitution Trace</TraceLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {step.trace?.map((t, i) => (
            <TraceBlock key={i} bg={color.bg}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', fontWeight: 700, color: '#1A1A2E' }}>[{t.position[0]},{t.position[1]}]</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', fontWeight: 600, color: '#4A4A6A' }}>{t.description}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono', fontSize: '0.9rem', fontWeight: 900 }}>
                <span style={{ color: '#1A1A2E' }}>{t.inputHex}</span>
                <ArrowRight size={12} color="#1A1A2E" />
                <span style={{ color: '#1A1A2E', background: '#FDE68A', padding: '2px 6px', border: '2px solid #1A1A2E' }}>{t.outputHex}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono', fontSize: '0.65rem', fontWeight: 600, color: '#4A4A6A', marginTop: 4 }}>
                <span>{t.inputBin}</span>
                <ArrowRight size={10} color="#4A4A6A" />
                <span>{t.outputBin}</span>
              </div>
            </TraceBlock>
          ))}
        </div>
      </div>
    );
  }

  if (step.operation === 'AddRoundKey') {
    return (
      <div>
        <TraceLabel>XOR Operations</TraceLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {step.trace?.map((t, i) => (
            <TraceBlock key={i} bg="#BFDBFE">
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.68rem', fontWeight: 700, color: '#1A1A2E' }}>[{t.position[0]},{t.position[1]}]</span>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', fontWeight: 700, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ color: '#1A1A2E' }}>{t.stateBin} ({t.stateHex})</div>
                <div style={{ color: '#4A4A6A' }}>⊕ {t.keyBin} ({t.keyHex})</div>
                <div style={{ borderTop: '2px solid #1A1A2E', paddingTop: 4, color: '#1A1A2E', fontWeight: 900 }}>= {t.resultBin} ({t.resultHex})</div>
              </div>
            </TraceBlock>
          ))}
        </div>
      </div>
    );
  }

  if (step.operation === 'ShiftRows' || step.operation === 'InvShiftRows') {
    return (
      <div>
        <TraceLabel>Row Shift Details</TraceLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[0, 1].map(r => (
            <TraceBlock key={r} bg="#E8D5FF">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', fontWeight: 900, color: '#1A1A2E', width: 40 }}>Row {r}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {step.trace?.[`row${r}`]?.before?.map((n, i) => (
                    <span key={i} style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '0.85rem', background: '#FFFFFF', border: '2px solid #1A1A2E', padding: '4px 8px', color: '#1A1A2E' }}>{n.toString(16).toUpperCase()}</span>
                  ))}
                </div>
                <ArrowRight size={14} color="#1A1A2E" />
                <div style={{ display: 'flex', gap: 6 }}>
                  {step.trace?.[`row${r}`]?.after?.map((n, i) => (
                    <span key={i} style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '0.85rem', background: step.trace[`row${r}`].shifted ? '#FFB8D9' : '#FFFFFF', border: '2px solid #1A1A2E', padding: '4px 8px', color: '#1A1A2E' }}>{n.toString(16).toUpperCase()}</span>
                  ))}
                </div>
                {r === 0 && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#4A4A6A' }}>unchanged</span>}
                {r === 1 && <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#1A1A2E', background: '#FDE68A', border: '2px solid #1A1A2E', padding: '2px 6px' }}>shifted ↔</span>}
              </div>
            </TraceBlock>
          ))}
        </div>
      </div>
    );
  }

  if (step.operation === 'MixColumns' || step.operation === 'InvMixColumns') {
    return (
      <div>
        <TraceLabel>GF(2⁴) Column Operations</TraceLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {step.trace?.map((t, i) => (
            <TraceBlock key={i} bg="#B8F0E0">
              <p style={{ fontWeight: 900, fontSize: '0.7rem', color: '#1A1A2E', marginBottom: 8, textTransform: 'uppercase' }}>Column {t.col}</p>
              {t.equations?.map((eq, j) => (
                <p key={j} style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', fontWeight: 700, color: '#1A1A2E', marginBottom: 4 }}>{eq}</p>
              ))}
            </TraceBlock>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
