import { motion } from 'framer-motion';

/**
 * MagneticButton - Replaced with a solid Neobrutalist Interactive Button component
 */
export function MagneticButton({ children, className = '', onClick, disabled = false, ...props }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.96 }}
      className={`btn-brutal ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/**
 * PrimaryButton - Neobrutalist style (Pink bg by default)
 */
export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <MagneticButton
      className={`bg-pink text-dark px-6 py-3 text-sm ${className}`}
      {...props}
    >
      {children}
    </MagneticButton>
  );
}

/**
 * SecondaryButton - Neobrutalist style (White bg)
 */
export function SecondaryButton({ children, className = '', ...props }) {
  return (
    <MagneticButton
      className={`bg-white text-dark px-6 py-3 text-sm ${className}`}
      {...props}
    >
      {children}
    </MagneticButton>
  );
}

/**
 * GhostButton - Neobrutalist style (Border-only, flat transition or lighter bg)
 */
export function GhostButton({ children, className = '', ...props }) {
  return (
    <MagneticButton
      className={`bg-transparent text-dark px-4 py-2 text-xs border-2 hover:bg-white/10 ${className}`}
      style={{ border: '2px solid #1A1A2E', boxShadow: '2px 2px 0px #1A1A2E' }}
      {...props}
    >
      {children}
    </MagneticButton>
  );
}

/**
 * AccentButton - Neobrutalist style (Tosca bg)
 */
export function AccentButton({ children, className = '', ...props }) {
  return (
    <MagneticButton
      className={`bg-tosca text-dark px-6 py-3 text-sm ${className}`}
      {...props}
    >
      {children}
    </MagneticButton>
  );
}
