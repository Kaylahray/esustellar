// ── PIN Fallback Service ─────────────────────────────────────────────────────
// Stores a hashed PIN in localStorage so the user can authenticate on
// devices that don't support biometrics (or when biometrics fail).

const STORAGE_KEY = 'esustellar_pin_hash';

class PinService {
  private static instance: PinService;

  private constructor() {}

  static getInstance(): PinService {
    if (!PinService.instance) {
      PinService.instance = new PinService();
    }
    return PinService.instance;
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  /**
   * Simple hash using the Web Crypto API (SHA-256).
   * Runs entirely on the client – the PIN never leaves the device.
   */
  private async hashPin(pin: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  private isStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && !!window.localStorage;
    } catch {
      return false;
    }
  }

  // ── Public API ───────────────────────────────────────────────────────────

  /** Returns true if a PIN has been set. */
  isPinSet(): boolean {
    if (!this.isStorageAvailable()) return false;
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  /** Save a new PIN (overwrites any existing one). */
  async setPin(pin: string): Promise<void> {
    if (!this.isStorageAvailable()) {
      throw new Error('Storage is not available');
    }

    if (!this.isValidPin(pin)) {
      throw new Error('PIN must be exactly 4-6 digits');
    }

    const hash = await this.hashPin(pin);
    localStorage.setItem(STORAGE_KEY, hash);
  }

  /** Verify a PIN against the stored hash. */
  async verifyPin(pin: string): Promise<boolean> {
    if (!this.isStorageAvailable()) return false;

    const storedHash = localStorage.getItem(STORAGE_KEY);
    if (!storedHash) return false;

    const inputHash = await this.hashPin(pin);
    return inputHash === storedHash;
  }

  /** Remove the stored PIN. */
  removePin(): void {
    if (!this.isStorageAvailable()) return;
    localStorage.removeItem(STORAGE_KEY);
  }

  /** Basic format check – 4 to 6 digits. */
  isValidPin(pin: string): boolean {
    return /^\d{4,6}$/.test(pin);
  }
}

export const pinService = PinService.getInstance();
