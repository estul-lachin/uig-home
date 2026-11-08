# uig-home

The one-page home at **https://uig.me**: who I am, and links to what I build, with live numbers.

- [lab.uig.me](https://lab.uig.me) ([source](https://github.com/estul-lachin/uig-lab)): hands-on Docker labs
- [honeypot.uig.me](https://honeypot.uig.me) ([source](https://github.com/estul-lachin/uig-honeypot)): a live
  Cowrie honeypot, weekly ATT&CK reports and Splunk detections

`site/` is plain HTML, CSS and JS, deployed by GitHub Pages. `app.js` reads `https://lab.uig.me/summary.json`
and the honeypot's `stats.json`; without them the page still renders, just without the numbers.

Local preview with fixtures: put a `summary.json` and a `stats.json` in `site/data/`, then
`python3 -m http.server -d site 8000` and open `http://127.0.0.1:8000/?local=1`.
