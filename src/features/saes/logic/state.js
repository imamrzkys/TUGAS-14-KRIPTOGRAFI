/**
 * State representation and conversion utilities for S-AES
 *
 * S-AES State is a 2x2 matrix of nibbles (4-bit values):
 * | n0 | n2 |
 * | n1 | n3 |
 *
 * Given a 16-bit value: b15 b14 ... b1 b0
 * n0 = bits 15-12, n1 = bits 11-8, n2 = bits 7-4, n3 = bits 3-0
 */

/**
 * Convert 16-bit integer to 2x2 state matrix of nibbles
 * @param {number} value - 16-bit integer
 * @returns {number[][]} 2x2 matrix [[n0,n2],[n1,n3]]
 */
export function toStateMatrix(value) {
  const n0 = (value >> 12) & 0xF;
  const n1 = (value >> 8) & 0xF;
  const n2 = (value >> 4) & 0xF;
  const n3 = value & 0xF;
  return [[n0, n2], [n1, n3]];
}

/**
 * Convert 2x2 state matrix back to 16-bit integer
 * @param {number[][]} state - 2x2 matrix
 * @returns {number} 16-bit integer
 */
export function fromStateMatrix(state) {
  const n0 = state[0][0];
  const n2 = state[0][1];
  const n1 = state[1][0];
  const n3 = state[1][1];
  return ((n0 & 0xF) << 12) | ((n1 & 0xF) << 8) | ((n2 & 0xF) << 4) | (n3 & 0xF);
}

/**
 * Convert binary string to integer
 */
export function binaryToInt(bin) {
  return parseInt(bin, 2);
}

/**
 * Convert integer to binary string (padded)
 */
export function intToBinary(n, bits = 16) {
  return (n >>> 0).toString(2).padStart(bits, '0');
}

/**
 * Convert integer to hex string
 */
export function intToHex(n, digits = 4) {
  return n.toString(16).toUpperCase().padStart(digits, '0');
}

/**
 * Convert nibble to binary string (4 bits)
 */
export function nibbleToBinary(n) {
  return intToBinary(n & 0xF, 4);
}

/**
 * Convert nibble to hex string
 */
export function nibbleToHex(n) {
  return (n & 0xF).toString(16).toUpperCase();
}

/**
 * Deep copy state matrix
 */
export function copyState(state) {
  return state.map(row => [...row]);
}

/**
 * Format state for display
 */
export function formatState(state) {
  return {
    matrix: state,
    binary: state.map(row => row.map(nibbleToBinary)),
    hex: state.map(row => row.map(nibbleToHex)),
    flat: [state[0][0], state[1][0], state[0][1], state[1][1]],
  };
}
