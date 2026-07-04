import { SBOX, INV_SBOX } from '../data/tables';
import { copyState, nibbleToHex } from './state';

/**
 * SubNibble: Apply S-Box substitution to each nibble
 * @param {number[][]} state - 2x2 matrix
 * @returns {{ stateBefore, stateAfter, trace, explanation }}
 */
export function subNibble(state) {
  const stateBefore = copyState(state);
  const stateAfter = [[0, 0], [0, 0]];
  const trace = [];

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      const nibble = state[r][c];
      const row = (nibble >> 2) & 0x3;
      const col = nibble & 0x3;
      const sub = SBOX[row][col];
      stateAfter[r][c] = sub;

      trace.push({
        position: [r, c],
        input: nibble,
        inputBin: nibble.toString(2).padStart(4, '0'),
        row,
        col,
        output: sub,
        outputBin: sub.toString(2).padStart(4, '0'),
        inputHex: nibbleToHex(nibble),
        outputHex: nibbleToHex(sub),
        description: `S[${row}][${col}] = 0x${sub.toString(16).toUpperCase()}`,
      });
    }
  }

  return {
    stateBefore,
    stateAfter,
    trace,
    name: 'SubNibble',
    explanation: 'Setiap nibble 4-bit digantikan oleh nilai padanannya di dalam tabel S-Box. 2 bit atas menentukan baris (row) dan 2 bit bawah menentukan kolom (column) pada tabel pencarian.',
  };
}

/**
 * Inverse SubNibble: Apply Inverse S-Box substitution
 */
export function inverseSubNibble(state) {
  const stateBefore = copyState(state);
  const stateAfter = [[0, 0], [0, 0]];
  const trace = [];

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      const nibble = state[r][c];
      const row = (nibble >> 2) & 0x3;
      const col = nibble & 0x3;
      const sub = INV_SBOX[row][col];
      stateAfter[r][c] = sub;

      trace.push({
        position: [r, c],
        input: nibble,
        inputBin: nibble.toString(2).padStart(4, '0'),
        row,
        col,
        output: sub,
        outputBin: sub.toString(2).padStart(4, '0'),
        inputHex: nibbleToHex(nibble),
        outputHex: nibbleToHex(sub),
        description: `INV_S[${row}][${col}] = 0x${sub.toString(16).toUpperCase()}`,
      });
    }
  }

  return {
    stateBefore,
    stateAfter,
    trace,
    name: 'InvSubNibble',
    explanation: 'Setiap nibble 4-bit digantikan oleh nilai padanannya di dalam tabel Inverse S-Box (S⁻¹) untuk membatalkan transformasi SubNibble sebelumnya.',
  };
}
