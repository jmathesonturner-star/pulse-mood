# Pulse — Mood Tracker PWA

A minimal daily mood tracker with 3 timed check-ins and background nudges.

## Files

```
pulse-pwa/
├── index.html        ← Main app
├── manifest.json     ← PWA manifest (install + theming)
├── service-worker.js ← Offline caching + notification routing
├── icon-192.svg      ← App icon
├── icon-512.svg      ← App icon (large)
└── README.md
```

## How to deploy (2 options)

### Option A — GitHub Pages (free, easiest)

1. Create a free GitHub account at github.com
2. Create a new repository (e.g. `pulse-mood`)
3. Upload all 5 files to the repo root
4. Go to Settings → Pages → Source: `main` branch, `/ (root)` folder → Save
5. Your app lives at `https://yourusername.github.io/pulse-mood/`
6. On your iPhone: open that URL in Safari → Share → Add to Home Screen

### Option B — Netlify drag-and-drop (free, 30 seconds)

1. Go to netlify.com → Log in or sign up
2. Drag the entire `pulse-pwa/` folder onto the Netlify dashboard
3. Done — you get a URL like `https://random-name.netlify.app`
4. On your iPhone: open in Safari → Share → Add to Home Screen

---

## Enabling background nudges

PWA push notifications that fire when the app is closed require a push server
(a backend that sends a push message to the browser at the right time).
The current setup gives you:

- ✅ Notifications when the app tab/window is open (setTimeout-based)
- ✅ Native notification banner on click (Web Notifications API)
- ✅ Offline caching so the app works without internet after first load
- ✅ "Add to Home Screen" install prompt

For true background nudges (fires even with tab closed), the simplest
no-backend approach is to use **Zapier + web-push** or a small Cloudflare
Worker. Happy to help set that up if wanted.

---

## Notes

- All data is stored locally in `localStorage` — nothing leaves your device
- Clear demo data: DevTools → Application → Local Storage → delete `pulse_data`
- Works offline after first load (service worker caches all assets)
