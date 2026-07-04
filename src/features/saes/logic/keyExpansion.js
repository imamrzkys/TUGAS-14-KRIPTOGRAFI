import { SBOX, RCON } from '../data/tables';
import { nibbleToHex } from './state';

/**
 * S-AES Key Expansion
 *
 * Input: 16-bit key K
 * Generates: K0 (16-bit), K1 (16-bit), K2 (16-bit)
 *
 * Key words:
 * w0 = K[15:8], w1 = K[7:0]
 * w2 = w0 ⊕ RCON1 ⊕ SubWord(RotWord(w1))
 * w3 = w2 ⊕ w1
 * w4 = w2 ⊕ RCON2 ⊕ SubWord(RotWord(w3))
 * w5 = w4 ⊕ w3
 *
 * K0 = w0 || w1
 * K1 = w2 || w3
 * K2 = w4 || w5
 */

function subNibbleSingle(nibble) {
  const row = (nibble >> 2) & 0x3;
  const col = nibble & 0x3;
  return SBOX[row][col];
}

function subWord(word8bit) {
  const highNibble = (word8bit >> 4) & 0xF;
  const lowNibble = word8bit & 0xF;
  const subHigh = subNibbleSingle(highNibble);
  const subLow = subNibbleSingle(lowNibble);
  return ((subHigh & 0xF) << 4) | (subLow & 0xF);
}

function rotWord(word8bit) {
  const high = (word8bit >> 4) & 0xF;
  const low = word8bit & 0xF;
  return ((low & 0xF) << 4) | (high & 0xF);
}

export function keyExpansion(key16bit) {
  const w0 = (key16bit >> 8) & 0xFF;
  const w1 = key16bit & 0xFF;

  // Round 1 key generation
  const rotW1 = rotWord(w1);
  const subRotW1 = subWord(rotW1);
  const w2 = w0 ^ RCON[0] ^ subRotW1;
  const w3 = w2 ^ w1;

  // Round 2 key generation
  const rotW3 = rotWord(w3);
  const subRotW3 = subWord(rotW3);
  const w4 = w2 ^ RCON[1] ^ subRotW3;
  const w5 = w4 ^ w3;

  // Round keys as 16-bit values
  const K0 = ((w0 & 0xFF) << 8) | (w1 & 0xFF);
  const K1 = ((w2 & 0xFF) << 8) | (w3 & 0xFF);
  const K2 = ((w4 & 0xFF) << 8) | (w5 & 0xFF);

  const toHex8 = n => n.toString(16).toUpperCase().padStart(2, '0');
  const toBin8 = n => n.toString(2).padStart(8, '0');
  const toHex4 = n => n.toString(16).toUpperCase().padStart(1, '0');

  return {
    // Raw values
    w0, w1, w2, w3, w4, w5,
    K0, K1, K2,

    // Intermediates
    rotW1, subRotW1,
    rotW3, subRotW3,

    // Round keys as 2x2 matrices
    K0Matrix: [[(w0 >> 4) & 0xF, (w1 >> 4) & 0xF], [w0 & 0xF, w1 & 0xF]],
    K1Matrix: [[(w2 >> 4) & 0xF, (w3 >> 4) & 0xF], [w2 & 0xF, w3 & 0xF]],
    K2Matrix: [[(w4 >> 4) & 0xF, (w5 >> 4) & 0xF], [w4 & 0xF, w5 & 0xF]],

    // Display formatted
    display: {
      w0: toHex8(w0), w1: toHex8(w1),
      w2: toHex8(w2), w3: toHex8(w3),
      w4: toHex8(w4), w5: toHex8(w5),
      rotW1: toHex8(rotW1),
      subRotW1: toHex8(subRotW1),
      rotW3: toHex8(rotW3),
      subRotW3: toHex8(subRotW3),
      rcon1: toHex8(RCON[0]),
      rcon2: toHex8(RCON[1]),
      K0: K0.toString(16).toUpperCase().padStart(4, '0'),
      K1: K1.toString(16).toUpperCase().padStart(4, '0'),
      K2: K2.toString(16).toUpperCase().padStart(4, '0'),
    },

    // Trace for visualization
    trace: {
      step1: {
        label: 'Initial Words',
        description: `Split 16-bit key into two 8-bit words`,
        w0: { value: w0, hex: toHex8(w0), bin: toBin8(w0) },
        w1: { value: w1, hex: toHex8(w1), bin: toBin8(w1) },
      },
      step2: {
        label: 'RotWord(w1)',
        description: `Rotate nibbles of w1: swap upper and lower nibbles`,
        input: { value: w1, hex: toHex8(w1), bin: toBin8(w1) },
        output: { value: rotW1, hex: toHex8(rotW1), bin: toBin8(rotW1) },
        upperNibble: toHex4((w1 >> 4) & 0xF),
        lowerNibble: toHex4(w1 & 0xF),
      },
      step3: {
        label: 'SubWord(RotWord(w1))',
        description: `Apply S-Box to each nibble of RotWord(w1)`,
        input: { value: rotW1, hex: toHex8(rotW1), bin: toBin8(rotW1) },
        output: { value: subRotW1, hex: toHex8(subRotW1), bin: toBin8(subRotW1) },
        highNibble: { in: toHex4((rotW1 >> 4) & 0xF), out: toHex4((subRotW1 >> 4) & 0xF) },
        lowNibble: { in: toHex4(rotW1 & 0xF), out: toHex4(subRotW1 & 0xF) },
      },
      step4: {
        label: 'Compute w2',
        description: `w2 = w0 ⊕ RCON[1] ⊕ SubWord(RotWord(w1))`,
        w0: { value: w0, hex: toHex8(w0) },
        rcon: { value: RCON[0], hex: toHex8(RCON[0]) },
        subRotW1: { value: subRotW1, hex: toHex8(subRotW1) },
        w2: { value: w2, hex: toHex8(w2) },
        equation: `${toHex8(w0)} ⊕ ${toHex8(RCON[0])} ⊕ ${toHex8(subRotW1)} = ${toHex8(w2)}`,
      },
      step5: {
        label: 'Compute w3',
        description: `w3 = w2 ⊕ w1`,
        w2: { value: w2, hex: toHex8(w2) },
        w1: { value: w1, hex: toHex8(w1) },
        w3: { value: w3, hex: toHex8(w3) },
        equation: `${toHex8(w2)} ⊕ ${toHex8(w1)} = ${toHex8(w3)}`,
      },
      step6: {
        label: 'RotWord(w3)',
        description: `Rotate nibbles of w3`,
        input: { value: w3, hex: toHex8(w3), bin: toBin8(w3) },
        output: { value: rotW3, hex: toHex8(rotW3), bin: toBin8(rotW3) },
      },
      step7: {
        label: 'SubWord(RotWord(w3))',
        description: `Apply S-Box to each nibble of RotWord(w3)`,
        input: { value: rotW3, hex: toHex8(rotW3), bin: toBin8(rotW3) },
        output: { value: subRotW3, hex: toHex8(subRotW3), bin: toBin8(subRotW3) },
        highNibble: { in: toHex4((rotW3 >> 4) & 0xF), out: toHex4((subRotW3 >> 4) & 0xF) },
        lowNibble: { in: toHex4(rotW3 & 0xF), out: toHex4(subRotW3 & 0xF) },
      },
      step8: {
        label: 'Compute w4',
        description: `w4 = w2 ⊕ RCON[2] ⊕ SubWord(RotWord(w3))`,
        w2: { value: w2, hex: toHex8(w2) },
        rcon: { value: RCON[1], hex: toHex8(RCON[1]) },
        subRotW3: { value: subRotW3, hex: toHex8(subRotW3) },
        w4: { value: w4, hex: toHex8(w4) },
        equation: `${toHex8(w2)} ⊕ ${toHex8(RCON[1])} ⊕ ${toHex8(subRotW3)} = ${toHex8(w4)}`,
      },
      step9: {
        label: 'Compute w5',
        description: `w5 = w4 ⊕ w3`,
        w4: { value: w4, hex: toHex8(w4) },
        w3: { value: w3, hex: toHex8(w3) },
        w5: { value: w5, hex: toHex8(w5) },
        equation: `${toHex8(w4)} ⊕ ${toHex8(w3)} = ${toHex8(w5)}`,
      },
    },
  };
}
