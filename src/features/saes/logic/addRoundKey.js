import { copyState, nibbleToHex } from './state';

/**
 * AddRoundKey: XOR state with round key
 * @param {number[][]} state - 2x2 matrix
 * @param {number[][]} roundKey - 2x2 matrix (same format as state)
 * @returns {{ stateBefore, stateAfter, trace, explanation }}
 */
export function addRoundKey(state, roundKey) {
  const stateBefore = copyState(state);
  const keyMatrix = copyState(roundKey);
  const stateAfter = [[0, 0], [0, 0]];
  const trace = [];

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      const s = stateBefore[r][c];
      const k = keyMatrix[r][c];
      const result = s ^ k;
      stateAfter[r][c] = result;

      trace.push({
        position: [r, c],
        state: s,
        key: k,
        result,
        stateBin: s.toString(2).padStart(4, '0'),
        keyBin: k.toString(2).padStart(4, '0'),
        resultBin: result.toString(2).padStart(4, '0'),
        stateHex: nibbleToHex(s),
        keyHex: nibbleToHex(k),
        resultHex: nibbleToHex(result),
        equation: `${nibbleToHex(s)} ⊕ ${nibbleToHex(k)} = ${nibbleToHex(result)}`,
      });
    }
  }

  return {
    stateBefore,
    stateAfter,
    keyMatrix,
    trace,
    name: 'AddRoundKey',
    explanation: 'Setiap nibble dari matriks state di-XOR secara bitwise dengan nibble yang bersesuaian pada round key. Langkah ini adalah satu-satunya tahapan yang menggunakan kunci secara langsung.',
  };
}

/**
 * Convert a 16-bit key word into a 2x2 state matrix format
 * key: 16-bit integer
 * Returns [[upper8_high_nibble, upper8_low_nibble], [lower8_high_nibble, lower8_low_nibble]]
 */
export function keyToMatrix(key16bit) {
  const n0 = (key16bit >> 12) & 0xF;
  const n1 = (key16bit >> 8) & 0xF;
  const n2 = (key16bit >> 4) & 0xF;
  const n3 = key16bit & 0xF;
  return [[n0, n2], [n1, n3]];
}
