/**
 * AI API Key Persistence (Obfuscation Level)
 * 
 * Note: This module stores API keys in localStorage.
 * It uses Web Crypto API (AES-GCM with PBKDF2 derived from a fixed key)
 * to obfuscate the keys. This prevents the keys from being in plain text
 * in DevTools but does NOT protect against a malicious script running in the same origin.
 */

export type AIProvider = "openai" | "gemini" | "claude";

export interface EncryptedKeyStore {
  version: 1;
  keys: Record<AIProvider, { ciphertext: string; iv: string } | undefined>;
}

const STORAGE_KEY = "scoutboard:ai-keys:v1";
const FIXED_SECRET = "scoutboard-ai-obfuscation-key-v1";
const SALT = "scoutboard-salt-v1";

// Helper to convert base64 to buffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

// Helper to convert buffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Derive AES-GCM Key using PBKDF2
async function getDerivedKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(FIXED_SECRET),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(SALT),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

// Encrypt plaintext -> { ciphertext(base64), iv(base64) }
async function encryptData(text: string): Promise<{ ciphertext: string; iv: string }> {
  const key = await getDerivedKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(text)
  );

  return {
    ciphertext: arrayBufferToBase64(ciphertextBuffer),
    iv: arrayBufferToBase64(iv.buffer),
  };
}

// Decrypt { ciphertext(base64), iv(base64) } -> plaintext
async function decryptData(ciphertextB64: string, ivB64: string): Promise<string> {
  const key = await getDerivedKey();
  const iv = base64ToArrayBuffer(ivB64);
  const ciphertext = base64ToArrayBuffer(ciphertextB64);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    key,
    ciphertext
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedBuffer);
}

// Get raw store from localStorage
function getRawStore(): EncryptedKeyStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: 1, keys: { openai: undefined, gemini: undefined, claude: undefined } };
    
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1 || !parsed.keys) {
      // Version mismatch or invalid schema, return empty
      return { version: 1, keys: { openai: undefined, gemini: undefined, claude: undefined } };
    }
    return parsed as EncryptedKeyStore;
  } catch (error) {
    // Parsing error
    return { version: 1, keys: { openai: undefined, gemini: undefined, claude: undefined } };
  }
}

// Public API

/**
 * Returns a map of provider -> plain text API key
 * Falls back gracefully if decryption fails.
 */
export async function getApiKeys(): Promise<Record<string, string>> {
  if (typeof window === "undefined" || !window.crypto) return {};
  
  const store = getRawStore();
  const result: Record<string, string> = {};

  for (const [provider, encrypted] of Object.entries(store.keys)) {
    if (encrypted && encrypted.ciphertext && encrypted.iv) {
      try {
        const plain = await decryptData(encrypted.ciphertext, encrypted.iv);
        result[provider] = plain;
      } catch (err) {
        console.warn(`Failed to decrypt key for ${provider}. It may be corrupted.`);
        // Fallback: ignore this key, let user re-enter
      }
    }
  }

  return result;
}

/**
 * Encrypts and saves an API key for a specific provider
 */
export async function setApiKey(provider: AIProvider, key: string): Promise<void> {
  if (typeof window === "undefined" || !window.crypto) return;

  const store = getRawStore();
  const encrypted = await encryptData(key);
  
  store.keys[provider] = encrypted;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

/**
 * Removes an API key for a specific provider
 */
export async function removeApiKey(provider: AIProvider): Promise<void> {
  if (typeof window === "undefined") return;

  const store = getRawStore();
  store.keys[provider] = undefined;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}
