# Security Policy

## Overview

Secure Diary API implements comprehensive security measures to protect user data and ensure application integrity.

## Password Security

### Argon2id Hashing

We use **Argon2id** for password hashing, which is the winner of the Password Hashing Competition (PHC) and is recommended by OWASP.

**Configuration:**
- Algorithm: Argon2id (type 2)
- Memory Cost: 65,536 KiB (64 MB)
- Time Cost: 3 iterations
- Parallelism: 4 threads

This configuration provides strong resistance against both GPU and side-channel attacks while maintaining reasonable performance. The settings are tuned to provide a good balance between security and performance for typical web applications.

## Authentication

### JWT Tokens

- **Token Type**: JSON Web Tokens (JWT)
- **Algorithm**: HS256 (HMAC-SHA256)
- **Expiration**: Configurable (default: 1 hour)
- **Payload**: Minimal claim set to reduce token size

### Authorization

Protected endpoints require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

## Encryption

### Client-Side Encryption

All diary content encryption/decryption is handled **exclusively on the client side**:

- Server never receives plaintext content
- Server stores only encrypted cipherText
- Client responsible for all cryptographic operations
- Recommended: Use AES-256-GCM for encryption

## Data Protection

### Database Security

- MongoDB connection uses standard authentication
- Connection URI should use strong credentials
- Recommend SSL/TLS connection in production
- Data at rest encryption recommended for production

### Sensitive Data

- Passwords are hashed, never logged
- Tokens are not stored in logs
- Encrypted content is not logged
- Error messages avoid exposing sensitive information

## API Security

### CORS Policy

- Configurable cross-origin requests
- Default: Allow all origins (configurable)
- Headers: Accept standard HTTP headers
- Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS

### Input Validation

- All inputs validated before processing
- Type checking enforced
- Maximum length checks on string inputs
- UUID validation for entry IDs

### Rate Limiting

Recommended for production deployment:
- Implement rate limiting on `/api/v1/auth/login`
- Implement rate limiting on `/api/v1/init`
- Consider per-IP rate limiting

## Transport Security

### HTTPS/TLS

**Production Requirement**: Always use HTTPS/TLS for all communications.

Recommended configuration:
- TLS 1.2 or higher
- Strong cipher suites
- Certificate from trusted CA
- HSTS headers enabled

## Environment Security

### Configuration

Sensitive configuration stored in environment variables:
- `JWT_SECRET`: Must be strong (minimum 32 characters)
- `MONGODB_URI`: Should include credentials and TLS configuration
- `NODE_ENV`: Set to `production` in production

### .env File

- Never commit `.env` files to version control
- Use `.env.example` as template
- Restrict file permissions: `chmod 600 .env`

## Incident Response

### Reporting Security Issues

If you discover a security vulnerability, please email `security@example.com` (replace with actual contact).

**Do not:**
- Create public GitHub issues for vulnerabilities
- Disclose vulnerabilities publicly before fix is available
- Test vulnerabilities on live production systems

## Best Practices for Deployment

### Production Checklist

- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS/TLS with valid certificates
- [ ] Use strong JWT_SECRET (minimum 32 random characters)
- [ ] Configure strong MongoDB credentials
- [ ] Enable rate limiting
- [ ] Enable request logging and monitoring
- [ ] Regular security updates for dependencies
- [ ] Database backups enabled
- [ ] CORS properly configured for your domain
- [ ] Error details not exposed to clients

### Dependency Management

- Regular `yarn upgrade` to get security patches
- Monitor security advisories: `yarn audit`
- Use lock file in version control
- Review major version upgrades before updating

## Compliance

This application is designed with security best practices in mind:

- Password hashing: OWASP recommended (Argon2id)
- Encryption: Client-side only (no server-side encryption of content)
- Authentication: Industry-standard JWT
- Transport: HTTPS/TLS recommended
- Database: Authentication enforced

## Security Updates

We regularly review and update security practices. Check the following for updates:

- GitHub Security Advisories
- Dependency vulnerability reports
- OWASP recommendations
- NodeJS security releases

## Support

For security questions or concerns, contact the development team.
