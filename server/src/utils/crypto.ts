import * as argon2 from 'argon2';

export async function hashPin(pin: string): Promise<string> {
  try {
    const hash = await argon2.hash(pin, {
      type: argon2.argon2id,
      memoryCost: 19,
      timeCost: 2,
      parallelism: 1,
    });
    return hash;
  } catch (error) {
    throw new Error('Failed to hash PIN');
  }
}

export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  try {
    const match = await argon2.verify(hash, pin);
    return match;
  } catch (error) {
    return false;
  }
}
