import { gfMul, gfMultiply } from './gf';
import { INV_MIX_MATRIX } from '../data/tables';
import { copyState, nibbleToHex } from './state';

/**
 * Inverse MixColumns for S-AES decryption
 *
 * For each column [s0, s1]:
 * [s0'] = [9 2] [s0]  in GF(2^4)
 * [s1'] = [2 9] [s1]
 *
 * s0' = (9·s0) ⊕ (2·s1)
 * s1' = (2·s0) ⊕ (9·s1)
 */
export function inverseMixColumns(state) {
  const stateBefore = copyState(state);
  const stateAfter = [[0, 0], [0, 0]];
  const trace = [];

  for (let col = 0; col < 2; col++) {
    const s0 = stateBefore[0][col];
    const s1 = stateBefore[1][col];

    const mul_9_s0 = gfMul(INV_MIX_MATRIX[0][0], s0); // 9 * s0
    const mul_2_s1 = gfMul(INV_MIX_MATRIX[0][1], s1); // 2 * s1
    const mul_2_s0 = gfMul(INV_MIX_MATRIX[1][0], s0); // 2 * s0
    const mul_9_s1 = gfMul(INV_MIX_MATRIX[1][1], s1); // 9 * s1

    const newS0 = mul_9_s0 ^ mul_2_s1;
    const newS1 = mul_2_s0 ^ mul_9_s1;

    stateAfter[0][col] = newS0;
    stateAfter[1][col] = newS1;

    trace.push({
      col,
      s0, s1,
      mul_9_s0, mul_2_s1, mul_2_s0, mul_9_s1,
      newS0, newS1,
      equations: [
        `s0' = (9 × ${nibbleToHex(s0)}) ⊕ (2 × ${nibbleToHex(s1)}) = ${nibbleToHex(mul_9_s0)} ⊕ ${nibbleToHex(mul_2_s1)} = ${nibbleToHex(newS0)}`,
        `s1' = (2 × ${nibbleToHex(s0)}) ⊕ (9 × ${nibbleToHex(s1)}) = ${nibbleToHex(mul_2_s0)} ⊕ ${nibbleToHex(mul_9_s1)} = ${nibbleToHex(newS1)}`,
      ],
    });
  }

  return {
    stateBefore,
    stateAfter,
    trace,
    name: 'InvMixColumns',
    explanation: 'Setiap kolom dikalikan dengan matriks Inverse MixColumns [[9,2],[2,9]] atas Galois Field GF(2⁴), memulihkan kondisi state sebelum operasi MixColumns.',
  };
}
