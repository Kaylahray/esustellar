// ── Security Types ───────────────────────────────────────────────────────────

export enum BiometricType {
  FINGERPRINT = 'fingerprint',
  FACIAL_RECOGNITION = 'facial_recognition',
  IRIS = 'iris',
  NONE = 'none',
}

export enum SecurityStatus {
  /** Device supports biometric hardware & user has enrolled credentials */
  AVAILABLE = 'available',
  /** Device has hardware but user hasn't enrolled biometrics */
  NOT_ENROLLED = 'not_enrolled',
  /** Device lacks biometric hardware entirely */
  UNSUPPORTED = 'unsupported',
  /** Feature hasn't been checked yet */
  UNKNOWN = 'unknown',
}

export interface BiometricCapability {
  status: SecurityStatus;
  supportedTypes: BiometricType[];
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

export interface SecurityConfig {
  biometricEnabled: boolean;
  pinEnabled: boolean;
  pinSet: boolean;
}

export const INITIAL_SECURITY_CONFIG: SecurityConfig = {
  biometricEnabled: false,
  pinEnabled: false,
  pinSet: false,
};
