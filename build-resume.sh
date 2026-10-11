#!/usr/bin/env bash
# Builds resume.pdf from resume.md (styled by resume.css). Needs pandoc and Chrome/Chromium.
set -euo pipefail
cd "$(dirname "$0")"

CHROME="${CHROME:-}"
for c in "$CHROME" "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" google-chrome chromium chromium-browser; do
  if [ -n "$c" ] && { [ -x "$c" ] || command -v "$c" >/dev/null 2>&1; }; then CHROME="$c"; break; fi
done
[ -n "$CHROME" ] || { echo "Chrome/Chromium not found (set CHROME=...)" >&2; exit 1; }

tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
pandoc resume.md -f gfm --standalone --metadata pagetitle="Zachary Preator" \
  --css resume.css --embed-resources -o "$tmp/resume.html"
"$CHROME" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf=resume.pdf "file://$tmp/resume.html" 2>/dev/null
echo "Wrote resume.pdf"
