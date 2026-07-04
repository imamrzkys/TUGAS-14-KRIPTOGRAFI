import { motion, AnimatePresence } from 'framer-motion';
import { nibbleToHex } from '../../features/saes/logic/state';

/* Pastel cell colours per position */
const CELL_COLORS = [
  ['#FFB8D9', '#B8F0E0'],  // row0: col0=pink, col1=tosca
  ['#FDE68A', '#E8D5FF'],  // row1: col0=yellow, col1=purple
];

const sizeMap = {
  sm: { minWH: 56, textSz: '0.7rem', subSz: '0.6rem', p: 8 },
  md: { minWH: 72, textSz: '0.85rem', subSz: '0.68rem', p: 10 },
  lg: { minWH: 84, textSz: '1rem', subSz: '0.75rem', p: 12 },
};

/**
 * StateMatrix — 2×2 S-AES nibble grid, Pastel Neobrutalism style
 */
export default function StateMatrix({
  state,
  label,
  highlight = [],
  size = 'md',
  className = '',
}) {
  if (!state) return null;

  const sz = sizeMap[size] || sizeMap.md;
  const isHighlighted = (r, c) => highlight.some(h => h[0] === r && h[1] === c);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {label && (
        <span style={{ fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1A1A2E' }}>
          {label}
        </span>
      )}

      {/* 2×2 grid wrapper */}
      <div style={{
        display: 'inline-grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 6,
        padding: 8,
        background: '#FFFFFF',
        border: '4px solid #1A1A2E',
        boxShadow: '4px 4px 0px 0px #1A1A2E',
      }}>
        {[0, 1].map(row =>
          [0, 1].map(col => {
            const nibble = state[row]?.[col] ?? 0;
            const isHigh = isHighlighted(row, col);
            const bg = isHigh ? '#FDE68A' : CELL_COLORS[row][col];

            return (
              <motion.div
                key={`${row}-${col}`}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: (row * 2 + col) * 0.05 }}
                className="matrix-cell"
                style={{
                  minWidth: sz.minWH,
                  minHeight: sz.minWH,
                  padding: sz.p,
                  background: bg,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  border: '3px solid #1A1A2E',
                  boxShadow: isHigh ? '3px 3px 0px #1A1A2E' : 'none',
                }}
              >
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: sz.subSz, fontWeight: 700, color: '#1A1A2E' }}>
                  {nibble.toString(2).padStart(4, '0')}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: sz.textSz, fontWeight: 900, color: '#1A1A2E' }}>
                  {nibbleToHex(nibble)}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', fontWeight: 700, color: '#4A4A6A', marginTop: 2 }}>
                  [{row},{col}]
                </span>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
