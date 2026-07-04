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
    description: 'XOR the ciphertext state with K2 to begin decryption.',
  });

  // ===== ROUND 1 (Inverse Round 2) =====
  const isr1 = inverseShiftRows(state);
  state = isr1.stateAfter;
  steps.push({ id: 'r1-invshiftrows', round: 1, operation: 'InvShiftRows', ...isr1, label: 'Round 1 — InvShiftRows' });

  const isn1 = inverseSubNibble(state);
  state = isn1.stateAfter;
  steps.push({ id: 'r1-invsubnibble', round: 1, operation: 'InvSubNibble', ...isn1, label: 'Round 1 — InvSubNibble' });

  const ark1 = addRoundKey(state, K1Matrix);
  state = ark1.stateAfter;
  steps.push({ id: 'r1-ark', round: 1, operation: 'AddRoundKey', roundKey: 'K1', ...ark1, label: 'Round 1 — AddRoundKey' });

  const imc1 = inverseMixColumns(state);
  state = imc1.stateAfter;
  steps.push({ id: 'r1-invmixcols', round: 1, operation: 'InvMixColumns', ...imc1, label: 'Round 1 — InvMixColumns' });

  // ===== ROUND 2 (Inverse Round 1) =====
  const isr2 = inverseShiftRows(state);
  state = isr2.stateAfter;
  steps.push({ id: 'r2-invshiftrows', round: 2, operation: 'InvShiftRows', ...isr2, label: 'Round 2 — InvShiftRows' });

  const isn2 = inverseSubNibble(state);
  state = isn2.stateAfter;
  steps.push({ id: 'r2-invsubnibble', round: 2, operation: 'InvSubNibble', ...isn2, label: 'Round 2 — InvSubNibble' });

  // Final AddRoundKey (K0)
  const ark0 = addRoundKey(state, K0Matrix);
  state = ark0.stateAfter;
  steps.push({ id: 'r2-ark', round: 2, operation: 'AddRoundKey', roundKey: 'K0', ...ark0, label: 'Round 2 — AddRoundKey' });

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
