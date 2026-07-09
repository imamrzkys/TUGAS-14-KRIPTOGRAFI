import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { intToBinary, intToHex } from '../logic/state';
import StateMatrix from '../../../components/matrix/StateMatrix';

const K_COLORS = ['#FFB8D9', '#B8F0E0', '#E8D5FF'];

export default function ResultPanel({ result }) {
  const [copied, setCopied] = useState('');
  if (!result) return null;

  const isEncrypt = result.mode === 'encrypt';
  const outputValue  = isEncrypt ? result.ciphertext  : result.plaintext;
  const outputBin    = isEncrypt ? result.ciphertextBin  : result.plaintextBin;
  const outputHex    = isEncrypt ? result.ciphertextHex  : result.plaintextHex;
  const inputBin     = isEncrypt ? result.plaintextBin   : result.ciphertextBin;
  const inputHex     = isEncrypt ? result.plaintextHex   : result.ciphertextHex;

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: '#FFFFFF',
        border: '4px solid #1A1A2E',
        boxShadow: '6px 6px 0px 0px #1A1A2E',
      }}
    >
      {/* Header bar */}
      <div style={{
        background: isEncrypt ? '#FF85C2' : '#5ECFB1',
        borderBottom: '4px solid #1A1A2E',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 10, height: 10,
          background: '#1A1A2E',
          border: '2px solid #1A1A2E',
        }} />
        <span style={{ fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1A1A2E' }}>
          {isEncrypt ? 'Hasil Enkripsi' : 'Hasil Dekripsi'}
        </span>
        <span style={{
          marginLeft: 'auto',
          fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase',
          background: '#1A1A2E', color: '#FFFFFF',
          padding: '3px 10px',
        }}>
          S-AES · {result.steps.length} ops
        </span>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {/* IO grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-center" style={{ marginBottom: '2.5rem' }}>
          {/* Input */}
          <div>
            <p style={{ fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1A1A2E', marginBottom: 8 }}>
              {isEncrypt ? 'Plaintext' : 'Ciphertext'} Input
            </p>
            <div style={{ background: '#FFF5FB', border: '3px solid #1A1A2E', padding: '1rem', marginBottom: 10 }}>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', fontWeight: 700, color: '#4A4A6A', marginBottom: 4 }}>BINER</p>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem', fontWeight: 900, color: '#1A1A2E', wordBreak: 'break-all' }}>{inputBin}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', fontWeight: 700, color: '#4A4A6A' }}>HEX: <span style={{ color: '#1A1A2E' }}>{inputHex}</span></p>
                <button onClick={() => handleCopy(inputBin, 'in')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  {copied === 'in' ? <Check size={14} color="#5ECFB1" strokeWidth={3} /> : <Copy size={14} color="#4A4A6A" />}
                </button>
              </div>
            </div>
            <StateMatrix state={result.initialState} label="Input State" size="sm" />
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-2 py-4 md:py-0">
            <div style={{
              background: '#1A1A2E', color: '#FFFFFF',
              border: '3px solid #1A1A2E',
              boxShadow: '3px 3px 0px #FDE68A',
              width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.25rem', fontWeight: 900,
            }}>
              <span className="hidden md:inline">→</span>
              <span className="inline md:hidden">↓</span>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', fontWeight: 700, color: '#4A4A6A', textTransform: 'uppercase' }}>S-AES</span>
          </div>

          {/* Output */}
          <div>
            <p style={{ fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1A1A2E', marginBottom: 8 }}>
              {isEncrypt ? 'Ciphertext' : 'Plaintext'} Output
            </p>
            <div style={{
              background: isEncrypt ? '#FFB8D9' : '#B8F0E0',
              border: '3px solid #1A1A2E',
              boxShadow: '3px 3px 0px #1A1A2E',
              padding: '1rem',
              marginBottom: 10,
            }}>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', fontWeight: 700, color: '#1A1A2E', marginBottom: 4 }}>BINER</p>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem', fontWeight: 900, color: '#1A1A2E', wordBreak: 'break-all' }}>{outputBin}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', fontWeight: 700, color: '#1A1A2E' }}>HEX: <span style={{ fontWeight: 900 }}>{outputHex}</span></p>
                <button onClick={() => handleCopy(outputBin, 'out')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  {copied === 'out' ? <Check size={14} color="#5ECFB1" strokeWidth={3} /> : <Copy size={14} color="#1A1A2E" />}
                </button>
              </div>
            </div>
            <StateMatrix state={result.finalState} label="Output State" size="sm" />
          </div>
        </div>

        {/* Ciphertext big display */}
        <div style={{ background: '#FDE68A', border: '4px solid #1A1A2E', padding: '1rem 1.25rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1A1A2E' }}>
            {isEncrypt ? 'Output' : 'Recovered'}
          </span>
          <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '1.25rem', color: '#1A1A2E', letterSpacing: '0.05em' }}>
            {outputBin}
          </span>
          <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '0.9rem', color: '#4A4A6A' }}>
            0x{outputHex}
          </span>
        </div>

        {/* Round Keys */}
        <div style={{ marginBottom: 0 }}>
          <p style={{ fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1A1A2E', marginBottom: 12 }}>Round Keys</p>
          <div className="round-keys-grid">
            {['K0', 'K1', 'K2'].map((k, i) => {
              const key = result.keyData[k];
              return (
                <div key={k} style={{
                  background: K_COLORS[i],
                  border: '4px solid #1A1A2E',
                  boxShadow: '4px 4px 0px #1A1A2E',
                  padding: '1rem',
                }}>
                  <p style={{ fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', color: '#1A1A2E', marginBottom: 8 }}>{k}</p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, fontSize: '0.8rem', color: '#1A1A2E', wordBreak: 'break-all' }}>
                    {key.toString(2).padStart(16, '0')}
                  </p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '0.7rem', color: '#4A4A6A', marginTop: 4 }}>
                    0x{key.toString(16).toUpperCase().padStart(4, '0')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
