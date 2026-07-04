import { toStateMatrix, fromStateMatrix, intToHex, intToBinary } from './state';
import { keyExpansion } from './keyExpansion';
import { addRoundKey, keyToMatrix } from './addRoundKey';
import { subNibble } from './subNibble';
import { shiftRows } from './shiftRows';
import { mixColumns } from './mixColumns';

/**
 * Full S-AES Encryption
 * @param {number} plaintext - 16-bit plaintext
 * @param {number} key - 16-bit key
 * @returns {object} Complete trace of all steps
 */
export function encrypt(plaintext, key) {
  const keyData = keyExpansion(key);
  const { K0Matrix, K1Matrix, K2Matrix } = keyData;

  const steps = [];
  let state = toStateMatrix(plaintext);

  // Initial state
  const initialState = [...state.map(r => [...r])];

  // --- Initial AddRoundKey (K0) ---
  const ark0 = addRoundKey(state, K0Matrix);
  state = ark0.stateAfter;
  steps.push({
    id: 'initial-ark',
    round: 0,
    operation: 'AddRoundKey',
    roundKey: 'K0',
    ...ark0,
    label: 'Initial AddRoundKey',
    description: 'XOR the plaintext state with K0 (initial round key) before any rounds begin.',
  });

  // ===== ROUND 1 =====
  // SubNibble
  const sn1 = subNibble(state);
  state = sn1.stateAfter;
  steps.push({ id: 'r1-subnibble', round: 1, operation: 'SubNibble', ...sn1, label: 'Round 1 — SubNibble' });

  // ShiftRows
  const sr1 = shiftRows(state);
  state = sr1.stateAfter;
  steps.push({ id: 'r1-shiftrows', round: 1, operation: 'ShiftRows', ...sr1, label: 'Round 1 — ShiftRows' });

  // MixColumns
  const mc1 = mixColumns(state);
  state = mc1.stateAfter;
  steps.push({ id: 'r1-mixcols', round: 1, operation: 'MixColumns', ...mc1, label: 'Round 1 — MixColumns' });

  // AddRoundKey (K1)
  const ark1 = addRoundKey(state, K1Matrix);
  state = ark1.stateAfter;
  steps.push({ id: 'r1-ark', round: 1, operation: 'AddRoundKey', roundKey: 'K1', ...ark1, label: 'Round 1 — AddRoundKey' });

  // ===== ROUND 2 (Final Round — no MixColumns) =====
  // SubNibble
  const sn2 = subNibble(state);
  state = sn2.stateAfter;
  steps.push({ id: 'r2-subnibble', round: 2, operation: 'SubNibble', ...sn2, label: 'Round 2 — SubNibble' });

  // ShiftRows
  const sr2 = shiftRows(state);
  state = sr2.stateAfter;
  steps.push({ id: 'r2-shiftrows', round: 2, operation: 'ShiftRows', ...sr2, label: 'Round 2 — ShiftRows' });

  // AddRoundKey (K2)
  const ark2 = addRoundKey(state, K2Matrix);
  state = ark2.stateAfter;
  steps.push({ id: 'r2-ark', round: 2, operation: 'AddRoundKey', roundKey: 'K2', ...ark2, label: 'Round 2 — AddRoundKey' });

  const ciphertextInt = fromStateMatrix(state);

  return {
    mode: 'encrypt',
    plaintext,
    key,
    ciphertext: ciphertextInt,
    plaintextBin: intToBinary(plaintext),
    plaintextHex: intToHex(plaintext),
    ciphertextBin: intToBinary(ciphertextInt),
    ciphertextHex: intToHex(ciphertextInt),
    keyData,
    initialState,
    finalState: state,
    steps,
  };
}
