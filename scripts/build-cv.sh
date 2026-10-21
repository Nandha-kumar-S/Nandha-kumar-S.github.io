#!/usr/bin/env bash
#
# Regenerate public/cv.pdf from the /cv route.
#
# The CV's content lives in src/content/data.ts like everything else, so the
# PDF is a build artifact rather than a document anyone edits by hand. Run
# this after changing anything the CV renders, otherwise the downloadable file
# drifts from the site while /cv silently stays correct.
#
#   npm run cv
#
# Headless Chrome is used rather than a PDF library because it is the same
# engine that renders the page — the print stylesheet in globals.css is
# honoured exactly, and anchors survive as real clickable link annotations.
set -euo pipefail

cd "$(dirname "$0")/.."

PORT=3977
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="${PWD}/public/cv.pdf"

if [ ! -x "${CHROME}" ]; then
  echo "Google Chrome not found at: $CHROME" >&2
  echo "Install Chrome, or open /cv and print to PDF manually." >&2
  exit 1
fi

cleanup() { pkill -f "next start -p ${PORT}" 2>/dev/null || true; }
trap cleanup EXIT
cleanup
sleep 1

echo "Building..."
npm run build >/dev/null

echo "Serving on :${PORT}..."
npx next start -p "${PORT}" >/tmp/cv-server.log 2>&1 &

for _ in $(seq 1 30); do
  curl -sf -o /dev/null "http://localhost:${PORT}/cv" && break
  sleep 1
done

echo "Rendering..."
# --virtual-time-budget waits for fonts and layout to settle before capturing;
# without it the PDF can be produced mid-paint with fallback fonts.
"${CHROME}" --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="${OUT}" --virtual-time-budget=8000 \
  "http://localhost:${PORT}/cv" 2>/dev/null

# pdfinfo reports the real page count. (Counting pdftotext's form feeds is
# off by one: it emits one after every page, including the last.)
if command -v pdfinfo >/dev/null 2>&1; then
  PAGES=$(pdfinfo "${OUT}" | awk '/^Pages:/ {print $2}')
  LINKS=$(python3 -c "
import re,sys
d=open(sys.argv[1],'rb').read()
print(len(set(re.findall(rb'/URI\s*\((.*?)\)', d))))" "${OUT}")
  echo "Pages: ${PAGES}  ·  embedded links: ${LINKS}"
  if [ "${PAGES}" != "1" ]; then
    echo "WARNING: the CV is meant to be one page." >&2
  fi
fi

echo "Wrote public/cv.pdf"
