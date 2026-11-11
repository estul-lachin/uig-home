// uig.me: fills the live numbers from lab.uig.me/summary.json,
// detections.uig.me/summary.json and the honeypot's stats.json. If a feed
// fails, that card's numbers are hidden; the page reads fine without them.
// Strings from the data are only ever set with textContent.
"use strict";

(function () {
  const params = new URLSearchParams(location.search);
  // ?local=1 reads fixtures from data/ for a local preview
  const LAB = params.get("local") ? "data/summary.json" : "https://lab.uig.me/summary.json";
  const HP = params.get("local") ? "data/stats.json"
    : "https://raw.githubusercontent.com/estul-lachin/uig-honeypot-data/main/stats.json";
  const DET = params.get("local") ? "data/detections.json" : "https://detections.uig.me/summary.json";
  const fmt = new Intl.NumberFormat("en");
  const $ = (id) => document.getElementById(id);
  const get = (url) => fetch(url, { cache: "no-cache" }).then((r) => {
    if (!r.ok) throw new Error(url + ": " + r.status);
    return r.json();
  });
  // hide the numbers of the card that holds this element
  const fail = (id) => (e) => {
    console.warn(e);
    $(id).closest(".nums").hidden = true;
  };

  get(LAB).then((s) => {
    $("labs-passed").textContent = fmt.format(s.labs_passed || 0);
    $("labs-latest").textContent = s.latest_pass || "–";
  }).catch(fail("labs-passed"));

  get(DET).then((s) => {
    $("det-rules").textContent = fmt.format(s.rules || 0);
    $("det-tests").textContent = fmt.format((s.attack_test_events || 0) + (s.lookalike_test_events || 0));
    // SOAR: shown only when the build could read Sentinel (detections' tools/soar_stats.py)
    const so = s.soar;
    if (so && so.incidents > 0) {
      $("det-soar").textContent = "SOAR: " + fmt.format(so.incidents) + " incidents since " + so.since + ", " +
        so.enriched_pct + "% enriched automatically" +
        (Number.isFinite(so.enrich_seconds_median) ? " (median " + so.enrich_seconds_median + " s)" : "") +
        ", " + so.high_notified + " of " + so.high + " High escalated";
      $("det-soar").hidden = false;
    }
  }).catch(fail("det-rules"));

  get(HP).then((s) => {
    $("hp-sessions").textContent = fmt.format(s.totals.sessions || 0);
    $("hp-sources").textContent = fmt.format(s.totals.unique_sources || 0);
    // say when counting started, e.g. "sessions since Nov 8"
    if (/^\d{4}-\d{2}-\d{2}$/.test(s.first_day || "")) {
      const since = new Date(s.first_day + "T00:00:00Z")
        .toLocaleDateString("en", { month: "short", day: "numeric", timeZone: "UTC" });
      $("hp-sessions-label").textContent = "sessions since " + since;
    }
    // the login techniques are in almost every session; show what comes after
    const t = (s.ttps || []).find((x) => !/^T1078$|^T1110/.test(x.id));
    if (t && /^T\d{4}(\.\d{3})?$/.test(t.id)) {
      const a = $("hp-ttp-link");
      a.href = "https://attack.mitre.org/techniques/" + t.id.replace(".", "/") + "/";
      a.textContent = t.id + " " + t.name;
      $("hp-ttp").hidden = false;
    }
    if (s.generated_at) {
      $("updated").textContent = "Honeypot numbers as of " + s.generated_at.replace("T", " ").replace("Z", " UTC");
    }
  }).catch(fail("hp-sessions"));
})();
