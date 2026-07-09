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
    explanation: 'State plaintext di-XOR dengan kunci ronde pertama (K0) sebelum ronde enkripsi dimulai. Operasi ini disebut "whitening" — memperkenalkan kunci ke dalam state sejak awal agar data tidak terbaca tanpa kunci.',
  });

  // ===== ROUND 1 =====
  // SubNibble
  const sn1 = subNibble(state);
  state = sn1.stateAfter;
  steps.push({
    id: 'r1-subnibble',
    round: 1,
    operation: 'SubNibble',
    ...sn1,
    label: 'Ronde 1 — SubNibble',
    explanation: 'Setiap nibble (4 bit) dalam state diganti menggunakan tabel S-Box non-linier. Substitusi ini memberikan sifat "confusion" — mempersulit penyerang menemukan hubungan antara kunci dan ciphertext.',
  });

  // ShiftRows
  const sr1 = shiftRows(state);
  state = sr1.stateAfter;
  steps.push({
    id: 'r1-shiftrows',
    round: 1,
    operation: 'ShiftRows',
    ...sr1,
    label: 'Ronde 1 — ShiftRows',
    explanation: 'Baris kedua matriks state digeser secara siklis satu posisi ke kiri. Baris pertama tidak berubah. Pergeseran ini memberikan sifat "diffusion" — mencampur posisi nibble antar kolom.',
  });

  // MixColumns
  const mc1 = mixColumns(state);
  state = mc1.stateAfter;
  steps.push({
    id: 'r1-mixcols',
    round: 1,
    operation: 'MixColumns',
    ...mc1,
    label: 'Ronde 1 — MixColumns',
    explanation: 'Setiap kolom state dikalikan dengan matriks [[1,4],[4,1]] menggunakan aritmatika GF(2⁴). Perkalian ini menyebarkan pengaruh setiap nibble ke seluruh kolom, meningkatkan efek difusi secara dramatis.',
  });

  // AddRoundKey (K1)
  const ark1 = addRoundKey(state, K1Matrix);
  state = ark1.stateAfter;
  steps.push({
    id: 'r1-ark',
    round: 1,
    operation: 'AddRoundKey',
    roundKey: 'K1',
    ...ark1,
    label: 'Ronde 1 — AddRoundKey',
    explanation: 'State hasil MixColumns di-XOR dengan kunci ronde kedua (K1). Ini mengintegrasikan material kunci kembali ke state setelah tiga transformasi sebelumnya.',
  });

  // ===== ROUND 2 (Final Round — no MixColumns) =====
  // SubNibble
  const sn2 = subNibble(state);
  state = sn2.stateAfter;
  steps.push({
    id: 'r2-subnibble',
    round: 2,
    operation: 'SubNibble',
    ...sn2,
    label: 'Ronde 2 — SubNibble',
    explanation: 'Substitusi S-Box dilakukan sekali lagi pada ronde akhir. Ronde terakhir tidak memiliki MixColumns — ini bukan kelemahan, melainkan desain yang disengaja agar enkripsi dan dekripsi dapat menggunakan struktur yang simetris.',
  });

  // ShiftRows
  const sr2 = shiftRows(state);
  state = sr2.stateAfter;
  steps.push({
    id: 'r2-shiftrows',
    round: 2,
    operation: 'ShiftRows',
    ...sr2,
    label: 'Ronde 2 — ShiftRows',
    explanation: 'Baris kedua state kembali digeser siklis satu posisi ke kiri. Ini adalah transformasi ShiftRows terakhir sebelum penambahan kunci final menghasilkan ciphertext.',
  });

  // AddRoundKey (K2)
  const ark2 = addRoundKey(state, K2Matrix);
  state = ark2.stateAfter;
  steps.push({
    id: 'r2-ark',
    round: 2,
    operation: 'AddRoundKey',
    roundKey: 'K2',
    ...ark2,
    label: 'Ronde 2 — AddRoundKey (Final)',
    explanation: 'State di-XOR dengan kunci ronde terakhir (K2). Hasil operasi ini adalah ciphertext 16-bit yang tidak dapat dibaca tanpa kunci enkripsi. Proses enkripsi S-AES telah selesai!',
  });

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
