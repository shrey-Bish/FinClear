import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto"

const ITERATIONS = 100_000
const KEY_LENGTH = 64
const DIGEST = "sha512"

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex")
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, storedValue: string) {
  const [salt, storedHash] = storedValue.split(":")
  if (!salt || !storedHash) return false

  const computedHash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
  const originalHash = Buffer.from(storedHash, "hex")
  if (computedHash.length !== originalHash.length) return false

  return timingSafeEqual(computedHash, originalHash)
}
