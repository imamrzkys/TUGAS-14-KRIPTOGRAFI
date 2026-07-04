import { useState, useCallback } from 'react';
import { encrypt } from '../logic/encrypt';
import { decrypt } from '../logic/decrypt';
import { binaryToInt, intToBinary } from '../logic/state';

// Test vector from textbook: plaintext=0110111101101011, key=1010011100111011
export const TEST_VECTOR = {
  plaintext: '0110111101101011',
  key: '1010011100111011',
};

export function useSAES() {
  const [plaintextBin, setPlaintextBin] = useState('');
  const [keyBin, setKeyBin] = useState('');
  const [result, setResult] = useState(null);
  const [activeStep, setActiveStep] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [errors, setErrors] = useState({ plaintext: '', key: '' });

  const validate = useCallback((bin, field) => {
    if (!bin) return `${field} is required`;
    if (!/^[01]+$/.test(bin)) return `${field} must contain only 0s and 1s`;
    if (bin.length !== 16) return `${field} must be exactly 16 bits (currently ${bin.length})`;
    return '';
  }, []);

  const handleEncrypt = useCallback(() => {
    const ptError = validate(plaintextBin, 'Plaintext');
    const keyError = validate(keyBin, 'Key');
    setErrors({ plaintext: ptError, key: keyError });
    if (ptError || keyError) return;

    const pt = binaryToInt(plaintextBin);
    const k = binaryToInt(keyBin);
    const encResult = encrypt(pt, k);
    setResult(encResult);
    setActiveStep(null);
  }, [plaintextBin, keyBin, validate]);

  const handleDecrypt = useCallback(() => {
    const ctError = validate(plaintextBin, 'Ciphertext');
    const keyError = validate(keyBin, 'Key');
    setErrors({ plaintext: ctError, key: keyError });
    if (ctError || keyError) return;

    const ct = binaryToInt(plaintextBin);
    const k = binaryToInt(keyBin);
    const decResult = decrypt(ct, k);
    setResult(decResult);
    setActiveStep(null);
  }, [plaintextBin, keyBin, validate]);

  const loadTestVector = useCallback(() => {
    setPlaintextBin(TEST_VECTOR.plaintext);
    setKeyBin(TEST_VECTOR.key);
    setErrors({ plaintext: '', key: '' });
  }, []);

  const reset = useCallback(() => {
    setPlaintextBin('');
    setKeyBin('');
    setResult(null);
    setActiveStep(null);
    setErrors({ plaintext: '', key: '' });
  }, []);

  const handlePlaintextChange = useCallback((val) => {
    const clean = val.replace(/[^01]/g, '').slice(0, 16);
    setPlaintextBin(clean);
    if (errors.plaintext) setErrors(e => ({ ...e, plaintext: '' }));
  }, [errors.plaintext]);

  const handleKeyChange = useCallback((val) => {
    const clean = val.replace(/[^01]/g, '').slice(0, 16);
    setKeyBin(clean);
    if (errors.key) setErrors(e => ({ ...e, key: '' }));
  }, [errors.key]);

  return {
    plaintextBin,
    keyBin,
    result,
    activeStep,
    isAnimating,
    errors,
    setActiveStep,
    setIsAnimating,
    handlePlaintextChange,
    handleKeyChange,
    handleEncrypt,
    handleDecrypt,
    loadTestVector,
    reset,
  };
}
