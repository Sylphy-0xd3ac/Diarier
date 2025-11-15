import { PasswordUtils, JwtUtils, UuidUtils } from '../core/Utils';

describe('Utility Functions', () => {
  describe('PasswordUtils', () => {
    it('should hash and verify passwords', async () => {
      const password = 'test-password-123';
      const hashed = await PasswordUtils.hash(password);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(0);

      const isValid = await PasswordUtils.compare(password, hashed);
      expect(isValid).toBe(true);

      const isInvalid = await PasswordUtils.compare('wrong-password', hashed);
      expect(isInvalid).toBe(false);
    });

    it('should handle multiple hashes of same password differently', async () => {
      const password = 'test-password';
      const hash1 = await PasswordUtils.hash(password);
      const hash2 = await PasswordUtils.hash(password);

      expect(hash1).not.toBe(hash2);
      expect(await PasswordUtils.compare(password, hash1)).toBe(true);
      expect(await PasswordUtils.compare(password, hash2)).toBe(true);
    });
  });

  describe('JwtUtils', () => {
    it('should sign and verify tokens', () => {
      const payload = { userId: 123, email: 'test@example.com' };
      const secret = 'test-secret-key';
      const expiresIn = '1h';

      const token = JwtUtils.sign(payload, secret, expiresIn);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = JwtUtils.verify(token, secret);
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(123);
      expect(decoded.email).toBe('test@example.com');
    });

    it('should decode tokens', () => {
      const payload = { userId: 456, username: 'testuser' };
      const secret = 'test-secret-key';
      const token = JwtUtils.sign(payload, secret, '1h');

      const decoded = JwtUtils.decode(token);
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(456);
      expect(decoded.username).toBe('testuser');
    });

    it('should reject invalid tokens', () => {
      const payload = { userId: 789 };
      const secret = 'test-secret-key';
      const token = JwtUtils.sign(payload, secret, '1h');

      expect(() => {
        JwtUtils.verify(token, 'wrong-secret');
      }).toThrow();
    });
  });

  describe('UuidUtils', () => {
    it('should generate valid UUIDs', () => {
      const uuid = UuidUtils.generate();
      expect(uuid).toBeDefined();
      expect(UuidUtils.isValid(uuid)).toBe(true);
    });

    it('should validate UUIDs correctly', () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';
      const invalidUuid = 'not-a-uuid';

      expect(UuidUtils.isValid(validUuid)).toBe(true);
      expect(UuidUtils.isValid(invalidUuid)).toBe(false);
    });

    it('should generate different UUIDs', () => {
      const uuid1 = UuidUtils.generate();
      const uuid2 = UuidUtils.generate();

      expect(uuid1).not.toBe(uuid2);
    });
  });
});
