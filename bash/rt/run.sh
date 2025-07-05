#!/usr/bin/env bash

set -euo pipefail
cd -- "$(dirname -- "$0")"
. ./lib/run.sh

run "Build the app" \
  ./build.sh

run "Serve the dist directory with SPA fallback" \
  npx http-server dist -p 8080 --spa
