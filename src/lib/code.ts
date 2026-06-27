import { customAlphabet } from "nanoid";

// Excludes 0/O, 1/l/I, and other visually similar characters.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

const generate = customAlphabet(ALPHABET, 6);

export function generateGuestCode(): string {
  const raw = generate();
  return `${raw.slice(0, 3)}-${raw.slice(3)}`;
}

export function normalizeCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, "");
}
