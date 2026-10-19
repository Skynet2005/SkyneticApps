# CommonGround

**A Florida-first, open and transparent HOA procedural fairness prototype.**

CommonGround is a React/Vite application designed to help individual homeowners organize sample dispute records, consult Florida statutes, audit their own notes, review procedural completeness, and explore voluntary fairness commitments. The design is a **local-first prototype**, not a production HOA management system.

## Run
```bash
npm install
npm run dev
npm test
npm run build
```

## What works
- Create and edit cases in browser storage
- Log activities with SHA-256 link hashes for newly added events
- Run five transparent procedural documentation checks
- Open current Florida statute sections from the official Senate website
- Add your own bibliographic references, not files
- View case metrics and local audit-chain checks
- Draft community governance charter commitments
- Export and import JSON workspace backups
- Navigate responsive dashboard, case details, law library, oversight, charter and settings

## What is deliberately NOT implemented
- No verified identities, sessions, accounts, or role-based multi-user access
- No database, off-device backup, real shared HOA workspace, real file upload, document verification, real-time collaboration, or notification system
- No AI-generated legal conclusions or binding actions
- No real digital signature or secure independent evidentiary custody
- A documentation checklist is **not** a legal compliance score or likelihood of success

Never enter confidential resident information, secret keys, financial account data or privileged documents. Sample or redacted information only. Data in localStorage can be deleted or modified by the local browser user.

## Architecture
- `src/main.jsx`: interface and workspace actions
- `src/engine.js`: deterministic fairness checklist, local record support and hash chain
- `src/styles.css`: responsive visual system
- `tests/engine.test.mjs`: core behavioral regression tests

## Why the boundary matters
Florida HOA law involves recorded covenants, statutory exceptions, property interests and procedural details that require human interpretation. This app deliberately separates transparent checklists from verified legal analysis and preserves a place for independent review.

## Future production milestones
1. Independent nonprofit stewardship and privacy policy.
2. Verified authentication, per-community permissions, tenant isolation, server audit retention and cryptographic external anchoring.
3. Private encrypted documents, provenance and verified source citations.
4. Shared invitation-based case threads, impartial reviewer conflict controls and procedural SLA clocks.
5. Accessibility audits, threat model, penetration test, retention/deletion policy and legal review for Chapters 720 and 468.
6. Only then AI source-grounded assistance, managed governance workflows and legally compliant electronic voting.

Community decisions remain with authorized humans. Software does not issue fines, authorize entry onto property or replace legal remedies.

## Source references
- [Florida Chapter 720 (2026)](https://www.flsenate.gov/Laws/Statutes/2026/Chapter720)

MIT licensed under the containing repository's license.
