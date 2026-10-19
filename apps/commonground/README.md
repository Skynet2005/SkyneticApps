# CommonGround (v0.2)
Independent Florida-first HOA procedural fairness and dispute-workspace prototype.

**Site:** https://commonground-nu.vercel.app

## Working functions
- Local case management, procedural completeness checks, status and history
- Source-linked Florida law navigator (architecture/fences, fines, records, elections, financial collections)
- Field-level before/after audit events with SHA-256 local hash links and last recorded state verification
- Local encrypted evidence vault: AES-256-GCM, PBKDF2/SHA-256 600,000 iterations, random per-item salts and nonces, encrypted filenames, ciphertext in IndexedDB, SHA-256 verified decrypt-and-download
- Browser-local import/export, Markdown case briefs, governance charter, responsive oversight interface

## Run and test
    npm install
    npm test
    npm run build
    npm run dev

Built with Vite + React. The Vercel project uses Root Directory apps/commonground, with git deployment from main.

## Security limitations

**Prototype only.** Cases and non-vault notes are plain localStorage, editable by anyone with access to this browser profile. Do not put names, addresses, passwords, account numbers, privileged documents, or real private dispute evidence into case forms.

Vault files are locally encrypted in IndexedDB and are never transmitted to our backend. Lost passphrases or deleted browser data are unrecoverable. Browser compromise or malicious extensions may access content or passphrases while in use. This is not independent legal evidence custody or a backed-up repository.

The platform has no multi-user identity verification, server database, invitations, shared cases, real HOA membership validation, remotely enforced role permissions, outside fact verification, or AI legal conclusions. Nothing is filed, served, or legally binding. Documentation coverage is not legal compliance, fairness, or likelihood of prevailing.

See docs/production-schema.sql for proposed **undeployed** database tables and docs/release-gates.md for required production safeguards. Never connect sensitive records before those gates pass.

## Primary sources
- https://www.flsenate.gov/Laws/Statutes/2026/Chapter720
- https://www.flsenate.gov/Laws/Statutes/2026/720.303
- https://www.flsenate.gov/Laws/Statutes/2026/720.3035
- https://www.flsenate.gov/Laws/Statutes/2026/720.305
- https://www.flsenate.gov/Laws/Statutes/2026/720.311

Refer to the effective version, governing documents, and qualified Florida counsel for legal matters. MIT licensed under parent repository.
