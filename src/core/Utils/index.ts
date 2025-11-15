import { hash, verify } from 'argon2';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export class PasswordUtils {
  static async hash(password: string): Promise<string> {
    return hash(password, {
      type: 2,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    try {
      return await verify(hash, password);
    } catch (error) {
      return false;
    }
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
