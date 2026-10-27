# YourStake – Frontend

Vue 2 frontend of YourStake, deployed on Vercel at https://yourstake.fr.

## Local development

```bash
npm install
npm run serve        # http://localhost:8080, uses .env (backend on http://localhost:5001)
```

## Production build

```bash
npm run build        # outputs dist/, uses .env.production
```

`.env.production` holds the public settings baked into the bundle:

| Variable | Value |
|---|---|
| `VUE_APP_BACKEND_URL` / `VUE_APP_SOCKET_URL` | URL of the game server, must be HTTPS (`https://api.yourstake.fr`) |
| `VUE_APP_HCAPTCHA_KEY` | hCaptcha **site** key (the secret key belongs to the backend only) |

## Vercel

`vercel.json` already sets the build command, the `dist` output folder and the
rewrite of every route to `index.html` (needed for direct links like `/crash`).
Node 24 is selected through `engines` in `package.json`.
