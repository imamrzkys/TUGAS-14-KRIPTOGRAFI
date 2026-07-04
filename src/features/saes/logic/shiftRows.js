import { copyState } from './state';

/**
 * ShiftRows: Swap nibbles in the second row
 * State:
 * | n0 | n2 |       | n0 | n2 |
 * | n1 | n3 |  -->  | n3 | n1 |
 */
export function shiftRows(state) {
  const stateBefore = copyState(state);
  const stateAfter = [
    [stateBefore[0][0], stateBefore[0][1]],
    [stateBefore[1][1], stateBefore[1][0]], // swap row 1
  ];

  return {
    stateBefore,
    stateAfter,
    trace: {
      row0: { before: [stateBefore[0][0], stateBefore[0][1]], after: [stateAfter[0][0], stateAfter[0][1]], shifted: false },
      row1: { before: [stateBefore[1][0], stateBefore[1][1]], after: [stateAfter[1][0], stateAfter[1][1]], shifted: true },
    },
    name: 'ShiftRows',
    explanation: 'Baris kedua digeser secara siklis ke kiri sebanyak satu posisi nibble (kolom), sementara baris 0 tetap tidak berubah. Operasi ini memberikan difusi (penyebaran informasi) antar kolom.',
  };
}

/**
 * Inverse ShiftRows: Same as ShiftRows (shift by 1 is its own inverse in 2 columns)
 */
export function inverseShiftRows(state) {
  const result = shiftRows(state);
  return {
    ...result,
    name: 'InvShiftRows',
    explanation: 'Baris kedua digeser secara siklis ke kanan sebanyak satu posisi nibble (yang secara matematis setara dengan pergeseran kiri pada matriks state 2 kolom).',
  };
}
