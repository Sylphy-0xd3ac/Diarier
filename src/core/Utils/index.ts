import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export class PasswordUtils {
  static async hash(password: string, rounds: number = 10): Promise<string> {
    return bcrypt.hash(password, rounds);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export class JwtUtils {
  static sign(payload: any, secret: string, expiresIn: string): string {
    return jwt.sign(payload, secret, { expiresIn } as any);
  }

  static verify(token: string, secret: string): any {
    return jwt.verify(token, secret);
  }

  static decode(token: string): any {
    return jwt.decode(token);
  }
}

export class UuidUtils {
  static generate(): string {
    return uuidv4();
  }

  static isValid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
