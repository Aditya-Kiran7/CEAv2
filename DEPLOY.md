# Deploying the CEA website

Create React App (react-scripts + CRACO). Use **yarn**, not npm.

## How it's configured (matches your current site)
- **Hash routing** (`HashRouter`) → URLs look like
  `https://www.civil.iitb.ac.in/cea/#/verify?id=...`
  This needs **NO server rewrites / .htaccess** — perfect for the dept server.
- **Relative asset paths** (`"homepage": "."` in package.json) → the build drops
  into the `/cea/` folder (or any subfolder) without further config.

## Build & upload
```bash
cd frontend
yarn install
yarn build           # output → frontend/build/
```
Upload the **contents of `build/`** into the `cea/` folder on the host via FileZilla
(so `index.html` sits at `.../cea/index.html`). Everything in `public/` (icons, QR
codes, intro video, image assets) is copied into `build/` automatically.

That's it — open `https://www.civil.iitb.ac.in/cea/` and it loads. Deep links like
`/cea/#/council` and `/cea/#/verify?id=...` work on refresh with no extra setup,
because the part after `#` never reaches the server.

## The ONLY link that hardcodes your domain
`scripts/qr_script.py` → `BASE_URL` is already set to:
```
https://www.civil.iitb.ac.in/cea/#/verify?id=
```
The 239 QR codes in `frontend/public/QR_Codes/` already point there. If the URL
ever changes, edit `BASE_URL`, delete the old PNGs, and re-run:
```bash
pip install "qrcode[pil]"
cd scripts && python qr_script.py
```

Notes:
- `frontend/.env` REACT_APP_BACKEND_URL is NOT used by the site — ignore it.
- `jsconfig.json` baseUrl is an import-path setting, NOT the website URL — don't touch.
- The `.htaccess` files in `public/` are optional now (hash routing doesn't need them);
  harmless to leave in.

## Website icon
`public/favicon.png`, `favicon.ico`, `apple-touch-icon.png` are the CEA logo.
Replace those files (same names) to change the icon.

## Custom images per section
Drop images in `public/assets/{council,events,blogs,gallery,publications}/`
named by id — see the README inside each folder. Add them BEFORE `yarn build`.

## Custom intro video
Replace `public/intro/hold-intro.mp4` with your clip (same name) before building.
