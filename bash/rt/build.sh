#!/usr/bin/env bash

set -euo pipefail
cd -- "$(dirname -- "$0")"
. ./lib/run.sh

run "Check for Node.js" \
  command -v node

run "Check for npm" \
  command -v npm

run "Install dependencies" \
  npm install

run "Run TypeScript type check" \
  npm run type-check

run "Build TypeScript React slide viewer with webpack" \
  npm run build
