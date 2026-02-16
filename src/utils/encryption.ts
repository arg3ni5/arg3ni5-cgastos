import { logger } from './logger';

/**
 * Simple Base64 encoding for basic obfuscation
 * Note: This is NOT cryptographically secure encryption, just basic obfuscation
 * For sensitive data, consider using Web Crypto API or a proper encryption library
 */
class StorageEncryption {
  private readonly prefix = 'enc_';

  /**
   * Encode data to Base64
   */
  private encode(data: string): string {
    try {
      return btoa(encodeURIComponent(data));
    } catch (error) {
      logger.error('Failed to encode data', { error });
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decode data from Base64
   */
  private decode(data: string): string {
    try {
      return decodeURIComponent(atob(data));
    } catch (error) {
      logger.error('Failed to decode data', { error });
      throw new Error('Decryption failed');
    }
  }

  /**
   * Encrypt and store data in localStorage
   */
  setItem(key: string, value: unknown): void {
    try {
      const jsonString = JSON.stringify(value);
      const encrypted = this.encode(jsonString);
      localStorage.setItem(this.prefix + key, encrypted);
    } catch (error) {
      logger.error('Failed to set encrypted item', { key, error });
      // Fallback to unencrypted storage
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (fallbackError) {
        logger.error('Failed to set item even without encryption', { key, error: fallbackError });
      }
    }
  }

  /**
   * Retrieve and decrypt data from localStorage
   */
  getItem<T>(key: string): T | null {
    try {
      // Try encrypted version first
      const encrypted = localStorage.getItem(this.prefix + key);
      if (encrypted) {
        const decrypted = this.decode(encrypted);
        return JSON.parse(decrypted) as T;
      }

      // Fallback to unencrypted for backward compatibility
      const unencrypted = localStorage.getItem(key);
      if (unencrypted) {
        return JSON.parse(unencrypted) as T;
      }

      return null;
    } catch (error) {
      logger.error('Failed to get encrypted item', { key, error });
      // Try to cleanup corrupted data
      this.removeItem(key);
      return null;
    }
  }

  /**
   * Remove item from localStorage (both encrypted and unencrypted versions)
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
      localStorage.removeItem(key);
    } catch (error) {
      logger.error('Failed to remove item', { key, error });
    }
  }

  /**
   * Check if an item exists in localStorage
   */
  hasItem(key: string): boolean {
    return localStorage.getItem(this.prefix + key) !== null || localStorage.getItem(key) !== null;
  }

  /**
   * Clear all encrypted items
   */
  clearEncrypted(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      logger.error('Failed to clear encrypted items', { error });
    }
  }
}

export const secureStorage = new StorageEncryption();

/**
 * Session management with expiration
 */
interface SessionData {
  data: unknown;
  timestamp: number;
  expiresIn: number;
}

export class SessionManager {
  /**
   * Set item with expiration
   */
  static setWithExpiry(key: string, value: unknown, expiresIn: number): void {
    const sessionData: SessionData = {
      data: value,
      timestamp: Date.now(),
      expiresIn
    };
    secureStorage.setItem(key, sessionData);
  }

  /**
   * Get item and check if expired
   */
  static getWithExpiry<T>(key: string): T | null {
    const item = secureStorage.getItem<SessionData>(key);
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    const isExpired = now - item.timestamp > item.expiresIn;

    if (isExpired) {
      logger.info('Session expired', { key });
      secureStorage.removeItem(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * Refresh session timestamp
   */
  static refreshSession(key: string): void {
    const item = secureStorage.getItem<SessionData>(key);
    if (item) {
      item.timestamp = Date.now();
      secureStorage.setItem(key, item);
    }
  }
}
