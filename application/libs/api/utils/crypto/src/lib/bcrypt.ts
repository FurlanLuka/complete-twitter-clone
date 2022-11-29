import { hash as hashAsync, compare as compareAsync } from 'bcrypt';

export async function hash(value: string): Promise<string> {
  return hashAsync(value, 50);
}

export async function compare(value: string, hash: string): Promise<boolean> {
  return compareAsync(value, hash);
}
