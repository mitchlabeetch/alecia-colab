# Security Policy

## Supported Versions

We take the security of Alecia Colab seriously. We release patches for security vulnerabilities promptly.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Alecia Colab, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Send details to the repository maintainers privately
3. Include a detailed description of the vulnerability
4. Provide steps to reproduce if possible
5. Suggest a fix if you have one

You will receive a response within 48 hours. If the issue is confirmed, we will:
- Work on a fix immediately
- Keep you informed of our progress
- Credit you for the discovery (if desired)
- Release a patch as soon as possible

## Security Best Practices

When using Alecia Colab:

1. **Authentication**: Always use secure authentication methods and keep credentials private
2. **Environment Variables**: Never commit `.env` files with sensitive data
3. **API Keys**: Store OpenAI and other API keys securely
4. **Data Storage**: Be aware that document content is stored in browser localStorage by default
5. **Access Control**: Use Clerk authentication to control access to your instance
6. **Updates**: Keep dependencies updated to receive security patches

## Known Security Considerations

- Document content is stored in browser localStorage - implement server-side storage for sensitive data
- File uploads should be validated and sanitized
- Rate limiting is implemented but should be configured appropriately for your use case

Thank you for helping keep Alecia Colab secure!
