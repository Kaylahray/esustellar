import * as LocalAuthentication from 'expo-local-authentication';
import {
  BiometricType,
  SecurityStatus,
  BiometricCapability,
  BiometricAuthResult,
} from './securityTypes';

// ── Biometric Service ────────────────────────────────────────────────────────

class BiometricAuthService {
  private static instance: BiometricAuthService;
  private cachedCapability: BiometricCapability | null = null;

  private constructor() {}

  static getInstance(): BiometricAuthService {
    if (!BiometricAuthService.instance) {
      BiometricAuthService.instance = new BiometricAuthService();
    }
    return BiometricAuthService.instance;
  }

  /**
   * Checks device biometric capability.
   * Returns UNSUPPORTED on non-native environments (web / SSR).
   */
  async getCapability(): Promise<BiometricCapability> {
    if (this.cachedCapability) return this.cachedCapability;

    // Guard: expo-local-authentication only works on native runtimes
    if (typeof window === 'undefined' || !LocalAuthentication) {
      const cap: BiometricCapability = {
        status: SecurityStatus.UNSUPPORTED,
        supportedTypes: [BiometricType.NONE],
      };
      this.cachedCapability = cap;
      return cap;
    }

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        const cap: BiometricCapability = {
          status: SecurityStatus.UNSUPPORTED,
          supportedTypes: [BiometricType.NONE],
        };
        this.cachedCapability = cap;
        return cap;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await this.getSupportedTypes();

      const cap: BiometricCapability = {
        status: isEnrolled
          ? SecurityStatus.AVAILABLE
          : SecurityStatus.NOT_ENROLLED,
        supportedTypes,
      };

      this.cachedCapability = cap;
      return cap;
    } catch {
      const cap: BiometricCapability = {
        status: SecurityStatus.UNSUPPORTED,
        supportedTypes: [BiometricType.NONE],
      };
      this.cachedCapability = cap;
      return cap;
    }
  }

  /**
   * Authenticate the user with biometrics.
   * Falls back to device passcode when `fallbackToPasscode` is true.
   */
  async authenticate(
    promptMessage = 'Authenticate to continue',
    disableDeviceFallback = false
  ): Promise<BiometricAuthResult> {
    try {
      const capability = await this.getCapability();

      if (capability.status === SecurityStatus.UNSUPPORTED) {
        return {
          success: false,
          error: 'Biometrics are not supported on this device',
        };
      }

      if (capability.status === SecurityStatus.NOT_ENROLLED) {
        return {
          success: false,
          error: 'No biometrics enrolled. Please set up biometrics in device settings',
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Cancel',
        disableDeviceFallback,
      });

      if (result.success) {
        return { success: true };
      }

      return {
        success: false,
        error: result.error === 'user_cancel'
          ? 'Authentication cancelled'
          : 'Authentication failed',
      };
    } catch {
      return {
        success: false,
        error: 'An unexpected error occurred during authentication',
      };
    }
  }

  /**
   * Maps expo-local-authentication type constants to our BiometricType enum.
   */
  private async getSupportedTypes(): Promise<BiometricType[]> {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const mapped: BiometricType[] = [];

      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        mapped.push(BiometricType.FINGERPRINT);
      }
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        mapped.push(BiometricType.FACIAL_RECOGNITION);
      }
      if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        mapped.push(BiometricType.IRIS);
      }

      return mapped.length > 0 ? mapped : [BiometricType.NONE];
    } catch {
      return [BiometricType.NONE];
    }
  }

  /** Invalidate cached capability so next call re-checks hardware */
  invalidateCache(): void {
    this.cachedCapability = null;
  }
}

export const biometricService = BiometricAuthService.getInstance();
