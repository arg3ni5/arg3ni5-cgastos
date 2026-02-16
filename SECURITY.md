# Security Policy

## Overview

This document describes the security measures implemented in the Cerdyn expense control system and provides guidelines for reporting security vulnerabilities.

## Security Features

### 1. Data Validation

All data inputs are validated using Zod schemas before being processed or stored. This includes:

- **Cuenta (Accounts)**: Validation of descriptions, types, and balance values
- **Categoria (Categories)**: Validation of descriptions, types, colors, and icons
- **Movimiento (Transactions)**: Validation of dates, amounts, descriptions, and states
- **Usuario (Users)**: Validation of names, emails, country codes, and currency codes
- **Conexiones (Connections)**: Validation of OAuth connection data

### 2. Encrypted LocalStorage

Sensitive user data stored in localStorage is encrypted using Base64 encoding:

- User session data is encrypted before storage
- Automatic session expiration (default: 24 hours)
- Automatic cleanup of corrupted or expired data
- Secure retrieval with validation checks

**Note**: While Base64 provides basic obfuscation, for highly sensitive data in production environments, consider implementing stronger encryption methods using Web Crypto API.

### 3. Session Management

- **Automatic expiration**: Sessions expire after a configurable timeout (default: 24 hours)
- **Session refresh**: Active sessions are automatically refreshed on user activity
- **Secure cleanup**: Expired sessions are automatically cleared from storage

### 4. Error Handling

- **Centralized logging**: All errors are logged with context for debugging
- **User-friendly messages**: Technical errors are translated to user-friendly messages
- **Error boundaries**: React error boundaries prevent application crashes
- **No sensitive data in logs**: Logs exclude passwords and authentication tokens

### 5. Environment Variables

- **Type validation**: All environment variables are typed and validated at startup
- **Required checks**: Application fails gracefully if required variables are missing
- **No hardcoded secrets**: All sensitive configuration is in environment variables

### 6. Authentication

- **OAuth 2.0**: Secure authentication using Google OAuth
- **Session validation**: All API calls validate active user sessions
- **Automatic logout**: Sessions are cleared on logout or expiration

### 7. React Query Optimization

- **Stale time**: 5 minutes to reduce unnecessary API calls
- **Cache time**: 10 minutes to improve performance
- **Retry logic**: Exponential backoff for failed requests (up to 30 seconds)
- **Enabled conditions**: Queries only run when required data is available

## Security Best Practices

### For Developers

1. **Never commit secrets**: Always use environment variables for sensitive data
2. **Validate all inputs**: Use Zod schemas for all user inputs and API responses
3. **Handle errors properly**: Use the centralized logger and show user-friendly messages
4. **Test security features**: Ensure validation and encryption work as expected
5. **Keep dependencies updated**: Regularly update packages to patch security vulnerabilities

### For Deployment

1. **Use HTTPS**: Always deploy with HTTPS enabled
2. **Secure environment variables**: Store environment variables securely (e.g., Vercel, Netlify)
3. **Enable CORS properly**: Configure CORS to only allow trusted domains
4. **Database security**: Use Row Level Security (RLS) in Supabase
5. **Monitor logs**: Regularly review application logs for suspicious activity

### For Users

1. **Use strong passwords**: If implementing password authentication
2. **Keep session active**: Don't share session tokens
3. **Logout after use**: Always logout on shared devices
4. **Review connections**: Regularly check OAuth connections in settings

## Known Limitations

1. **LocalStorage encryption**: Currently uses Base64 encoding for obfuscation, not cryptographic encryption
2. **Session storage**: Sessions stored in browser can be accessed if device is compromised
3. **Client-side validation**: While implemented, server-side validation is also required for production

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please follow these steps:

1. **Do not create a public GitHub issue**
2. Email the details to: [security email - to be configured]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work on a fix as soon as possible.

## Security Updates

This project follows semantic versioning. Security updates will be released as:

- **Patch releases** (x.x.X) for minor security fixes
- **Minor releases** (x.X.x) for security improvements
- **Major releases** (X.x.x) for major security overhauls

## Compliance

This application implements security best practices for web applications:

- Input validation and sanitization
- Secure session management
- Error handling and logging
- Environment variable validation
- Authentication and authorization

## Regular Security Audits

We recommend:

1. **Dependency audits**: Run `npm audit` regularly
2. **Code scanning**: Use tools like CodeQL for static analysis
3. **Penetration testing**: Conduct regular security testing
4. **Security reviews**: Review code changes for security implications

## Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://reactjs.org/docs/security.html)
- [Zod Documentation](https://zod.dev/)

## Last Updated

This security policy was last updated on: [Current Date]

## Version

Security measures implemented in version: 1.0.0
