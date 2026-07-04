/**
 * Galois Field GF(2^4) arithmetic
 * Irreducible polynomial: x^4 + x + 1 (0x13 = 10011)
 */

const GF_MOD = 0x13; // x^4 + x + 1

/**
 * GF(2^4) multiplication using peasant's algorithm
 * Returns { result, steps } for visualization
 */
export function gfMultiply(a, b) {
  const steps = [];
  let product = 0;
  let multiplier = a & 0xF;
  let multiplicand = b & 0xF;

  steps.push({
    description: `Start: ${toHex(a)} × ${toHex(b)} in GF(2⁴)`,
    a: multiplier,
    b: multiplicand,
    product: 0,
    shift: 0,
  });

  for (let i = 0; i < 4; i++) {
    if (multiplicand & 1) {
      const before = product;
      product ^= multiplier;
      steps.push({
        description: `Bit ${i} of b is 1: XOR result with ${toHex(multiplier)} (shifted a)`,
        a: multiplier,
        b: multiplicand,
        product,
        xorWith: multiplier,
        before,
        shift: i,
      });
    }

    const msb = multiplier & 0x8;
    multiplier <<= 1;
    multiplier &= 0xF;

    if (msb) {
      const before = multiplier;
      multiplier ^= 0x3; // XOR with lower bits of irreducible polynomial (x+1)
      steps.push({
        description: `MSB was 1: reduce by XOR with 0x3 (x+1 part of irreducible poly)`,
        a: multiplier,
        b: multiplicand,
        product,
        reduction: true,
        before,
        shift: i,
      });
    }

    multiplicand >>= 1;
  }

  steps.push({
    description: `Final result: ${toHex(a)} × ${toHex(b)} = ${toHex(product)}`,
    a,
    b,
    product,
    final: true,
  });

  return { result: product & 0xF, steps };
}

/**
 * Simple GF multiply (no trace)
 */
export function gfMul(a, b) {
  return gfMultiply(a, b).result;
}

function toHex(n) {
  return '0x' + n.toString(16).toUpperCase();
}
