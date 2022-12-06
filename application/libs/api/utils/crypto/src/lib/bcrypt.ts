import { hash as hashAsync, compare as compareAsync } from 'bcrypt';
import * as crypto from 'crypto';

export async function hash(value: string): Promise<string> {
  return hashAsync(value, 10);
}

export async function compare(value: string, hash: string): Promise<boolean> {
  return compareAsync(value, hash);
}

export function randomBytes(size: number): Buffer {
  return crypto.randomBytes(size);
}
