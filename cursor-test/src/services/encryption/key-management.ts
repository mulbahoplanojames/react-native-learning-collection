/**
 * Key Management Service
 * Handles encryption key storage and exchange
 *
 * NOTE: This is a structure for key management.
 * For production, implement secure key storage using
 * expo-secure-store or similar.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateKeyPair } from "./encryption.service";

const KEYS_STORAGE_KEY = "@kolohealth:encryption_keys";

interface UserKeys {
  userId: string;
  publicKey: string;
  privateKey: string; // Should be stored securely (expo-secure-store)
  createdAt: string;
}

class KeyManagementService {
  /**
   * Get or generate keys for a user
   */
  async getUserKeys(userId: string): Promise<UserKeys | null> {
    try {
      const stored = await AsyncStorage.getItem(
        `${KEYS_STORAGE_KEY}:${userId}`
      );
      if (stored) {
        return JSON.parse(stored);
      }

      // Generate new keys
      const { publicKey, privateKey } = await generateKeyPair();
      const keys: UserKeys = {
        userId,
        publicKey,
        privateKey,
        createdAt: new Date().toISOString(),
      };

      // Store keys (in production, use expo-secure-store for private key)
      await AsyncStorage.setItem(
        `${KEYS_STORAGE_KEY}:${userId}`,
        JSON.stringify(keys)
      );

      return keys;
    } catch (error) {
      console.error("Error getting user keys:", error);
      return null;
    }
  }

  /**
   * Store public key for another user
   */
  async storePublicKey(userId: string, publicKey: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        `${KEYS_STORAGE_KEY}:public:${userId}`,
        publicKey
      );
      return true;
    } catch (error) {
      console.error("Error storing public key:", error);
      return false;
    }
  }

  /**
   * Get public key for a user
   */
  async getPublicKey(userId: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(`${KEYS_STORAGE_KEY}:public:${userId}`);
    } catch (error) {
      console.error("Error getting public key:", error);
      return null;
    }
  }

  /**
   * Exchange keys with another user
   * In production, this would happen through a secure key exchange protocol
   */
  async exchangeKeys(userId1: string, userId2: string): Promise<boolean> {
    try {
      const keys1 = await this.getUserKeys(userId1);
      const keys2 = await this.getUserKeys(userId2);

      if (!keys1 || !keys2) return false;

      // Store each other's public keys
      await this.storePublicKey(userId1, keys2.publicKey);
      await this.storePublicKey(userId2, keys1.publicKey);

      return true;
    } catch (error) {
      console.error("Error exchanging keys:", error);
      return false;
    }
  }
}

export const keyManagementService = new KeyManagementService();
