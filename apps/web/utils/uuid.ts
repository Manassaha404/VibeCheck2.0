/**
 * Converts a standard UUID string to a numeric representation.
 * Since a UUID is 128 bits, it exceeds the maximum safe integer in JavaScript (which is 53 bits).
 * Therefore, we use BigInt to handle the conversion without losing precision, returning it as a string of numbers.
 * 
 * @param uuid - The UUID string (e.g., "123e4567-e89b-12d3-a456-426614174000")
 * @returns A base-10 numeric string representing the UUID.
 */
export function uuidToNumber(uuid: string): string {
  // Remove all dashes to get the raw hexadecimal string
  const hexStr = uuid.replace(/-/g, '');
  // Parse the hex string as a BigInt and convert to a base-10 string
  return BigInt('0x' + hexStr).toString(10);
}

/**
 * Converts a numeric string (or bigint) representing a 128-bit number back to a standard UUID string.
 * 
 * @param num - The base-10 numeric string or BigInt.
 * @returns The standard UUID string (e.g., "123e4567-e89b-12d3-a456-426614174000")
 */
export function numberToUuid(num: string | bigint): string {
  // Convert the number back to a hexadecimal string
  let hexStr = BigInt(num).toString(16);
  
  // Pad with leading zeros to ensure it's exactly 32 hexadecimal characters
  hexStr = hexStr.padStart(32, '0');
  
  // Re-insert the dashes at standard UUID positions: 8-4-4-4-12
  return [
    hexStr.substring(0, 8),
    hexStr.substring(8, 12),
    hexStr.substring(12, 16),
    hexStr.substring(16, 20),
    hexStr.substring(20, 32)
  ].join('-');
}
