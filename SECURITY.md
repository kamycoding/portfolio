# Security policy

## Reporting a vulnerability

Please report security problems privately, in one of two ways:

- Use GitHub's private reporting form: [Report a vulnerability](https://github.com/kamycoding/portfolio/security/advisories/new).
- Send an email to [contact@kamycoding.com](mailto:contact@kamycoding.com).

Do not open a public issue, pull request or discussion for a security report.

Helpful details:

- What the problem is and where it is (URL, file or endpoint)
- Steps to reproduce it
- What an attacker could do with it

I will answer as soon as I can. Reports in English or German are welcome. Please give me reasonable time to fix the problem before you share it publicly.

## Supported versions

Only the current version of the site at [kamycoding.com](https://kamycoding.com), built from the `main` branch, receives security fixes.

## security.txt

The site publishes both channels in [`/.well-known/security.txt`](https://kamycoding.com/.well-known/security.txt) (RFC 9116). Its `Expires` date (currently 2027-10-31) must be renewed before it passes, in `public/.well-known/security.txt`.
