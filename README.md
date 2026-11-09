# uig-home

The one-page home at **https://uig.me**: who I am, and links to what I build, with live numbers.

- [lab.uig.me](https://lab.uig.me) ([source](https://github.com/estul-lachin/uig-lab)): hands-on Docker labs
- [honeypot.uig.me](https://honeypot.uig.me) ([source](https://github.com/estul-lachin/uig-honeypot)): a live
  Cowrie honeypot, weekly ATT&CK reports and Splunk detections
- [detections.uig.me](https://detections.uig.me) ([source](https://github.com/estul-lachin/uig-detections)):
  Sigma rules tested in CI, converted to Splunk SPL and Microsoft Sentinel KQL

`site/` is plain HTML, CSS and JS, deployed by GitHub Pages. `app.js` reads `https://lab.uig.me/summary.json`,
`https://detections.uig.me/summary.json` and the honeypot's `stats.json`; if one fails, that card just shows no
numbers. A Content-Security-Policy meta tag in `index.html` allows only those three origins for `fetch`, so a new
data source must be added there too. `site/.well-known/` is published because the workflow sets
`include-hidden-files`.

Local preview with fixtures: put a `summary.json`, a `detections.json` and a `stats.json` in `site/data/`, then
`python3 -m http.server -d site 8000` and open `http://127.0.0.1:8000/?local=1`.

Link preview image: `site/og-image.png` (1200x630) is rendered from `assets/og-image.html` with Chrome:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 --screenshot="$PWD/site/og-image.png" \
  "file://$PWD/assets/og-image.html"
```
