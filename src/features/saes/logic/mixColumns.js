import { gfMul, gfMultiply } from './gf';
import { MIX_MATRIX } from '../data/tables';
import { copyState, nibbleToHex } from './state';

/**
 * MixColumns operation for S-AES
 *
 * For each column [s0, s1]:
 * [s0'] = [1 4] [s0]  in GF(2^4)
 * [s1'] = [4 1] [s1]
 *
 * s0' = (1·s0) ⊕ (4·s1) = s0 ⊕ gfMul(4, s1)
 * s1' = (4·s0) ⊕ (1·s1) = gfMul(4, s0) ⊕ s1
 */
export function mixColumns(state) {
  const stateBefore = copyState(state);
  const stateAfter = [[0, 0], [0, 0]];
  const trace = [];

  for (let col = 0; col < 2; col++) {
    const s0 = stateBefore[0][col];
    const s1 = stateBefore[1][col];

    const mul_1_s0 = gfMul(MIX_MATRIX[0][0], s0); // 1 * s0 = s0
    const mul_4_s1 = gfMul(MIX_MATRIX[0][1], s1); // 4 * s1
    const mul_4_s0 = gfMul(MIX_MATRIX[1][0], s0); // 4 * s0
    const mul_1_s1 = gfMul(MIX_MATRIX[1][1], s1); // 1 * s1 = s1

    const newS0 = mul_1_s0 ^ mul_4_s1;
    const newS1 = mul_4_s0 ^ mul_1_s1;

    stateAfter[0][col] = newS0;
    stateAfter[1][col] = newS1;

    trace.push({
      col,
      s0, s1,
      mul_1_s0, mul_4_s1,
      mul_4_s0, mul_1_s1,
      newS0, newS1,
      gfSteps4s1: gfMultiply(MIX_MATRIX[0][1], s1).steps,
      gfSteps4s0: gfMultiply(MIX_MATRIX[1][0], s0).steps,
      equations: [
        `s0' = (1 × ${nibbleToHex(s0)}) ⊕ (4 × ${nibbleToHex(s1)}) = ${nibbleToHex(mul_1_s0)} ⊕ ${nibbleToHex(mul_4_s1)} = ${nibbleToHex(newS0)}`,
        `s1' = (4 × ${nibbleToHex(s0)}) ⊕ (1 × ${nibbleToHex(s1)}) = ${nibbleToHex(mul_4_s0)} ⊕ ${nibbleToHex(mul_1_s1)} = ${nibbleToHex(newS1)}`,
      ],
    });
  }

  return {
    stateBefore,
    stateAfter,
    trace,
    name: 'MixColumns',
    explanation: 'Setiap kolom dari state matriks diperlakukan sebagai polinomial atas GF(2⁴) dan dikalikan dengan polinomial tetap (matriks [[1,4],[4,1]]). Langkah ini menghasilkan percampuran data secara mendalam (difusi) di dalam kolom.',
  };
}
