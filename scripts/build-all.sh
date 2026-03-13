#!/bin/sh
set -e
export PATH="/home/dps/.nvm/versions/node/v22.22.1/bin:$PATH"
ESBUILD="$(dirname "$0")/../node_modules/.bin/esbuild"
ROOT="$(dirname "$0")/.."

node "$ROOT/scripts/copy-assets.js"

"$ESBUILD" "$ROOT/website/assets/css/styles.css" --minify --outfile="$ROOT/build/assets/css/styles.min.css"
echo "  styles.min.css done"

"$ESBUILD" "$ROOT/website/assets/css/privacy.css" --minify --outfile="$ROOT/build/assets/css/privacy.min.css"
echo "  privacy.min.css done"

"$ESBUILD" "$ROOT/website/assets/js/scripts.js" --minify --outfile="$ROOT/build/assets/js/scripts.min.js"
echo "  scripts.min.js done"

"$ESBUILD" "$ROOT/website/assets/js/privacy-theme.js" --minify --outfile="$ROOT/build/assets/js/privacy-theme.min.js"
echo "  privacy-theme.min.js done"

node "$ROOT/scripts/build.js"

echo "Build complete!"
