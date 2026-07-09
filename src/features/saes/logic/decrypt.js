import { toStateMatrix, fromStateMatrix, intToHex, intToBinary } from './state';
import { keyExpansion } from './keyExpansion';
import { addRoundKey } from './addRoundKey';
import { inverseSubNibble } from './subNibble';
import { inverseShiftRows } from './shiftRows';
import { inverseMixColumns } from './inverseMixColumns';

/**
 * Full S-AES Decryption (Inverse Cipher)
 * Keys applied in reverse: K2, K1, K0
 * @param {number} ciphertext - 16-bit ciphertext
 * @param {number} key - 16-bit key
 * @returns {object} Complete trace of all steps
 */
export function decrypt(ciphertext, key) {
  const keyData = keyExpansion(key);
  const { K0Matrix, K1Matrix, K2Matrix } = keyData;

  const steps = [];
  let state = toStateMatrix(ciphertext);
  const initialState = [...state.map(r => [...r])];

  // --- Initial AddRoundKey (K2) ---
  const ark2 = addRoundKey(state, K2Matrix);
  state = ark2.stateAfter;
  steps.push({
    id: 'initial-ark',
    round: 0,
    operation: 'AddRoundKey',
    roundKey: 'K2',
    ...ark2,
    label: 'Initial AddRoundKey',
    explanation: 'State ciphertext di-XOR dengan kunci ronde terakhir (K2) untuk memulai proses dekripsi. Operasi ini membalikkan efek penambahan kunci final pada proses enkripsi.',
  });

  // ===== ROUND 1 (Inverse Round 2) =====
  const isr1 = inverseShiftRows(state);
  state = isr1.stateAfter;
  steps.push({
    id: 'r1-invshiftrows',
    round: 1,
    operation: 'InvShiftRows',
    ...isr1,
    label: 'Ronde 1 — InvShiftRows',
    explanation: 'Baris kedua matriks state digeser secara siklis ke kanan sebanyak satu posisi nibble. Ini membalikkan operasi ShiftRows (geser kiri) yang dilakukan pada enkripsi.',
  });

  const isn1 = inverseSubNibble(state);
  state = isn1.stateAfter;
  steps.push({
    id: 'r1-invsubnibble',
    round: 1,
    operation: 'InvSubNibble',
    ...isn1,
    label: 'Ronde 1 — InvSubNibble',
    explanation: 'Setiap nibble dalam state dipetakan kembali menggunakan Inverse S-Box untuk mengembalikan nilai aslinya. Operasi ini membalikkan pemetaan non-linier dari SubNibble enkripsi.',
  });

  const ark1 = addRoundKey(state, K1Matrix);
  state = ark1.stateAfter;
  steps.push({
    id: 'r1-ark',
    round: 1,
    operation: 'AddRoundKey',
    roundKey: 'K1',
    ...ark1,
    label: 'Ronde 1 — AddRoundKey',
    explanation: 'State hasil substitusi di-XOR dengan kunci ronde K1. Pada cipher invers, AddRoundKey tetap menggunakan XOR karena operasi XOR adalah invers dari dirinya sendiri (Self-Inverse).',
  });

  const imc1 = inverseMixColumns(state);
  state = imc1.stateAfter;
  steps.push({
    id: 'r1-invmixcols',
    round: 1,
    operation: 'InvMixColumns',
    ...imc1,
    label: 'Ronde 1 — InvMixColumns',
    explanation: 'Kolom state dikalikan dengan matriks invers [[9,2],[2,9]] atas GF(2⁴). Transformasi ini membatalkan pencampuran kolom dari operasi MixColumns pada enkripsi.',
  });

  // ===== ROUND 2 (Inverse Round 1) =====
  const isr2 = inverseShiftRows(state);
  state = isr2.stateAfter;
  steps.push({
    id: 'r2-invshiftrows',
    round: 2,
    operation: 'InvShiftRows',
    ...isr2,
    label: 'Ronde 2 — InvShiftRows',
    explanation: 'Pergeseran baris kedua secara siklis ke kanan satu posisi nibble diulangi kembali untuk membalikkan pergeseran baris enkripsi ronde pertama.',
  });

  const isn2 = inverseSubNibble(state);
  state = isn2.stateAfter;
  steps.push({
    id: 'r2-invsubnibble',
    round: 2,
    operation: 'InvSubNibble',
    ...isn2,
    label: 'Ronde 2 — InvSubNibble',
    explanation: 'Substitusi menggunakan Inverse S-Box diulangi kembali untuk mengembalikan bentuk nibble sebelum proses SubNibble pertama enkripsi.',
  });

  // Final AddRoundKey (K0)
  const ark0 = addRoundKey(state, K0Matrix);
  state = ark0.stateAfter;
  steps.push({
    id: 'r2-ark',
    round: 2,
    operation: 'AddRoundKey',
    roundKey: 'K0',
    ...ark0,
    label: 'Ronde 2 — AddRoundKey (Final)',
    explanation: 'State di-XOR dengan kunci ronde K0. Hasil akhir dari operasi ini mengembalikan plaintext biner 16-bit asli sepenuhnya. Proses dekripsi S-AES selesai!',
  });

  const plaintextInt = fromStateMatrix(state);

  return {
    mode: 'decrypt',
    ciphertext,
    key,
    plaintext: plaintextInt,
    ciphertextBin: intToBinary(ciphertext),
    ciphertextHex: intToHex(ciphertext),
    plaintextBin: intToBinary(plaintextInt),
    plaintextHex: intToHex(plaintextInt),
    keyData,
    initialState,
    finalState: state,
    steps,
  };
}
