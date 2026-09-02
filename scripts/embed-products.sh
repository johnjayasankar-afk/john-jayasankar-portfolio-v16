#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SITE="$ROOT/john-jayasankar-website"
DEST="$SITE/public/apps"

echo "Building AgentFit for /apps/agentfit/"
cd "$ROOT/agentfit"
EMBED_BASE=/apps/agentfit/ ./node_modules/vite/bin/vite.js build --base /apps/agentfit/

echo "Building Opportunity OS for /apps/opportunity-os/"
cd "$ROOT"
EMBED_BASE=/apps/opportunity-os/ ./node_modules/vite/bin/vite.js build --base /apps/opportunity-os/

echo "Copying into website public/apps"
rm -rf "$DEST"
mkdir -p "$DEST"
cp -R "$ROOT/agentfit/dist" "$DEST/agentfit"
cp -R "$ROOT/dist" "$DEST/opportunity-os"

# Nested SPAs should not register a service worker on the personal site origin.
rm -f "$DEST/agentfit/sw.js" "$DEST/agentfit/registerSW.js" \
  "$DEST/opportunity-os/sw.js" "$DEST/opportunity-os/registerSW.js"
rm -f "$DEST/agentfit"/workbox-*.js "$DEST/opportunity-os"/workbox-*.js

echo "Embedded:"
du -sh "$DEST/agentfit" "$DEST/opportunity-os"
