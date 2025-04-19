// src/services/hashUtils.ts
/**
 * Utility functions for hashing data for Facebook Conversions API
 */

/**
 * Hash data using SHA-256
 * @param data String to hash
 * @returns Promise that resolves to the hashed string
 */
export const hashData = async (data: string): Promise<string> => {
  if (!data) return '';

  try {
    // Use browser's crypto API
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    console.log(`Hashed value: ${data} -> ${hashHex}`); // Logging for debugging
    return hashHex;
  } catch (error) {
    console.error('Error hashing data:', error);
    throw error;
  }
};

/**
 * Normalize and hash an email address according to Meta's requirements
 * @param email Email to hash
 */
export const hashEmail = async (email: string): Promise<string> => {
  if (!email) return '';
  // Normalize: trim and lowercase
  const normalized = email.trim().toLowerCase();
  console.log(`Normalizing email: ${email} -> ${normalized}`);
  return await hashData(normalized);
};

/**
 * Normalize and hash a phone number according to Meta's requirements
 * @param phone Phone number to hash
 */
export const hashPhone = async (phone: string): Promise<string> => {
  if (!phone) return '';
  // Normalize: strip all non-numeric characters
  const normalized = phone.replace(/\D/g, '');
  console.log(`Normalizing phone: ${phone} -> ${normalized}`);
  return await hashData(normalized);
};

/**
 * Normalize and hash a name according to Meta's requirements
 * @param name Name to hash
 */
export const hashName = async (name: string): Promise<string> => {
  if (!name) return '';
  // Normalize: trim and lowercase
  const normalized = name.trim().toLowerCase();
  console.log(`Normalizing name: ${name} -> ${normalized}`);
  return await hashData(normalized);
};
