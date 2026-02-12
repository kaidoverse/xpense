# Xpense

Static Firebase web app for tracking personal transactions.

## Local setup

1. Copy `public/firebase-config.template.js` to `public/firebase-config.local.js`.
2. Put your Firebase web config in `public/firebase-config.local.js`.
3. Serve the `public/` directory (for example with VS Code Live Server) and open `app.html`.

## Security notes

- `public/firebase-config.local.js` is ignored by git.
- Keep API key restrictions enabled in Google Cloud (`Websites` + `Restrict key`).
- Publish strict Firestore rules from `firestore.rules`.
- Never commit service-account keys, admin tokens, or `.env` secrets.

## Lint

```bash
npm install
npm run lint
```
